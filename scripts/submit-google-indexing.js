import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const KEY_FILE_CANDIDATES = [
  path.resolve(process.cwd(), '../hr-vasthu-504211-397216f90b66.json'),
  path.resolve(process.cwd(), 'hr-vasthu-504211-397216f90b66.json')
];

let keyData = null;
for (const p of KEY_FILE_CANDIDATES) {
  if (fs.existsSync(p)) {
    keyData = JSON.parse(fs.readFileSync(p, 'utf8'));
    break;
  }
}

if (!keyData) {
  console.log('⚠️ Google Service Account key file not found. Skipping Google Indexing API direct call.');
  process.exit(0);
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to obtain Google access token: ${data.error_description || data.error || res.statusText}`);
  }

  return data.access_token;
}

export async function publishUrlToGoogle(url, accessToken, type = 'URL_UPDATED') {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url,
      type
    })
  });

  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function run() {
  console.log('🔑 Authenticating with Google Indexing API...');
  try {
    const token = await getAccessToken(keyData.client_email, keyData.private_key);
    console.log('✅ Obtained Google OAuth2 Access Token successfully!');

    const sampleUrls = [
      'https://www.hrvasthu.com/',
      'https://www.hrvasthu.com/about',
      'https://www.hrvasthu.com/contact',
      'https://www.hrvasthu.com/videos',
      'https://www.hrvasthu.com/blog',
      'https://www.hrvasthu.com/drawings',
      'https://www.hrvasthu.com/books'
    ];

    console.log(`📡 Submitting ${sampleUrls.length} priority URLs to Google Indexing API...`);
    for (const url of sampleUrls) {
      try {
        const result = await publishUrlToGoogle(url, token);
        if (result.ok) {
          console.log(`  ✅ [Google Indexing API] ${url} -> Notified successfully (${result.data.urlNotificationMetadata?.latestUpdate?.type || 'OK'})`);
        } else {
          console.log(`  ⚠️ [Google Indexing API] ${url} -> ${result.status}: ${JSON.stringify(result.data.error?.message || result.data)}`);
        }
      } catch (err) {
        console.error(`  ❌ Error notifying ${url}:`, err.message);
      }
    }
  } catch (err) {
    console.error('❌ Google Indexing API authentication or execution error:', err.message);
  }
}

if (process.argv[1] && process.argv[1].includes('submit-google-indexing.js')) {
  run();
}

import dotenv from 'dotenv';
dotenv.config();

// Dynamically import the handler from the TypeScript API module
import handler from '../api/prerender.ts';

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(key, val) {
    this.headers[key] = val;
    return this;
  }

  send(content) {
    this.body = content;
    return this;
  }
}

async function testRoute(testPath, expectedStatus = 200) {
  const req = {
    query: { path: testPath },
    url: `/api/prerender?path=${encodeURIComponent(testPath)}`
  };
  const res = new MockResponse();

  await handler(req, res);

  const titleMatch = res.body.match(/<title>(.*?)<\/title>/);
  const descMatch = res.body.match(/<meta name="description" content="(.*?)"/);
  const canonicalMatch = res.body.match(/<link rel="canonical" href="(.*?)"/);
  const jsonLdMatch = res.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  const title = titleMatch ? titleMatch[1] : 'MISSING';
  const canonical = canonicalMatch ? canonicalMatch[1] : 'MISSING';
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'MISSING';
  const hasJsonLd = !!jsonLdMatch;

  const passed = res.statusCode === expectedStatus &&
                 canonical.startsWith('https://www.hrvasthu.com') &&
                 title !== 'MISSING' &&
                 h1 !== 'MISSING';

  console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [HTTP ${res.statusCode}] Route: ${testPath}`);
  console.log(`   Title:     ${title}`);
  console.log(`   Canonical: ${canonical}`);
  console.log(`   H1:        ${h1}`);
  console.log(`   JSON-LD:   ${hasJsonLd ? 'Present' : 'None'}`);
  console.log(`   Body Size: ${res.body.length} bytes`);
  console.log('---');

  return passed;
}

async function runAllTests() {
  console.log('🚀 Running Dynamic Pre-rendering Test Suite...\n');

  const testCases = [
    { path: '/', expected: 200 },
    { path: '/about', expected: 200 },
    { path: '/contact', expected: 200 },
    { path: '/videos', expected: 200 },
    { path: '/videos/cvVJDFk7xYo', expected: 200 },
    { path: '/blog', expected: 200 },
    { path: '/blog/vastu-architecture-guide-CjSnCdaiOVs-blog', expected: 200 },
    { path: '/drawings', expected: 200 },
    { path: '/books', expected: 200 },
    { path: '/blog/this-page-definitely-does-not-exist-12345', expected: 404 }
  ];

  let allPassed = true;
  for (const tc of testCases) {
    try {
      const passed = await testRoute(tc.path, tc.expected);
      if (!passed) allPassed = false;
    } catch (err) {
      console.error(`❌ ERROR on route ${tc.path}:`, err);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL 10 PRE-RENDER TEST CASES PASSED WITH 100% CANONICAL COMPLIANCE!');
    process.exit(0);
  } else {
    console.error('\n⚠️ Some test cases failed.');
    process.exit(1);
  }
}

runAllTests();

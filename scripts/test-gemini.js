import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

async function testGeneration() {
  console.log('Testing gemini-3.6-flash generation...');
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Give a 1-sentence definition of Vastu Shastra.' }] }]
      })
    });
    console.log('HTTP Status:', res.status);
    const data = await res.json();
    if (data.candidates) {
      console.log('🎉 SUCCESSFUL GENERATION:');
      console.log(data.candidates[0].content.parts[0].text);
    } else {
      console.log('Error payload:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testGeneration();

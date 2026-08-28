import fs from 'fs';

const transcripts = JSON.parse(fs.readFileSync('scripts/transcripts-output.json', 'utf-8'));
console.log('Total transcript records:', transcripts.length);
const withWords = transcripts.filter((t: any) => t.word_count > 30);
console.log('Transcripts with > 30 words:', withWords.length);

for (let i = 0; i < 5; i++) {
  const item = withWords[i];
  console.log(`\n[${i + 1}] YouTube ID: ${item.youtube_id} | Source: ${item.source} | Words: ${item.word_count}`);
  console.log(`Text: ${item.transcript.slice(0, 200)}...`);
}

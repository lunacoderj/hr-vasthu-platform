import fs from 'fs';
import path from 'path';

const all = JSON.parse(fs.readFileSync('scripts/transcripts-output.json', 'utf-8'));
console.log('Total transcript records:', all.length);

const sample = all.slice(0, 10).map((x: any, i: number) => ({
  index: i + 1,
  id: x.youtube_id || x.video_id,
  title: (x.title || '').slice(0, 50),
  words: (x.transcript || '').split(/\s+/).filter(Boolean).length
}));

console.log('First 10 Videos in Dataset:');
console.table(sample);

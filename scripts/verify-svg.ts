import fs from 'fs';
import path from 'path';

const blogAssets = path.join(process.cwd(), 'public/blog-assets');
const dirs = fs.readdirSync(blogAssets);
console.log('Total dirs in public/blog-assets:', dirs.length);

let malformedCount = 0;
let totalChecked = 0;

for (const dir of dirs) {
  const dirPath = path.join(blogAssets, dir);
  const files = fs.readdirSync(dirPath);
  for (const f of files) {
    if (f.endsWith('.svg')) {
      totalChecked++;
      const fullPath = path.join(dirPath, f);
      const text = fs.readFileSync(fullPath, 'utf-8');
      if (!text.includes('<svg') || !text.includes('</svg>')) {
        malformedCount++;
        console.log('Malformed SVG:', fullPath);
      }
    }
  }
}

console.log(`Verified ${totalChecked} SVGs across ${dirs.length} folders.`);
console.log(`Malformed SVGs: ${malformedCount}`);

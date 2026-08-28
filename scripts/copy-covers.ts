import fs from 'fs';
import path from 'path';

const BRAIN_DIR = 'C:/Users/user/.gemini/antigravity/brain/74dce32a-758f-4d44-8a8a-7dafc4df3e35';
const TARGET_COVERS = path.resolve('public/drawings/covers');
const TARGET_ADMIN_COVERS = path.resolve('../hr-vasthu-admin/public/drawings/covers');

fs.mkdirSync(TARGET_COVERS, { recursive: true });
fs.mkdirSync(TARGET_ADMIN_COVERS, { recursive: true });

const COVERS_MAP: { [key: string]: string } = {
  '87': 'house_87_sqyd_1787861253809.jpg',
  '96': 'house_96_sqyd_1787862351841.jpg',
  '98': 'house_98_sqyd_1787861291805.jpg',
  '99': 'house_99_sqyd_1787862383948.jpg',
  '105': 'house_105_sqyd_1787862423323.jpg',
  '116': 'house_116_sqyd_1787861420652.jpg',
  '126': 'house_126_sqyd_1787862461915.jpg',
  '130': 'house_130_sqyd_1787861453007.jpg',
  '157': 'house_157_sqyd_1787861331112.jpg',
  '175': 'house_175_sqyd_1787861364063.jpg',
  '248': 'house_248_sqyd_1787861392934.jpg',
};

for (const [plotSize, filename] of Object.entries(COVERS_MAP)) {
  const src = path.join(BRAIN_DIR, filename);
  const destName = `cover-${plotSize}.jpg`;
  const dest1 = path.join(TARGET_COVERS, destName);
  const dest2 = path.join(TARGET_ADMIN_COVERS, destName);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest1);
    fs.copyFileSync(src, dest2);
    console.log(`✓ Copied ${destName}`);
  } else {
    console.warn(`File not found: ${src}`);
  }
}

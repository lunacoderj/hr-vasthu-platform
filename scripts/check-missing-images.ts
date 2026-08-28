import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');

async function checkMissingFiles() {
  const { data: blogs } = await supabase.from('blogs').select('id, slug, content');
  if (!blogs) return;

  let missingCount = 0;
  let totalImages = 0;
  const missingSamples: any[] = [];

  for (const b of blogs) {
    try {
      const parsed = JSON.parse(b.content);
      const images = parsed.images || [];
      for (const img of images) {
        totalImages++;
        const relPath = img.publicUrl.replace(/^\//, '');
        const fullPath = path.join(process.cwd(), 'public', relPath);
        if (!fs.existsSync(fullPath)) {
          missingCount++;
          if (missingSamples.length < 10) {
            missingSamples.push({ slug: b.slug, publicUrl: img.publicUrl, fullPath });
          }
        }
      }
    } catch {}
  }

  console.log(`Checked ${totalImages} total images across ${blogs.length} articles.`);
  console.log(`Missing images on disk: ${missingCount}`);
  if (missingSamples.length > 0) {
    console.log('Sample missing files:', missingSamples);
  }
}
checkMissingFiles().catch(console.error);

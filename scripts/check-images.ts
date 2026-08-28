import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');

async function check() {
  console.log('1. Checking disk files in public/blog-assets...');
  const blogAssetsDir = path.join(process.cwd(), 'public/blog-assets');
  if (fs.existsSync(blogAssetsDir)) {
    const dirs = fs.readdirSync(blogAssetsDir);
    console.log('Total folders in public/blog-assets:', dirs.length);
    if (dirs.length > 0) {
      console.log('Sample dir:', dirs[0]);
      const sampleFiles = fs.readdirSync(path.join(blogAssetsDir, dirs[0]));
      console.log('Files in sample dir:', sampleFiles);
      if (sampleFiles.length > 0) {
        const fileContent = fs.readFileSync(path.join(blogAssetsDir, dirs[0], sampleFiles[0]), 'utf-8');
        console.log('Sample file head:', fileContent.slice(0, 150));
      }
    }
  } else {
    console.log('Directory public/blog-assets NOT FOUND');
  }

  console.log('\n2. Checking Supabase article images...');
  const { data: blogs } = await supabase.from('blogs').select('id, title, slug, content').limit(3);
  if (blogs && blogs.length > 0) {
    for (const b of blogs) {
      const parsed = JSON.parse(b.content);
      console.log(`Blog "${b.title.slice(0, 30)}" images:`, parsed.images);
    }
  }
}
check().catch(console.error);

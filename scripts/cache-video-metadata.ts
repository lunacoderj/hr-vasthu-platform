import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cacheVideos() {
  console.log('Fetching video records from Supabase...');
  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at, views');

  if (error || !videos) {
    console.error('Error fetching videos:', error);
    return;
  }

  console.log(`Fetched ${videos.length} videos from Supabase.`);
  fs.writeFileSync('data/video-metadata.json', JSON.stringify(videos, null, 2), 'utf-8');
  console.log('✅ Cached to data/video-metadata.json!');
}

cacheVideos().catch(console.error);

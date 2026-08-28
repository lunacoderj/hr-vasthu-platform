import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');

async function check() {
  const { data: blogSample, error: bErr } = await supabase.from('blogs').select('*').limit(1);
  console.log('Blog sample keys:', Object.keys(blogSample?.[0] || {}), 'Error:', bErr);

  const { data: videoSample, error: vErr } = await supabase.from('videos').select('*').limit(1);
  console.log('Video sample keys:', Object.keys(videoSample?.[0] || {}), 'Error:', vErr);
}
check().catch(console.error);

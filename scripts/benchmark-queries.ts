import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');

async function benchmark() {
  console.log('1. Testing simple select without count...');
  console.time('No Count');
  const { data: d1, error: e1 } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image, author, created_at, keywords')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(30);
  console.timeEnd('No Count');
  console.log('Results 1:', d1?.length, 'Error:', e1);

  console.log('\n2. Testing select with text excerpt search or category filter...');
  console.time('Category Filter');
  const { data: d2, error: e2 } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image, author, created_at, keywords')
    .eq('is_published', true)
    .ilike('title', '%వాస్తు%')
    .order('created_at', { ascending: false })
    .limit(20);
  console.timeEnd('Category Filter');
  console.log('Results 2:', d2?.length, 'Error:', e2);
}

benchmark().catch(console.error);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');

async function test() {
  console.time('Fast Metadata Query');
  const { data, count, error } = await supabase
    .from('blogs')
    .select('id, title, slug, cover_image, author, created_at, keywords', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(0, 24);
  console.timeEnd('Fast Metadata Query');

  if (error) console.error('Error:', error);
  else {
    console.log('✅ Query succeeded! Total blogs in DB:', count, 'Fetched rows:', data.length);
    console.log('Sample row:', data[0]);
  }
}
test().catch(console.error);

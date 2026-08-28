import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '');

async function inspect() {
  const { data: allBlogs, error } = await supabase
    .from('blogs')
    .select('id, title, slug, is_published, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Total blogs in DB:', allBlogs.length);
  console.log('Published count:', allBlogs.filter(b => b.is_published).length);
  console.log('First 5 items:');
  console.table(allBlogs.slice(0, 5));
  console.log('Last 5 items:');
  console.table(allBlogs.slice(-5));
}

inspect().catch(console.error);

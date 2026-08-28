import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data, count, error } = await supabase.from('blogs').select('id, title, slug, is_published', { count: 'exact' }).limit(5);
  if (error) {
    console.error('Supabase blogs error:', error);
  } else {
    console.log('✅ Supabase blogs connected! Total blogs in DB:', count);
    console.log('Sample rows:', data);
  }
}
test().catch(console.error);

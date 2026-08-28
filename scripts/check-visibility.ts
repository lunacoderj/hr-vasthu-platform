import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const anonClient = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || '');
const serviceClient = createClient(process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '');

async function check() {
  console.log('--- 1. Testing Anon Client with lte(created_at, now) ---');
  const { data: anon1, count: count1, error: err1 } = await anonClient
    .from('blogs')
    .select('id, title, slug, is_published, created_at', { count: 'exact' })
    .eq('is_published', true)
    .lte('created_at', new Date().toISOString())
    .limit(5);

  console.log('Count with lte(created_at):', count1, 'Error:', err1);
  if (anon1) console.log('Sample rows:', anon1);

  console.log('\n--- 2. Testing Anon Client WITHOUT lte(created_at, now) ---');
  const { data: anon2, count: count2, error: err2 } = await anonClient
    .from('blogs')
    .select('id, title, slug, is_published, created_at', { count: 'exact' })
    .eq('is_published', true)
    .limit(5);

  console.log('Count without lte(created_at):', count2, 'Error:', err2);
  if (anon2) console.log('Sample rows:', anon2);

  console.log('\n--- 3. Testing Service Client total published ---');
  const { count: count3, error: err3 } = await serviceClient
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  console.log('Service Role total count:', count3, 'Error:', err3);
}

check().catch(console.error);

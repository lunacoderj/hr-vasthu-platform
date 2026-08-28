import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function checkTables() {
  const tableNames = ['drawings', 'drawing_bundles', 'drawing_files', 'leads', 'orders', 'purchases', 'books', 'blogs', 'videos'];
  for (const t of tableNames) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    console.log(`Table [${t}]:`, error ? `Error: ${error.message}` : `OK (${data?.length} rows)`);
  }
}

checkTables().catch(console.error);

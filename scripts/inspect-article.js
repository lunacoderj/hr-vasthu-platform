import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('blogs').select('*').eq('slug', 'vastu-guide-iIlfew').single();
  if (error) return console.error(error);
  
  console.log('TITLE:', data.title);
  console.log('SLUG:', data.slug);
  console.log('AUTHOR:', data.author);
  
  const parsed = JSON.parse(data.content);
  console.log('CATEGORY:', parsed.category);
  console.log('EXCERPT:', parsed.excerpt);
  console.log('READING TIME:', parsed.reading_time_minutes, 'min');
  console.log('TOTAL SECTIONS:', parsed.sections.length);
  
  let totalWords = 0;
  for (const s of parsed.sections) {
    const wc = s.content_markdown.split(/\s+/).length;
    totalWords += wc;
    console.log(`  Section ${s.number}: ${s.title} (${wc} words)`);
    console.log(`    Image: ${s.image_url.slice(0, 65)}...`);
  }
  
  console.log('\n===========================================');
  console.log('🎉 TOTAL GENERATED WORD COUNT:', totalWords, 'WORDS!');
  console.log('===========================================');
  console.log('FAQS COUNT:', parsed.faqs.length);
}

check();

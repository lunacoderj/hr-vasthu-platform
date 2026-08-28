import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function updateBooks() {
  console.log('Updating English book in Supabase...');
  const { error: eErr } = await supabase.from('books').upsert({
    id: 'english-book',
    title: 'Pathway to Success Through Vedic Vasthu (English)',
    description: 'Authoritative guide to ancient Vedic architectural wisdom by Dr. Kunchala Hanumantha Rao. Detailed insights on plot selection, room orientations, non-demolition remedies, and positive energy flow.',
    cover_image: '/books/english-book-cover.png',
    pdf_url: '/books/Vijayabata%20Vaasthu%20Book%20English.pdf',
    language: 'en',
    pages: 310,
    category: 'Vasthu Shastra',
    is_free: true,
    created_at: new Date().toISOString()
  });
  if (eErr) console.error('Error updating english book:', eErr);
  else console.log('English book updated successfully.');

  console.log('Updating Telugu book in Supabase...');
  const { error: tErr } = await supabase.from('books').upsert({
    id: 'telugu-book',
    title: 'విజయబాట వాస్తు గ్రంథం (Telugu)',
    description: 'డాక్టర్ కుంచాల హనుమంతరావు గారిచే రచించబడిన ప్రామాణిక వాస్తు శాస్త్ర గ్రంథం. గృహ నిర్మాణం, దిశల ప్రాముఖ్యత, ఆయది గణితం మరియు దోష నివారణల సంపూర్ణ సమగ్ర గ్రంథం.',
    cover_image: '/books/telugu-book-cover.png',
    pdf_url: '/books/vasthu%20telugu%20book.pdf',
    language: 'te',
    pages: 240,
    category: 'Vasthu Shastra',
    is_free: false,
    created_at: new Date().toISOString()
  });
  if (tErr) console.error('Error updating telugu book:', tErr);
  else console.log('Telugu book updated successfully.');
}

updateBooks().catch(console.error);

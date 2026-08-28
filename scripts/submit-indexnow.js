import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const INDEXNOW_KEY = 'a78f219c63b44e05b38d9f1234abcd56';
const HOST = 'hrvasthu.com';
const BASE_URL = 'https://hrvasthu.com';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function submitIndexNow() {
  console.log('🚀 Compiling all 1,000+ website URLs for Search Engine IndexNow broadcast...');

  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/about`,
    `${BASE_URL}/videos`,
    `${BASE_URL}/shorts`,
    `${BASE_URL}/books`,
    `${BASE_URL}/drawings`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/gallery`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/appointment`,
    `${BASE_URL}/privacy`,
    `${BASE_URL}/terms`,
    `${BASE_URL}/disclaimer`
  ];

  try {
    const [blogsRes, videosRes, booksRes] = await Promise.all([
      supabase.from('blogs').select('slug').eq('is_published', true).order('created_at', { ascending: false }).limit(1000),
      supabase.from('videos').select('id, youtube_id').order('published_at', { ascending: false }).limit(1000),
      supabase.from('books').select('id').limit(100)
    ]);

    const blogUrls = (blogsRes.data || []).map(b => `${BASE_URL}/blog/${b.slug}`);
    const videoUrls = (videosRes.data || []).map(v => `${BASE_URL}/videos/${v.youtube_id || v.id}`);
    const bookUrls = (booksRes.data || []).map(bk => `${BASE_URL}/books/${bk.id}`);

    let drawingUrls = [];
    try {
      const fs = await import('fs');
      const path = await import('path');
      const bundlePath = path.resolve(process.cwd(), 'src/core/data/drawing-bundles.ts');
      if (fs.existsSync(bundlePath)) {
        const raw = fs.readFileSync(bundlePath, 'utf8');
        const slugMatches = [...raw.matchAll(/"slug":\s*"([^"]+)"/g)];
        const slugs = new Set();
        for (const m of slugMatches) {
          slugs.add(m[1]);
        }
        drawingUrls = Array.from(slugs).map(slug => `${BASE_URL}/drawings/${slug}`);
      }
    } catch {}

    const allUrls = [
      ...staticUrls,
      ...blogUrls,
      ...videoUrls,
      ...drawingUrls,
      ...bookUrls
    ];

    console.log(`📊 Total URLs collected: ${allUrls.length} (${blogUrls.length} blogs, ${videoUrls.length} videos, ${drawingUrls.length} drawings, ${bookUrls.length} books, ${staticUrls.length} static pages)`);

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: allUrls
    };

    console.log('📡 Broadcasting to IndexNow API (Bing, Yandex, Seznam, Naver, Yahoo)...');

    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow'
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload)
        });

        console.log(`✅ [${endpoint}] Response status: ${res.status} (${res.statusText || 'OK'})`);
      } catch (err) {
        console.error(`❌ [${endpoint}] Error:`, err.message);
      }
    }

    console.log('\n🎉 Automatic Instant Indexing Submission Finished!');
    console.log('💡 Note for Google: Google crawls via your sitemap.xml. Ensure https://hrvasthu.com/sitemap.xml is submitted in Google Search Console.');

  } catch (error) {
    console.error('Fatal error during indexing broadcast:', error);
  }
}

submitIndexNow();

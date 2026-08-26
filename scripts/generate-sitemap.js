import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://hrvasthu.com';

async function generateSitemap() {
  console.log('Generating Video-Rich & Drawing-Rich Sitemap...');
  
  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/videos`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/shorts`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/books`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/drawings`, priority: '0.95', changefreq: 'daily' },
    { loc: `${BASE_URL}/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/gallery`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/appointment`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${BASE_URL}/terms`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${BASE_URL}/disclaimer`, priority: '0.5', changefreq: 'yearly' },
  ];

  try {
    let videosData = [];
    let blogsData = [];
    let booksData = [];
    let drawingsData = [];

    try {
      const { data } = await supabase.from('videos').select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at').order('published_at', { ascending: false });
      videosData = data || [];
    } catch {}

    try {
      const { data } = await supabase.from('blogs').select('slug, created_at').eq('is_published', true).order('created_at', { ascending: false });
      blogsData = data || [];
    } catch {}

    try {
      const { data } = await supabase.from('books').select('id');
      booksData = data || [];
    } catch {}

    try {
      const { data } = await supabase.from('drawings').select('id, slug, updated_at, created_at').order('created_at', { ascending: false });
      drawingsData = data || [];
    } catch {}

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    for (const page of staticUrls) {
      xml += `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    if (videosData && videosData.length > 0) {
      for (const v of videosData) {
        const thumb = v.thumbnail_max || v.thumbnail_high || `${BASE_URL}/hero.png`;
        const title = (v.title || 'Vastu Lesson').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const desc = (v.description || v.title || 'Vastu Video').slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        xml += `  <url>
    <loc>${BASE_URL}/videos/${v.youtube_id || v.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <video:video>
      <video:thumbnail_loc>${thumb}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${desc}</video:description>
      <video:publication_date>${new Date(v.published_at || Date.now()).toISOString().split('T')[0]}</video:publication_date>
    </video:video>
  </url>\n`;
      }
    }

    if (blogsData && blogsData.length > 0) {
      for (const b of blogsData) {
        xml += `  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
      }
    }

    if (drawingsData && drawingsData.length > 0) {
      for (const d of drawingsData) {
        const path = d.slug ? `/drawings/${d.slug}` : `/drawings/${d.id}`;
        xml += `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date(d.updated_at || d.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
      }
    }

    if (booksData && booksData.length > 0) {
      for (const book of booksData) {
        xml += `  <url>
    <loc>${BASE_URL}/books/${book.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      }
    }

    xml += `</urlset>`;

    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log('✅ Video-Rich and Drawing-Rich Sitemap successfully generated at public/sitemap.xml');
    
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

generateSitemap();

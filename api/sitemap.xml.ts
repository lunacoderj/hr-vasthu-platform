import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://hrvasthu.com';

  try {
    const [videosRes, blogsRes, booksRes, drawingsRes] = await Promise.all([
      supabase.from('videos').select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at, duration').order('published_at', { ascending: false }),
      supabase.from('blogs').select('slug, created_at').eq('is_published', true).order('created_at', { ascending: false }),
      supabase.from('books').select('id, created_at'),
      supabase.from('drawings').select('id, slug, updated_at, created_at').order('created_at', { ascending: false }).catch(() => ({ data: [] }))
    ]);

    const staticPages = [
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
      { loc: `${BASE_URL}/disclaimer`, priority: '0.5', changefreq: 'yearly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // Static Pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    // Video Pages with Google Video Schema Extensions
    if (videosRes.data) {
      for (const v of videosRes.data) {
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

    // Blog Pages
    if (blogsRes.data) {
      for (const b of blogsRes.data) {
        xml += `  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${new Date(b.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
      }
    }

    // Drawing Architectural Blueprint Pages
    if (drawingsRes?.data && Array.isArray(drawingsRes.data)) {
      for (const d of drawingsRes.data) {
        const path = d.slug ? `/drawings/${d.slug}` : `/drawings/${d.id}`;
        xml += `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date(d.updated_at || d.created_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
      }
    }

    // Book Pages
    if (booksRes.data) {
      for (const book of booksRes.data) {
        xml += `  <url>
    <loc>${BASE_URL}/books/${book.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).send(xml);

  } catch (err: any) {
    console.error('Dynamic sitemap error:', err);
    return res.status(500).send('<error>Failed to generate sitemap</error>');
  }
}

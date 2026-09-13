import { createClient } from '@supabase/supabase-js';

const DRAWING_SLUGS = [
  "87-sq-yards-87-sq-yards-contemporary-vedic-living-plan",
  "96-sq-yards-96-sq-yards-modern-compact-vastu-home",
  "98-sq-yards-98-sq-yards-harmonious-family-vastu-house",
  "99-sq-yards-99-sq-yards-contemporary-vedic-living-plan",
  "105-sq-yards-105-sq-yards-contemporary-vedic-living-plan",
  "116-sq-yards-116-sq-yards-harmonious-family-vastu-house",
  "126-sq-yards-126-sq-yards-modern-compact-vastu-home",
  "130-sq-yards-130-sq-yards-smart-spatial-vastu-villa",
  "133-sq-yards-133-sq-yards-executive-independent-vastu-residence",
  "138-sq-yards-138-sq-yards-modern-compact-vastu-home",
  "140-sq-yards-140-sq-yards-harmonious-family-vastu-house",
  "141-sq-yards-141-sq-yards-contemporary-vedic-living-plan",
  "143-sq-yards-143-sq-yards-premium-architectural-vastu-home",
  "148-sq-yards-148-sq-yards-smart-spatial-vastu-villa",
  "153-sq-yards-153-sq-yards-contemporary-vedic-living-plan",
  "155-sq-yards-155-sq-yards-premium-architectural-vastu-home",
  "156-sq-yards-156-sq-yards-modern-compact-vastu-home",
  "157-sq-yards-157-sq-yards-executive-independent-vastu-residence",
  "160-sq-yards-160-sq-yards-smart-spatial-vastu-villa",
  "166-sq-yards-166-sq-yards-smart-spatial-vastu-villa",
  "173-sq-yards-173-sq-yards-premium-architectural-vastu-home",
  "175-sq-yards-175-sq-yards-executive-independent-vastu-residence",
  "194-sq-yards-194-sq-yards-harmonious-family-vastu-house",
  "195-sq-yards-195-sq-yards-contemporary-vedic-living-plan",
  "200-sq-yards-200-sq-yards-harmonious-family-vastu-house",
  "202-sq-yards-202-sq-yards-smart-spatial-vastu-villa",
  "205-sq-yards-205-sq-yards-executive-independent-vastu-residence",
  "208-sq-yards-208-sq-yards-smart-spatial-vastu-villa",
  "215-sq-yards-215-sq-yards-premium-architectural-vastu-home",
  "217-sq-yards-217-sq-yards-executive-independent-vastu-residence",
  "219-sq-yards-219-sq-yards-contemporary-vedic-living-plan",
  "222-sq-yards-222-sq-yards-modern-compact-vastu-home",
  "239-sq-yards-239-sq-yards-premium-architectural-vastu-home",
  "242-sq-yards-242-sq-yards-harmonious-family-vastu-house",
  "248-sq-yards-248-sq-yards-harmonious-family-vastu-house",
  "252-sq-yards-252-sq-yards-modern-compact-vastu-home",
  "271-sq-yards-271-sq-yards-executive-independent-vastu-residence",
  "303-sq-yards-303-sq-yards-contemporary-vedic-living-plan"
];

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://www.hrvasthu.com';

  try {
    const today = new Date().toISOString().split('T')[0];

    // Fetch videos, blogs, drawings, and books with resilient fallbacks
    const [videosRes, blogsRes, booksRes, drawingsRes] = await Promise.all([
      supabase.from('videos').select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at, duration').order('published_at', { ascending: false }).limit(1000),
      supabase.from('blogs').select('slug, created_at, updated_at').eq('is_published', true).order('created_at', { ascending: false }).limit(1000),
      supabase.from('books').select('id, created_at').limit(100),
      supabase.from('drawings').select('id, slug, updated_at, created_at').order('created_at', { ascending: false })
    ]);

    let blogs = blogsRes.data || [];
    if (!blogs || blogs.length === 0) {
      const { data: altBlogs } = await supabase.from('blogs').select('slug, created_at, updated_at').limit(1000);
      if (altBlogs && altBlogs.length > 0) {
        blogs = altBlogs;
      }
    }

    let drawings = (drawingsRes?.data && Array.isArray(drawingsRes.data) && drawingsRes.data.length > 0)
      ? drawingsRes.data
      : DRAWING_SLUGS.map(s => ({ slug: s, updated_at: today }));

    const staticPages = [
      { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/about`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/videos`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/shorts`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/books`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${BASE_URL}/drawings`, priority: '0.95', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/blog`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${BASE_URL}/gallery`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${BASE_URL}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/appointment`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${BASE_URL}/privacy`, priority: '0.5', changefreq: 'yearly', lastmod: today },
      { loc: `${BASE_URL}/terms`, priority: '0.5', changefreq: 'yearly', lastmod: today },
      { loc: `${BASE_URL}/disclaimer`, priority: '0.5', changefreq: 'yearly', lastmod: today }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // 1. Static Pages (13)
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    // 2. Video Pages with Google Video Schema Extensions (495)
    if (videosRes.data) {
      for (const v of videosRes.data) {
        const thumb = v.thumbnail_max || v.thumbnail_high || `${BASE_URL}/hero.webp`;
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

    // 3. Blog Research Article Pages (495)
    if (blogs && blogs.length > 0) {
      for (const b of blogs) {
        const lastMod = new Date(b.updated_at || b.created_at || Date.now()).toISOString().split('T')[0];
        xml += `  <url>
    <loc>${BASE_URL}/blog/${b.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
      }
    }

    // 4. Drawing Blueprint Pages (38)
    for (const d of drawings) {
      const path = d.slug ? `/drawings/${d.slug}` : `/drawings/${d.id}`;
      const lastMod = new Date(d.updated_at || d.created_at || Date.now()).toISOString().split('T')[0];
      xml += `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    }

    // 5. Book Pages (2)
    if (booksRes.data && booksRes.data.length > 0) {
      for (const book of booksRes.data) {
        xml += `  <url>
    <loc>${BASE_URL}/books/${book.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      }
    } else {
      xml += `  <url>
    <loc>${BASE_URL}/books/english-book</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n  <url>
    <loc>${BASE_URL}/books/telugu-book</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);

  } catch (err: any) {
    console.error('Dynamic master sitemap error:', err);
    return res.status(500).send('<error>Failed to generate master sitemap</error>');
  }
}

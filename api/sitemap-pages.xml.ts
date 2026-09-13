import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://www.hrvasthu.com';
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: books } = await supabase
      .from('books')
      .select('id, created_at')
      .limit(100);

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    }

    if (books && books.length > 0) {
      for (const book of books) {
        xml += `  <url>
    <loc>${BASE_URL}/books/${book.id}</loc>
    <lastmod>${today}</lastmod>
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
    console.error('Pages sitemap error:', err);
    return res.status(500).send('<error>Failed to generate pages sitemap</error>');
  }
}

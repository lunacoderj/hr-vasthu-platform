import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://www.hrvasthu.com';

  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at, duration')
      .order('published_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    if (videos && videos.length > 0) {
      for (const v of videos) {
        const thumb = v.thumbnail_max || v.thumbnail_high || `${BASE_URL}/hero.png`;
        const title = (v.title || 'Vastu Lesson').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const desc = (v.description || v.title || 'Vastu Video').slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const pubDate = new Date(v.published_at || Date.now()).toISOString().split('T')[0];

        xml += `  <url>
    <loc>${BASE_URL}/videos/${v.youtube_id || v.id}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <video:video>
      <video:thumbnail_loc>${thumb}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${desc}</video:description>
      <video:publication_date>${pubDate}</video:publication_date>
    </video:video>
  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).send(xml);

  } catch (err: any) {
    console.error('Videos sitemap error:', err);
    return res.status(500).send('<error>Failed to generate videos sitemap</error>');
  }
}

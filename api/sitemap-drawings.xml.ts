import { createClient } from '@supabase/supabase-js';
import { DRAWING_BUNDLES } from '../src/core/data/drawing-bundles.js';

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://www.hrvasthu.com';

  try {
    let drawingsList: any[] = [];
    try {
      const { data } = await supabase.from('drawings').select('id, slug, updated_at, created_at').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        drawingsList = data;
      }
    } catch {}

    if (drawingsList.length === 0) {
      drawingsList = (DRAWING_BUNDLES as any[]) || [];
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const d of drawingsList) {
      const path = d.slug ? `/drawings/${d.slug}` : `/drawings/${d.id}`;
      const lastMod = new Date(d.updated_at || d.createdAt || d.created_at || Date.now()).toISOString().split('T')[0];
      xml += `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).send(xml);

  } catch (err: any) {
    console.error('Drawings sitemap error:', err);
    return res.status(500).send('<error>Failed to generate drawings sitemap</error>');
  }
}

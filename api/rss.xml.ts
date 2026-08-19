import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const BASE_URL = 'https://hrvasthu.com';

  try {
    const [blogsRes, videosRes] = await Promise.all([
      supabase.from('blogs').select('title, slug, content, author, created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(30),
      supabase.from('videos').select('id, title, description, published_at').order('published_at', { ascending: false }).limit(30)
    ]);

    const escapeXml = (str: string) => {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HR Vasthu — Authentic Vedic Architecture Updates</title>
    <link>${BASE_URL}</link>
    <description>Daily authentic Vastu Shastra lessons, architectural floor plans, and video analyses by Vasthu Siddanthi Dr. Kunchala Hanumantha Rao.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
`;

    // Add Blogs to RSS
    if (blogsRes.data) {
      for (const blog of blogsRes.data) {
        let desc = 'Authentic Vastu Shastra guidance by Dr. Kunchala Hanumantha Rao.';
        try {
          const parsed = JSON.parse(blog.content);
          if (parsed.cards && parsed.cards[0]?.text) {
            desc = parsed.cards[0].text.slice(0, 300) + '...';
          }
        } catch {
          desc = (blog.content || '').slice(0, 300);
        }

        xml += `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${BASE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${blog.slug}</guid>
      <description>${escapeXml(desc)}</description>
      <author>${escapeXml(blog.author || 'Dr. Kunchala Hanumantha Rao')}</author>
      <pubDate>${new Date(blog.created_at || Date.now()).toUTCString()}</pubDate>
    </item>\n`;
      }
    }

    // Add Videos to RSS
    if (videosRes.data) {
      for (const video of videosRes.data) {
        xml += `    <item>
      <title>${escapeXml(video.title)}</title>
      <link>${BASE_URL}/videos/${video.id}</link>
      <guid isPermaLink="true">${BASE_URL}/videos/${video.id}</guid>
      <description>${escapeXml(video.description || video.title)}</description>
      <author>Dr. Kunchala Hanumantha Rao</author>
      <pubDate>${new Date(video.published_at || Date.now()).toUTCString()}</pubDate>
    </item>\n`;
      }
    }

    xml += `  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).send(xml);

  } catch (err: any) {
    console.error('Dynamic RSS Feed error:', err);
    return res.status(500).send('<error>Failed to generate RSS feed</error>');
  }
}

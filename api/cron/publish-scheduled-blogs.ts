import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const now = new Date().toISOString();

    // 1. Fetch up to 3 draft/scheduled articles ready to be published today
    const { data: pendingBlogs, error: fetchError } = await supabase
      .from('blogs')
      .select('id, title, slug')
      .eq('is_published', false)
      .lte('created_at', now)
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) {
      console.error('Error fetching pending blogs:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!pendingBlogs || pendingBlogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending articles to publish today. All scheduled articles are live!'
      });
    }

    const publishedIds = pendingBlogs.map(b => b.id);

    // 2. Flip is_published to true
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ is_published: true, updated_at: now })
      .in('id', publishedIds);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // 3. Ping Google and IndexNow to index new URLs
    const urls = pendingBlogs.map(b => `https://hrvasthu.com/blog/${b.slug}`);
    try {
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'hrvasthu.com',
          key: 'a78f219c63b44e05b38d9f1234abcd56',
          keyLocation: 'https://hrvasthu.com/a78f219c63b44e05b38d9f1234abcd56.txt',
          urlList: [...urls, 'https://hrvasthu.com/blog']
        })
      });

      await Promise.allSettled([
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`),
        fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`)
      ]);
    } catch (e: any) {
      console.warn('Sitemap ping warning:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully published ${pendingBlogs.length} articles today.`,
      published: pendingBlogs
    });

  } catch (error: any) {
    console.error('Publish cron error:', error);
    return res.status(500).json({ error: error.message });
  }
}

import { createClient } from '@supabase/supabase-js';

const INDEXNOW_KEY = 'a78f219c63b44e05b38d9f1234abcd56';
const HOST = 'hrvasthu.com';
const BASE_URL = 'https://hrvasthu.com';

export default async function handler(req: any, res: any) {
  // Allow POST or GET for quick ping trigger
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    let urls: string[] = [];

    if (req.body && Array.isArray(req.body.urls)) {
      urls = req.body.urls;
    }

    // If no specific URLs provided, fetch the latest 10 blogs and videos
    if (urls.length === 0) {
      const [blogsRes, videosRes] = await Promise.all([
        supabase.from('blogs').select('slug').eq('is_published', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('videos').select('id').order('published_at', { ascending: false }).limit(5)
      ]);

      const blogUrls = (blogsRes.data || []).map(b => `${BASE_URL}/blog/${b.slug}`);
      const videoUrls = (videosRes.data || []).map(v => `${BASE_URL}/videos/${v.id}`);

      urls = [
        `${BASE_URL}/`,
        `${BASE_URL}/blog`,
        `${BASE_URL}/videos`,
        ...blogUrls,
        ...videoUrls
      ];
    }

    const results: any = {
      submittedUrls: urls,
      indexNow: null,
      sitemapPings: []
    };

    // 1. IndexNow API Broadcast (Bing, Yandex, Seznam, Naver)
    try {
      const indexNowPayload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls
      };

      const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(indexNowPayload)
      });

      results.indexNow = {
        status: indexNowRes.status,
        ok: indexNowRes.ok
      };
    } catch (e: any) {
      results.indexNow = { error: e.message };
    }

    // 2. Google & Bing Sitemap Pings
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;
    const pingEndpoints = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ];

    for (const pingUrl of pingEndpoints) {
      try {
        const pingRes = await fetch(pingUrl);
        results.sitemapPings.push({ url: pingUrl, status: pingRes.status, ok: pingRes.ok });
      } catch (err: any) {
        results.sitemapPings.push({ url: pingUrl, error: err.message });
      }
    }

    // 3. Log Auto-Index Event to Analytics for Admin visibility
    try {
      await supabase.from('analytics_events').insert({
        event_name: 'search_engine_auto_index',
        path: '/api/auto-index',
        device_type: 'server',
        os: 'cloud_worker',
        browser: 'indexnow_crawler',
        payload: {
          url_count: urls.length,
          urls: urls.slice(0, 15),
          results: results,
          timestamp: new Date().toISOString()
        }
      });
    } catch {
      /* non-critical */
    }

    return res.status(200).json({
      success: true,
      message: `Successfully broadcast ${urls.length} URLs to search engine indexing bots.`,
      results
    });

  } catch (error: any) {
    console.error('Auto-index error:', error);
    return res.status(500).json({ error: error.message });
  }
}

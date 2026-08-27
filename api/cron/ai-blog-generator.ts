import { createClient } from '@supabase/supabase-js';
import { BlogGeneratorService } from '../../src/core/services/blogGenerator.service';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    // 1. Fetch existing blog slugs / titles to avoid duplicate topics
    const { data: existingBlogs } = await supabase
      .from('blogs')
      .select('title, slug, content');

    const existingSlugs = new Set((existingBlogs || []).map(b => b.slug));

    // 2. Fetch candidates from videos table
    const { data: videos, error: videoError } = await supabase
      .from('videos')
      .select('id, youtube_id, title, description, category, thumbnail_max, thumbnail_high, views')
      .order('views', { ascending: false })
      .limit(100);

    if (videoError || !videos || videos.length === 0) {
      return res.status(404).json({ error: 'No candidate videos found in database.' });
    }

    // 3. Find the first video not yet transformed into a deep-dive article
    let targetVideo = null;
    for (const v of videos) {
      const clean = BlogGeneratorService.cleanTitle(v.title);
      const testSlug = BlogGeneratorService.generateSlug(clean, v.youtube_id || v.id);
      if (!existingSlugs.has(testSlug)) {
        targetVideo = v;
        break;
      }
    }

    // If all top videos have blogs, pick a random video from the top 50
    if (!targetVideo) {
      const randomIdx = Math.floor(Math.random() * Math.min(videos.length, 50));
      targetVideo = videos[randomIdx];
    }

    // 4. Generate Long-Form AI Blog Article
    const article = await BlogGeneratorService.generateArticleFromVideo(targetVideo);

    // 5. Insert into Supabase blogs table
    const { data: inserted, error: insertError } = await supabase
      .from('blogs')
      .insert({
        title: article.title,
        slug: article.slug,
        content: article.content,
        cover_image: article.cover_image,
        author: article.author,
        keywords: article.keywords,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting generated blog:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    // 6. Broadcast new blog URL to IndexNow and Search Engine Sitemaps
    const newBlogUrl = `https://hrvasthu.com/blog/${article.slug}`;
    try {
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'hrvasthu.com',
          key: 'a78f219c63b44e05b38d9f1234abcd56',
          keyLocation: 'https://hrvasthu.com/a78f219c63b44e05b38d9f1234abcd56.txt',
          urlList: [newBlogUrl, 'https://hrvasthu.com/blog']
        })
      });

      await Promise.allSettled([
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`),
        fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`)
      ]);
    } catch (e: any) {
      console.warn('Auto indexing notification warning:', e.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully generated and published AI blog article.',
      article: {
        id: inserted.id,
        title: article.title,
        slug: article.slug,
        url: newBlogUrl,
        source_video: targetVideo.title,
        reading_time_minutes: article.reading_time_minutes
      }
    });

  } catch (error: any) {
    console.error('AI Blog Cron failed:', error);
    return res.status(500).json({ error: error.message });
  }
}

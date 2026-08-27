import { createClient } from '@supabase/supabase-js';
import { BlogGeneratorService } from '../../src/core/services/blogGenerator.service';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { videoId, count = 1 } = req.body || req.query || {};

  try {
    let targetVideos = [];

    if (videoId) {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`id.eq.${videoId},youtube_id.eq.${videoId}`)
        .limit(1);

      if (error || !data || data.length === 0) {
        return res.status(404).json({ error: `Video not found for ID: ${videoId}` });
      }
      targetVideos = data;
    } else {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('views', { ascending: false })
        .limit(Math.min(parseInt(count as string) || 1, 10));

      if (error || !data || data.length === 0) {
        return res.status(404).json({ error: 'No videos available for generation.' });
      }
      targetVideos = data;
    }

    const generatedArticles = [];

    for (const vid of targetVideos) {
      const article = await BlogGeneratorService.generateArticleFromVideo(vid);

      const { data: inserted, error: insertError } = await supabase
        .from('blogs')
        .upsert({
          title: article.title,
          slug: article.slug,
          content: article.content,
          cover_image: article.cover_image,
          author: article.author,
          keywords: article.keywords,
          is_published: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (!insertError && inserted) {
        generatedArticles.push({
          id: inserted.id,
          title: article.title,
          slug: article.slug,
          url: `https://hrvasthu.com/blog/${article.slug}`
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully generated ${generatedArticles.length} AI blog articles.`,
      articles: generatedArticles
    });

  } catch (error: any) {
    console.error('Admin blog generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}

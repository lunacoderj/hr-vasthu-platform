import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { BlogGeneratorService } from '../src/core/services/blogGenerator.service.js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedCornerstoneBlogs() {
  console.log('🚀 Starting Cornerstone Vastu Articles Generation...');

  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('id, youtube_id, title, description, category, thumbnail_max, thumbnail_high, views')
      .order('views', { ascending: false })
      .limit(12);

    if (error || !videos || videos.length === 0) {
      console.error('No videos found to generate articles from:', error);
      return;
    }

    console.log(`Found ${videos.length} top videos. Generating 1,500+ word pillar articles...`);

    for (let i = 0; i < videos.length; i++) {
      const vid = videos[i];
      console.log(`[${i + 1}/${videos.length}] Generating: ${vid.title.slice(0, 60)}...`);

      const article = await BlogGeneratorService.generateArticleFromVideo(vid);

      const { error: upsertError } = await supabase
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
        }, { onConflict: 'slug' });

      if (upsertError) {
        console.error(`Error saving blog for ${vid.id}:`, upsertError.message);
      } else {
        console.log(`  ✅ Published: "${article.title}" -> /blog/${article.slug}`);
      }
    }

    console.log('\n🎉 Successfully seeded cornerstone articles!');

  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seedCornerstoneBlogs();

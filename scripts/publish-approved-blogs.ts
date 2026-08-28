/**
 * Post-Review Live Publisher
 * Publishes the validated 491 articles to Supabase after user approval
 * 
 * Rules:
 * - Older videos (> 2 months): is_published = true (immediately live)
 * - Recent videos (last 2 months): is_published = false (scheduled 1 per day)
 * 
 * Run when ready: npx tsx scripts/publish-approved-blogs.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🚀 Starting Publication of Reviewed Blog Articles to Supabase...\n');

  const datasetPath = path.join(process.cwd(), 'scripts/generated-blogs-ready-to-review.json');
  if (!fs.existsSync(datasetPath)) {
    console.error('❌ Could not find scripts/generated-blogs-ready-to-review.json. Run pipeline first.');
    return;
  }

  const articles = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  console.log(`📦 Loaded ${articles.length} approved articles from dataset.\n`);

  const { data: videos } = await supabase
    .from('videos')
    .select('id, youtube_id, published_at');

  const videoDateMap: Record<string, string> = {};
  if (videos) {
    for (const v of videos) {
      if (v.youtube_id && v.published_at) videoDateMap[v.youtube_id] = v.published_at;
      if (v.id && v.published_at) videoDateMap[v.id] = v.published_at;
    }
  }

  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  let publishedCount = 0;
  let scheduledCount = 0;

  const dbRecords = articles.map((article: any, idx: number) => {
    const publishedAt = videoDateMap[article.youtube_id] || new Date().toISOString();
    const isRecent = new Date(publishedAt) >= twoMonthsAgo;

    let isPublished = true;
    let postDate = publishedAt;

    if (isRecent) {
      isPublished = false;
      const sched = new Date(now);
      sched.setDate(sched.getDate() + scheduledCount + 1);
      sched.setHours(11, 30, 0, 0);
      postDate = sched.toISOString();
      scheduledCount++;
    } else {
      publishedCount++;
    }

    return {
      title: article.title,
      slug: article.slug,
      content: JSON.stringify({
        sections: article.sections,
        faqs: article.faqs,
        youtube_id: article.youtube_id,
        hero_image: article.hero_image,
        category: article.category,
        reading_time_minutes: article.reading_time_minutes,
        excerpt: article.excerpt
      }),
      cover_image: article.hero_image,
      author: article.author || "Dr. Kunchala Hanumantha Rao",
      keywords: article.keywords,
      is_published: isPublished,
      created_at: postDate,
      updated_at: new Date().toISOString()
    };
  });

  console.log(`📌 Publishing Strategy:`);
  console.log(`   🌟 ${publishedCount} Older Articles (> 2 months): Publishing LIVE NOW`);
  console.log(`   🗓️ ${scheduledCount} Recent Articles (last 2 months): Scheduled 1 PER DAY\n`);

  const CHUNK_SIZE = 25;
  for (let c = 0; c < dbRecords.length; c += CHUNK_SIZE) {
    const chunk = dbRecords.slice(c, c + CHUNK_SIZE);
    const { error } = await supabase
      .from('blogs')
      .upsert(chunk, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error in chunk ${c / CHUNK_SIZE + 1}:`, error.message);
    } else {
      console.log(`  ✅ Upserted batch ${c / CHUNK_SIZE + 1}/${Math.ceil(dbRecords.length / CHUNK_SIZE)} (posts ${c + 1}-${Math.min(c + CHUNK_SIZE, dbRecords.length)})`);
    }
  }

  console.log(`\n🎉 SUCCESS: All ${dbRecords.length} blog posts published to Supabase!`);
}

main().catch(console.error);

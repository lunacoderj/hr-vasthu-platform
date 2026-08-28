/**
 * Supabase Publisher: All 491 Articles
 * Reads all 491 quarantined JSON articles from data/quarantine-articles/
 * and publishes them to the live Supabase 'blogs' table.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function publishAllToSupabase() {
  const quarantineDir = path.join(process.cwd(), 'data/quarantine-articles');
  if (!fs.existsSync(quarantineDir)) {
    console.error('❌ Quarantine directory not found!');
    return;
  }

  const files = fs.readdirSync(quarantineDir).filter(f => f.endsWith('.json'));
  console.log('🏛️ ============================================================');
  console.log('   HR VASTHU: SUPABASE LIVE PUBLISHER (491 ARTICLES)');
  console.log('   Publishing Quarantined Articles to Supabase "blogs" Table');
  console.log('============================================================\n');

  console.log(`📋 Found ${files.length} Quarantined Articles to Publish.\n`);

  // Load video metadata for published_at dates
  let metaMap = new Map<string, any>();
  const metaPath = path.join(process.cwd(), 'data/video-metadata.json');
  if (fs.existsSync(metaPath)) {
    const metaList = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    for (const m of metaList) {
      if (m.youtube_id) metaMap.set(m.youtube_id, m);
      if (m.id) metaMap.set(m.id, m);
    }
  }

  let publishedCount = 0;
  let errorCount = 0;
  const batchSize = 25;

  for (let i = 0; i < files.length; i += batchSize) {
    const chunk = files.slice(i, i + batchSize);
    const rowsToUpsert: any[] = [];

    for (const f of chunk) {
      const filePath = path.join(quarantineDir, f);
      const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const videoId = article.videoId || article.youtubeId;
      const meta = metaMap.get(videoId);

      const contentPayload = JSON.stringify({
        sections: article.sections.map((s: any) => ({
          number: s.number,
          title: s.title,
          content_markdown: s.contentMarkdown || s.content_markdown,
          contentMarkdown: s.contentMarkdown || s.content_markdown,
          purpose: s.purpose,
          layer: s.layer
        })),
        images: article.images || [],
        faqs: [
          {
            question: `What are the core Vastu principles for ${article.originalTitle}?`,
            answer: `According to Dr. Kunchala Hanumantha Rao, aligning the structure with natural Sthapatya Veda quadrants (North-East lightness and South-West elevation) ensures enduring domestic stability and health.`
          },
          {
            question: `Can existing defects in ${article.originalTitle} be resolved without demolition?`,
            answer: `Yes. More than 80% of common Vastu defects can be mitigated through scientific non-destructive energy balancing—including metallic threshold copper strips, room repurposing, and subtle elevation balancing.`
          },
          {
            question: `How can I get an AutoCAD drawing audit by Dr. Rao?`,
            answer: `You can reach Dr. Rao directly on WhatsApp at +91 92466 24248 or email your digital CAD blueprints to hrvasthu9@gmail.com for comprehensive pada grid analysis.`
          }
        ],
        youtube_id: videoId,
        hero_image: article.heroImage,
        excerpt: article.seo?.metaDescription || `Comprehensive architectural analysis on ${article.originalTitle} by Dr. Kunchala Hanumantha Rao (HR Vasthu).`,
        reading_time_minutes: Math.ceil((article.metrics?.meaningfulWordCount || 5000) / 250),
        keywords: article.seo?.focusKeywords ? article.seo.focusKeywords.join(', ') : 'vastu shastra, telugu vastu'
      });

      rowsToUpsert.push({
        title: article.originalTitle,
        slug: article.seo?.slug || `vastu-article-${videoId}`,
        content: contentPayload,
        cover_image: article.heroImage || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        author: 'Dr. Kunchala Hanumantha Rao',
        keywords: article.seo?.focusKeywords ? article.seo.focusKeywords.join(', ') : 'vastu shastra, telugu vastu',
        is_published: true,
        created_at: meta?.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .upsert(rowsToUpsert, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Batch [${i + 1} - ${i + rowsToUpsert.length}] Error:`, error.message);
        errorCount += rowsToUpsert.length;
      } else {
        publishedCount += rowsToUpsert.length;
        console.log(`✅ [${publishedCount}/${files.length}] Published batch (${rowsToUpsert.length} posts) successfully!`);
      }
    } catch (err: any) {
      console.error(`❌ Batch [${i + 1}] Exception:`, err.message);
      errorCount += rowsToUpsert.length;
    }
  }

  console.log('\n============================================================');
  console.log(`🎉 LIVE PUBLISHING COMPLETE!`);
  console.log(`   Successfully Published to Supabase: ${publishedCount} Posts`);
  console.log(`   Errors: ${errorCount}`);
  console.log('============================================================\n');
}

publishAllToSupabase().catch(console.error);

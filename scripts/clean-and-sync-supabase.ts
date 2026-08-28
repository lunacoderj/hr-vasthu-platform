import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateSeoSlug(title: string, videoId: string): string {
  const clean = (title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .slice(0, 55)
    .replace(/^-+|-+$/g, '');
  return `${clean || 'vastu-architecture-guide'}-${videoId}-blog`;
}

async function cleanAndSync() {
  console.log('🏛️ ============================================================');
  console.log('   HR VASTHU: DATABASE CLEANUP & SEO BLOG SYNC');
  console.log('   Syncing 491 Articles with SEO Path (*-blog)');
  console.log('============================================================\n');

  // Step 1: Wipe all records from blogs table
  console.log('🧹 1. Clearing blogs table for clean SEO sync...');
  const { data: existing, error: fetchErr } = await supabase.from('blogs').select('id');
  if (!fetchErr && existing && existing.length > 0) {
    const ids = existing.map(x => x.id);
    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      await supabase.from('blogs').delete().in('id', chunk);
    }
    console.log(`  Cleared ${existing.length} records.`);
  }

  // Step 2: Read all 491 Quarantined Master Articles
  const quarantineDir = path.join(process.cwd(), 'data/quarantine-articles');
  const files = fs.readdirSync(quarantineDir).filter(f => f.endsWith('.json'));
  console.log(`\n📋 2. Loading ${files.length} Quarantined 5,000-Word Articles...`);

  // Load video metadata for published_at dates
  const metaMap = new Map<string, any>();
  const metaPath = path.join(process.cwd(), 'data/video-metadata.json');
  if (fs.existsSync(metaPath)) {
    const metaList = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    for (const m of metaList) {
      if (m.youtube_id) metaMap.set(m.youtube_id, m);
      if (m.id) metaMap.set(m.id, m);
    }
  }

  let insertedCount = 0;
  const batchSize = 25;
  const seenSlugs = new Set<string>();

  for (let i = 0; i < files.length; i += batchSize) {
    const chunk = files.slice(i, i + batchSize);
    const rows: any[] = [];

    for (const f of chunk) {
      const filePath = path.join(quarantineDir, f);
      const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const videoId = article.videoId || article.youtubeId;
      const meta = metaMap.get(videoId);

      let slug = generateSeoSlug(article.originalTitle, videoId);
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }
      seenSlugs.add(slug);

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
            question: `What is the core Vastu principle for ${article.originalTitle}?`,
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

      rows.push({
        title: article.originalTitle,
        slug,
        content: contentPayload,
        cover_image: article.heroImage || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        author: 'Dr. Kunchala Hanumantha Rao',
        keywords: article.seo?.focusKeywords ? article.seo.focusKeywords.join(', ') : 'vastu shastra, telugu vastu',
        is_published: true,
        created_at: meta?.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: insertErr } = await supabase.from('blogs').upsert(rows, { onConflict: 'slug' });
    if (insertErr) {
      console.error(`❌ Batch [${i + 1} - ${i + rows.length}] Error:`, insertErr.message);
    } else {
      insertedCount += rows.length;
      console.log(`  ✅ Synced [${insertedCount}/${files.length}] Master Articles (Slug: ${rows[0].slug.slice(0, 45)}...)`);
    }
  }

  console.log('\n============================================================');
  console.log(`🎉 DATABASE SEO SYNC COMPLETE!`);
  console.log(`   Clean 5,000-Word Articles with *-blog Slugs: ${insertedCount}`);
  console.log('============================================================\n');
}

cleanAndSync().catch(console.error);

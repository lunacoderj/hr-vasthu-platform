/**
 * Phase 1: Extract transcripts from ALL YouTube videos
 * 
 * Hybrid approach:
 * 1. youtube-transcript npm package (for videos with captions)
 * 2. youtube-transcript.ai external API (fallback)
 * 3. Title + description seed (last resort for no-caption videos)
 * 
 * Run: npx tsx scripts/extract-all-transcripts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { fetchTranscript } from 'youtube-transcript';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 10;
const DELAY_MS = 1500; // delay between batches to avoid rate limits

interface VideoRecord {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
}

interface TranscriptResult {
  video_id: string;
  youtube_id: string;
  transcript: string;
  source: 'youtube-transcript' | 'youtube-transcript-ai' | 'title-description';
  word_count: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Method 1: youtube-transcript npm package
 */
async function extractViaPackage(youtubeId: string): Promise<string | null> {
  try {
    const transcriptItems = await fetchTranscript(youtubeId);
    if (transcriptItems && transcriptItems.length > 0) {
      const fullText = transcriptItems.map(item => item.text).join(' ');
      // Clean up common transcript artifacts
      const cleaned = fullText
        .replace(/\[Music\]/gi, '')
        .replace(/\[Applause\]/gi, '')
        .replace(/\[Laughter\]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length > 50) {
        return cleaned;
      }
    }
    return null;
  } catch (err: any) {
    // Common errors: no captions available, video unavailable
    return null;
  }
}

/**
 * Method 2: youtube-transcript.ai external API
 */
async function extractViaExternalApi(youtubeId: string): Promise<string | null> {
  try {
    const url = `https://youtube-transcript.ai/transcript/${youtubeId}.txt`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'HR-Vasthu-Blog-Generator/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    if (response.ok) {
      const text = await response.text();
      const cleaned = text
        .replace(/\[Music\]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length > 50) {
        return cleaned;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Method 3: Use title + description as seed content
 */
function extractFromMetadata(title: string, description?: string): string {
  const parts = [title];
  if (description && description.length > 20) {
    // Clean description: remove URLs, hashtags, excessive whitespace
    const cleanDesc = description
      .replace(/https?:\/\/\S+/g, '')
      .replace(/#[\w\u0C00-\u0C7F]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    parts.push(cleanDesc);
  }
  return parts.join('. ');
}

async function processVideo(video: VideoRecord): Promise<TranscriptResult> {
  const youtubeId = video.youtube_id;

  // Try Method 1: npm package
  const transcript1 = await extractViaPackage(youtubeId);
  if (transcript1) {
    return {
      video_id: video.id,
      youtube_id: youtubeId,
      transcript: transcript1,
      source: 'youtube-transcript',
      word_count: transcript1.split(/\s+/).length
    };
  }

  // Try Method 2: external API
  await sleep(500); // small delay before fallback
  const transcript2 = await extractViaExternalApi(youtubeId);
  if (transcript2) {
    return {
      video_id: video.id,
      youtube_id: youtubeId,
      transcript: transcript2,
      source: 'youtube-transcript-ai',
      word_count: transcript2.split(/\s+/).length
    };
  }

  // Method 3: metadata fallback
  const metadataText = extractFromMetadata(video.title, video.description);
  return {
    video_id: video.id,
    youtube_id: youtubeId,
    transcript: metadataText,
    source: 'title-description',
    word_count: metadataText.split(/\s+/).length
  };
}

async function main() {
  console.log('🎬 Phase 1: Extracting transcripts from ALL YouTube videos...\n');

  // Fetch all videos
  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, youtube_id, title, description')
    .order('views', { ascending: false });

  if (error || !videos || videos.length === 0) {
    console.error('❌ Failed to fetch videos:', error);
    return;
  }

  console.log(`📹 Found ${videos.length} videos to process.\n`);

  const results: TranscriptResult[] = [];
  let successPackage = 0, successApi = 0, fallbackMeta = 0, failed = 0;

  // Process in batches
  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(videos.length / BATCH_SIZE);

    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (videos ${i + 1}-${Math.min(i + BATCH_SIZE, videos.length)})...`);

    // Process batch sequentially to avoid rate limits
    for (const video of batch) {
      try {
        const result = await processVideo(video);
        results.push(result);

        const icon = result.source === 'youtube-transcript' ? '✅'
          : result.source === 'youtube-transcript-ai' ? '🌐'
          : '📝';

        if (result.source === 'youtube-transcript') successPackage++;
        else if (result.source === 'youtube-transcript-ai') successApi++;
        else fallbackMeta++;

        console.log(`  ${icon} [${result.source}] ${result.word_count} words — ${video.title.slice(0, 55)}...`);
      } catch (err: any) {
        failed++;
        console.error(`  ❌ FAILED: ${video.title.slice(0, 55)}... — ${err.message}`);
      }
    }

    // Delay between batches
    if (i + BATCH_SIZE < videos.length) {
      await sleep(DELAY_MS);
    }
  }

  // Save results to a JSON file for the article generator
  const outputPath = 'scripts/transcripts-output.json';
  const fs = await import('fs');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎉 Transcript extraction complete!`);
  console.log(`   ✅ youtube-transcript (captions): ${successPackage}`);
  console.log(`   🌐 youtube-transcript.ai (API):   ${successApi}`);
  console.log(`   📝 title+description (fallback):  ${fallbackMeta}`);
  console.log(`   ❌ Failed:                         ${failed}`);
  console.log(`   📄 Total saved: ${results.length}`);
  console.log(`   💾 Output: ${outputPath}`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);

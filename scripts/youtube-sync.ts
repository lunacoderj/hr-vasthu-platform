import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing required environment variables. Please check your .env file.");
  console.log("Required: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Initialize Supabase Client with Service Role Key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Helper: Parse ISO 8601 duration (e.g., PT1M30S) to MM:SS string and check if it's a short
const parseDuration = (isoDuration: string) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (parseInt(match?.[1] || '0') || 0);
  const minutes = (parseInt(match?.[2] || '0') || 0);
  const seconds = (parseInt(match?.[3] || '0') || 0);
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const isShort = totalSeconds < 180; // Less than 3 minutes usually implies short format, though YT shorts are < 60s
  
  let formatted = '';
  if (hours > 0) {
    formatted += `${hours}:`;
    formatted += `${minutes.toString().padStart(2, '0')}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += seconds.toString().padStart(2, '0');
  
  return { formatted, isShort };
};

// Helper: Extract hashtags from description
const extractHashtags = (text: string) => {
  const regex = /#\w+/g;
  const matches = text.match(regex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
};

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.ok) return await res.json();
    if (res.status === 403 || res.status === 429) {
      console.warn(`Rate limited or forbidden. Retrying in ${Math.pow(2, i)}s...`);
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    } else {
      throw new Error(`YouTube API Error: ${res.statusText}`);
    }
  }
  throw new Error('Failed to fetch from YouTube API after retries');
}

async function getUploadPlaylistId(channelId: string) {
  console.log(`Fetching channel details for ${channelId}...`);
  const url = `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`;
  const data = await fetchWithRetry(url);
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }
  
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getAllVideoIds(playlistId: string) {
  console.log(`Fetching all video IDs from playlist ${playlistId}...`);
  let videoIds: string[] = [];
  let nextPageToken = '';
  
  do {
    const url = `${YOUTUBE_API_BASE}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const data = await fetchWithRetry(url);
    
    const ids = data.items.map((item: any) => item.contentDetails.videoId);
    videoIds = videoIds.concat(ids);
    
    nextPageToken = data.nextPageToken;
    console.log(`Fetched ${videoIds.length} video IDs so far...`);
  } while (nextPageToken);
  
  return videoIds;
}

async function syncVideosToSupabase(videoIds: string[]) {
  console.log(`Fetching details for ${videoIds.length} videos...`);
  
  // Process in batches of 50
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`;
    
    const data = await fetchWithRetry(url);
    
    const upsertData = data.items.map((item: any) => {
      const durationInfo = parseDuration(item.contentDetails.duration);
      const hashtags = extractHashtags(item.snippet.description);
      
      // Auto-categorize based on title/tags (Basic example)
      let category = 'General';
      const textForCategory = (item.snippet.title + ' ' + item.snippet.description).toLowerCase();
      if (textForCategory.includes('residential') || textForCategory.includes('home') || textForCategory.includes('house') || textForCategory.includes('kitchen')) {
        category = 'Residential';
      } else if (textForCategory.includes('commercial') || textForCategory.includes('office') || textForCategory.includes('business')) {
        category = 'Commercial';
      } else if (textForCategory.includes('astrology') || textForCategory.includes('horoscope') || textForCategory.includes('zodiac')) {
        category = 'Astrology';
      }
      
      return {
        youtube_id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        embed_url: `https://www.youtube.com/embed/${item.id}`,
        watch_url: `https://youtu.be/${item.id}`,
        thumbnail_default: item.snippet.thumbnails?.default?.url || '',
        thumbnail_medium: item.snippet.thumbnails?.medium?.url || '',
        thumbnail_high: item.snippet.thumbnails?.high?.url || '',
        thumbnail_max: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.standard?.url || '',
        published_at: item.snippet.publishedAt,
        duration: durationInfo.formatted,
        views: parseInt(item.statistics.viewCount || '0'),
        likes: parseInt(item.statistics.likeCount || '0'),
        comments: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags || [],
        hashtags: hashtags,
        category: category,
        is_short: durationInfo.isShort
      };
    });
    
    // Upsert into Supabase
    const { error } = await supabase
      .from('videos')
      .upsert(upsertData, { onConflict: 'youtube_id' });
      
    if (error) {
      console.error(`Error upserting batch ${i / 50 + 1}:`, error);
    } else {
      console.log(`Successfully synced batch ${i / 50 + 1} (${batch.length} videos)`);
    }
  }
  
  console.log('✅ Video sync complete!');
}

async function run() {
  try {
    const playlistId = await getUploadPlaylistId(YOUTUBE_CHANNEL_ID as string);
    const videoIds = await getAllVideoIds(playlistId);
    
    if (videoIds.length > 0) {
      await syncVideosToSupabase(videoIds);
    } else {
      console.log('No videos found on this channel.');
    }
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

run();

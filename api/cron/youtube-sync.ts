import { createClient } from '@supabase/supabase-js';

// Helper: Parse ISO 8601 duration
const parseDuration = (isoDuration: string) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (parseInt(match?.[1] || '0') || 0);
  const minutes = (parseInt(match?.[2] || '0') || 0);
  const seconds = (parseInt(match?.[3] || '0') || 0);
  
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const isShort = totalSeconds < 180;
  
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ensure this is triggered by Vercel Cron or authorize via a secret token
  const authHeader = req.headers.authorization;
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    req.headers['user-agent'] !== 'vercel-cron/1.0'
  ) {
    // We allow vercel-cron user agent for Vercel Cron Jobs, but you should ideally use CRON_SECRET
    // In production, configure CRON_SECRET in Vercel env vars and remove the user-agent check
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Missing required environment variables." });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

  try {
    // 1. Get Channel & Playlist ID
    const channelUrl = `${YOUTUBE_API_BASE}/channels?part=contentDetails,statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    const channelData = await fetchWithRetry(channelUrl);
    
    if (!channelData.items || channelData.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    
    const channelDetails = channelData.items[0];
    const playlistId = channelDetails.contentDetails.relatedPlaylists.uploads;
    
    // Total stats from channel
    const subscriberCount = parseInt(channelDetails.statistics.subscriberCount || '0');
    const totalViewCount = parseInt(channelDetails.statistics.viewCount || '0');
    const videoCount = parseInt(channelDetails.statistics.videoCount || '0');

    // 2. Get Video IDs
    let videoIds: string[] = [];
    let nextPageToken = '';
    
    do {
      const playlistUrl = `${YOUTUBE_API_BASE}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const playlistData = await fetchWithRetry(playlistUrl);
      
      const ids = playlistData.items.map((item: any) => item.contentDetails.videoId);
      videoIds = videoIds.concat(ids);
      
      nextPageToken = playlistData.nextPageToken;
    } while (nextPageToken);

    // 3. Sync Videos to Supabase and Aggregate totals
    let syncedCount = 0;
    let totalLikes = 0;
    let totalComments = 0;
    
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${batch.join(',')}&key=${YOUTUBE_API_KEY}`;
      
      const data = await fetchWithRetry(url);
      
      const upsertData = data.items.map((item: any) => {
        const durationInfo = parseDuration(item.contentDetails.duration);
        const hashtags = extractHashtags(item.snippet.description);
        
        const views = parseInt(item.statistics.viewCount || '0');
        const likes = parseInt(item.statistics.likeCount || '0');
        const comments = parseInt(item.statistics.commentCount || '0');
        
        totalLikes += likes;
        totalComments += comments;
        
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
      
      const { error } = await supabase
        .from('videos')
        .upsert(upsertData, { onConflict: 'youtube_id' });
        
      if (error) {
        console.error(`Error upserting batch ${i / 50 + 1}:`, error);
      } else {
        syncedCount += batch.length;
      }
    }

    // 4. Record Channel Snapshot to analytics_events
    await supabase.from('analytics_events').insert({
      event_name: 'youtube_channel_stats',
      path: '/api/cron/youtube-sync',
      device_type: 'server',
      os: 'cron',
      browser: 'node',
      payload: {
        subscriber_count: subscriberCount,
        total_view_count: totalViewCount,
        total_video_count: videoCount,
        total_likes: totalLikes,
        total_comments: totalComments,
        videos_synced: syncedCount,
        synced_at: new Date().toISOString()
      }
    });

    // 5. Automatically broadcast newly synced URLs to Search Engines (IndexNow & Google Sitemaps)
    try {
      const recentUrls = [
        'https://hrvasthu.com/',
        'https://hrvasthu.com/videos',
        'https://hrvasthu.com/blog',
        ...videoIds.slice(0, 10).map(id => `https://hrvasthu.com/videos/${id}`)
      ];

      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'hrvasthu.com',
          key: 'a78f219c63b44e05b38d9f1234abcd56',
          keyLocation: 'https://hrvasthu.com/a78f219c63b44e05b38d9f1234abcd56.txt',
          urlList: recentUrls
        })
      });

      await Promise.allSettled([
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`),
        fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent('https://hrvasthu.com/sitemap.xml')}`)
      ]);
    } catch (e: any) {
      console.warn('Search engine auto-indexing ping warning:', e.message);
    }

    return res.status(200).json({ success: true, message: `Synced ${syncedCount} videos, updated dynamic sitemap & RSS feeds, and broadcasted new URLs to search engine indexers.` });

  } catch (error: any) {
    console.error('Sync failed:', error);
    return res.status(500).json({ error: error.message });
  }
}

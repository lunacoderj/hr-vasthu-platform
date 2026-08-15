import { type Video, type VideoFilterOptions } from '../types/video';
import { supabase } from './supabase';

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0C00-\u0C7F]+/g, (match) => {
      // Keep Telugu or transliterated words if clean, otherwise URL-safe characters
      return match;
    })
    .replace(/[^a-z0-9\u0C00-\u0C7F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
};

export const getVideoSlug = (video: Video): string => {
  if (!video) return '';
  const cleanTitle = (video.title || 'vastu-lesson')
    .toLowerCase()
    .replace(/[^a-z0-9\u0C00-\u0C7F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  
  const shortId = video.youtube_id || video.id?.slice(0, 8) || 'video';
  return `${cleanTitle}-${shortId}`;
};

class VideoService {
  async getVideos(options?: VideoFilterOptions): Promise<Video[]> {
    try {
      let query = supabase.from('videos').select('*').order('published_at', { ascending: false });

      if (options) {
        if (options.category && options.category !== 'All') {
          query = query.eq('category', options.category);
        }
        
        if (options.searchQuery) {
          query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
        }
      }

      const { data, error } = await query.limit(1000);

      if (error) throw error;
      return data as Video[];
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      const categories = new Set(data.map(v => v.category));
      return ['All', ...Array.from(categories)];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['All'];
    }
  }

  async getVideoById(idOrSlug: string): Promise<Video | null> {
    if (!idOrSlug) return null;
    const cleanParam = decodeURIComponent(idOrSlug).trim();

    try {
      // 1. Check if UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParam);
      if (isUuid) {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', cleanParam)
          .single();
        if (!error && data) return data as Video;
      }

      // 2. Check if YouTube ID
      const { data: byYt, error: ytErr } = await supabase
        .from('videos')
        .select('*')
        .eq('youtube_id', cleanParam)
        .single();
      if (!ytErr && byYt) return byYt as Video;

      // 3. Check if slug contains youtube_id suffix or match by slug
      const all = await this.getAllVideos();
      for (const v of all) {
        if (v.youtube_id && cleanParam.endsWith(v.youtube_id)) return v;
        if (v.id && cleanParam.endsWith(v.id.slice(0, 8))) return v;
        if (getVideoSlug(v) === cleanParam) return v;
      }

      // 4. Fuzzy fallback match on title
      const normalizedParam = cleanParam.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const match = all.find(v => {
        const normTitle = v.title.toLowerCase().replace(/[^a-z0-9]/g, ' ');
        return normTitle.includes(normalizedParam) || normalizedParam.includes(normTitle);
      });

      return match || all[0] || null;
    } catch (error) {
      console.error('Error fetching video by slug/id:', error);
      return null;
    }
  }

  async getAllVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as Video[];
    } catch (error) {
      console.error('Error fetching all videos:', error);
      return [];
    }
  }

  async getRecentVideos(limit: number = 6): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Video[];
    } catch (error) {
      console.error('Error fetching recent videos:', error);
      return [];
    }
  }

  async getPopularVideos(limit: number = 6): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Video[];
    } catch (error) {
      console.error('Error fetching popular videos:', error);
      return [];
    }
  }

  async getFeaturedVideos(limit: number = 6): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Video[];
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      return [];
    }
  }

  async getSimilarVideos(video: Video, limit: number = 4): Promise<Video[]> {
    try {
      const allVideos = await this.getAllVideos();
      const otherVideos = allVideos.filter(v => v.id !== video.id);

      const Fuse = (await import('fuse.js')).default;
      const fuse = new Fuse(otherVideos, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'description', weight: 1 },
          { name: 'hashtags', weight: 2 },
          { name: 'category', weight: 2 }
        ],
        threshold: 0.6,
        includeScore: true,
      });

      const searchTerms = [video.title, ...(video.hashtags || []), video.category].join(' ');
      const results = fuse.search(searchTerms);

      let similar = results.map(r => r.item).slice(0, limit);

      if (similar.length < limit) {
        const existingIds = new Set(similar.map(v => v.id));
        const fallbacks = otherVideos.filter(v => v.category === video.category && !existingIds.has(v.id));
        similar = [...similar, ...fallbacks].slice(0, limit);
      }

      return similar;
    } catch (error) {
      console.error('Error fetching similar videos:', error);
      return [];
    }
  }
}

export const videoService = new VideoService();

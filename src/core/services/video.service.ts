import { type Video, type VideoFilterOptions } from '../types/video';
import { supabase } from './supabase';

class VideoService {
  async getVideos(options?: VideoFilterOptions): Promise<Video[]> {
    try {
      let query = supabase.from('videos').select('*').order('published_at', { ascending: false });

      if (options) {
        if (options.category && options.category !== 'All') {
          query = query.eq('category', options.category);
        }
        
        if (options.language && options.language !== 'all') {
          // Assuming language might be added in the future, for now filtering is basic
          // query = query.eq('language', options.language);
        }
        
        if (options.searchQuery) {
          // A simple ilike on title or description
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

  async getVideoById(id: string): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Video;
    } catch (error) {
      console.error('Error fetching video by id:', error);
      return null;
    }
  }

  async getAllVideos(): Promise<Video[]> {
    try {
      // Fetch specifically needed fields to reduce payload size if we want, but select('*') is okay for < 1000 rows
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
      // 1. Fetch all videos to do a client-side fuzzy match (cached by browser/framework ideally)
      const allVideos = await this.getAllVideos();
      
      // 2. Remove the current video from the list
      const otherVideos = allVideos.filter(v => v.id !== video.id);

      // 3. Dynamic import of Fuse to avoid bloating the initial load if not needed
      const Fuse = (await import('fuse.js')).default;

      // 4. Setup Fuse.js for similarity scoring
      const fuse = new Fuse(otherVideos, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'description', weight: 1 },
          { name: 'hashtags', weight: 2 },
          { name: 'category', weight: 2 }
        ],
        threshold: 0.6, // More lenient for "similar" concepts
        includeScore: true,
      });

      // 5. Create a query string from the current video's features
      const searchTerms = [
        video.title,
        ...(video.hashtags || []),
        video.category
      ].join(' ');

      // 6. Perform search
      const results = fuse.search(searchTerms);

      // 7. Return top matches, or fallback to same category if not enough matches
      let similar = results.map(r => r.item).slice(0, limit);

      if (similar.length < limit) {
        // Fallback: fill rest with same category
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

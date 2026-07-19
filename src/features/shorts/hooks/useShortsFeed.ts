import { useState, useEffect } from 'react';
import { supabase } from '../../../core/services/supabase';
import type { Video } from '../../../core/types/video';
import type { ShortsCategory } from '../constants';

export const useShortsFeed = (category: ShortsCategory) => {
  const [shorts, setShorts] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('videos')
          .select('*')
          .eq('is_short', true)
          .order('published_at', { ascending: false });

        if (category !== 'All') {
          // If category matching is simple exact match or LIKE
          query = query.ilike('category', `%${category}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setShorts(data || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShorts();
  }, [category]);

  return { shorts, isLoading };
};

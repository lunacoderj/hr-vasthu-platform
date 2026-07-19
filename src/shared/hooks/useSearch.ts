import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { videoService } from '../../core/services/video.service';
import { type Video } from '../../core/types/video';

export const useSearch = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load all videos into memory once
  useEffect(() => {
    const loadAllVideos = async () => {
      try {
        const data = await videoService.getAllVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to load videos for search index", error);
      } finally {
        setIsReady(true);
      }
    };
    loadAllVideos();
  }, []);

  // Initialize Fuse index
  const fuse = useMemo(() => {
    return new Fuse(videos, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'description', weight: 1 },
        { name: 'category', weight: 2 },
        { name: 'tags', weight: 2 }
      ],
      threshold: 0.4, // Fuzzy matching threshold
      includeMatches: true,
      ignoreLocation: true, // Don't require match to be at beginning
      minMatchCharLength: 2,
    });
  }, [videos]);

  const search = (query: string): Video[] => {
    if (!query || query.trim() === '') return [];
    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  return {
    isReady,
    search,
  };
};

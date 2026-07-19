import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { videoService } from '../../core/services/video.service';
import { bookService } from '../../core/services/book.service';

export interface GlobalSearchResult {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'book' | 'page';
  url: string;
  image?: string;
  category?: string;
}

const STATIC_PAGES: GlobalSearchResult[] = [
  { id: 'p-home', title: 'Home', description: 'Return to the homepage', type: 'page', url: '/' },
  { id: 'p-about', title: 'About Us', description: 'Learn about HR Vasthu and our philosophy', type: 'page', url: '/about' },
  { id: 'p-contact', title: 'Contact', description: 'Get in touch with us for consultation', type: 'page', url: '/contact' },
  { id: 'p-videos', title: 'All Videos', description: 'Browse our entire video collection', type: 'page', url: '/videos' },
  { id: 'p-books', title: 'Digital Library', description: 'Read our Vasthu Shastra books online', type: 'page', url: '/books' },
  { id: 'p-blog', title: 'Blog', description: 'Read our latest articles', type: 'page', url: '/blog' },
  { id: 'p-appointment', title: 'Book Appointment', description: 'Schedule a consultation', type: 'page', url: '/appointment' },
];

export const useGlobalSearch = () => {
  const [items, setItems] = useState<GlobalSearchResult[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [videos, books] = await Promise.all([
          videoService.getAllVideos(),
          bookService.getBooks()
        ]);

        const videoItems: GlobalSearchResult[] = videos.map(v => ({
          id: `v-${v.id}`,
          title: v.title,
          description: v.description,
          type: 'video',
          url: `/videos/${v.id}`,
          image: v.thumbnail_default || v.thumbnail,
          category: v.category
        }));

        const bookItems: GlobalSearchResult[] = books.map(b => ({
          id: `b-${b.id}`,
          title: b.title,
          description: b.description,
          type: 'book',
          url: `/books/${b.id}`,
          image: b.coverImage,
          category: b.category
        }));

        setItems([...STATIC_PAGES, ...bookItems, ...videoItems]);
      } catch (error) {
        console.error("Failed to load global search index", error);
      } finally {
        setIsReady(true);
      }
    };
    loadAllData();
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'description', weight: 1 },
        { name: 'category', weight: 2 },
        { name: 'type', weight: 1 }
      ],
      threshold: 0.4,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  const search = (query: string): GlobalSearchResult[] => {
    if (!query || query.trim() === '') return [];
    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  return {
    isReady,
    search,
  };
};

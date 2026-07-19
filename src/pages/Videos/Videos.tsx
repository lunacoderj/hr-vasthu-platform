import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner, Button } from '../../shared/components/ui';
import { VideoCard } from './components/VideoCard';
import { VideoFilters } from './components/VideoFilters';
import { videoService } from '../../core/services/video.service';
import { type Video } from '../../core/types/video';
import './videos.css';

export const Videos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  useEffect(() => {
    // Load categories once
    videoService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await videoService.getVideos({
          category: selectedCategory,
          language: selectedLanguage,
          searchQuery,
        });
        setVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchVideos();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedLanguage, searchQuery]);

  return (
    <div className="video-page py-12">
      <Container size="xl">
        <div className="mb-12">
          <Typography variant="display" className="mb-4">
            Video Insights
          </Typography>
          <Typography variant="body" className="text-stone-600 dark:text-stone-400 max-w-2xl">
            Explore our vast library of educational and spiritual videos. Filter by your preferred language and topic to find exactly what you need.
          </Typography>
        </div>

        <div className="mb-8">
          <VideoFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
            <Spinner size="lg" variant="primary" />
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="video-grid">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="h-full"
                >
                  <VideoCard 
                    video={video} 
                    onClick={(v) => console.log('Navigate to video detail:', v.id)} 
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Mock Load More */}
            <div className="mt-12 flex justify-center">
              <Button variant="secondary" onClick={() => console.log('Load more')}>
                Load More Videos
              </Button>
            </div>
          </>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
            <Typography variant="h3" className="mb-2 text-stone-400 dark:text-stone-600">
              No videos found
            </Typography>
            <Typography variant="body" className="text-stone-500">
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
            <Button 
              variant="ghost" 
              className="mt-6"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLanguage('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Videos;

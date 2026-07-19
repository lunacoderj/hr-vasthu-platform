import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button, Spinner } from '../../../shared/components/ui';
import { Link } from 'react-router-dom';
import { videoService } from '../../../core/services/video.service';
import { type Video } from '../../../core/types/video';
import { VideoCard } from '../../Videos/components/VideoCard';

export const FeaturedVideos: React.FC = () => {
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [popularVideos, setPopularVideos] = useState<Video[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [recent, popular, featured] = await Promise.all([
          videoService.getRecentVideos(4),
          videoService.getPopularVideos(4),
          videoService.getFeaturedVideos(4),
        ]);
        setRecentVideos(recent);
        setPopularVideos(popular);
        setFeaturedVideos(featured);
      } catch (error) {
        console.error('Error loading showcase videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const renderRow = (title: string, subtitle: string, videos: Video[]) => {
    if (videos.length === 0) return null;
    return (
      <div className="mb-20 last:mb-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <Typography variant="h3" className="mb-2 text-2xl md:text-3xl text-stone-900 dark:text-white font-serif">{title}</Typography>
            <p className="text-stone-600 dark:text-stone-400 font-light">{subtitle}</p>
          </div>
          <Link to="/videos">
            <button className="px-6 py-2.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-800 dark:text-white rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 magnetic">
              <span>View All</span>
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div 
              key={`${title}-${video.id}`} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-transparent border-t border-stone-200/50 dark:border-white/5 transition-colors">
      <Container size="xl">
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {featuredVideos.length > 0 && renderRow("Featured Insights", "Handpicked videos for your journey to prosperity.", featuredVideos)}
            {renderRow("Recently Added", "The latest Vastu principles and tips.", recentVideos)}
            {renderRow("Most Popular", "Our most-watched guides by the community.", popularVideos)}
          </>
        )}
      </Container>
    </section>
  );
};

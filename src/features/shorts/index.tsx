import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Search, Menu, ChevronLeft } from 'lucide-react';
import { Spinner } from '../../shared/components/ui';

import { useShortsFeed } from './hooks/useShortsFeed';
import type { ShortsCategory } from './constants';
import { ShortCard } from './components/ShortCard';
import { CategoryBar } from './components/CategoryBar';
import { Navbar, MobileBottomNav } from '../../shared/components/common';
import type { Video } from '../../core/types/video';

export const ShortsModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ShortsCategory>('All');
  const { shorts, isLoading } = useShortsFeed(activeCategory);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Native apps usually start with sound if system allows, or unmute upon interaction
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<any | null>(null);
  const navigate = useNavigate();

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;
      const scrollPosition = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      
      const newIndex = Math.round(scrollPosition / containerHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < shorts.length) {
        setCurrentIndex(newIndex);
        // Ensure any video played triggers unmute state for subsequent videos to act native
        setIsMuted(false); 
      }
    }, 100); 
  };

  const handleShare = async (short: Video) => {
    const url = `${window.location.origin}/shorts?id=${short.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: short.title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleWatchFull = (short: Video) => {
    if (short.watch_url) {
      window.open(short.watch_url, '_blank');
    } else {
      navigate(`/videos/${short.id}`);
    }
  };

  const handleAskAstrobot = (short: Video) => {
    navigate(`/astrobot?context=short&videoId=${short.id}`);
  };

  if (isLoading && shorts.length === 0) {
    return (
      <div className="h-[100dvh] w-[100vw] bg-black flex items-center justify-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-[100dvh] bg-black overflow-hidden flex flex-col">
      <Helmet>
        <title>Shorts | HR Vasthu</title>
        <meta name="description" content="Watch premium Vastu Shastra shorts." />
      </Helmet>

      {/* 1. Mobile Top Navbar placeholder wrapper (occupies space in flex layout on mobile) */}
      <div className="block md:hidden h-16 flex-none relative z-50 bg-[#0a0a0f]">
        <Navbar />
      </div>

      {/* 2. Desktop Custom Header Overlay (Constant, Floating on desktop) */}
      <div className="hidden md:flex absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent pt-4 pb-12 px-4 pointer-events-none justify-between items-start">
        {/* Desktop Back Button */}
        <div 
          className="pointer-events-auto cursor-pointer bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md transition-all text-white border border-white/10 flex items-center gap-2" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Back to Home</span>
        </div>
        
        {/* Desktop Search & Menu */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors">
            <Search size={24} className="drop-shadow-md" />
          </button>
          <button className="text-white hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors">
            <Menu size={24} className="drop-shadow-md" />
          </button>
        </div>
      </div>

      {/* 3. Scrollable Feed Container (Only the video cards scroll here) */}
      <div 
        className="flex-1 w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
        ref={containerRef}
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {shorts.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center flex-col gap-4 text-white/50">
            <PlayCircle size={48} />
            <h2 className="text-xl font-medium">No shorts found in this category.</h2>
          </div>
        ) : (
          shorts.map((short, index) => {
            // Virtualization logic: Only mount iframe if within +/- 1 of current index
            const shouldMount = Math.abs(index - currentIndex) <= 1;
            const isActive = index === currentIndex;

            return (
              <ShortCard 
                key={short.id}
                short={short}
                isActive={isActive}
                shouldMount={shouldMount}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onShare={handleShare}
                onWatchFull={handleWatchFull}
                onAskAstrobot={handleAskAstrobot}
              />
            );
          })
        )}
      </div>

      {/* 4. Mobile Bottom Navbar placeholder wrapper (occupies space in flex layout on mobile) */}
      <div className="block md:hidden h-16 flex-none relative z-50 bg-[#0a0a0f]">
        <MobileBottomNav />
      </div>
    </div>
  );
};

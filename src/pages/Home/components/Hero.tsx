import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Search, PlayCircle, Sparkles } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button, AnimatedBookingCTA } from '../../../shared/components/ui';
import { VasthuMandala } from '../../../shared/components/effects/VasthuMandala';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../../shared/hooks/useSearch';
import { useTranslation } from '../../../core/hooks/useTranslation';
import { animate, stagger } from 'animejs';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { search } = useSearch();
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim() ? search(searchQuery) : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-stagger-item');
      const anim = animate(elements, {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(120),
        duration: 1000,
        easing: 'easeOutQuad',
      });
      return () => {
        anim.pause();
      };
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
      navigate(`/video/${searchResults[selectedIndex].id}`);
    } else if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    }
  };

  return (
    <section ref={heroRef} className="relative bg-transparent pt-20 pb-28 md:pb-36 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#d4720a]/10 to-[#e68a1c]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      {/* Luxury Vasthu Sastra Background Element */}
      <VasthuMandala className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#d4720a]/10 to-[#e68a1c]/10 border border-[#d4720a]/20 text-[#d4720a] px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-stagger-item opacity-0">
            <Compass size={16} className="animate-spin-slow" />
            <span className="tracking-wider uppercase">{t('nepalAward')}</span>
          </div>

          <div className="animate-stagger-item opacity-0">
            <Typography variant="display" className="mb-4 font-serif tracking-tight text-stone-900 dark:text-white text-3xl sm:text-5xl md:text-6xl">
              Harmonize Your Space, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#a855f7] dark:to-[#fef9f0]">
                Elevate Your Life.
              </span>
            </Typography>
          </div>

          {/* Telugu Page-Specific Subtitle */}
          <div className="animate-stagger-item opacity-0 mb-6">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gold-400/20 dark:bg-gold-500/10 blur-xl rounded-full" />
              <div className="relative px-6 py-2 bg-white/50 dark:bg-stone-900/60 backdrop-blur-md border border-gold-500/30 rounded-2xl shadow-sm">
                <span className="text-sm md:text-base font-bold text-stone-800 dark:text-gold-400 tracking-wide">
                  మీ ఇంటి ప్లాన్స్ &amp; డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును
                </span>
              </div>
            </div>
          </div>

          <div className="animate-stagger-item opacity-0">
            <p className="mb-8 text-base md:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              {t('transformSpace')}
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="w-full max-w-2xl relative mb-8 animate-stagger-item opacity-0">
            <form ref={formRef} onSubmit={handleSearch} className="relative z-20">
              <div className="relative flex items-center bg-white dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-full shadow-lg hover:border-gold-500/50 transition-all p-1.5">
                <div className="pl-4 text-gold-500">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Ask Vastu AI or search videos, books, directions (e.g. Kitchen, East)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2.5 bg-transparent border-none text-xs md:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 text-white rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-stagger-item opacity-0">
            <Link
              to="/videos"
              className="px-6 py-3 bg-stone-900 text-white border border-stone-700 hover:border-gold-500 rounded-full text-xs md:text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlayCircle size={18} className="text-gold-500" />
              <span>{t('watchFreeLessons')}</span>
            </Link>

            <Link
              to="/appointment"
              className="px-6 py-3 bg-gradient-to-r from-gold-600 to-amber-500 text-white rounded-full text-xs md:text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>{t('bookConsultation')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Hero;

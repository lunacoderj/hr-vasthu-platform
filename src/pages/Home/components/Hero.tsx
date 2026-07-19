import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Search, PlayCircle } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button } from '../../../shared/components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../../shared/hooks/useSearch';
import { animate, stagger } from 'animejs';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { search } = useSearch();
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim() ? search(searchQuery) : [];

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Anime.js stagger animations on load
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
      navigate(`/videos/${searchResults[selectedIndex].id}`);
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
    <section ref={heroRef} className="relative bg-transparent pt-24 pb-36 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#d4720a]/10 to-[#e68a1c]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#d4720a]/10 to-[#e68a1c]/10 border border-[#d4720a]/20 text-[#d4720a] px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-stagger-item opacity-0">
            <Compass size={16} className="animate-spin-slow" />
            <span className="tracking-wider uppercase text-xs">Discover the Science of Architecture</span>
          </div>

          <div className="animate-stagger-item opacity-0">
            <Typography variant="display" className="mb-6 font-serif tracking-tight text-white">
              Harmonize Your Space, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#fef9f0]">
                Elevate Your Life.
              </span>
            </Typography>
          </div>

          <div className="animate-stagger-item opacity-0">
            <p className="mb-10 text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
              Unlock prosperity, health, and peace with expert Vastu Shastra consultation. Ancient wisdom perfectly adapted for modern living.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-10 px-4 sm:px-0 relative z-50 animate-stagger-item opacity-0">
            <form 
              ref={formRef}
              onSubmit={handleSearch} 
              className="relative flex flex-col"
            >
              <div className="relative flex items-center w-full group">
                <Search className="absolute left-6 text-stone-400 group-focus-within:text-[#d4720a] transition-colors" size={22} />
                <input
                  type="text"
                  placeholder="Search videos, topics, or Vastu principles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-14 pr-16 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 focus:border-[#d4720a]/60 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#d4720a]/20 text-white placeholder-stone-500 transition-all text-lg backdrop-blur-xl"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 bg-gradient-to-r from-[#d4720a] to-[#e68a1c] hover:opacity-90 text-white p-3 rounded-full transition-colors flex items-center justify-center shadow-lg magnetic"
                  aria-label="Search"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {isFocused && searchQuery.trim().length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-[#111118]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden max-h-[400px] flex flex-col z-50"
                  >
                    {searchResults.length > 0 ? (
                      <div className="overflow-y-auto custom-scrollbar p-2">
                        {searchResults.map((video, idx) => (
                          <div 
                            key={video.id}
                            onClick={() => {
                              navigate(`/videos/${video.id}`);
                              setIsFocused(false);
                            }}
                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                              selectedIndex === idx 
                                ? 'bg-white/10' 
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-800">
                              <img 
                                src={video.thumbnail_default || video.thumbnail} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <PlayCircle size={20} className="text-white opacity-80" />
                              </div>
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="text-sm font-semibold text-white line-clamp-2">
                                {video.title}
                              </h4>
                              <p className="text-xs text-stone-400 mt-1">
                                {video.category} • {new Intl.NumberFormat('en-IN').format(video.views || 0)} views
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-stone-400">
                        No videos found matching "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 animate-stagger-item opacity-0">
            <Link to="/appointment" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 magnetic">
                Book Consultation
              </button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-medium transition-all active:scale-95 magnetic">
                Explore Vastu
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

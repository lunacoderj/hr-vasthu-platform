import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, PlayCircle, BookOpen, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../../../shared/hooks/useGlobalSearch';
import { VastuAIOverview } from '../ai/VastuAIOverview';
import Typography from '../content/Typography';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { search, isReady } = useGlobalSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const results = query.trim() ? search(query) : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigate(results[selectedIndex].url);
        onClose();
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle size={18} className="text-gold-500" />;
      case 'book': return <BookOpen size={18} className="text-copper-500" />;
      case 'page': return <FileText size={18} className="text-stone-400" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-white dark:bg-[#0e0e14] rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[85vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-6 border-b border-stone-200 dark:border-stone-800 shrink-0 bg-stone-50/50 dark:bg-stone-900/40">
              <Search size={22} className="text-gold-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder={isReady ? "Ask Vastu AI or search videos, books, directions..." : "Loading search..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none py-5 px-4 text-base md:text-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 mr-2 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar bg-stone-50/30 dark:bg-stone-950/30">
              {/* Google-AI-Overview Style Response */}
              {query.trim().length > 2 && (
                <VastuAIOverview query={query} onCloseModal={onClose} />
              )}

              {query.trim() === '' ? (
                <div className="py-12 text-center text-stone-500 dark:text-stone-400 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gold-600 dark:text-gold-400 font-serif font-bold text-sm">
                    <Sparkles size={16} /> Instant AI Search & Knowledge Console
                  </div>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Type any query like "Kitchen Vastu", "Pooja Room", or "East Facing House" to get instant AI answers and matching video lessons.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                    <kbd className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[10px]">↑</kbd>
                    <kbd className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[10px]">↓</kbd>
                    <span>navigate</span>
                    <kbd className="ml-2 px-2 py-0.5 bg-stone-200 dark:bg-stone-800 rounded font-mono text-[10px]">Enter</kbd>
                    <span>select</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 block mb-2">
                    Matching Content ({results.length})
                  </span>
                  {results.map((result, idx) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        navigate(result.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                        selectedIndex === idx
                          ? 'bg-white dark:bg-stone-800 shadow-md border border-stone-200 dark:border-stone-700'
                          : 'hover:bg-white dark:hover:bg-stone-800/50 border border-transparent'
                      }`}
                    >
                      {result.image ? (
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800 relative">
                          <img src={result.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                          {getIcon(result.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {result.title}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold shrink-0">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {result.category ? `${result.category} • ` : ''}{result.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearchModal;

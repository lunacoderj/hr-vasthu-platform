import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, PlayCircle, BookOpen, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../../../shared/hooks/useGlobalSearch';
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
  
  // Close on Escape, handle navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Ctrl+K or Cmd+K handled elsewhere (in App/Navbar) to open it
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Focus input on open
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

  // Reset selection when query changes
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center px-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
              <Search size={24} className="text-stone-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={isReady ? "Search videos, books, and pages..." : "Loading search..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none py-6 px-4 text-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-0"
              />
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-2 custom-scrollbar bg-stone-50/50 dark:bg-stone-950/50">
              {query.trim() === '' ? (
                <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                  <Typography variant="body" className="mb-2">Search anything on HR Vasthu</Typography>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-800 rounded-md font-mono text-xs">↑</kbd>
                    <kbd className="px-2 py-1 bg-stone-200 dark:bg-stone-800 rounded-md font-mono text-xs">↓</kbd>
                    <span>to navigate</span>
                    <kbd className="ml-2 px-2 py-1 bg-stone-200 dark:bg-stone-800 rounded-md font-mono text-xs">Enter</kbd>
                    <span>to select</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-1 pb-4">
                  {results.map((result, idx) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        navigate(result.url);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedIndex === idx
                          ? 'bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700'
                          : 'hover:bg-white dark:hover:bg-stone-800/50 border border-transparent'
                      }`}
                    >
                      {result.image ? (
                        <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800 relative">
                          <img src={result.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                          {getIcon(result.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {result.title}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-medium shrink-0">
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
              ) : (
                <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

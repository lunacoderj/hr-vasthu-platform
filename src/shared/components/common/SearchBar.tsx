import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

export const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex items-center">
        {/* Desktop Search Button */}
        <button 
          onClick={() => setIsOpen(true)}
          className="hidden md:flex relative group items-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all rounded-full pl-3 pr-3 py-1.5 w-56 hover:w-64 duration-300 border border-transparent dark:border-stone-700/50"
        >
          <Search size={16} className="text-stone-400 group-hover:text-gold-500 transition-colors shrink-0" />
          <span className="ml-2 text-sm text-stone-500 dark:text-stone-400 font-medium">Search...</span>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <kbd className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-stone-500 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded shadow-sm">
              Ctrl K
            </kbd>
          </div>
        </button>

        {/* Mobile Search Icon */}
        <button
          className="md:hidden p-2 text-stone-600 dark:text-stone-300"
          onClick={() => setIsOpen(true)}
        >
          <Search size={20} />
        </button>
      </div>

      <GlobalSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Books from './Books';
import BlogList from '../Blog/BlogList';

export const BooksMobileContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'blog'>('books');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Top Bar Tabs */}
      <div className="flex-none flex justify-center items-center h-12 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="flex space-x-1 bg-stone-100 dark:bg-stone-800/50 p-1 rounded-full">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'books' ? 'bg-gold-600 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'blog' ? 'bg-gold-600 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Blog
          </button>
        </div>
      </div>

      {/* Swipeable Content */}
      <div className="flex-1 relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          {activeTab === 'books' && (
            <motion.div
              key="books"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-16"
            >
              <Books />
            </motion.div>
          )}
          
          {activeTab === 'blog' && (
            <motion.div
              key="blog"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-16"
            >
              <BlogList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BooksMobileContainer;

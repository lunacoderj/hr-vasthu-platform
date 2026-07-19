import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Videos from './Videos';
import Shorts from './Shorts';

export const VideosMobileContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts'>('videos');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-stone-950">
      {/* Top Bar Tabs */}
      <div className="flex-none flex justify-center items-center h-12 bg-stone-900 border-b border-stone-800">
        <div className="flex space-x-1 bg-stone-800/50 p-1 rounded-full">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'videos' ? 'bg-gold-600 text-white shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'shorts' ? 'bg-gold-600 text-white shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            Shorts
          </button>
        </div>
      </div>

      {/* Swipeable Content */}
      <div className="flex-1 relative w-full h-full">
        <AnimatePresence initial={false} mode="wait">
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-16"
            >
              <Videos />
            </motion.div>
          )}
          
          {activeTab === 'shorts' && (
            <motion.div
              key="shorts"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 overflow-hidden pb-16"
            >
              <Shorts />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideosMobileContainer;

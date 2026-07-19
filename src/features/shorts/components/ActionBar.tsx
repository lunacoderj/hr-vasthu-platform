import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Bookmark, PlayCircle } from 'lucide-react';
import type { Video } from '../../../core/types/video';
import { motion } from 'framer-motion';
import { tracker } from '../../../core/services/tracker';

interface ActionBarProps {
  short: Video;
  onShare: (short: Video) => void;
  onWatchFull: (short: Video) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ short, onShare, onWatchFull }) => {
  const handleWatchFull = () => {
    // Track the short play/redirect event
    tracker.trackEvent('short_play', '/shorts', null, null, {
      video_title: short.title,
      video_id: short.youtube_id || short.id,
    });
    onWatchFull(short);
  };

  return (
    <div className="absolute right-4 bottom-0 flex flex-col gap-5 z-40 items-center">
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors">
          <ThumbsUp size={24} className="text-white drop-shadow-md" fill="white" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-lg">{short.likes ? short.likes.toLocaleString() : '12k'}</span>
      </motion.button>
      
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors">
          <MessageCircle size={24} className="text-white drop-shadow-md" fill="white" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-lg">{short.comments ? short.comments.toLocaleString() : '842'}</span>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors">
          <Bookmark size={24} className="text-white drop-shadow-md" fill="white" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-lg">Save</span>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => onShare(short)} 
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors">
          <Share2 size={24} className="text-white drop-shadow-md" />
        </div>
        <span className="text-white text-xs font-semibold drop-shadow-lg">Share</span>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={handleWatchFull} 
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors shadow-lg shadow-white/10 border border-white/30">
          <PlayCircle size={26} className="text-white drop-shadow-md" fill="rgba(0,0,0,0.5)" />
        </div>
      </motion.button>
    </div>
  );
};


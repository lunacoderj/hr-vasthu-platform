import React from 'react';
import { ThumbsUp, MessageCircle, Share2, Bookmark, PlayCircle, Bot } from 'lucide-react';
import type { Video } from '../../../core/types/video';
import { motion } from 'framer-motion';

interface ActionBarProps {
  short: Video;
  onShare: (short: Video) => void;
  onWatchFull: (short: Video) => void;
  onAskAstrobot: (short: Video) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ short, onShare, onWatchFull, onAskAstrobot }) => {
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
        onClick={() => onWatchFull(short)} 
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-[48px] h-[48px] bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors shadow-lg shadow-white/10 border border-white/30">
          <PlayCircle size={26} className="text-white drop-shadow-md" fill="rgba(0,0,0,0.5)" />
        </div>
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => onAskAstrobot(short)} 
        className="flex flex-col items-center gap-1 group mt-2"
      >
        <div className="w-[48px] h-[48px] bg-gradient-to-tr from-amber-600 to-amber-400 backdrop-blur-lg rounded-full flex items-center justify-center transition-colors shadow-lg shadow-amber-500/30">
          <Bot size={24} className="text-white drop-shadow-md" />
        </div>
      </motion.button>
    </div>
  );
};

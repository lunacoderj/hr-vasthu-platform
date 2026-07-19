import React, { useState } from 'react';
import type { Video } from '../../../core/types/video';

interface BottomInfoPanelProps {
  short: Video;
  onWatchFull: (short: Video) => void;
}

export const BottomInfoPanel: React.FC<BottomInfoPanelProps> = ({ short }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute left-0 right-0 bottom-0 z-40 px-4 pb-safe pb-6 pointer-events-auto flex flex-col justify-end">
      <div className="pr-16 max-w-[85%]">
        
        {/* Channel Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 shadow-lg shrink-0">
            HR
          </div>
          <span className="text-white font-bold text-[15px] drop-shadow-lg tracking-wide whitespace-nowrap">HR Vasthu</span>
          <button className="ml-2 px-3 py-1 bg-white text-black font-bold text-xs rounded-full hover:bg-stone-200 transition-colors shadow-lg shadow-black/20 shrink-0">
            Subscribe
          </button>
        </div>

        {/* Description & Hashtags Toggle Area */}
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Title */}
          <h2 className={`text-white text-base md:text-lg font-bold mb-1 drop-shadow-lg leading-tight transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1'}`} style={{ overflowWrap: 'break-word' }}>
            {short.title}
          </h2>

          {/* Description & Hashtags (Only show if expanded) */}
          {isExpanded ? (
            <div 
              className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-h-[50vh] overflow-y-auto overscroll-contain p-4 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-500/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-amber-400 transition-all"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the scrollable area
            >
              <p className="text-white text-sm drop-shadow-md font-medium mb-3 leading-relaxed">
                {short.description}
              </p>
              
              <div className="flex gap-1.5 flex-wrap text-sm font-medium text-amber-400 font-semibold mt-4">
                 {short.hashtags?.length ? short.hashtags.map(tag => (
                   <span key={tag} className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shadow-sm">#{tag}</span>
                 )) : (
                   <>
                      <span className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shadow-sm">#vastutips</span>
                      <span className="bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shadow-sm">#hrvasthu</span>
                   </>
                 )}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="mt-5 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider block transition-colors w-full text-center py-2 bg-white/5 rounded-lg border border-white/5"
              >
                Show less
              </button>
            </div>
          ) : (
            <span className="text-white/70 text-xs font-semibold">...more</span>
          )}
        </div>
      </div>
    </div>
  );
};

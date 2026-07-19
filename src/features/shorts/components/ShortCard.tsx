import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { Video } from '../../../core/types/video';
import { ActionBar } from './ActionBar';
import { BottomInfoPanel } from './BottomInfoPanel';

interface ShortCardProps {
  short: Video;
  isActive: boolean;
  shouldMount: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onShare: (short: Video) => void;
  onWatchFull: (short: Video) => void;
  onAskAstrobot: (short: Video) => void;
}

export const ShortCard: React.FC<ShortCardProps> = ({
  short,
  isActive,
  shouldMount,
  isMuted,
  onToggleMute,
  onShare,
  onWatchFull,
  onAskAstrobot
}) => {
  const videoId = short.youtube_id || short.embed_url?.split('/embed/')[1] || '';
  const thumbnailUrl = short.thumbnail_medium || short.thumbnail_default || short.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayStateAnim, setShowPlayStateAnim] = useState<null | 'play' | 'pause'>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync isPlaying with active viewport state
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      const timer = setTimeout(() => {
        sendPlayerCommand(isMuted ? 'mute' : 'unMute');
        sendPlayerCommand('playVideo');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
      sendPlayerCommand('pauseVideo');
    }
  }, [isActive]);

  // Sync volume state from global setting
  useEffect(() => {
    if (isActive) {
      sendPlayerCommand(isMuted ? 'mute' : 'unMute');
    }
  }, [isMuted, isActive]);

  const sendPlayerCommand = (func: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args: '' }),
        '*'
      );
    }
  };

  const handleVideoTap = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if (e.cancelable) {
        e.preventDefault();
      }
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sendPlayerCommand(nextState ? 'playVideo' : 'pauseVideo');
    
    // Trigger overlay icon popup animation
    setShowPlayStateAnim(nextState ? 'play' : 'pause');
    setTimeout(() => setShowPlayStateAnim(null), 800);
  };

  return (
    <div className="relative w-full h-full md:h-[100dvh] overflow-hidden bg-black snap-start shrink-0 flex justify-center items-center">
      
      {/* 1. Global Background / Thumbnail Layer (Blurred on Desktop padding) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out blur-3xl scale-110"
        style={{ 
          backgroundImage: `url(${thumbnailUrl})`,
          opacity: isActive ? 0.3 : 1 
        }}
      />

      {/* Container for the actual short (Restricted width on desktop to simulate mobile) */}
      <div className="relative h-full md:h-[100dvh] aspect-[9/16] w-full sm:w-auto sm:max-w-none mx-auto bg-black shadow-2xl overflow-hidden">
        
        {/* 2. Video Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {shouldMount && (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? '1' : '0'}&mute=${isMuted ? '1' : '0'}&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${videoId}&enablejsapi=1`}
              className={`
                absolute
                inset-0
                w-full
                h-full
                transition-opacity duration-700
                ${isActive ? 'opacity-100' : 'opacity-0'}
              `}
              title={short.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>

        {/* 2.5 Clickable Play/Pause Overlay */}
        <div 
          onClick={handleVideoTap}
          onTouchEnd={handleVideoTap}
          className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center"
        >
          {/* Central scale/fade icon indicator */}
          <AnimatePresence>
            {showPlayStateAnim && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="bg-black/60 p-5 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
              >
                {showPlayStateAnim === 'play' ? (
                  <Play className="w-8 h-8 fill-current text-[#d4720a]" />
                ) : (
                  <Pause className="w-8 h-8 fill-current text-[#d4720a]" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2.6 Floating Volume Controller */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-4 right-4 z-40 w-10 h-10 bg-black/50 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all hover:bg-black/70"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-stone-400" />
          ) : (
            <Volume2 size={18} className="text-[#d4720a] animate-pulse" />
          )}
        </motion.button>

        {/* 3. Gradient Layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 z-20 pointer-events-none" 
        />

        {/* 4. UI Overlays Layer (z-40) */}
        <ActionBar 
          short={short} 
          onShare={onShare} 
          onWatchFull={onWatchFull} 
          onAskAstrobot={onAskAstrobot} 
        />
        
        <BottomInfoPanel 
          short={short} 
          onWatchFull={onWatchFull} 
        />
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

const MARQUEE_TEXT = [
  "✦ 100% Authentic Vastu Shastra",
  "✦ Trusted by Thousands of Families",
  "✦ Bring Harmony to Your Space",
  "✦ Expert Consultations by Dr. Kunchala Hanumantha Rao",
  "✦ Unlock Prosperity, Health, and Peace"
].join(" \u00A0\u00A0\u00A0 ");

export const StickyMarquee: React.FC = () => {
  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-t border-gold-600/30 overflow-hidden shadow-[0_-5px_20px_rgba(212,114,10,0.15)] pointer-events-none">
      <div className="flex whitespace-nowrap overflow-hidden items-center py-2 relative">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-transparent to-stone-900 z-10 w-full" />
        
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
          className="flex whitespace-nowrap"
        >
          <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase drop-shadow-[0_0_8px_rgba(212,114,10,0.6)]">
            {MARQUEE_TEXT}
          </span>
          <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase drop-shadow-[0_0_8px_rgba(212,114,10,0.6)] ml-[100px]">
            {MARQUEE_TEXT}
          </span>
          <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase drop-shadow-[0_0_8px_rgba(212,114,10,0.6)] ml-[100px]">
            {MARQUEE_TEXT}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

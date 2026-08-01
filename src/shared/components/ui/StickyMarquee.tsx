import React from 'react';
import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  "✦ 100% Authentic Vastu Shastra",
  "✦ మీ ఇంటి ప్లాన్స్ & డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును",
  "✦ Trusted by Thousands of Families",
  "✦ Bring Harmony to Your Space",
  "✦ Expert Consultations by Dr. Kunchala Hanumantha Rao",
  "✦ Unlock Prosperity, Health, and Peace"
];

const renderMarqueeContent = () => (
  <div className="flex items-center space-x-8 mr-8">
    {MARQUEE_ITEMS.map((item, idx) => (
      <span
        key={idx}
        className={`text-sm font-semibold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(212,114,10,0.6)] ${
          item.includes("మీ ఇంటి ప్లాన్స్") 
            ? "text-white bg-gradient-to-r from-gold-500 to-copper-500 px-3 py-0.5 rounded-full shadow-[0_0_15px_rgba(212,114,10,0.4)]" 
            : "text-gold-400"
        }`}
      >
        {item}
      </span>
    ))}
  </div>
);

export const StickyMarquee: React.FC = () => {
  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border-t border-gold-600/30 overflow-hidden shadow-[0_-5px_20px_rgba(212,114,10,0.15)] pointer-events-none">
      <div className="flex whitespace-nowrap overflow-hidden items-center py-2 relative">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-transparent to-stone-900 z-10 w-full" />
        
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
          className="flex whitespace-nowrap"
        >
          {renderMarqueeContent()}
          {renderMarqueeContent()}
          {renderMarqueeContent()}
          {renderMarqueeContent()}
        </motion.div>
      </div>
    </div>
  );
};

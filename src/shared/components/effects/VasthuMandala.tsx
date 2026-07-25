import React from 'react';
import { motion } from 'framer-motion';

export const VasthuMandala: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute pointer-events-none overflow-hidden ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="relative w-full h-full flex items-center justify-center opacity-20 dark:opacity-30 mix-blend-overlay dark:mix-blend-screen"
      >
        {/* Sacred Geometry SVG Representation */}
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[800px] h-[800px] text-gold-600 drop-shadow-[0_0_15px_rgba(212,114,10,0.5)]"
        >
          {/* Outer circle */}
          <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
          <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="1" />
          
          {/* Lotus petals (simplified geometric version) */}
          <path d="M200 30 Q 250 100 200 170 Q 150 100 200 30 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M200 370 Q 150 300 200 230 Q 250 300 200 370 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M30 200 Q 100 150 170 200 Q 100 250 30 200 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M370 200 Q 300 250 230 200 Q 300 150 370 200 Z" stroke="currentColor" strokeWidth="1" />
          
          <path d="M80 80 Q 150 100 170 170 Q 100 150 80 80 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M320 320 Q 250 300 230 230 Q 300 250 320 320 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M320 80 Q 300 150 230 170 Q 250 100 320 80 Z" stroke="currentColor" strokeWidth="1" />
          <path d="M80 320 Q 100 250 170 230 Q 150 300 80 320 Z" stroke="currentColor" strokeWidth="1" />
          
          {/* Inner squares (Vastu Purusha Mandala base) */}
          <rect x="100" y="100" width="200" height="200" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 200 200)" />
          <rect x="100" y="100" width="200" height="200" stroke="currentColor" strokeWidth="1" />
          
          {/* Central bindu / energy center */}
          <circle cx="200" cy="200" r="10" fill="currentColor" />
          <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="1" />
          
          {/* Intersecting lines */}
          <line x1="200" y1="30" x2="200" y2="370" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="200" x2="370" y2="200" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

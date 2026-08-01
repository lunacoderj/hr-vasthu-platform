import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CTA_OPTIONS = [
  'Consultation',
  'Residential Vastu',
  'Commercial Vastu',
  'House Plans & Drawings',
  'Plot Selection',
];

interface AnimatedBookingCTAProps {
  onClick?: () => void;
  className?: string;
}

export const AnimatedBookingCTA: React.FC<AnimatedBookingCTAProps> = ({ onClick, className = '' }) => {
  const [ctaIndex, setCtaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCtaIndex((prev) => (prev + 1) % CTA_OPTIONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <button 
      onClick={onClick}
      className={`w-full sm:w-[290px] h-[52px] bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,114,10,0.4)] hover:opacity-90 active:scale-95 magnetic overflow-hidden relative group flex items-center justify-center ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5 w-full px-6">
        <span>Book</span>
        <div className="relative h-6 flex-1 overflow-hidden text-left flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={ctaIndex}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute inset-0 font-bold whitespace-nowrap flex items-center ${
                CTA_OPTIONS[ctaIndex] === 'House Plans & Drawings' ? 'text-yellow-200 drop-shadow-md' : 'text-white'
              }`}
            >
              {CTA_OPTIONS[ctaIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </span>
      {/* Sweeping shine effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine left-[-125%]" />
    </button>
  );
};

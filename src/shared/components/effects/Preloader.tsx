import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader: React.FC = () => {
  const [show, setShow] = useState(() => {
    // Only show preloader once per session to maximize speed and UX
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('hr_vasthu_visited');
      return !seen;
    }
    return false;
  });

  useEffect(() => {
    if (!show) return;
    
    // Fast, lightweight 450ms intro
    const timer = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('hr_vasthu_visited', 'true');
      } catch {
        /* storage full / private mode fallback */
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="fast-preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-14 h-14 rounded-full border-2 border-t-[#d4720a] border-r-transparent border-b-[#d4720a]/30 border-l-transparent animate-spin" />
          <h2 className="font-serif text-xl font-bold bg-gradient-to-r from-white via-gold-200 to-[#d4720a] bg-clip-text text-transparent tracking-widest uppercase">
            HR Vasthu
          </h2>
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-mono">
            Vedic Architecture
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;

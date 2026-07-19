import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, translateY: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-52 md:bottom-40 right-6 md:right-8 z-50 p-3 rounded-full bg-white/95 dark:bg-[#0a0a0f]/90 border border-stone-200 dark:border-[#d4720a]/30 text-[#d4720a] shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(212,114,10,0.2)] hover:border-[#d4720a] hover:text-[#d4720a] dark:hover:text-white backdrop-blur-md transition-colors cursor-pointer focus:outline-none"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

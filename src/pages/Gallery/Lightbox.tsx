import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { type GalleryItem } from './galleryData';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ items, currentIndex, onClose, onNavigate }) => {
  const item = items[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, items.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Viewing: ${item.title}`}
      >
        {/* Ambient Glow */}
        <div className="lightbox-glow" style={{ top: '20%', left: '30%' }} />
        <div className="lightbox-glow" style={{ bottom: '10%', right: '20%', opacity: 0.5 }} />

        {/* Close Button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X size={20} />
        </button>

        {/* Image */}
        <motion.div
          className="lightbox-image-container"
          initial={{ scale: 0.85, opacity: 0, rotateY: -5 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Title overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-serif text-xl font-bold">{item.title}</h3>
            <p className="text-white/60 text-sm mt-1">{item.description}</p>
          </motion.div>

          {/* Navigation */}
          {currentIndex > 0 && (
            <button
              className="lightbox-nav prev"
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {currentIndex < items.length - 1 && (
            <button
              className="lightbox-nav next"
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest uppercase z-10">
          {currentIndex + 1} / {items.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import React from 'react';
import { SHORTS_CATEGORIES, type ShortsCategory } from '../constants';
import { motion } from 'framer-motion';

interface CategoryBarProps {
  activeCategory: ShortsCategory;
  onSelectCategory: (category: ShortsCategory) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="absolute top-[70px] left-[12px] right-0 z-50 flex overflow-x-auto no-scrollbar pointer-events-auto pb-2">
      <div className="flex gap-2">
        {SHORTS_CATEGORIES.map((category) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 backdrop-blur-xl border shadow-lg ${
              activeCategory === category 
                ? 'bg-white text-black border-white shadow-black/20' 
                : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

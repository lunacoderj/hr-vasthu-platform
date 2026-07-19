import React from 'react';
import { Search } from 'lucide-react';
import { LANGUAGES } from '../../../core/store/language.store';

interface VideoFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const VideoFilters: React.FC<VideoFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedLanguage,
  onLanguageChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 transition-colors">
      
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-shadow"
        />
      </div>

      <div className="flex space-x-4">
        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 md:w-48 px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Language Dropdown */}
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="flex-1 md:w-40 px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
        >
          <option value="all">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      
    </div>
  );
};

export default VideoFilters;

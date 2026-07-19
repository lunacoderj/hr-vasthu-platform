import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Play, LayoutGrid, BookOpen, MessageCircle } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Videos', path: '/videos', icon: Play, matchPrefix: ['/videos', '/shorts'] },
  { name: 'Gallery', path: '/gallery', icon: LayoutGrid },
  { name: 'Books', path: '/books', icon: BookOpen, matchPrefix: ['/books', '/blog'] },
  { name: 'Contact', path: '/contact', icon: MessageCircle },
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.matchPrefix) {
      return item.matchPrefix.some(prefix => location.pathname.startsWith(prefix));
    }
    return location.pathname === item.path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/85 dark:bg-[#0a0a0f]/85 backdrop-blur-2xl border-t border-stone-200/50 dark:border-[#d4720a]/15 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="flex justify-around items-center h-16 px-1 relative">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full relative z-10 transition-colors duration-300 ${
                active 
                  ? 'text-[#d4720a]' 
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={active ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                className="flex flex-col items-center justify-center space-y-0.5"
              >
                <Icon 
                  size={20} 
                  strokeWidth={active ? 2.5 : 2} 
                  fill={active ? 'currentColor' : 'none'}
                  className="transition-all duration-300"
                />
                <span className={`text-[10px] tracking-wide transition-all duration-300 ${
                  active ? 'font-bold text-[#d4720a]' : 'font-medium'
                }`}>
                  {item.name}
                </span>
              </motion.div>

              {active && (
                <motion.span 
                  layoutId="mobileActiveIndicator"
                  className="absolute bottom-1 w-1.5 h-1.5 bg-gradient-to-r from-[#d4720a] to-[#e68a1c] rounded-full shadow-[0_0_8px_#d4720a]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

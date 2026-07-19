import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';


interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ name: string; path: string }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-[#111118]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-50 lg:hidden overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <span className="font-serif font-semibold text-lg text-[#d4720a]">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 py-4 px-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-[#d4720a]/10 text-[#d4720a] border-l-2 border-[#d4720a]'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>


          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

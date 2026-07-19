import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../../core/store/auth.store';
import { authService } from '../../../core/services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const UserMenu: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsOpen(false);
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`
    : user?.email?.split('@')[0] || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 hover:ring-2 hover:ring-gold-500 transition-all"
      >
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-md shadow-lg border border-stone-200 dark:border-stone-800 py-1 z-50"
          >
            <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
              <p className="text-sm font-medium text-stone-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                {user?.email}
              </p>
              {user?.role && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400 text-xs rounded-full">
                  {user.role}
                </span>
              )}
            </div>

            <div className="py-1">
              {(user?.role === 'Super Admin' || user?.role === 'Editor') && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  Admin Dashboard
                </Link>
              )}
              
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-copper-600 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;

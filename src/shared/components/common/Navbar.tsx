import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, MessageCircle, PenTool } from 'lucide-react';
import { Container } from '../layout/Container';
import { useAuthStore } from '../../../core/store/auth.store';
import { useTranslation } from '../../../core/hooks/useTranslation';

// Subcomponents
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const NAV_LINKS = [
  { key: 'home', name: 'Home', path: '/' },
  { key: 'about', name: 'About', path: '/about' },
  { key: 'gallery', name: 'Gallery', path: '/gallery' },
  { key: 'blog', name: 'Blog', path: '/blog' },
  { key: 'videos', name: 'Videos', path: '/videos' },
  { key: 'shorts', name: 'Shorts', path: '/shorts' },
  { key: 'books', name: 'Books', path: '/books' },
  { key: 'contact', name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-stone-200/50 dark:border-white/5 transition-all duration-300">
        {/* Architect & Siddanthi Bar */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 py-1.5 w-full hidden sm:block border-b border-[#d4720a]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-2 text-gold-400">
            <PenTool size={12} className="opacity-80 text-[#d4720a]" />
            <span className="text-[11px] md:text-xs font-semibold tracking-wider text-center drop-shadow-[0_0_8px_rgba(212,114,10,0.6)] text-stone-200">
              <strong className="text-gold-400 font-bold">Connect with Vasthu Siddanthi Dr. Hanumanthu Rao</strong> • మీ ఇంటి ప్లాన్స్ &amp; డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును • <a href="tel:+919246624248" className="hover:text-gold-400 underline text-stone-300 ml-1">+91 92466 24248</a>
            </span>
            <PenTool size={12} className="opacity-80 text-[#d4720a]" />
          </div>
        </div>
        <Container size="xl">
          {/* Desktop/Tablet Header Layout */}
          <div className="hidden md:flex h-16 items-center justify-between">
            {/* Left: Logo & Desktop Links */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex flex-col">
                <span className="font-serif text-xl font-bold text-stone-900 dark:text-white tracking-tight leading-none">
                  HR <span className="text-[#d4720a] bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4720a] font-semibold">Vasthu Siddanthi</span>
              </Link>

              <nav className="hidden lg:flex items-center space-x-1">
                {NAV_LINKS.map((link) => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group magnetic ${active
                        ? 'text-[#d4720a]'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                        }`}
                    >
                      {t(link.key)}
                      {/* Premium animated bottom bar */}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#d4720a] to-[#e68a1c] transition-transform duration-300 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <SearchBar />

              <div className="hidden sm:flex items-center space-x-2 border-r border-stone-200/50 dark:border-white/5 pr-2 sm:pr-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {!isLoading && isAuthenticated && (
                <div className="hidden sm:flex items-center space-x-3 pl-2">
                  <UserMenu />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header Layout */}
          <div className="flex md:hidden h-16 items-center justify-between">
            {/* Left: Logo in Serif Gradient */}
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-white leading-none">
                HR <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#d4720a] font-semibold">Vasthu Siddanthi</span>
            </Link>

            {/* Right: Theme Toggle, Camera/Shorts, Search, Message Shortcuts */}
            <div className="flex items-center space-x-1">
              {/* Dynamic Theme Switcher */}
              <ThemeToggle />

              {/* Camera/Shorts Shortcut */}
              <Link
                to="/shorts"
                className="p-2 text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white active:scale-95 transition-transform"
                title="Shorts"
              >
                <Camera size={20} />
              </Link>

              {/* Search Toggle Icon Button */}
              <SearchBar />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Navbar;

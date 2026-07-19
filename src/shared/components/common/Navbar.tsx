import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, MessageCircle, Phone } from 'lucide-react';
import { Container } from '../layout/Container';
import { useAuthStore } from '../../../core/store/auth.store';

// Subcomponents
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Videos', path: '/videos' },
  { name: 'Shorts', path: '/shorts' },
  { name: 'Books', path: '/books' },
  { name: 'Blog', path: '/blog' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-stone-200/50 dark:border-white/5 transition-all duration-300">
        <Container size="xl">
          {/* Desktop/Tablet Header Layout */}
          <div className="hidden md:flex h-16 items-center justify-between">
            {/* Left: Logo & Desktop Links */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                  HR <span className="text-[#d4720a] bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
                </span>
              </Link>
              
              <nav className="hidden lg:flex items-center space-x-1">
                {NAV_LINKS.map((link) => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group magnetic ${
                        active
                          ? 'text-[#d4720a]'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {link.name}
                      {/* Premium animated bottom bar */}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#d4720a] to-[#e68a1c] transition-transform duration-300 origin-left ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
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

              {/* Call Now Desktop CTA */}
              <a 
                href="tel:+919246624248"
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_4px_15px_rgba(212,114,10,0.3)] active:scale-95 magnetic shrink-0"
              >
                <Phone size={14} className="stroke-[2.5]" />
                <span>Call Now</span>
              </a>

              {!isLoading && isAuthenticated && (
                <div className="hidden sm:flex items-center space-x-3 pl-2">
                  <UserMenu />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header Layout (Instagram/WhatsApp Hybrid) */}
          <div className="flex md:hidden h-16 items-center justify-between">
            {/* Left: Logo in Serif Gradient */}
            <Link to="/" className="flex items-center">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                HR <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
              </span>
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

              {/* Direct Message (Contact) with pulsating gold badge */}
              <Link 
                to="/contact" 
                className="p-2 text-stone-500 dark:text-[#d4720a] active:scale-95 transition-transform relative"
                title="Consultation Chat"
              >
                <MessageCircle size={20} />
                <span className="absolute top-2.5 right-2.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4720a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d4720a]"></span>
                </span>
              </Link>

              {/* Call Now Mobile Shortcut */}
              <a 
                href="tel:+919246624248" 
                className="p-2 text-stone-500 dark:text-[#d4720a] active:scale-95 transition-transform"
                title="Call Now"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Navbar;

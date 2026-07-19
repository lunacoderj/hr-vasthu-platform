import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav, ScrollToTop } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';
import { MessageSquare, Phone } from 'lucide-react';

export const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative bg-stone-50 dark:bg-[#0a0a0f] text-stone-900 dark:text-stone-100 overflow-x-hidden transition-colors duration-300">
      {!isMobile && <CosmicParticles />}
      {!isMobile && <MagneticCursor />}
      <Navbar />
      <main className="flex-1 flex flex-col relative z-10 pt-16">
        <Outlet />
      </main>
      <div className="hidden md:block relative z-10">
        <Footer />
      </div>
      <MobileBottomNav />
      <ScrollToTop />

      {/* Floating Action Buttons (FAB) Stack */}
      {/* 1. Book Consultation (Bottom) */}
      <div className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-40 group">
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-stone-900/90 dark:bg-white/90 text-white dark:text-stone-900 text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          Book Consultation
        </div>
        <Link 
          to="/contact" 
          className="w-14 h-14 rounded-full flex items-center justify-center glass-fab hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(212,114,10,0.2)] dark:shadow-black/50"
          aria-label="Quick Consultation"
        >
          {/* Inner Glow Circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d4720a] to-[#e68a1c] flex items-center justify-center text-white shadow-lg shadow-[#d4720a]/20">
            <MessageSquare size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>
      </div>

      {/* 2. Call Now (Middle) */}
      <div className="fixed bottom-36 md:bottom-24 right-6 md:right-8 z-40 group">
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-stone-900/90 dark:bg-white/90 text-white dark:text-stone-900 text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          Call Now
        </div>
        <a 
          href="tel:+919246624248" 
          className="w-14 h-14 rounded-full flex items-center justify-center glass-fab hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(16,185,129,0.2)] dark:shadow-black/50"
          aria-label="Call Master Immediately"
        >
          {/* Inner Glow Circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Phone size={18} className="group-hover:scale-110 transition-transform duration-300" />
          </div>
        </a>
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav, ScrollToTop } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';

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
    </div>
  );
};

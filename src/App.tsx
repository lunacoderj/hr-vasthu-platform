import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './shared/components/ui';
import { MainLayout } from './shared/components/common';
import { useAuthStore } from './core/store/auth.store';
import { supabase } from './core/services/supabase';
import { tracker } from './core/services/tracker';

import Books from './pages/Books/Books';
import BookReader from './pages/Books/BookReader';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Sandbox from './pages/Sandbox';
import Videos from './pages/Videos/Videos';
import VideoDetail from './pages/Videos/VideoDetail';
import Shorts from './pages/Videos/Shorts';
import BlogList from './pages/Blog/BlogList';
import BlogPost from './pages/Blog/BlogPost';

import { lazy, Suspense } from 'react';
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));

import BooksMobileContainer from './pages/Books/BooksMobileContainer';
import VideosMobileContainer from './pages/Videos/VideosMobileContainer';

// Simple responsive wrapper for mobile/desktop split
const ResponsiveVideos = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile ? <VideosMobileContainer /> : <Videos />;
};

const ResponsiveBooks = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile ? <BooksMobileContainer /> : <Books />;
};

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    tracker.trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    tracker.initTracker();
  }, []);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser((session?.user as any) || null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as any) || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <RouteTracker />
        <ToastProvider />
        
        <Routes>
          {/* Main Website Layout (Navbar + Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/videos" element={<ResponsiveVideos />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/books" element={<ResponsiveBooks />} />
            <Route path="/books/:id" element={<BookReader />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/gallery" element={<Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}><Gallery /></Suspense>} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Route>

          {/* Full-Screen Native Mobile Experiences (No Navbar/Footer) */}
          <Route path="/shorts" element={<Shorts />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './shared/components/ui';
import { MainLayout } from './shared/components/common';
import { ScrollToTop } from './shared/components/common/ScrollToTop';
import { useAuthStore } from './core/store/auth.store';
import { supabase } from './core/services/supabase';
import { tracker } from './core/services/tracker';
import { Preloader } from './shared/components/effects/Preloader';

// Eager load core navigation pages for instant FCP
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

// Code-split heavy content pages
const Books = lazy(() => import('./pages/Books/Books'));
const BookReader = lazy(() => import('./pages/Books/BookReader'));
const Videos = lazy(() => import('./pages/Videos/Videos'));
const VideoDetail = lazy(() => import('./pages/Videos/VideoDetail'));
const Shorts = lazy(() => import('./pages/Videos/Shorts'));
const BlogList = lazy(() => import('./pages/Blog/BlogList'));
const BlogPost = lazy(() => import('./pages/Blog/BlogPost'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const BooksMobileContainer = lazy(() => import('./pages/Books/BooksMobileContainer'));
const VideosMobileContainer = lazy(() => import('./pages/Videos/VideosMobileContainer'));

// Legal & Policy Pages for AdSense Compliance
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService'));
const VastuDisclaimer = lazy(() => import('./pages/Legal/VastuDisclaimer'));
const Appointment = lazy(() => import('./pages/Legal/Appointment'));

const PageFallback = () => (
  <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-t-gold-500 border-r-transparent border-b-gold-500/20 border-l-transparent animate-spin" />
  </div>
);

const ResponsiveVideos = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile ? <VideosMobileContainer /> : <Videos />;
};

const ResponsiveBooks = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser((session?.user as any) || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as any) || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <HelmetProvider>
      <Preloader />
      <BrowserRouter>
        <ScrollToTop />
        <RouteTracker />
        <ToastProvider />
        
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Main Website Layout (Navbar + Footer) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/videos" element={<ResponsiveVideos />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/books" element={<ResponsiveBooks />} />
              <Route path="/books/:id" element={<BookReader />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/gallery" element={<Gallery />} />
              
              {/* AdSense Mandatory Compliance & Booking Routes */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/disclaimer" element={<VastuDisclaimer />} />
              <Route path="/appointment" element={<Appointment />} />
            </Route>

            {/* Full-Screen Native Mobile Experiences */}
            <Route path="/shorts" element={<Shorts />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

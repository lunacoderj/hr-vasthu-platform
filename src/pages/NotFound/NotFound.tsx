import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Home, Search, BookOpen, Video, FileText, PhoneCall, ArrowRight } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pt-28 pb-20 flex flex-col justify-center">
      <Helmet>
        <title>404 — Page Not Found | HR Vasthu</title>
        <meta name="description" content="The page you are looking for does not exist or has been moved. Explore Vedic Vastu videos, articles, house plans, and consultation services by Dr. Kunchala Hanumantha Rao." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {/* Compass Graphic */}
          <div className="inline-flex p-5 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-6 shadow-sm">
            <Compass size={48} className="animate-spin-slow" />
          </div>

          <p className="text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase mb-2">
            Direction Lost • 404 Error
          </p>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 tracking-tight">
            Page Not Found in the Mandala
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            The link you followed may be broken or the page has moved. Let us guide you back to harmony and authentic Vedic Vastu knowledge.
          </p>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
            <Link
              to="/videos"
              className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                  <Video size={18} />
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">Video Lessons</h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">491+ authentic video guides</p>
            </Link>

            <Link
              to="/blog"
              className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">Vastu Articles</h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">491+ research guides &amp; tips</p>
            </Link>

            <Link
              to="/drawings"
              className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                  <BookOpen size={18} />
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">House Plans</h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">38+ 100% compliant CAD plans</p>
            </Link>

            <Link
              to="/appointment"
              className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <PhoneCall size={18} />
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">Consultation</h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Direct booking with Siddanthi</p>
            </Link>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-full font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              <Home size={16} />
              <span>Return to Homepage</span>
            </Link>

            <Link
              to="/appointment"
              className="px-7 py-3.5 bg-stone-900 text-white dark:bg-white/10 border border-stone-700 hover:border-amber-500 rounded-full font-bold text-sm transition-all flex items-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;

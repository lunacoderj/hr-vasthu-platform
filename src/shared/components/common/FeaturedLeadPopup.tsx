import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  X, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Layers, 
  Flame,
  PhoneCall,
  Compass,
  CheckCircle2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../../core/services/supabase';
import { getVideoSlug } from '../../../core/services/video.service';

interface PopupItem {
  id: string;
  type: 'blog' | 'video';
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  keywords: string[];
  youtube_id?: string;
}

const DEFAULT_POPUP_INTERVAL_MS = 120 * 1000; // 2 minutes

export const FeaturedLeadPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PopupItem | null>(null);
  const [featuredPool, setFeaturedPool] = useState<PopupItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch Featured Blogs & Featured Videos from Supabase
  const loadFeaturedContent = useCallback(async () => {
    try {
      const items: PopupItem[] = [];

      // 1. Fetch Blogs
      const { data: blogData } = await supabase
        .from('blogs')
        .select('id, title, slug, content, cover_image, keywords')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(100);

      const savedFeatured = localStorage.getItem('hr_featured_blogs');
      const featuredSet = new Set<string>();
      if (savedFeatured) {
        try {
          JSON.parse(savedFeatured).forEach((id: string) => featuredSet.add(id));
        } catch {}
      }

      if (blogData && blogData.length > 0) {
        const featuredBlogs = blogData.filter(b => 
          featuredSet.has(b.id) || (b.keywords && (b.keywords.includes('featured') || b.keywords.includes('FEATURED')))
        );

        const activeBlogs = featuredBlogs.length > 0 ? featuredBlogs : blogData.slice(0, 15);

        activeBlogs.forEach((b) => {
          let excerpt = 'Authentic Vastu Shastra architectural analysis and scientific remedies by Dr. Kunchala Hanumantha Rao.';
          let ytId: string | undefined;
          try {
            const parsed = JSON.parse(b.content);
            if (parsed.excerpt) excerpt = parsed.excerpt;
            if (parsed.youtube_id) ytId = parsed.youtube_id;
          } catch {}

          const kw = (b.keywords || '')
            .split(',')
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 2 && !k.includes('dr hanumanthu') && !k.includes('featured'))
            .slice(0, 4);

          items.push({
            id: b.id,
            type: 'blog',
            title: b.title,
            slug: b.slug || `blog/${b.id}`,
            thumbnail: b.cover_image || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'),
            excerpt: excerpt.slice(0, 220) + (excerpt.length > 220 ? '...' : ''),
            keywords: kw.length > 0 ? kw : ['Vastu Blueprint', 'Floor Plans', 'Non-Demolition Remedy'],
            youtube_id: ytId
          });
        });
      }

      // 2. Fetch Featured Videos
      const { data: videoData } = await supabase
        .from('videos')
        .select('id, title, youtube_id, description, thumbnail_high, thumbnail_max, thumbnail_medium, is_featured')
        .order('views', { ascending: false })
        .limit(30);

      if (videoData && videoData.length > 0) {
        const featuredVids = videoData.filter(v => v.is_featured);
        const activeVids = featuredVids.length > 0 ? featuredVids : videoData.slice(0, 10);

        activeVids.forEach((v) => {
          const videoSlug = getVideoSlug(v as any) || v.id;
          items.push({
            id: v.id,
            type: 'video',
            title: v.title,
            slug: `video/${videoSlug}`,
            thumbnail: v.thumbnail_max || v.thumbnail_high || v.thumbnail_medium || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`,
            excerpt: (v.description || 'Dr. Kunchala Hanumantha Rao explains foundational Vedic spatial principles and house planning rules in this masterclass lecture.').slice(0, 220) + '...',
            keywords: ['Video Masterclass', 'Telugu Vastu Lecture', 'House Planning'],
            youtube_id: v.youtube_id
          });
        });
      }

      setFeaturedPool(items);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error loading featured popup pool:', err);
    }
  }, []);

  useEffect(() => {
    loadFeaturedContent();
  }, [loadFeaturedContent]);

  const triggerRandomPopup = useCallback(() => {
    if (featuredPool.length === 0) return;
    const randomPick = featuredPool[Math.floor(Math.random() * featuredPool.length)];
    setCurrentItem(randomPick);
    setIsOpen(true);
  }, [featuredPool]);

  // Trigger initial appearance after 45s, then every 2 minutes
  useEffect(() => {
    if (!hasLoaded || featuredPool.length === 0) return;

    const initialTimer = setTimeout(() => {
      triggerRandomPopup();
    }, 45000);

    const intervalTimer = setInterval(() => {
      triggerRandomPopup();
    }, DEFAULT_POPUP_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [hasLoaded, featuredPool, triggerRandomPopup]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!currentItem) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Dr. Rao, I saw the featured ${currentItem.type === 'video' ? 'video' : 'guide'} "${currentItem.title}" on hrvasthu.com and would like expert consultation on my property.`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm">
          
          {/* Backdrop click dismiss */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Smart Responsive Modal: Exactly 80% Screen Width & 90% Screen Height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-[94vw] sm:w-[90vw] md:w-[84vw] lg:w-[80vw] h-[90vh] max-w-[1600px] bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col font-['DM_Sans',sans-serif] text-[#112625]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Gradient Status Banner with Prominent Close (X) */}
            <div className="bg-gradient-to-r from-[#ff5436] via-[#f59e0b] to-[#0d9488] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between text-white shadow-xs shrink-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Sparkles size={16} className="text-yellow-200 animate-pulse" />
                <span>
                  {currentItem.type === 'video' ? '✦ FEATURED VIDEO MASTERCLASS' : '✦ FEATURED 5,000-WORD VASTU BLUEPRINT'}
                </span>
                <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Empirical Vedic Science
                </span>
              </div>
              
              {/* Always-Visible Big Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer shadow-md hover:scale-105"
                title="Close Modal (Esc)"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Main Smart 2-Column Split Canvas */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden">
              
              {/* ======================================================== */}
              {/* LEFT COLUMN: 5/12 Width (Visuals, Compass, Insights)      */}
              {/* ======================================================== */}
              <div className="lg:col-span-5 bg-stone-900 p-4 sm:p-6 flex flex-col justify-between text-white relative overflow-hidden">
                
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Media Thumbnail Container */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[55%] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg group shrink-0">
                  <img
                    src={currentItem.thumbnail}
                    alt={currentItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {currentItem.type === 'video' && (
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                        <Play size={24} className="fill-white translate-x-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                    {currentItem.type === 'video' ? <Play size={11} className="fill-amber-300" /> : <Layers size={11} />}
                    <span>{currentItem.type === 'video' ? 'Video Lecture' : 'Sthapatya Blueprint'}</span>
                  </div>
                </div>

                {/* Bottom Vastu Compass Info Box */}
                <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass size={14} className="text-[#ff5436]" /> 81-Pada Energy Matrix
                    </span>
                    <span className="text-[10px] text-gray-300">Non-Demolition Remedy</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-gray-300">NE (ఈశాన్యం): Water</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="text-gray-300">SE (ఆగ్నేయం): Fire</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-gray-300">SW (నైరుతి): Earth</span>
                    </div>
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-gray-300">NW (వాయువ్యం): Air</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ======================================================== */}
              {/* RIGHT COLUMN: 7/12 Width (Content, Lead Conversion CTAs) */}
              {/* ======================================================== */}
              <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
                
                {/* Title & Excerpt Block */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-[#ff5436] rounded-full text-xs font-bold uppercase tracking-wider">
                      ✦ Recommended Topic
                    </span>
                    <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
                      Dr. Kunchala Hanumantha Rao
                    </span>
                  </div>

                  <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl lg:text-3xl font-bold text-[#112625] leading-tight">
                    {currentItem.title}
                  </h2>

                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    {currentItem.excerpt}
                  </p>

                  {/* Topic Keywords */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentItem.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-full"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High-Converting Lead Generation Box */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/60 to-emerald-50/40 border-2 border-amber-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#ff5436]/10 flex items-center justify-center text-[#ff5436]">
                        <Flame size={18} />
                      </div>
                      <div>
                        <h4 className="font-['Playfair_Display'] font-bold text-base sm:text-lg text-[#112625]">
                          Get Expert Vastu Verification For Your Property
                        </h4>
                        <p className="text-xs text-slate-600">
                          Dr. Rao provides empirical blueprint audits and non-demolition scientific remedies.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary 1-Tap Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      href="tel:+919246624248"
                      className="py-3.5 px-4 bg-gradient-to-r from-[#ff5436] to-[#f59e0b] hover:from-[#e04529] hover:to-[#d98906] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-102 uppercase tracking-wide cursor-pointer"
                    >
                      <Phone size={16} />
                      <span>Call Vasthu Siddanthi</span>
                    </a>

                    <a
                      href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-102 uppercase tracking-wide cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Footer Navigation & Hotline Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-200 text-xs">
                  <Link
                    to={currentItem.type === 'video' ? `/${currentItem.slug}` : `/blog/${currentItem.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="font-bold text-[#ff5436] hover:underline inline-flex items-center gap-1.5 text-sm"
                  >
                    <span>{currentItem.type === 'video' ? 'Watch Full Video Lecture' : 'Read Complete 5,000-Word Guide'}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href="tel:+919246624248"
                    className="text-stone-700 font-bold hover:text-[#ff5436] flex items-center gap-1.5"
                  >
                    <PhoneCall size={14} className="text-[#ff5436]" />
                    <span>Direct Hotline: +91 92466 24248</span>
                  </a>
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeaturedLeadPopup;

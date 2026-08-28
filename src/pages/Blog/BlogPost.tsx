import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../../core/services/supabase';
import { getVideoSlug } from '../../core/services/video.service';
import { Spinner } from '../../shared/components/ui';
import { JsonLd } from '../../shared/components/seo/JsonLd';
import { 
  Compass, 
  Clock, 
  Share2, 
  Bookmark, 
  ZoomIn, 
  ZoomOut, 
  ChevronRight, 
  FileText, 
  Layers, 
  Box, 
  Check, 
  ArrowRight,
  Maximize2,
  ShieldCheck,
  Play,
  PhoneCall,
  Sparkles,
  Award,
  HelpCircle,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface BlogCard {
  id?: string;
  subtitle: string;
  text: string;
  image?: string;
}

interface ImageAsset {
  imageId: string;
  type: string;
  purpose: string;
  publicUrl: string;
  width?: number;
  height?: number;
}

interface Section {
  number?: number;
  sectionNumber?: number;
  title: string;
  content_markdown?: string;
  contentMarkdown?: string;
  image_url?: string;
  purpose?: string;
  layer?: string;
}

interface StructuredContent {
  sections?: Section[];
  body_markdown?: string;
  inline_images?: string[];
  images?: ImageAsset[];
  youtube_id?: string;
  cards?: BlogCard[];
  faqs?: { question: string; answer: string }[];
  excerpt?: string;
  reading_time_minutes?: number;
  keywords?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author: string;
  created_at: string;
  keywords?: string;
}

const cssVars: React.CSSProperties = {
  // @ts-ignore
  '--cream': '#faf7f2',
  '--paper': '#ffffff',
  '--ink': '#112625',
  '--muted': '#586b69',
  '--coral': '#ff5436',
  '--orange': '#f59e0b',
  '--yellow': '#fbbf24',
  '--teal': '#0d9488',
  '--mint': '#10b981',
  '--purple': '#8b5cf6',
  '--border': 'rgba(17, 38, 37, 0.1)',
};

const SvgAssetViewer: React.FC<{ 
  url?: string; 
  fallbackUrl: string; 
  alt: string; 
  onClick: () => void;
  className?: string;
}> = ({ url, fallbackUrl, alt, onClick, className = '' }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setSvgContent(null);
    setHasError(false);

    if (url && url.endsWith('.svg')) {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('SVG load failed');
          return res.text();
        })
        .then(text => {
          if (isMounted && text.includes('<svg')) {
            const cleanedSvg = text
              .replace(/<\?xml.*?\?>/i, '')
              .replace(/<!DOCTYPE.*?>/i, '')
              .replace(/width="1000"/i, 'width="100%"')
              .replace(/height="700"/i, 'height="100%"')
              .replace(/width="1200"/i, 'width="100%"');
            setSvgContent(cleanedSvg);
          }
        })
        .catch(() => {
          if (isMounted) setHasError(true);
        });
    }

    return () => { isMounted = false; };
  }, [url]);

  if (svgContent && !hasError) {
    return (
      <div 
        className={`w-full h-full flex items-center justify-center cursor-pointer overflow-hidden p-2 transition-transform duration-300 group-hover:scale-[1.005] [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[520px] ${className}`}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onClick={onClick}
      />
    );
  }

  return (
    <img 
      src={hasError || !url ? fallbackUrl : url} 
      alt={alt}
      className={`w-full h-auto max-h-[520px] object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.005] ${className}`}
      onClick={onClick}
      onError={() => setHasError(true)}
    />
  );
};

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [parsedContent, setParsedContent] = useState<StructuredContent | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [textSize, setTextSize] = useState<number>(17);
  const [activeVisualTab, setActiveVisualTab] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        let blogData: any = null;
        const decodedSlug = slug ? decodeURIComponent(slug).trim() : '';

        // 1. Exact slug match
        if (decodedSlug) {
          const { data: bySlug } = await supabase
            .from('blogs')
            .select('*')
            .eq('is_published', true)
            .eq('slug', decodedSlug)
            .maybeSingle();
          blogData = bySlug;
        }

        // 2. Alt slug with/without -blog
        if (!blogData && decodedSlug) {
          const altSlug = decodedSlug.endsWith('-blog') 
            ? decodedSlug.replace(/-blog$/, '') 
            : `${decodedSlug}-blog`;

          const { data: byAltSlug } = await supabase
            .from('blogs')
            .select('*')
            .eq('is_published', true)
            .eq('slug', altSlug)
            .maybeSingle();
          blogData = byAltSlug;
        }

        // 3. UUID match
        if (!blogData && decodedSlug) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);
          if (isUUID) {
            const { data: byId } = await supabase
              .from('blogs')
              .select('*')
              .eq('id', decodedSlug)
              .maybeSingle();
            blogData = byId;
          }
        }

        // 4. Extract 11-char YouTube ID
        if (!blogData && decodedSlug) {
          const ytMatch = decodedSlug.match(/([a-zA-Z0-9_-]{11})(?:-blog)?$/);
          const videoId = ytMatch ? ytMatch[1] : null;
          if (videoId) {
            const { data: byYt } = await supabase
              .from('blogs')
              .select('*')
              .eq('is_published', true)
              .ilike('slug', `%${videoId}%`)
              .limit(1);
            if (byYt && byYt.length > 0) blogData = byYt[0];
          }
        }

        // 5. Keyword search
        if (!blogData && decodedSlug) {
          const cleanKeyword = decodedSlug.replace(/-blog$/, '').split('-').filter(w => w.length > 3).pop();
          if (cleanKeyword) {
            const { data: byLike } = await supabase
              .from('blogs')
              .select('*')
              .eq('is_published', true)
              .ilike('slug', `%${cleanKeyword}%`)
              .limit(1);
            if (byLike && byLike.length > 0) blogData = byLike[0];
          }
        }

        // 6. Fallback
        if (!blogData) {
          const { data: fallback } = await supabase
            .from('blogs')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(1);
          if (fallback && fallback.length > 0) blogData = fallback[0];
        }

        if (!blogData) throw new Error('Blog not found');
        setBlog(blogData);

        let parsed: StructuredContent = {};
        try {
          if (typeof blogData.content === 'string') {
            parsed = JSON.parse(blogData.content);
          } else if (typeof blogData.content === 'object' && blogData.content !== null) {
            parsed = blogData.content;
          } else {
            parsed = { body_markdown: String(blogData.content) };
          }
        } catch {
          parsed = { body_markdown: String(blogData.content) };
        }

        if (parsed.cards && Array.isArray(parsed.cards) && (!parsed.sections || parsed.sections.length === 0)) {
          parsed.sections = parsed.cards.map((c, i) => ({
            number: i + 1,
            sectionNumber: i + 1,
            title: c.subtitle || `0${i + 1} — Vastu Principles`,
            content_markdown: c.text,
            contentMarkdown: c.text
          }));
        }

        if (parsed.sections && Array.isArray(parsed.sections)) {
          parsed.sections = parsed.sections.map((s, i) => ({
            ...s,
            number: s.number || s.sectionNumber || i + 1,
            sectionNumber: s.sectionNumber || s.number || i + 1,
            content_markdown: s.content_markdown || s.contentMarkdown || '',
            contentMarkdown: s.contentMarkdown || s.content_markdown || ''
          }));
        }

        setParsedContent(parsed);

        // Fetch Related Guides & Featured Videos
        const [relatedRes, videosRes] = await Promise.all([
          supabase
            .from('blogs')
            .select('id, title, slug, cover_image, created_at, keywords')
            .eq('is_published', true)
            .neq('id', blogData.id)
            .order('created_at', { ascending: false })
            .limit(4),
          supabase
            .from('videos')
            .select('id, youtube_id, title, views, duration, thumbnail_medium, published_at')
            .order('views', { ascending: false })
            .limit(3)
        ]);

        setRecentBlogs(relatedRes.data || []);
        setFeaturedVideos(videosRes.data || []);
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Scrollspy for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const secElements = document.querySelectorAll('article[id^="sec-"]');
      let current = '';
      secElements.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 220) {
          current = sec.id;
        }
      });
      if (current) setActiveSectionId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parsedContent]);

  const pageUrl = blog ? `https://hrvasthu.com/blog/${blog.slug || blog.id}` : 'https://hrvasthu.com/blog';
  const heroImage = blog?.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200';
  const faqs = parsedContent?.faqs || [];
  const readTime = parsedContent?.reading_time_minutes || 10;
  const excerpt = parsedContent?.excerpt || "Comprehensive Vedic Vastu guidance by Dr. Kunchala Hanumantha Rao.";
  const visualAssets = parsedContent?.images || [];
  const youtubeId = parsedContent?.youtube_id;
  const sections = parsedContent?.sections || [];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleSaveArticle = () => {
    if (!blog) return;
    setSavedArticles(prev => {
      const next = new Set(prev);
      if (next.has(blog.id)) next.delete(blog.id);
      else next.add(blog.id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-28 flex flex-col justify-center items-center gap-4 text-center" style={cssVars}>
        <Spinner size="lg" variant="primary" />
        <p className="text-xs font-bold tracking-widest text-[var(--muted)] animate-pulse uppercase">
          Loading Sthapatya Veda Blueprint...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-28 flex flex-col justify-center items-center text-center px-4" style={cssVars}>
        <h2 className="text-2xl font-['Playfair_Display'] text-[var(--ink)] mb-4 font-bold">Article Not Found</h2>
        <button onClick={() => navigate('/blog')} className="px-6 py-2.5 bg-[var(--coral)] text-white font-bold text-xs rounded-full hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider">
          Return to Blog Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)] font-['DM_Sans',sans-serif] selection:bg-[var(--coral)] selection:text-white" style={cssVars}>
      <Helmet>
        <title>{`${blog.title} — Sthapatya Veda Architecture Guide`}</title>
        <meta name="description" content={excerpt} />
        <link rel="canonical" href={pageUrl} />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Dynamic Multi-Color Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left"
        style={{ 
          scaleX,
          background: 'linear-gradient(to right, #ff5436, #f59e0b, #10b981, #0d9488, #8b5cf6)'
        }} 
      />

      {/* Main Full-Width Wrapper with Minimal Edge Spacing */}
      <div className="w-full px-2 sm:px-3 pt-24 pb-20">

        {/* Header Hero Area */}
        <header className="max-w-[1700px] mx-auto text-center mb-8 px-2">
          
          {/* Category & Badge Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-2xs border border-[var(--border)] text-[11px] font-bold uppercase tracking-wider text-[var(--coral)]">
              <Sparkles size={12} /> Sthapatya Veda Research
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-[11px] font-semibold text-amber-900">
              <Clock size={12} /> {readTime} Min Read • 5,000+ Words
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-[11px] font-semibold text-emerald-900">
              <Award size={12} /> Non-Demolition Remediation
            </span>
          </div>

          {/* Master Title */}
          <h1 className="font-['Playfair_Display'] text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--ink)] leading-[1.25] tracking-tight max-w-5xl mx-auto mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-3xl mx-auto mb-4 font-normal">
            {excerpt}
          </p>

          {/* Author Meta Strip */}
          <div className="inline-flex items-center justify-center gap-3 text-xs text-[var(--muted)] bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full border border-[var(--border)]">
            <span className="font-bold text-[var(--ink)]">Dr. Kunchala Hanumantha Rao</span>
            <span>•</span>
            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-[var(--teal)] font-bold flex items-center gap-1">
              <ShieldCheck size={13} /> Peer-Reviewed
            </span>
          </div>
        </header>

        {/* Exact Proportion 3-Column Layout: 14% | 1% Spacing | 70% | 1% Spacing | 14% */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-[1%]">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: 14% Width (Space-Saving, High-Density)     */}
          {/* ======================================================== */}
          <aside className="hidden lg:flex flex-col w-[14%] shrink-0 sticky top-24 space-y-4">
            
            {/* Table of Contents Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[var(--border)] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-[var(--coral)]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--ink)]">
                    Contents
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--coral)] bg-orange-50 px-1.5 py-0.5 rounded-md">
                  {sections.length}
                </span>
              </div>

              <nav className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
                {sections.length > 0 ? (
                  sections.map((sec, idx) => {
                    const secNumber = sec.sectionNumber || sec.number || idx + 1;
                    const secId = `sec-${secNumber}`;
                    const isActive = activeSectionId === secId;

                    return (
                      <a
                        key={idx}
                        href={`#${secId}`}
                        className={`group flex items-start gap-1.5 p-1.5 rounded-lg text-[11px] leading-tight transition-all duration-150 ${
                          isActive
                            ? 'bg-orange-50 text-[var(--coral)] font-bold border-l-2 border-[var(--coral)]'
                            : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-stone-50 font-medium'
                        }`}
                      >
                        <span className={`shrink-0 text-[9px] font-mono px-1 py-0.2 rounded ${
                          isActive ? 'bg-[var(--coral)] text-white font-bold' : 'bg-stone-100 text-gray-600'
                        }`}>
                          {secNumber.toString().padStart(2, '0')}
                        </span>
                        <span className="line-clamp-2">
                          {sec.title}
                        </span>
                      </a>
                    );
                  })
                ) : (
                  <a href="#content" className="text-[11px] text-[var(--muted)]">Main Content</a>
                )}
              </nav>
            </div>

            {/* Compact Vastu Compass Widget */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 p-3.5 rounded-2xl border border-[var(--border)] shadow-2xs text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--coral)] block">
                ✦ Polar Mandala ✦
              </span>

              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[var(--coral)] via-[var(--yellow)] to-[var(--teal)] p-1 shadow-inner relative animate-[spin_40s_linear_infinite]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative">
                  <span className="absolute top-1 text-[8px] font-black text-rose-600">N</span>
                  <span className="absolute bottom-1 text-[8px] font-black text-slate-800">S</span>
                  <span className="absolute right-1 text-[8px] font-black text-blue-600">E</span>
                  <span className="absolute left-1 text-[8px] font-black text-amber-600">W</span>
                  <Compass size={22} className="text-[var(--coral)]" />
                </div>
              </div>

              <div className="text-[10px] text-[var(--muted)] space-y-0.5 text-left bg-white/90 p-2 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between">
                  <span className="font-semibold text-emerald-700">NE (ఈశాన్యం):</span>
                  <span>Water</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-rose-700">SE (ఆగ్నేయం):</span>
                  <span>Fire</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-amber-800">SW (నైరుతి):</span>
                  <span>Earth</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-blue-700">NW (వాయువ్యం):</span>
                  <span>Air</span>
                </div>
              </div>
            </div>

            {/* Compact WhatsApp Button */}
            <div className="bg-white p-3 rounded-2xl border border-[var(--border)] shadow-2xs text-center space-y-2">
              <span className="text-[10px] font-bold text-[var(--ink)] block">
                CAD Drawing Audit
              </span>
              <a
                href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I am reading "${blog.title}" and would like to audit my house plan.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-transform hover:scale-102 uppercase tracking-wide"
              >
                <PhoneCall size={11} /> Chat WhatsApp
              </a>
            </div>

          </aside>

          {/* ======================================================== */}
          {/* CENTER CONTENT: 70% Width (Immersive & Standardized)     */}
          {/* ======================================================== */}
          <main className="w-full lg:w-[70%] min-w-0 space-y-8" style={{ fontSize: `${textSize}px` }}>
            
            {/* Visual Modality CAD / 3D Blueprint Frame */}
            {visualAssets.length > 0 && (
              <div className="bg-white rounded-3xl p-3 sm:p-5 shadow-sm border border-[var(--border)]">
                {/* Switcher Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
                  {visualAssets.map((asset, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVisualTab(i)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeVisualTab === i
                          ? 'bg-[var(--coral)] text-white shadow-xs scale-102'
                          : 'bg-stone-100/80 text-[var(--ink)] hover:bg-orange-100/60'
                      }`}
                    >
                      {i === 0 && <FileText size={13} />}
                      {i === 1 && <Layers size={13} />}
                      {i >= 2 && <Box size={13} />}
                      <span>
                        {i === 0 ? '2D CAD Blueprint' : i === 1 ? '3D Technical Cross-Section' : '3D Axonometric Model'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Vector Canvas */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center min-h-[300px] sm:min-h-[440px] group shadow-inner">
                  <SvgAssetViewer 
                    url={visualAssets[activeVisualTab]?.publicUrl} 
                    fallbackUrl={heroImage}
                    alt={visualAssets[activeVisualTab]?.purpose || blog.title}
                    onClick={() => setLightboxImage(visualAssets[activeVisualTab]?.publicUrl || heroImage)}
                  />

                  <button
                    onClick={() => setLightboxImage(visualAssets[activeVisualTab]?.publicUrl || heroImage)}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-xl shadow-md text-[var(--ink)] hover:text-[var(--coral)] transition-all cursor-pointer"
                    title="Fullscreen Diagram"
                  >
                    <Maximize2 size={16} />
                  </button>

                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[11px] max-w-md hidden sm:block border border-white/10">
                    <span className="text-[var(--yellow)] font-bold">✦ Purpose: </span>
                    <span className="text-gray-200">{visualAssets[activeVisualTab]?.purpose}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 11 Rich Content Sections */}
            <div id="content" className="space-y-8">
              {sections.length > 0 ? (
                sections.map((sec, idx) => {
                  const secNumber = sec.sectionNumber || sec.number || idx + 1;
                  const markdownText = sec.contentMarkdown || sec.content_markdown || '';

                  return (
                    <article 
                      key={idx} 
                      id={`sec-${secNumber}`} 
                      className="scroll-mt-28 bg-white p-6 sm:p-9 md:p-10 rounded-3xl border border-[var(--border)] shadow-2xs"
                    >
                      {/* Section Badge */}
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="px-3 py-0.5 bg-orange-100 text-[var(--coral)] rounded-full text-[11px] font-bold tracking-widest uppercase">
                          SECTION {secNumber.toString().padStart(2, '0')}
                        </span>
                        {sec.layer && (
                          <span className="text-[11px] font-semibold text-[var(--teal)] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 hidden sm:inline-block">
                            {sec.layer}
                          </span>
                        )}
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
                      </div>

                      {/* Section Title */}
                      <h2 className="text-xl sm:text-2xl md:text-[28px] font-['Playfair_Display'] font-bold leading-snug mb-6 text-[var(--ink)] tracking-tight">
                        {sec.title}
                      </h2>
                      
                      {/* Section Body Markdown */}
                      <div className="prose prose-slate max-w-none text-slate-800 leading-[1.8]
                        prose-p:mb-5 prose-p:text-[16.5px] prose-p:leading-[1.8]
                        prose-headings:font-['Playfair_Display'] prose-headings:text-[var(--ink)] prose-headings:font-bold prose-headings:tracking-tight
                        prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-3 prose-h3:border-b prose-h3:border-orange-100 prose-h3:pb-1.5
                        prose-h4:text-base prose-h4:mt-5 prose-h4:mb-2
                        prose-strong:text-[var(--ink)] prose-strong:font-bold prose-strong:bg-amber-50/90 prose-strong:px-1 prose-strong:py-0.2 prose-strong:rounded
                        prose-a:text-[var(--coral)] prose-a:font-semibold hover:prose-a:underline
                        prose-ul:my-5 prose-ul:space-y-2.5 prose-ul:list-disc prose-ul:pl-5
                        prose-ol:my-5 prose-ol:space-y-2.5 prose-ol:list-decimal prose-ol:pl-5
                        prose-li:text-[16px] prose-li:leading-[1.7]
                        prose-blockquote:border-l-4 prose-blockquote:border-[var(--coral)] prose-blockquote:bg-orange-50/40 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:my-5
                        prose-table:w-full prose-table:my-5 prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden
                        prose-th:bg-amber-100/60 prose-th:text-[var(--ink)] prose-th:p-3 prose-th:font-bold prose-th:text-left prose-th:text-xs
                        prose-td:p-3 prose-td:border-b prose-td:border-gray-100 prose-td:text-xs sm:prose-td:text-sm"
                      >
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {markdownText}
                        </ReactMarkdown>
                      </div>

                      {/* Embedded YouTube Player on Section 04 */}
                      {idx === 3 && youtubeId && (
                        <div className="my-8 rounded-2xl overflow-hidden shadow-xl aspect-video bg-black border border-slate-700">
                          <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="Dr. Rao Lecture Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="prose prose-lg max-w-none text-slate-800 leading-loose bg-white p-8 rounded-3xl border border-[var(--border)]">
                  {parsedContent?.body_markdown ? (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{parsedContent.body_markdown}</ReactMarkdown>
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{typeof blog.content === 'string' && !blog.content.trim().startsWith('{') ? blog.content : excerpt}</ReactMarkdown>
                  )}
                </div>
              )}
            </div>

            {/* Interactive FAQs Accordion */}
            {faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[var(--coral)] flex items-center justify-center font-bold">
                    <HelpCircle size={15} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-[var(--ink)]">
                      Frequently Asked Questions
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} className="border border-[var(--border)] rounded-2xl bg-[var(--paper)] overflow-hidden transition-all duration-200">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-4 sm:p-5 flex justify-between items-center text-left gap-3 hover:bg-orange-50/30 transition-colors cursor-pointer"
                        >
                          <span className="font-['Playfair_Display'] font-bold text-sm sm:text-base text-[var(--ink)] leading-snug">
                            {faq.question}
                          </span>
                          <ChevronDown size={16} className={`text-[var(--coral)] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 sm:px-5 pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-dashed border-gray-100">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dr. Rao Author Profile Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-[#193b3a] via-[#122e2d] to-[#0c1f1e] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-teal-900/40">
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="w-18 h-18 shrink-0 rounded-full bg-gradient-to-tr from-[var(--yellow)] to-[var(--coral)] p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[var(--ink)] flex items-center justify-center text-2xl font-['Playfair_Display'] font-bold text-[var(--yellow)]">
                    HR
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="inline-block bg-white/15 text-[var(--yellow)] text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full">
                    ✦ Chief Vasthu Siddanthi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold">
                    Dr. Kunchala Hanumantha Rao
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm max-w-2xl">
                    Renowned Vedic Vasthu Siddanthi and Nepal Sadbhavana Awardee with over 30 years of empirical architectural research. Helping homeowners achieve spatial harmony without destructive demolitions.
                  </p>
                  <div className="pt-1">
                    <a 
                      href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I read your article "${blog.title}" on hrvasthu.com and would like to consult on my floor plans.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--coral)] to-[var(--orange)] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105"
                    >
                      <PhoneCall size={13} /> WhatsApp Consultation (+91 92466 24248)
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </main>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR: 14% Width (Tools, Videos, Trending)       */}
          {/* ======================================================== */}
          <aside className="hidden lg:flex flex-col w-[14%] shrink-0 sticky top-24 space-y-4">
            
            {/* Reading Toolbar Box */}
            <div className="bg-white p-3 rounded-2xl border border-[var(--border)] shadow-2xs space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block">
                Reading Tools
              </span>
              <div className="flex items-center justify-between gap-1.5">
                <button 
                  onClick={() => setTextSize(s => Math.min(s + 2, 22))}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--cream)] hover:bg-orange-100 text-[var(--ink)] font-bold text-[11px] flex items-center justify-center gap-0.5 transition-colors cursor-pointer border border-[var(--border)]"
                  title="Increase Text Size"
                >
                  <ZoomIn size={12} /> A+
                </button>
                <button 
                  onClick={() => setTextSize(s => Math.max(s - 2, 14))}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--cream)] hover:bg-orange-100 text-[var(--ink)] font-bold text-[11px] flex items-center justify-center gap-0.5 transition-colors cursor-pointer border border-[var(--border)]"
                  title="Decrease Text Size"
                >
                  <ZoomOut size={12} /> A−
                </button>
                <button 
                  onClick={() => setTextSize(17)}
                  className="p-1.5 rounded-lg bg-[var(--cream)] hover:bg-orange-100 text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer border border-[var(--border)]"
                  title="Reset Font Size"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

              <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border)]">
                <button 
                  onClick={toggleSaveArticle}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--cream)] hover:bg-orange-100 text-[var(--ink)] font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[var(--border)]"
                >
                  <Bookmark size={12} className={savedArticles.has(blog.id) ? 'fill-[var(--coral)] text-[var(--coral)]' : ''} />
                  <span>{savedArticles.has(blog.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-1.5 rounded-lg bg-[var(--cream)] hover:bg-orange-100 text-[var(--ink)] font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-[var(--border)]"
                >
                  {copiedLink ? <Check size={12} className="text-emerald-600" /> : <Share2 size={12} />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Video Masterclasses Card */}
            {featuredVideos.length > 0 && (
              <div className="bg-white p-3 rounded-2xl border border-[var(--border)] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border)]">
                  <div className="flex items-center gap-1">
                    <Play size={12} className="text-rose-600 fill-rose-600" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--ink)]">
                      Lectures
                    </span>
                  </div>
                  <Link to="/videos" className="text-[9px] font-bold text-[var(--coral)] hover:underline">
                    All →
                  </Link>
                </div>

                <div className="space-y-2">
                  {featuredVideos.map((vid) => {
                    const videoSlug = getVideoSlug(vid) || vid.id;
                    return (
                      <Link
                        key={vid.id}
                        to={`/video/${videoSlug}`}
                        className="group block rounded-xl overflow-hidden hover:bg-orange-50/60 p-1 transition-colors"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-[var(--border)] mb-1">
                          <img 
                            src={vid.thumbnail_medium || `https://img.youtube.com/vi/${vid.youtube_id}/mqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <Play size={11} className="text-white fill-white" />
                          </div>
                        </div>
                        <h4 className="text-[10px] font-bold text-[var(--ink)] line-clamp-2 group-hover:text-[var(--coral)] transition-colors leading-tight">
                          {vid.title}
                        </h4>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trending Articles */}
            {recentBlogs.length > 0 && (
              <div className="bg-white p-3 rounded-2xl border border-[var(--border)] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border)]">
                  <div className="flex items-center gap-1">
                    <Sparkles size={12} className="text-[var(--coral)]" />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--ink)]">
                      Trending
                    </span>
                  </div>
                  <Link to="/blog" className="text-[9px] font-bold text-[var(--coral)] hover:underline">
                    All →
                  </Link>
                </div>

                <div className="space-y-2">
                  {recentBlogs.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      to={`/blog/${item.slug || item.id}`}
                      className="group block rounded-xl hover:bg-orange-50/60 p-1 transition-colors"
                    >
                      <h4 className="text-[10px] font-bold text-[var(--ink)] line-clamp-2 group-hover:text-[var(--coral)] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[9px] text-[var(--coral)] font-semibold flex items-center gap-0.5 mt-0.5">
                        Read <ChevronRight size={9} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Consultation Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#ff5436] to-[#f59e0b] text-white shadow-sm space-y-2 text-center">
              <span className="text-[8px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                ✦ 1-ON-1 AUDIT
              </span>
              <h4 className="font-['Playfair_Display'] text-xs font-bold leading-tight">
                Floor Plan Verification
              </h4>
              <p className="text-[10px] text-white/90 leading-tight">
                Send your AutoCAD plans to Dr. Rao.
              </p>
              <a
                href="https://wa.me/919246624248?text=Hello%20Dr.%20Rao%2C%20I%20would%20like%20to%20audit%20my%20house%20plan%20as%20per%20Vastu."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2 bg-white text-[var(--ink)] hover:bg-stone-50 font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 shadow-xs transition-transform hover:scale-102"
              >
                <PhoneCall size={10} className="text-[var(--coral)]" /> WhatsApp
              </a>
            </div>

          </aside>

        </div>

      </div>

      {/* Bottom Further Reading Grid */}
      {recentBlogs.length > 0 && (
        <section className="bg-white py-12 border-t border-[var(--border)]">
          <div className="w-full max-w-[1700px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8">
              <div>
                <span className="text-[var(--coral)] text-xs font-bold tracking-widest uppercase block mb-1">
                  Further Reading
                </span>
                <h3 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-[var(--ink)]">
                  Related Vedic Architecture Guides
                </h3>
              </div>
              <Link to="/blog" className="text-xs font-bold text-[var(--coral)] flex items-center gap-1 hover:underline">
                View All 490+ Articles <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentBlogs.map((item, i) => (
                <Link 
                  key={i} 
                  to={`/blog/${item.slug || item.id}`}
                  className="group bg-[var(--cream)] rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img 
                      src={item.cover_image || heroImage} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 text-[var(--ink)] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      5,000+ WORDS
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <h4 className="font-['Playfair_Display'] font-bold text-sm text-[var(--ink)] line-clamp-2 group-hover:text-[var(--coral)] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                      <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-[var(--coral)] font-bold flex items-center gap-0.5">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-900 rounded-2xl p-3 sm:p-5 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <SvgAssetViewer 
              url={lightboxImage} 
              fallbackUrl={heroImage}
              alt="Enlarged Diagram" 
              onClick={() => {}}
              className="max-w-full max-h-[80vh]"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="mt-3 px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Fullscreen (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;

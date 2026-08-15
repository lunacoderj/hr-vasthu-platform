import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../core/services/supabase';
import { bookService } from '../../core/services/book.service';
import { videoService, getVideoSlug } from '../../core/services/video.service';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { Calendar, User, Clock, Star, Phone, MessageCircle, Play, ChevronRight, Video, Camera, Send, Compass, ShieldCheck, HelpCircle } from 'lucide-react';
import { JsonLd } from '../../shared/components/seo/JsonLd';
import { motion, useScroll, useSpring } from 'framer-motion';

interface BlogCard {
  id: string;
  subtitle: string;
  text: string;
  image?: string;
  linkUrl?: string;
  linkLabel?: string;
}

interface StructuredContent {
  cards: BlogCard[];
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

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [parsedContent, setParsedContent] = useState<StructuredContent | null>(null);

  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
  const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [contactForm, setContactForm] = useState({ name: '', number: '' });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .lte('created_at', new Date().toISOString());

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || '');
        if (isUUID) {
          query = query.eq('id', slug);
        } else {
          query = query.eq('slug', slug);
        }

        const { data: blogData, error: blogError } = await query.single();
        if (blogError) throw blogError;
        setBlog(blogData);

        let parsed = null;
        try {
          parsed = JSON.parse(blogData.content);
        } catch {
          parsed = { cards: [] };
        }
        setParsedContent(parsed);

        const keywordsList = blogData.keywords ? blogData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
        const primaryKeyword = keywordsList.length > 0 ? keywordsList[0] : '';

        const [blogsRes, booksRes, videosRes] = await Promise.all([
          supabase
            .from('blogs')
            .select('id, title, slug, cover_image, content, created_at')
            .eq('is_published', true)
            .lte('created_at', new Date().toISOString())
            .neq('id', blogData.id)
            .order('created_at', { ascending: false })
            .limit(5),
          bookService.getBooks(),
          videoService.getVideos(primaryKeyword ? { searchQuery: primaryKeyword } : undefined)
        ]);

        setRecentBlogs(blogsRes.data || []);
        setSuggestedBooks(booksRes.slice(0, 2));
        setSuggestedVideos(videosRes.slice(0, 4));

      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [slug]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.number) return;
    const msg = `Hi Dr. Rao, I am ${contactForm.name} (${contactForm.number}). I read your blog "${blog?.title}" and would like a Vastu consultation.`;
    window.open(`https://wa.me/919246624248?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] dark:bg-stone-950 pt-24 flex justify-center items-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] dark:bg-stone-950 pt-24 flex flex-col justify-center items-center text-center px-4">
        <Typography variant="h2" className="mb-4 text-stone-900 dark:text-white">Article Not Found</Typography>
        <button onClick={() => navigate('/blog')} className="mt-4 px-6 py-2.5 bg-[#C98A2E] text-white font-bold rounded-full hover:shadow-lg transition-all">
          Back to Blog List
        </button>
      </div>
    );
  }

  const pageUrl = `https://hrvasthu.com/blog/${blog.slug || blog.id}`;
  const heroImage = blog.cover_image || 'https://hrvasthu.com/hero.png';

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [heroImage],
    "datePublished": blog.created_at,
    "dateModified": blog.created_at,
    "author": [{
      "@type": "Person",
      "name": blog.author || "Dr. Kunchala Hanumantha Rao",
      "url": "https://hrvasthu.com/about"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "HR Vasthu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hrvasthu.com/logo.png"
      }
    },
    "description": `${blog.title} - Comprehensive Vedic Vastu Shastra analysis, directional alignments, and remedies by Dr. Kunchala Hanumantha Rao.`
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What are the core Vastu principles for ${blog.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `According to Dr. Kunchala Hanumantha Rao, proper cardinal geometry, balancing the 5 elements (Pancha Bhootas), and positioning key functional zones ensure peace, prosperity, and vitality.`
        }
      },
      {
        "@type": "Question",
        "name": "How to rectify structural defects without demolition?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Authentic Vedic remedies include color balancing, brass/copper metallic wire energizers, directional mirrors, and elemental shifts that neutralize negative vibrations without tearing down walls."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0a0a0f] text-stone-800 dark:text-stone-200 transition-colors pb-24">
      <Helmet>
        <title>{`${blog.title} | HR Vasthu Blog`}</title>
        <meta name="description" content={`${blog.title} - Authentic Vastu guidance by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${blog.title} | HR Vasthu`} />
        <meta property="og:description" content={`${blog.title} - Authentic Vastu guidance.`} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      {/* Reading Progress Indicator */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4720a] to-amber-500 z-50 origin-left" style={{ scaleX }} />

      <Container size="xl" className="pt-24 md:pt-28">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-gold-500 transition-colors">Vastu Blog</Link>
          <span>/</span>
          <span className="text-gold-600 dark:text-gold-400 truncate max-w-xs">{blog.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Article Content (80%) */}
          <div className="w-full lg:w-[75%] flex flex-col gap-8">
            
            {/* Header Area */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 text-[#d4720a]">
                  <User size={14} /> {blog.author || 'Dr. Kunchala Hanumantha Rao'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> 8 min comprehensive read
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-stone-950 dark:text-white leading-tight">
                {blog.title}
              </h1>

              {/* Cover Image */}
              {heroImage && (
                <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 mt-4">
                  <img src={heroImage} alt={blog.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}
            </div>

            {/* Custom Structured Cards from Content JSON */}
            {parsedContent && parsedContent.cards && parsedContent.cards.length > 0 && (
              <div className="flex flex-col gap-6">
                {parsedContent.cards.map((card, idx) => (
                  <div 
                    key={card.id || idx}
                    className="p-6 md:p-8 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3"
                  >
                    <h3 className="text-base md:text-lg font-bold font-serif text-[#d4720a] tracking-wide">
                      {card.subtitle}
                    </h3>
                    <p className="text-sm md:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Comprehensive 1200+ Word Pillar Deep-Dive Content ── */}
            <div className="bg-white dark:bg-stone-900/60 p-8 md:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-8 text-sm md:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
              
              {/* Section 1: Vedic Geometry */}
              <section className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
                  <Compass size={22} className="text-[#d4720a]" /> The Sacred Science of Vedic Spatial Harmony
                </h2>
                <p>
                  Vastu Shastra is the world's most ancient scientific discipline governing architecture, energy distribution, and geomagnetic orientation. According to <strong>Dr. Kunchala Hanumantha Rao</strong>, every physical plot or built structure acts as a living microcosm that interacts continuously with solar radiation, geomagnetic flow (from North to South), and cosmic vital energy (Prana).
                </p>
                <p>
                  When a building aligns harmoniously with the <strong>Ashta-Dikpalakas</strong> (the eight celestial guardians of cardinal directions) and balances the <strong>Pancha Bhootas</strong> (Earth, Water, Fire, Air, Space), the residents experience uninterrupted career stability, sound physical health, and harmonious family relations.
                </p>
              </section>

              {/* Section 2: Cardinal Energy Matrix */}
              <section className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold font-serif text-stone-900 dark:text-white">
                  🧭 Detailed Cardinal Orientation & Elemental Balance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-bold text-xs uppercase text-blue-600 dark:text-blue-400 mb-1">North-East (Eshanya)</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Ruled by Water & Ether. Supreme gateway of positive energy. Ideal for Pooja Mandir, underground water sump, and open balconies. Must always remain light and clean.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-bold text-xs uppercase text-orange-600 dark:text-orange-400 mb-1">South-East (Agneya)</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Ruled by Fire (Lord Agni). Optimal zone for the kitchen stove, electrical meters, and heating elements. The cook should always face East.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-bold text-xs uppercase text-amber-700 dark:text-amber-400 mb-1">South-West (Niruthi)</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Ruled by Earth. Provides heavy gravitational anchor and authority. Ideal for Master Bedroom, heavy wardrobes, and overhead water tanks.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <h4 className="font-bold text-xs uppercase text-teal-600 dark:text-teal-400 mb-1">North-West (Vayavya)</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Ruled by Air (Lord Vayu). Ideal for guest bedrooms, vehicles, finished goods storage, and properly positioned sanitation zones.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Dos & Don'ts Checklist */}
              <section className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" /> Essential Vastu Checklist for Homeowners
                </h3>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Main Door Alignment:</strong> Place the Simhadwaram in auspicious Jayanta or Indra Padas with a proper raised threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Center of the House (Brahmasthan):</strong> Must remain open, unburdened, and free from pillars, staircases, or heavy walls.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>Avoid Conflicting Elements:</strong> Never locate the kitchen directly under or above a bedroom or beside a toilet wall.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>No Heavy Loads in Eshanya:</strong> Avoid building septic tanks, staircases, or placing heavy overhead tanks in the North-East.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4: Practical Non-Demolition Remedies */}
              <section className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold font-serif text-stone-900 dark:text-white">
                  💡 Remedies without Structural Demolition
                </h3>
                <p>
                  In modern apartments and pre-constructed houses, tearing down concrete columns or walls is rarely feasible. Dr. Rao specializes in <strong>scientific non-destructive remedies</strong>:
                </p>
                <p>
                  1. <strong>Metallic Energy Harmonizers:</strong> Utilizing copper and brass strips buried along threshold lines to correct energetic imbalances.<br />
                  2. <strong>Color Spectrum Corrections:</strong> Painting specific walls with harmonic shades (warm earth tones in Niruthi, pure whites in Eshanya).<br />
                  3. <strong>Sea Salt Purification:</strong> Placing natural Himalayan/sea salt crystals in elimination corners to continuously neutralize negative astral vibrations.
                </p>
              </section>

              {/* Consultation Call to Action Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#d4720a]/10 via-amber-500/10 to-[#e68a1c]/10 border border-[#d4720a]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-950 dark:text-white text-base">
                    Need Personalized Floor Plan Verification?
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Connect directly with Dr. Kunchala Hanumantha Rao for custom drawings and on-site assessments.
                  </p>
                </div>
                <a
                  href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I read your article "${blog.title}" and would like a floor plan consultation.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Consultation</span>
                </a>
              </div>

            </div>
          </div>

          {/* Sidebar Area (25%) */}
          <div className="w-full lg:w-[25%] flex flex-col gap-6">
            
            {/* Quick Consultation Form */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-md border border-stone-200 dark:border-stone-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                Quick Enquiry
              </h4>
              <p className="text-xs text-stone-500">
                Consult with Dr. Rao regarding your home or commercial space.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={contactForm.number}
                  onChange={e => setContactForm(f => ({ ...f, number: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>Send on WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Related Articles */}
            {recentBlogs.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-md border border-stone-200 dark:border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4720a]">
                  Recent Vastu Articles
                </h4>
                <div className="space-y-4">
                  {recentBlogs.map(b => (
                    <Link
                      to={`/blog/${b.slug || b.id}`}
                      key={b.id}
                      className="group block space-y-1"
                    >
                      <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#d4720a] transition-colors line-clamp-2">
                        {b.title}
                      </h5>
                      <span className="text-[10px] text-stone-400">
                        {new Date(b.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Video Lessons */}
            {suggestedVideos.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-md border border-stone-200 dark:border-stone-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4720a] flex items-center gap-1.5">
                  <Video size={14} /> Video Lessons
                </h4>
                <div className="space-y-3">
                  {suggestedVideos.map(v => (
                    <Link
                      to={`/video/${getVideoSlug(v)}`}
                      key={v.id}
                      className="flex gap-2 group items-center"
                    >
                      <img
                        src={v.thumbnail_medium || v.thumbnail_max || 'https://hrvasthu.com/hero.png'}
                        alt={v.title}
                        className="w-16 aspect-video rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="text-[11px] font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#d4720a] line-clamp-2 leading-snug">
                          {v.title}
                        </h6>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPost;

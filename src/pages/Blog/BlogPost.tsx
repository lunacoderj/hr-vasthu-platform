import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../../core/services/supabase';
import { bookService } from '../../core/services/book.service';
import { videoService, getVideoSlug } from '../../core/services/video.service';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { Calendar, User, Clock, MessageCircle, Play, ChevronDown, Video, Compass, ShieldCheck, HelpCircle } from 'lucide-react';
import { JsonLd } from '../../shared/components/seo/JsonLd';
import { motion, useScroll, useSpring } from 'framer-motion';

interface BlogCard {
  id: string;
  subtitle: string;
  text: string;
  image?: string;
}

interface StructuredContent {
  body_markdown?: string;
  inline_images?: string[];
  youtube_id?: string;
  cards?: BlogCard[];
  faqs?: { question: string; answer: string }[];
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

        let parsed: StructuredContent = {};
        try {
          parsed = JSON.parse(blogData.content);
        } catch {
          parsed = { body_markdown: blogData.content };
        }
        setParsedContent(parsed);

        const keywordsList = blogData.keywords ? blogData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
        const primaryKeyword = keywordsList.length > 0 ? keywordsList[0] : '';

        const [blogsRes, booksRes, videosRes] = await Promise.all([
          supabase
            .from('blogs')
            .select('id, title, slug, cover_image, created_at')
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
        <button onClick={() => navigate('/blog')} className="mt-4 px-6 py-2.5 bg-[#C98A2E] text-white font-bold rounded-full hover:shadow-lg transition-all cursor-pointer">
          Back to Blog List
        </button>
      </div>
    );
  }

  const pageUrl = `https://hrvasthu.com/blog/${blog.slug || blog.id}`;
  const heroImage = blog.cover_image || 'https://hrvasthu.com/hero.png';

  const faqs = parsedContent?.faqs || [
    {
      question: `What are the core Vastu principles for ${blog.title}?`,
      answer: `According to Dr. Kunchala Hanumantha Rao, proper cardinal geometry, balancing the 5 elements (Pancha Bhootas), and positioning key functional zones ensure peace, prosperity, and vitality.`
    },
    {
      question: "How to rectify structural defects without demolition?",
      answer: "Authentic Vedic remedies include color balancing, brass/copper metallic wire energizers, directional mirrors, and elemental shifts that neutralize negative vibrations without tearing down walls."
    }
  ];

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
    "description": `${blog.title} — Comprehensive Vedic Vastu Shastra analysis, directional alignments, and scientific non-demolition remedies by Dr. Kunchala Hanumantha Rao.`
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0a0a0f] text-stone-800 dark:text-stone-200 transition-colors pb-24">
      <Helmet>
        <title>{`${blog.title} | HR Vasthu Blog`}</title>
        <meta name="description" content={`${blog.title} — Comprehensive Vedic Vastu guidance by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${blog.title} | HR Vasthu`} />
        <meta property="og:description" content={`${blog.title} — Comprehensive Vedic Vastu guidance.`} />
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
          
          {/* Main Article Content (75%) */}
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

            {/* Render In-Depth Article Content */}
            {parsedContent?.body_markdown ? (
              <div className="bg-white dark:bg-stone-900/80 p-6 md:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
                <div className="prose prose-stone dark:prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-950 dark:prose-headings:text-white prose-a:text-[#d4720a] prose-img:rounded-2xl prose-img:shadow-lg prose-table:border-collapse prose-th:bg-stone-100 dark:prose-th:bg-stone-800 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-stone-200 dark:prose-td:border-stone-800 leading-relaxed">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {parsedContent.body_markdown}
                  </ReactMarkdown>
                </div>
              </div>
            ) : parsedContent?.cards && parsedContent.cards.length > 0 ? (
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
            ) : (
              <div className="bg-white dark:bg-stone-900/80 p-6 md:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
                <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {blog.content}
                </p>
              </div>
            )}

            {/* Dynamic Interactive FAQs Section */}
            {faqs.length > 0 && (
              <div className="bg-white dark:bg-stone-900/80 p-6 md:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle size={22} className="text-[#d4720a]" />
                  <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div 
                        key={index} 
                        className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50 dark:bg-stone-950/40"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-4 md:p-5 flex items-center justify-between text-left font-serif font-bold text-sm md:text-base text-stone-900 dark:text-white hover:text-[#d4720a] transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown 
                            size={18} 
                            className={`text-stone-400 transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-[#d4720a]' : ''}`} 
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 md:px-5 pb-5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-200/60 dark:border-stone-800/60 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Author Attribution & Consultation Box */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#d4720a]/10 via-amber-500/10 to-[#e68a1c]/10 border border-[#d4720a]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4720a] to-amber-500 p-0.5 shrink-0 shadow-lg">
                  <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-gold-400 font-bold text-lg font-serif">
                    HR
                  </div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base md:text-lg text-stone-950 dark:text-white flex items-center gap-1.5">
                    Dr. Kunchala Hanumantha Rao <ShieldCheck size={18} className="text-gold-500" />
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Vasthu Siddanthi • Master of Vedic Architecture • Nepal Sadbhavana Awardee
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I read your article "${blog.title}" and would like a floor plan consultation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Floor Plan Review</span>
              </a>
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

            {/* Official YouTube Channel Subscribe Card */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-red-950/40 rounded-3xl p-6 shadow-md border border-stone-800 text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-gold-500 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-gold-400 font-bold text-xs">
                    HR
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1">
                    HR Vasthu Official <ShieldCheck size={14} className="text-gold-400" />
                  </h4>
                  <p className="text-[10px] text-stone-400">Dr. Kunchala Hanumantha Rao</p>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Watch 500+ free Vedic Vastu architectural blueprints and daily video remedies.
              </p>
              <a
                href="https://www.youtube.com/channel/UCgCijg9nTzivoeszshGjzzQ?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              >
                <Play size={14} className="fill-white" />
                <span>Subscribe on YouTube</span>
              </a>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPost;

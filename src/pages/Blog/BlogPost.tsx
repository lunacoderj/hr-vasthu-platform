import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../core/services/supabase';
import { bookService } from '../../core/services/book.service';
import { videoService } from '../../core/services/video.service';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { Calendar, User, Clock, Star, Phone, MessageCircle, Play, ChevronRight, Video, Camera, Send, Compass } from 'lucide-react';
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

  // Sidebar Form State
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

        // Parse content
        let parsed = null;
        try {
          parsed = JSON.parse(blogData.content);
        } catch (e) {
          // If not valid JSON, create a fallback structure
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
        setSuggestedBooks((booksRes || []).slice(0, 3));
        setSuggestedVideos((videosRes || []).slice(0, 3));

      } catch (error) {
        console.error('Error fetching blog data:', error);
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchAllData();
    }
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.number) return;
    const msg = `Hi, I am ${contactForm.name}. My number is ${contactForm.number}. Please contact me regarding Vasthu.`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] dark:bg-stone-950 pt-24 flex justify-center items-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!blog || !parsedContent) return null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.cover_image],
    "datePublished": blog.created_at,
    "author": [{ "@type": "Person", "name": blog.author, "url": "https://hrvasthu.com/about" }],
    "keywords": blog.keywords || "vasthu, architecture"
  };

  const words = blog.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 225));
  const heroImage = blog.cover_image;

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950 pt-24 pb-12 font-sans selection:bg-[#C98A2E] selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#C98A2E] origin-left z-50" style={{ scaleX }} />

      <JsonLd data={articleSchema} />
      <Helmet>
        <title>{blog.title} | HR Vasthu</title>
        <meta name="description" content={blog.title} />
      </Helmet>

      <Container size="xl">
        {/* Breadcrumbs */}
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-8 flex gap-2 items-center">
          <Link to="/" className="hover:text-[#C98A2E] transition-colors">Home</Link> <span>/</span>
          <Link to="/blog" className="hover:text-[#C98A2E] transition-colors">Blog</Link> <span>/</span>
          <span className="text-[#C98A2E] truncate max-w-[200px] md:max-w-md">{blog.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* =========================================================
              MAIN CONTENT (80%)
              ========================================================= */}
          <div className="w-full lg:w-[80%] flex flex-col gap-10">
            
            {/* Hero Section */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif bg-gradient-to-r from-[#4A2C17] to-[#C98A2E] dark:from-[#C98A2E] dark:to-[#FFF9F2] bg-clip-text text-transparent leading-tight">
                {blog.title}
              </h1>

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-6">
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full">
                  <User size={14} className="text-[#C98A2E]" />
                  <span className="font-bold text-stone-800 dark:text-stone-200">{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#C98A2E]" />
                  <span className="font-medium">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#C98A2E]" />
                  <span className="font-medium">{readTime} min read</span>
                </div>
              </div>

              {heroImage && (
                <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
                  <img src={heroImage} alt="Hero" className="w-full h-auto object-contain max-h-[70vh]" />
                </div>
              )}
            </div>

            {/* Structured Cards Loop */}
            <div className="flex flex-col gap-12 mt-6">
              {parsedContent.cards && parsedContent.cards.map((card, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    key={card.id || idx} 
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-800`}
                  >
                    {/* Image Column */}
                    {card.image && (
                      <div className="w-full md:w-1/2 flex-shrink-0 relative overflow-hidden rounded-2xl shadow-md border border-stone-200 dark:border-stone-700">
                        <img src={card.image} alt={card.subtitle} className="w-full h-auto object-cover max-h-[400px] hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                      </div>
                    )}
                    
                    {/* Text Column */}
                    <div className={`w-full flex flex-col justify-center ${card.image ? 'md:w-1/2' : 'md:w-full'}`}>
                      <h3 className="text-[14px] font-bold text-[#4A2C17] dark:text-gold-400 mb-4 uppercase tracking-widest leading-relaxed">
                        {card.subtitle}
                      </h3>
                      <p className="text-[12px] text-stone-700 dark:text-stone-300 leading-loose whitespace-pre-wrap">
                        {card.text}
                      </p>
                      
                      {card.linkUrl && (
                        <div className="mt-6">
                          <a 
                            href={card.linkUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 text-[12px] font-bold text-white bg-gradient-to-r from-[#C98A2E] to-[#A66E1F] px-6 py-2.5 rounded-full hover:shadow-lg transition-all hover:scale-105"
                          >
                            {card.linkLabel || 'Read More'} <ChevronRight size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* =========================================================
              SIDEBAR (20%)
              ========================================================= */}
          <div className="w-full lg:w-[20%] flex flex-col gap-6">
            
            {/* Glimpse of Other Blogs */}
            {recentBlogs.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-md border border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-black uppercase text-[#4A2C17] dark:text-gold-400 border-b-2 border-stone-100 dark:border-stone-800 pb-2 mb-4">Latest Articles</h4>
                <div className="flex flex-col gap-5">
                  {recentBlogs.map(b => {
                    // Try to parse short text preview
                    let snippet = '';
                    try {
                      const c = JSON.parse(b.content);
                      snippet = c.cards?.[0]?.text?.substring(0, 60) || '';
                    } catch(e) { snippet = ''; }

                    return (
                      <div key={b.id} className="group flex flex-col gap-2">
                        {b.cover_image && (
                          <div className="w-full h-24 rounded-lg overflow-hidden relative shadow-sm">
                            <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                          </div>
                        )}
                        <h5 className="text-xs font-bold text-stone-900 dark:text-white leading-tight group-hover:text-gold-500 transition-colors line-clamp-2">
                          {b.title}
                        </h5>
                        {snippet && <p className="text-[10px] text-stone-500 line-clamp-2">{snippet}...</p>}
                        <Link to={`/blog/${b.slug || b.id}`} className="text-[10px] font-bold text-[#C98A2E] flex items-center mt-1 hover:underline">
                          Read Now <ChevronRight size={10} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommended Videos */}
            {suggestedVideos.length > 0 && (
              <div className="bg-stone-900 rounded-2xl p-5 shadow-xl text-white">
                <h4 className="text-sm font-black uppercase text-gold-400 border-b-2 border-stone-800 pb-2 mb-4 flex items-center gap-2">
                  <Video size={16} /> Top Shorts
                </h4>
                <div className="flex flex-col gap-4">
                  {suggestedVideos.map(v => (
                    <Link key={v.id} to={`/videos/${v.id}`} className="group relative w-full h-32 rounded-xl overflow-hidden shadow-inner">
                      <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={16} fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-[10px] font-bold truncate">{v.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Books */}
            {suggestedBooks.length > 0 && (
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 shadow-md border border-stone-100 dark:border-stone-800">
                <h4 className="text-sm font-black uppercase text-[#4A2C17] dark:text-gold-400 border-b-2 border-stone-100 dark:border-stone-800 pb-2 mb-4">Books</h4>
                <div className="flex flex-col gap-4">
                  {suggestedBooks.map(b => (
                    <a key={b.id} href={b.amazon_link} target="_blank" rel="noreferrer" className="flex gap-3 group">
                      <div className="w-12 h-16 bg-stone-100 rounded overflow-hidden shadow-sm flex-shrink-0">
                        <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[11px] font-bold line-clamp-2 group-hover:text-gold-500">{b.title}</p>
                        <span className="text-[10px] text-stone-500 font-medium">{b.language}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Contact Form */}
            <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl p-5 shadow-inner border border-stone-200 dark:border-stone-700">
              <h4 className="text-sm font-black uppercase text-[#4A2C17] dark:text-gold-400 mb-3 text-center">Quick Contact</h4>
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
                <input 
                  required type="text" placeholder="Your Name" 
                  value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:outline-none focus:border-gold-500" 
                />
                <input 
                  required type="tel" placeholder="Mobile Number" 
                  value={contactForm.number} onChange={e => setContactForm({...contactForm, number: e.target.value})}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:outline-none focus:border-gold-500" 
                />
                <button type="submit" className="w-full text-[11px] font-bold uppercase text-white bg-stone-900 dark:bg-stone-700 py-2.5 rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-2">
                  <Send size={12} /> Contact Us
                </button>
              </form>
            </div>

            {/* Social & Action Links */}
            <div className="flex flex-col gap-2">
              <a href="https://youtube.com/@hrvasthu" target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/50 p-3 rounded-xl transition-colors">
                <Video size={18} />
                <span className="text-[11px] font-bold uppercase">Subscribe YouTube</span>
              </a>
              <a href="https://instagram.com/hrvasthu" target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:hover:bg-pink-900/40 border border-pink-200 dark:border-pink-800/50 p-3 rounded-xl transition-colors">
                <Camera size={18} />
                <span className="text-[11px] font-bold uppercase">Follow Instagram</span>
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-900/20 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800/50 p-3 rounded-xl transition-colors">
                <MessageCircle size={18} />
                <span className="text-[11px] font-bold uppercase">Chat on WhatsApp</span>
              </a>
              <button onClick={() => window.open('https://wa.me/919999999999?text=I am interested in House Plans & Drawings.', '_blank')} className="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 p-3 rounded-xl transition-colors text-left">
                <Compass size={18} className="flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase leading-tight">Drawings Query</span>
              </button>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default BlogPost;

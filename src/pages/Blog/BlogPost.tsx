import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../../core/services/supabase';
import { bookService } from '../../core/services/book.service';
import { videoService } from '../../core/services/video.service';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { Calendar, User, ArrowLeft, Play, BookOpen, ChevronRight, Clock, Star, Phone, MessageCircle, Link as LinkIcon, Share2 } from 'lucide-react';
import { JsonLd } from '../../shared/components/seo/JsonLd';
import { motion, useScroll, useSpring } from 'framer-motion';

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

  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
  const [suggestedVideos, setSuggestedVideos] = useState<any[]>([]);
  const [headings, setHeadings] = useState<{ id: string, text: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        let query = supabase.from('blogs').select('*').eq('is_published', true);

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || '');
        if (isUUID) {
          query = query.eq('id', slug);
        } else {
          query = query.eq('slug', slug);
        }

        const { data: blogData, error: blogError } = await query.single();
        if (blogError) throw blogError;
        setBlog(blogData);

        // Extract headings for Table of Contents
        const headingRegex = /^##\s+(.+)$/gm;
        const matches = Array.from(blogData.content.matchAll(headingRegex));
        const extractedHeadings = matches.map((m: any) => ({
          id: m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          text: m[1]
        }));
        setHeadings(extractedHeadings);

        const keywordsList = blogData.keywords ? blogData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
        const primaryKeyword = keywordsList.length > 0 ? keywordsList[0] : '';

        const [blogsRes, booksRes, videosRes] = await Promise.all([
          supabase
            .from('blogs')
            .select('id, title, slug, cover_image')
            .eq('is_published', true)
            .neq('id', blogData.id)
            .order('created_at', { ascending: false })
            .limit(5),
          bookService.getBooks(),
          videoService.getVideos(primaryKeyword ? { searchQuery: primaryKeyword } : undefined)
        ]);

        setRecentBlogs(blogsRes.data || []);
        setSuggestedBooks((booksRes || []).slice(0, 3));
        setSuggestedVideos((videosRes || []).slice(0, 4));

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] dark:bg-stone-950 pt-24 flex justify-center items-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (!blog) return null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.cover_image],
    "datePublished": blog.created_at,
    "author": [{
      "@type": "Person",
      "name": blog.author,
      "url": "https://hrvasthu.com/about"
    }],
    "keywords": blog.keywords || "vasthu, architecture"
  };

  const keywordsList = blog.keywords ? blog.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
  const words = blog.content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / 225);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-stone-950 pt-24 pb-12 font-sans selection:bg-[#C98A2E] selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#C98A2E] origin-left z-50"
        style={{ scaleX }}
      />

      <JsonLd data={articleSchema} />
      <Helmet>
        <title>{blog.title} | HR Vasthu</title>
        <meta name="description" content={blog.content.substring(0, 160).replace(/[#*`_]/g, '')} />
        {blog.keywords && <meta name="keywords" content={blog.keywords} />}
      </Helmet>

      {/* Hero Image Section (Full width, full screen) */}
      {blog.cover_image && (
        <div className="w-full h-[calc(100vh-6rem)] bg-[#4A2C17] mb-8 flex justify-center border-b-[8px] border-[#C98A2E]">
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-full object-cover shadow-2xl"
          />
        </div>
      )}

      <Container size="xl">
        {/* Breadcrumbs */}
        <div className="text-sm text-stone-500 mb-6 flex gap-2 items-center">
          <Link to="/" className="hover:text-[#C98A2E] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#C98A2E] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-stone-800 dark:text-stone-300 font-medium truncate max-w-xs md:max-w-md">{blog.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 order-2 lg:order-1">

            {/* Magazine Title Section */}
            <div className="mb-10 pb-8 border-b border-stone-200 dark:border-stone-800">
              <h1 className="leading-tight text-[40px] md:text-[58px] text-[#4A2C17] dark:text-[#FFF9F2] font-serif font-bold mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#C98A2E]" />
                  <span className="font-medium text-stone-800 dark:text-stone-200">{readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#C98A2E]" />
                  <span className="font-medium">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#C98A2E]" />
                  <span>By <span className="font-bold text-stone-800 dark:text-stone-200">{blog.author}</span></span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 bg-white dark:bg-stone-900 w-fit px-4 py-2 rounded-lg shadow-sm border border-stone-100 dark:border-stone-800">
                <div className="flex gap-1 text-[#C98A2E]">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">Trusted by 20,000+ Families</span>
              </div>
            </div>

            {/* Rich Markdown Content */}
            <article className="prose prose-stone dark:prose-invert max-w-none 
              prose-p:text-[8px] prose-p:leading-[1.9] prose-p:text-stone-300 dark:prose-p:text-stone-100 prose-p:font-normal
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#4A2C17] dark:prose-headings:text-[#FFF9F2]
              prose-h4:text-[10px] prose-h4:font-bold
              prose-h4:text-[10px] prose-h4:mt-12 prose-h3:mb-6 prose-h3:border-b prose-h4:border-stone-200 prose-h4:pb-4 prose-h4:font-bold
              prose-h4:text-[10px] prose-h4:mt-8 prose-h3:mb-4 prose-h3:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-[#C98A2E] prose-blockquote:bg-white dark:prose-blockquote:bg-stone-900 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-md prose-blockquote:my-8 prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-stone-800 dark:prose-blockquote:text-stone-200
              prose-a:text-[#C98A2E] hover:prose-a:text-[#A66E1F] prose-a:font-semibold
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:w-full prose-img:my-10
              prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-8 prose-li:before:content-['✓'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-[#2E7D32] prose-li:before:font-bold prose-li:mb-2
            ">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ node, ...props }) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return <h6 id={id} {...props} />
                  }
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </article>

            {/* Keywords Tags */}
            {keywordsList.length > 0 && (
              <div className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800">
                <Typography variant="h4" className="mb-4 text-[#4A2C17] dark:text-[#FFF9F2]">Topics Covered</Typography>
                <div className="flex flex-wrap gap-2">
                  {keywordsList.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-full shadow-sm border border-stone-200 dark:border-stone-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Premium Sidebar (4 cols) */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-28">

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border-t-4 border-[#C98A2E]">
                  <Typography variant="h4" className="mb-4 text-[#4A2C17] dark:text-[#FFF9F2] font-serif flex items-center gap-2 text-xl">
                    Table of Contents
                  </Typography>
                  <ul className="space-y-3">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a href={`#${h.id}`} className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-[#C98A2E] flex items-start gap-2">
                          <span className="text-[#C98A2E] opacity-50">›</span> {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author Box */}
              <div className="bg-[#4A2C17] rounded-2xl p-6 shadow-xl relative overflow-hidden text-center text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#C98A2E] overflow-hidden mb-4 shadow-lg bg-stone-800">
                  <img src="https://hrvasthu.com/images/dr-hanumantha-rao.jpg" alt="Dr. Hanumantha Rao" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=HR&background=C98A2E&color=fff'} />
                </div>
                <h4 className="font-serif font-bold text-lg mb-1">{blog.author}</h4>
                <p className="text-stone-300 text-xs mb-3">25+ Years Experience in Vastu Shastra</p>
                <div className="flex justify-center gap-1 text-[#C98A2E] mb-4">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
                <button onClick={() => navigate('/about')} className="text-xs uppercase tracking-wider font-bold border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
                  View Profile
                </button>
              </div>

              {/* Social Share */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-100 dark:border-stone-800">
                <Typography variant="h5" className="mb-4 text-center">Share this article</Typography>
                <div className="flex justify-center gap-3">
                  <a href={`https://wa.me/?text=Read this: ${window.location.href}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <MessageCircle size={18} />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <Share2 size={18} fill="currentColor" className="border-none" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <Share2 size={18} />
                  </a>
                  <button onClick={copyToClipboard} className="w-10 h-10 rounded-full bg-stone-700 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Related Videos */}
              {suggestedVideos.length > 0 && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-100 dark:border-stone-800">
                  <Typography variant="h4" className="mb-5 flex items-center gap-2 text-xl font-serif text-[#4A2C17] dark:text-[#FFF9F2]">
                    Latest Videos
                  </Typography>
                  <div className="space-y-4">
                    {suggestedVideos.map((video) => (
                      <Link key={video.id} to={`/videos/${video.id}`} className="group flex gap-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative shadow-sm">
                          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <Play size={20} className="text-white drop-shadow-md" fill="white" />
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h5 className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 group-hover:text-[#C98A2E] transition-colors leading-tight">{video.title}</h5>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/videos" className="text-[#C98A2E] hover:text-[#A66E1F] text-xs font-bold uppercase tracking-wider flex justify-center mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 transition-colors">
                    View All Videos
                  </Link>
                </div>
              )}

              {/* Recommended Articles */}
              {recentBlogs.length > 0 && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-md border border-stone-100 dark:border-stone-800">
                  <Typography variant="h4" className="mb-5 text-xl font-serif text-[#4A2C17] dark:text-[#FFF9F2]">Related Articles</Typography>
                  <div className="space-y-0">
                    {recentBlogs.map((b) => (
                      <Link key={b.id} to={`/blog/${b.slug || b.id}`} className="group flex gap-3 border-b border-stone-100 dark:border-stone-800 py-4 first:pt-0 last:border-0 last:pb-0">
                        {b.cover_image && (
                          <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h5 className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 group-hover:text-[#C98A2E] transition-colors leading-snug">{b.title}</h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FFE8CC] dark:from-stone-900 dark:to-stone-800 rounded-2xl p-6 shadow-md border border-[#C98A2E]/30 text-center">
                <h3 className="font-serif font-bold text-xl text-[#4A2C17] dark:text-[#FFF9F2] mb-2">Planning Your Dream Home?</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Get Expert Vastu Consultation for Your Home, Office, Shop or Factory</p>
                <ul className="text-xs text-stone-700 dark:text-stone-300 text-left space-y-2 mb-6 mx-auto w-fit">
                  <li className="flex gap-2"><span className="text-[#C98A2E]">✓</span> Personalized Vastu Analysis</li>
                  <li className="flex gap-2"><span className="text-[#C98A2E]">✓</span> 100% Traditional Methods</li>
                  <li className="flex gap-2"><span className="text-[#C98A2E]">✓</span> Practical & Easy Remedies</li>
                </ul>
                <a href="tel:+919876543210" className="w-full block bg-[#C98A2E] hover:bg-[#A66E1F] text-white font-bold py-3 rounded-xl mb-3 shadow-md transition-colors">
                  Book Consultation
                </a>
                <a href="https://wa.me/919876543210" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-md transition-colors">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default BlogPost;

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../core/services/supabase';
import { Container } from '../../shared/components/layout/Container';
import { Spinner } from '../../shared/components/ui';
import { 
  Search, 
  Bookmark, 
  Clock, 
  Compass, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface BlogMeta {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  author: string;
  created_at: string;
  keywords?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: '✦' },
  { id: 'home', label: 'Home Vastu', icon: '🏠' },
  { id: 'road', label: 'Road Thrust & Facing', icon: '🛣️' },
  { id: 'septic', label: 'Septic & Water Sump', icon: '💧' },
  { id: 'kitchen', label: 'Kitchen & Agneya', icon: '🔥' },
  { id: 'bedroom', label: 'Master Bedroom', icon: '🛏️' },
  { id: 'pooja', label: 'Pooja Room & North-East', icon: '🕉️' },
  { id: 'remedies', label: 'Non-Demolition Remedies', icon: '🌿' },
];

const cssVars: React.CSSProperties = {
  // @ts-ignore
  '--cream': '#fff9ef',
  '--paper': '#fffdf8',
  '--ink': '#193b3a',
  '--muted': '#5c6f6d',
  '--coral': '#ff6b4a',
  '--orange': '#f59e0b',
  '--yellow': '#fbbf24',
  '--teal': '#0d9488',
  '--mint': '#10b981',
  '--purple': '#8b5cf6',
  '--border': 'rgba(25, 59, 58, 0.1)',
};

const PAGE_SIZE = 24;

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogMeta[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogMeta[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fast lightweight query: Exclude heavy 35MB `content` column to eliminate statement timeouts!
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, cover_image, author, created_at, keywords')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
      setFilteredBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    let result = blogs;

    if (selectedCategory !== 'all') {
      const catMap: Record<string, string[]> = {
        home: ['home', 'house', 'ఇల్లు', 'గృహ', 'నిర్మాణం'],
        road: ['road', 'రోడ్డు', 'వీధి', 'facing', 'పోటు'],
        septic: ['septic', 'water', 'సెప్టిక్', 'నీటి', 'బోర్', 'ట్యాంక్'],
        kitchen: ['kitchen', 'ఆగ్నేయం', 'వంటగది', 'fire', 'south-east'],
        bedroom: ['bedroom', 'నైరుతి', 'బెడ్', 'master', 'south-west'],
        pooja: ['pooja', 'ఈశాన్యం', 'పూజ', 'temple', 'north-east'],
        remedies: ['remedy', 'దోషం', 'నివారణ', 'రక్ష', 'పరిహారాలు'],
      };

      const keywords = catMap[selectedCategory] || [selectedCategory];
      result = result.filter(b => {
        const text = (b.title + ' ' + (b.keywords || '')).toLowerCase();
        return keywords.some(k => text.includes(k.toLowerCase()));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => (b.title + ' ' + (b.keywords || '')).toLowerCase().includes(q));
    }

    setFilteredBlogs(result);
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery, blogs]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedArticles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getExcerpt = (blog: BlogMeta) => {
    return `Comprehensive architectural guidance and Sthapatya Veda dimensional guidelines for ${blog.title.slice(0, 75)} by Dr. Kunchala Hanumantha Rao.`;
  };

  const featuredArticle = filteredBlogs[0];
  const popularArticles = filteredBlogs.slice(1, 5);
  const gridArticles = filteredBlogs.slice(featuredArticle && selectedCategory === 'all' && !searchQuery ? 1 : 0, visibleCount);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)] font-['DM_Sans',sans-serif] pt-24 pb-20 selection:bg-[var(--coral)] selection:text-white" style={cssVars}>
      <Helmet>
        <title>HR Vasthu Journal — 490+ Vedic Architecture Guides</title>
        <meta name="description" content="Explore complete Sthapatya Veda principles, 81-pada mandala guidelines, and non-demolition remedies by Dr. Kunchala Hanumantha Rao across 490+ research articles." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 md:px-8 border-b border-[var(--border)]">
        <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-xs">
              <Sparkles size={14} className="text-[var(--coral)]" />
              <span className="text-[var(--coral)] text-xs font-bold tracking-widest uppercase">
                ✦ 490+ ARCHITECTURAL RESEARCH GUIDES ✦
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[var(--ink)]">
              Vedic Architecture <br />
              <span className="text-[var(--coral)] italic underline decoration-[var(--yellow)] decoration-wavy decoration-2">Knowledge Hub</span>
            </h1>

            <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed max-w-xl">
              Authentic Vastu Shastra research, 2D AutoCAD site plans, and non-demolition scientific remedies documented by <strong className="text-[var(--ink)]">Dr. Kunchala Hanumantha Rao</strong>.
            </p>

            {/* Search Box */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-xl">
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search 490+ guides by topic, direction, room, or Telugu keyword..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-[var(--border)] text-sm text-[var(--ink)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--coral)]"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-3.5 rounded-full bg-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Hero Decorative Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-[40px_20px_40px_20px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Vastu Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[var(--yellow)] text-xs font-bold uppercase tracking-widest block mb-1">
                    ✦ Sthapatya Veda Geometry
                  </span>
                  <h3 className="font-['Playfair_Display'] font-bold text-lg">
                    30+ Years of Empirical Research & Spatial Science
                  </h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Navigation */}
      <Container size="xl" className="py-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs border ${
                  isActive 
                    ? 'bg-[var(--coral)] text-white border-[var(--coral)] shadow-md shadow-[var(--coral)]/20 scale-105' 
                    : 'bg-white text-[var(--ink)] border-[var(--border)] hover:border-[var(--coral)] hover:text-[var(--coral)]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Container>

      <Container size="xl" className="space-y-16">
        
        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 flex flex-col justify-center items-center gap-4">
            <Spinner size="lg" variant="primary" />
            <span className="text-sm font-semibold text-[var(--muted)]">Loading Vastu Library...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[var(--border)] p-12">
            <Compass size={48} className="mx-auto text-[var(--coral)] mb-4 animate-spin" />
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--ink)] mb-2">No Articles Found</h3>
            <p className="text-[var(--muted)] text-sm max-w-md mx-auto mb-6">
              We couldn't find any articles matching "{searchQuery}". Try another keyword or reset the category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-6 py-2.5 rounded-full bg-[var(--coral)] text-white text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Top Grid: Featured Article + Popular Articles */}
            {featuredArticle && selectedCategory === 'all' && !searchQuery && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Featured Card */}
                <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-md flex flex-col group hover:shadow-xl transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={featuredArticle.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200'}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[var(--coral)] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                      ✦ FEATURED MASTERCLASS
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="text-[var(--coral)] text-xs font-bold uppercase tracking-widest block">
                        STHAPATYA VEDA BLUEPRINT
                      </span>
                      <Link to={`/blog/${featuredArticle.slug || featuredArticle.id}`}>
                        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>
                      </Link>
                      <p className="text-[var(--muted)] text-sm md:text-base leading-relaxed line-clamp-3">
                        {getExcerpt(featuredArticle)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--ink)] text-[var(--yellow)] flex items-center justify-center font-['Playfair_Display'] font-bold text-sm">
                          HR
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-[var(--ink)]">{featuredArticle.author || 'Dr. Kunchala Hanumantha Rao'}</span>
                          <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                            <Clock size={12} /> 10 min read • 5,000+ words
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--cream)] hover:bg-[var(--coral)] text-[var(--ink)] hover:text-white font-bold text-xs transition-all border border-[var(--border)] shadow-xs"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Popular Articles Sidebar */}
                <div className="lg:col-span-5 bg-[var(--paper)] rounded-3xl p-6 md:p-8 border border-[var(--border)] shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--ink)] mb-6 flex items-center gap-2">
                      <span className="text-[var(--coral)]">★</span> Popular Publications
                    </h3>

                    <div className="divide-y divide-[var(--border)]">
                      {popularArticles.map((pop) => (
                        <Link
                          to={`/blog/${pop.slug || pop.id}`}
                          key={pop.id}
                          className="py-4 first:pt-0 last:pb-0 flex gap-4 group items-center"
                        >
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-[var(--border)]">
                            <img
                              src={pop.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300'}
                              alt={pop.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-['Playfair_Display'] text-sm font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors line-clamp-2 leading-snug">
                              {pop.title}
                            </h4>
                            <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                              <Clock size={11} /> 10 min read • 5k+ words
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] text-center">
                    <span className="text-xs text-[var(--muted)] flex items-center justify-center gap-1">
                      <ShieldCheck size={14} className="text-[var(--teal)]" /> 490+ Peer-Reviewed Articles Available
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Grid Articles Section */}
            <div id="all-articles" className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[var(--ink)]">
                  {selectedCategory === 'all' ? 'All Published Guides' : `${CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Articles'}`}
                </h3>
                <span className="text-xs font-bold text-[var(--coral)] bg-orange-100 px-3 py-1 rounded-full">
                  Showing {Math.min(gridArticles.length + (featuredArticle && selectedCategory === 'all' && !searchQuery ? 1 : 0), filteredBlogs.length)} of {filteredBlogs.length} Guides
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gridArticles.map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (idx % 8) * 0.03 }}
                    className="bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-xs hover:shadow-xl transition-all flex flex-col group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={blog.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[var(--ink)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        5,000+ WORDS
                      </div>
                      <button
                        onClick={e => toggleBookmark(blog.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[var(--ink)] hover:text-[var(--coral)] shadow-xs transition-colors cursor-pointer"
                      >
                        <Bookmark size={14} className={savedArticles.has(blog.id) ? 'fill-[var(--coral)] text-[var(--coral)]' : ''} />
                      </button>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <Link to={`/blog/${blog.slug || blog.id}`}>
                          <h4 className="font-['Playfair_Display'] text-base font-bold text-[var(--ink)] group-hover:text-[var(--coral)] transition-colors line-clamp-2 leading-snug">
                            {blog.title}
                          </h4>
                        </Link>
                        <p className="text-[var(--muted)] text-xs leading-relaxed line-clamp-2">
                          {getExcerpt(blog)}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
                        <span className="flex items-center gap-1 text-[var(--teal)] font-semibold">
                          <Layers size={12} /> 11 Sections
                        </span>
                        <Link
                          to={`/blog/${blog.slug || blog.id}`}
                          className="font-bold text-[var(--coral)] flex items-center gap-1 hover:underline"
                        >
                          Read Guide <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredBlogs.length && (
                <div className="py-10 text-center">
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="px-8 py-4 rounded-full bg-white border-2 border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)] hover:text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Load More Architectural Guides ({filteredBlogs.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </div>

            {/* Consultation Banner */}
            <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-r from-[#ffeae5] via-[#fff4e8] to-[#e6faf7] border border-[var(--coral)]/20 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <span className="text-[var(--coral)] text-xs font-bold uppercase tracking-widest block">
                  ✦ EXPERT ARCHITECTURAL AUDIT
                </span>
                <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[var(--ink)] leading-tight">
                  Need Your House Plan Audited? <br />
                  <span className="text-[var(--coral)] italic">Connect with Dr. Rao</span>
                </h3>
                <p className="text-[var(--muted)] text-sm md:text-base leading-relaxed">
                  Send your AutoCAD site plans and building elevations directly to Dr. Rao on WhatsApp for comprehensive Sthapatya Veda verification.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href="https://wa.me/919246624248?text=Hello%20Dr.%20Rao%2C%20I%20would%20like%20to%20get%20my%20house%20plan%20audited%20as%20per%20Vastu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--coral)] to-[var(--orange)] text-white text-xs font-bold uppercase tracking-wider shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Audit (+91 92466 24248)</span>
                </a>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default BlogList;

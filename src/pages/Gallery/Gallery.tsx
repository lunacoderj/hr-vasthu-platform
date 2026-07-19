import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ChevronDown, Award, FileCheck, Mic } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { GALLERY_ITEMS, FILTER_TABS, type GalleryItem } from './galleryData';
import { Lightbox } from './Lightbox';
import { supabase } from '../../core/services/supabase';
import { useTranslation } from '../../core/hooks/useTranslation';
import './gallery.css';

/* ─── Golden Dust Background ─── */
const GoldenDust: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${15 + Math.random() * 25}s`,
      delay: `${Math.random() * 10}s`,
      dx: `${(Math.random() - 0.5) * 100}px`,
      dy: `${-100 - Math.random() * 300}px`,
    })), []
  );

  return (
    <div className="golden-dust">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            left: p.left,
            top: p.top,
            '--duration': p.duration,
            '--delay': p.delay,
            '--dx': p.dx,
            '--dy': p.dy,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

/* ─── Sacred Mandala ─── */
const SacredMandala: React.FC<{ size: number; top: string; left: string; speed?: string }> = ({ size, top, left, speed = '60s' }) => (
  <div
    className="sacred-mandala"
    style={{ width: size, height: size, top, left, '--speed': speed } as React.CSSProperties}
  />
);

/* ─── Hero Section ─── */
const GalleryHero: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const { t } = useTranslation();

  return (
    <section ref={ref} className="gallery-hero" aria-label="Gallery hero">
      {/* Mandalas */}
      <SacredMandala size={600} top="-15%" left="-10%" speed="80s" />
      <SacredMandala size={400} top="60%" left="70%" speed="100s" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(212,114,10,0.3)] bg-[rgba(212,114,10,0.08)]"
        >
          <Sparkles size={14} className="text-[#d4720a]" />
          <span className="text-[#d4720a] text-xs font-semibold tracking-[0.2em] uppercase">{t('theSacredArchive')}</span>
        </motion.div>

        <motion.h1
          className="gallery-hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          {t('legacyOfExcellence')}
        </motion.h1>

        <motion.p
          className="gallery-hero-subtitle"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {t('awardsCertificationsMilestones')}
        </motion.p>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <span>{t('exploreJourney')}</span>
          <ChevronDown size={16} />
          <div className="scroll-indicator-line" />
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Filter Bar ─── */
const FilterBar: React.FC<{ active: string; onChange: (key: string) => void }> = ({ active, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap justify-center gap-3 px-4" role="tablist" aria-label="Gallery filters">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.key}
          className={`filter-pill ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
          role="tab"
          aria-selected={active === tab.key}
        >
          {tab.key === 'awards' && <Award size={14} className="inline mr-1.5 -mt-0.5" />}
          {tab.key === 'certifications' && <FileCheck size={14} className="inline mr-1.5 -mt-0.5" />}
          {tab.key === 'speeches' && <Mic size={14} className="inline mr-1.5 -mt-0.5" />}
          {tab.key === 'all' ? t('home') : 
           tab.key === 'awards' ? t('awardsHonors') : 
           tab.key === 'certifications' ? t('clientCertifications') : 
           t('lecturesSpeeches')}
        </button>
      ))}
    </div>
  );
};

/* ─── Award Card ─── */
const AwardCard: React.FC<{ item: GalleryItem; index: number; onClick: () => void }> = ({ item, index, onClick }) => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 5 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        ref={cardRef}
        className="award-card p-1"
        style={{
          transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${item.title}`}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <div className="relative overflow-hidden rounded-[20px]">
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white font-serif text-lg font-bold leading-snug">{item.title}</h3>
            <p className="text-white/50 text-xs mt-1 line-clamp-2">{item.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Certification Card ─── */
const CertCard: React.FC<{ item: GalleryItem; index: number; onClick: () => void }> = ({ item, index, onClick }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="cert-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        className="w-full object-cover"
        draggable={false}
      />
      {/* Animated stamp */}
      <div className="cert-stamp">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="rgba(212,114,10,0.6)" strokeWidth="2" strokeDasharray="4 3" />
          <path d="M16 24l5 5 11-11" stroke="rgba(212,114,10,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
};

/* ─── Speech Section ─── */
const SpeechSection: React.FC<{ item: GalleryItem; onClick: () => void }> = ({ item, onClick }) => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden" aria-label="Public speeches">
      <SacredMandala size={500} top="10%" left="75%" speed="90s" />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="cursor-pointer group"
          onClick={onClick}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src={item.src} alt={item.title} className="w-full object-cover" loading="lazy" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-500" />
            {/* Sound wave decoration */}
            <div className="absolute bottom-4 left-4 flex items-end gap-[3px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-[#d4720a]"
                  animate={{ height: [8, 16 + Math.random() * 16, 8] }}
                  transition={{ duration: 0.8 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 text-[#d4720a] text-xs font-semibold tracking-[0.2em] uppercase">
            <Mic size={14} />
            <span>{t('lecturesSpeeches')}</span>
          </div>
          <h2 className="section-heading">{t('voiceOfVastuWisdom')}</h2>
          <p className="text-stone-600 dark:text-white/50 text-lg leading-relaxed">
            {t('speechesDesc1')}
          </p>
          <p className="text-stone-500 dark:text-white/35 text-base leading-relaxed">
            {t('speechesDesc2')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   GALLERY PAGE
   ═══════════════════════════════════════ */
const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [liveItems, setLiveItems] = useState<GalleryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Fetch live items from Supabase
  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: GalleryItem[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || 'Vastu compliance asset details',
            src: item.image_url || item.cover_image,
            category: (item.category || 'all').toLowerCase() as any,
          }));
          setLiveItems(mapped);
        } else {
          setLiveItems(GALLERY_ITEMS);
        }
      } catch (err) {
        console.warn('Could not load live gallery items. Falling back to local data.', err);
        setLiveItems(GALLERY_ITEMS);
      }
    };
    fetchLiveItems();
  }, []);

  const allItems = useMemo(() => {
    return liveItems;
  }, [liveItems]);

  const filtered = useMemo(() => {
    if (filter === 'all') return allItems;
    return allItems.filter((item) => item.category === filter);
  }, [filter, allItems]);

  const awards = useMemo(() => filtered.filter((i) => i.category === 'awards'), [filtered]);
  const certs = useMemo(() => filtered.filter((i) => i.category === 'certifications'), [filtered]);
  const speeches = useMemo(() => filtered.filter((i) => i.category === 'speeches'), [filtered]);

  const openLightbox = (item: GalleryItem) => {
    const idx = filtered.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx);
  };

  return (
    <>
      <Helmet>
        <title>Gallery — HR Vasthu | Awards, Certifications & Legacy</title>
        <meta name="description" content="Explore the prestigious awards, client certifications, and speaking engagements of Dr. Kunchala Hanumantha Rao — the Vastu Jnani and Kala Samrat." />
      </Helmet>

      {/* Cosmic Background */}
      <div className="gallery-cosmos" aria-hidden="true" />
      <GoldenDust />

      <div ref={scrollRef} className="relative z-10 min-h-screen bg-transparent">
        {/* Hero */}
        <GalleryHero />

        {/* Filter Bar */}
        <section className="py-16 relative z-10">
          <FilterBar active={filter} onChange={setFilter} />
        </section>

        {/* Awards */}
        <AnimatePresence mode="wait">
          {awards.length > 0 && (
            <motion.section
              key="awards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24 relative z-10"
              aria-label="Awards and honors"
            >
              <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <Award size={20} className="text-[#d4720a]" />
                  <h2 className="section-heading text-2xl">{t('awardsHonors')}</h2>
                </div>
                <p className="text-stone-500 dark:text-white/35 text-sm max-w-xl">
                  {t('awardsHonorsSub')}
                </p>
              </div>
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {awards.map((item, idx) => (
                  <AwardCard key={item.id} item={item} index={idx} onClick={() => openLightbox(item)} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Certifications */}
        <AnimatePresence mode="wait">
          {certs.length > 0 && (
            <motion.section
              key="certs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24 relative z-10"
              aria-label="Client certifications"
            >
              <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck size={20} className="text-[#d4720a]" />
                  <h2 className="section-heading text-2xl">{t('clientCertifications')}</h2>
                </div>
                <p className="text-stone-500 dark:text-white/35 text-sm max-w-xl">
                  {t('clientCertificationsSub')}
                </p>
              </div>
              <div className="max-w-7xl mx-auto px-4 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {certs.map((item, idx) => (
                  <CertCard key={item.id} item={item} index={idx} onClick={() => openLightbox(item)} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Speech */}
        <AnimatePresence mode="wait">
          {speeches.length > 0 && speeches.map((item) => (
            <SpeechSection key={item.id} item={item} onClick={() => openLightbox(item)} />
          ))}
        </AnimatePresence>

        {/* Bottom Spacer */}
        <div className="h-24" />
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};

export default Gallery;

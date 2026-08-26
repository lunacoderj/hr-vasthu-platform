import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Compass, 
  Search, 
  Sparkles, 
  X,
  Building,
  ShieldCheck,
  Lock,
  Download,
  FileText,
  MessageCircle,
  Phone
} from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import { Spinner } from '../../shared/components/ui';
import { drawingService } from '../../core/services/drawing.service';
import { type Drawing, type FacingFilter, type PriceFilter } from '../../core/types/drawing';
import { DrawingCard } from './components/DrawingCard';
import { UnlockDrawingModal } from './components/UnlockDrawingModal';

const FACING_OPTIONS: { key: FacingFilter; label: string }[] = [
  { key: 'All', label: 'All Directions' },
  { key: 'East', label: 'East Facing' },
  { key: 'North', label: 'North Facing' },
  { key: 'West', label: 'West Facing' },
  { key: 'South', label: 'South Facing' },
  { key: 'North-East', label: 'North-East (Ishanya)' },
  { key: 'South-East', label: 'South-East (Agneya)' },
  { key: 'North-West', label: 'North-West (Vayavya)' },
  { key: 'South-West', label: 'South-West (Nairuthi)' },
];

const CATEGORY_OPTIONS = [
  'All',
  'Residential Plans',
  'Duplex House',
  'Commercial Vastu',
  'Villa Plans',
  'Apartment Layouts'
];

export const Drawings: React.FC = () => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacing, setSelectedFacing] = useState<FacingFilter>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('All');
  const [unlockingDrawing, setUnlockingDrawing] = useState<Drawing | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    setIsLoading(true);
    try {
      const data = await drawingService.getDrawings();
      setDrawings(data);
    } catch (error) {
      console.error('Failed to load drawings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered drawings computation
  const filteredDrawings = useMemo(() => {
    return drawings.filter((drawing) => {
      // Facing Filter
      const matchesFacing = 
        selectedFacing === 'All' || 
        drawing.facing?.toLowerCase().includes(selectedFacing.toLowerCase());

      // Category Filter
      const matchesCategory = 
        selectedCategory === 'All' || 
        drawing.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Price Filter
      const matchesPrice = 
        selectedPrice === 'All' || 
        (selectedPrice === 'Free' && drawing.price === 0) || 
        (selectedPrice === 'Paid' && drawing.price > 0);

      // Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        drawing.title.toLowerCase().includes(query) ||
        drawing.description.toLowerCase().includes(query) ||
        (drawing.dimensions && drawing.dimensions.toLowerCase().includes(query)) ||
        drawing.facing.toLowerCase().includes(query);

      return matchesFacing && matchesCategory && matchesPrice && matchesSearch;
    });
  }, [drawings, selectedFacing, selectedCategory, selectedPrice, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFacing('All');
    setSelectedCategory('All');
    setSelectedPrice('All');
  };

  return (
    <>
      <Helmet>
        <title>HR Vasthu Drawings, 3D Elevations & CAD Blueprints — Dr. Hanumanthu Rao</title>
        <meta 
          name="description" 
          content="Certified 100% Vastu-compliant architectural house drawings, photorealistic 3D building elevations, and downloadable CAD PDFs with instant ₹99 unlock." 
        />
      </Helmet>

      <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a0a0f] text-stone-900 dark:text-stone-100 transition-colors duration-300">
        
        {/* ═══ HERO SECTION ═══ */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-stone-200/60 dark:border-white/5">
          {/* Ambient Warm Golden Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-[#d4720a]/15 via-amber-500/10 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute -top-20 left-10 w-72 h-72 bg-[#0f766e]/10 rounded-full blur-[90px] pointer-events-none" />

          <Container size="xl">
            <div className="text-center max-w-3xl mx-auto space-y-5 relative z-10">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4720a]/15 to-amber-500/10 border border-[#d4720a]/30 shadow-sm"
              >
                <Compass size={14} className="text-[#d4720a] animate-spin-slow" />
                <span className="text-[#d4720a] text-xs font-bold tracking-widest uppercase">
                  HR Vasthu Architectural Archive
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.15]"
              >
                Vastu <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] via-amber-500 to-[#e68a1c]">House Drawings &amp; 3D Elevations</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto"
              >
                Photorealistic 3D building elevations with scientific 2D floor plans. Unlock and download complete high-resolution CAD Drawing PDFs for just <strong>₹99 via Cashfree</strong>.
              </motion.p>

              {/* Trust Strip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="pt-4 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs font-bold text-stone-600 dark:text-stone-300"
              >
                <div className="flex items-center gap-1.5">
                  <Building size={16} className="text-[#d4720a]" />
                  <span>AI 3D Building Elevations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText size={16} className="text-[#0f766e] dark:text-emerald-400" />
                  <span>₹99 Downloadable CAD PDF</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-amber-500" />
                  <span>Cashfree Verified Payments</span>
                </div>
              </motion.div>

            </div>
          </Container>
        </section>

        {/* ═══ FILTER & SEARCH TOOLBAR ═══ */}
        <section className="py-7 bg-white/70 dark:bg-[#0d0d14]/70 backdrop-blur-xl border-b border-stone-200/60 dark:border-white/5 sticky top-16 z-30 shadow-sm transition-colors">
          <Container size="xl">
            <div className="space-y-4">
              
              {/* Search & Category Selectors */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by plot size (30x40), facing, 3BHK..."
                    className="w-full pl-11 pr-10 py-3 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Categories & Reset */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>

                  {(searchQuery || selectedFacing !== 'All' || selectedCategory !== 'All') && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-[#d4720a] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X size={13} /> Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Direction Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Compass size={13} className="text-[#d4720a]" /> Facing:
                </span>
                {FACING_OPTIONS.map((facing) => {
                  const isActive = selectedFacing === facing.key;
                  return (
                    <button
                      key={facing.key}
                      onClick={() => setSelectedFacing(facing.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#d4720a] text-white shadow-md'
                          : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {facing.label}
                    </button>
                  );
                })}
              </div>

            </div>
          </Container>
        </section>

        {/* ═══ MAIN DRAWINGS GRID SECTION ═══ */}
        <section className="py-12 md:py-16">
          <Container size="xl">
            
            {/* Header info */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                  Available Vastu Architectural Plans
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Showing {filteredDrawings.length} {filteredDrawings.length === 1 ? 'drawing' : 'drawings'} • High-resolution CAD download for ₹99
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-semibold">
                <span>Architectural Hotline:</span>
                <a href="tel:+919246624248" className="text-[#d4720a] font-bold underline">
                  +91 92466 24248
                </a>
              </div>
            </div>

            {/* Grid Content */}
            {isLoading ? (
              <div className="py-32 flex flex-col justify-center items-center gap-3">
                <Spinner size="lg" variant="primary" />
                <p className="text-xs text-stone-500 font-semibold tracking-wider uppercase">
                  Loading Architectural Drawings...
                </p>
              </div>
            ) : drawings.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/5 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
                <Compass size={56} className="mx-auto mb-4 text-[#d4720a]/40 animate-spin-slow" />
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
                  No Drawings Listed Yet
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                  Certified Vastu architectural floor plans will appear here once published from the administration portal. Need a customized plan for your plot right away?
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/919246624248?text=Hello%20Dr.%20Rao,%20I%20need%20a%20custom%20Vastu%20Architectural%20Drawing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Request Custom Plan on WhatsApp
                  </a>
                  <a
                    href="tel:+919246624248"
                    className="px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Call Helpline: +91 92466 24248
                  </a>
                </div>
              </div>
            ) : filteredDrawings.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/5 rounded-3xl p-8 max-w-lg mx-auto">
                <Compass size={56} className="mx-auto mb-4 text-[#d4720a]/40" />
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  No Drawings Match Your Filters
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                  We couldn't find any Vastu plans matching your specific filters. Try searching for different dimensions or directions.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#d4720a] hover:bg-[#b86108] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredDrawings.map((drawing, index) => (
                  <motion.div
                    key={drawing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <DrawingCard 
                      drawing={drawing} 
                      onSelect={(item) => setUnlockingDrawing(item)}
                      onUnlock={(item) => setUnlockingDrawing(item)}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Custom Drawing CTA Banner */}
            <div className="mt-16 sm:mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-[#d4720a]/30 p-8 sm:p-12 text-white shadow-2xl">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[#d4720a]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4720a]/20 border border-[#d4720a]/40 text-[#d4720a] text-xs font-bold">
                  <Sparkles size={13} />
                  <span>Custom Vastu Floor Plan Drafting</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Need a Custom Plan for Your Specific Plot Coordinates?
                </h2>

                <p className="text-stone-300 text-sm leading-relaxed">
                  Have an irregular plot, specific cardinal angle, or custom floor plan requirements? Connect directly with <strong>Vasthu Siddanthi Dr. Kunchala Hanumanthu Rao</strong> for personalized CAD architectural drafting and 3D elevation renders.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <a
                    href="https://api.whatsapp.com/send?phone=919246624248&text=Hello%20Dr.%20Hanumanthu%20Rao%20garu,%20I%20need%20a%20custom%20Vastu%20drawing%20and%203D%20house%20plan%20for%20my%20plot.%20Please%20guide%20me."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Custom Plan Request</span>
                  </a>

                  <a
                    href="tel:+919246624248"
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Phone size={16} className="text-[#d4720a]" />
                    <span>Call +91 92466 24248</span>
                  </a>
                </div>
              </div>
            </div>

          </Container>
        </section>

      </div>

      {/* Unlock Modal */}
      <UnlockDrawingModal
        drawing={unlockingDrawing}
        isOpen={!!unlockingDrawing}
        onClose={() => setUnlockingDrawing(null)}
      />
    </>
  );
};

export default Drawings;

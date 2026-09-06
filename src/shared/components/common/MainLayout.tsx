import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';
import { StickyMarquee } from '../ui';
import { Phone, MessageSquare, CalendarCheck, Sparkles, Compass, X, Send, CheckCircle2, Loader2, ArrowUp, Gift, Video, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../core/services/supabase';
import { useTranslation } from '../../../core/hooks/useTranslation';
import { VastuAIAssistant } from '../ai/VastuAIAssistant';
import { FeaturedLeadPopup } from './FeaturedLeadPopup';
import { WelcomeOfferModal } from './WelcomeOfferModal';
import { OnlineConsultationModal } from './OnlineConsultationModal';

const WHATSAPP_NUMBER = '919246624248';
const PHONE_NUMBER = '+919246624248';

const CONSULT_TYPES = [
  'Residential Vastu',
  'Commercial / Business Vastu',
  'Industrial Factory Vastu',
  'Plot / Land Selection',
  'Apartment / Flat Vastu',
  'Temple / Religious Vastu',
  'House Plans & Drawings',
];

// Rotating Cloud Popup Messages with Divinity Vibes
const AI_CLOUD_MESSAGES = [
  '✨ Ask Vastu AI Anything!',
  '🧭 Have a Vastu doubt? Get Instant Answers!',
  '🕉️ Direct AI by Dr. Hanumantha Rao',
  '🏠 Instant Kitchen, Bedroom & Pooja Rules'
];

const BOOKING_CLOUD_MESSAGES = [
  '📅 Book Vastu Consultation',
  '📐 Need 100% Vastu House Plans?',
  '📞 Talk Directly with Dr. Rao',
  '🏡 Residential & Commercial Vastu'
];

const OFFER_CLOUD_MESSAGES = [
  '🎁 కేవలం ₹999/- కే ఆన్‌లైన్ వాస్తు సంప్రదింపులు + ఉచిత బుక్!',
  '⚡ ₹500 CAD డ్రాయింగ్స్ ఇప్పుడు కేవలం ₹99/- మాత్రమే (80% OFF!)',
  '🕉️ వాస్తు సిద్ధాంతి డా॥ హనుమంత రావు గారితో Video Call',
  '✨ వాస్తు పరిష్కారం ఇప్పుడు ఆన్‌లైన్‌లో! Claim Offer',
  '🏠 100% Vastu House Plans & 3D Elevations (₹99)',
  '🪔 సరైన వాస్తు... సంతోషమైన జీవితం... Claim Now!'
];

/* ─── Booking Modal ─── */
const BookingModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', consultType: CONSULT_TYPES[0] });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'confirmed'>('idle');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await supabase.from('bookings').insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        consultation_type: form.consultType,
        status: 'pending',
        source: 'website_booking_modal',
      });
    } catch {
      // Silently continue
    }

    const messageText = `*New Consultation Request*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email || 'N/A'}\n*Consultation Type:* ${form.consultType}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`, '_blank');
    setStatus('confirmed');
  };

  const handleClose = () => {
    setStatus('idle');
    setForm({ name: '', phone: '', email: '', consultType: CONSULT_TYPES[0] });
    onClose();
  };

  if (!open) return null;

  return (
    <div 
      data-modal-active="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-24 pb-8 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-md max-h-[calc(100vh-6rem)] my-auto overflow-y-auto bg-stone-900 border border-gold-500/30 rounded-3xl p-6 shadow-2xl"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {status === 'confirmed' ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 size={56} className="text-green-400 mx-auto" />
            <h3 className="text-xl font-bold font-serif text-white">Consultation Initiated</h3>
            <p className="text-sm text-stone-300">
              Your details have been registered. Opening WhatsApp to connect directly with Dr. Rao.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-stone-900 font-bold rounded-xl text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Dr. Kunchala Hanumantha Rao
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-1">Book Vastu Consultation</h2>
              <p className="text-xs text-stone-400 mt-1">Direct telephonic / on-site consultation booking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Consultation Type</label>
                <select
                  value={form.consultType}
                  onChange={(e) => setForm((prev) => ({ ...prev, consultType: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  {CONSULT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-sm shadow-lg hover:shadow-gold-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'sending' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Proceed to WhatsApp Confirmation</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ─── Drawing Request Modal Component ─── */
const DrawingRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    
    const message = `Hello Dr. Rao, I am interested in House Plans & Architectural Drawings.\n\nName: ${form.name}\nPhone: ${form.phone}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div 
      data-modal-active="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-24 pb-8 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-sm max-h-[calc(100vh-6rem)] my-auto overflow-y-auto bg-stone-900 border border-gold-500/30 rounded-3xl p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors z-20 cursor-pointer">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-3 text-gold-400">
            <Compass size={24} />
          </div>
          <h3 className="text-lg font-bold font-serif text-white">House Plans & Drawings</h3>
          <p className="text-xs text-stone-400 mt-1">Get authentic 100% Vastu-compliant architectural floor plans</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-300 mb-1">Your Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Ramesh"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-300 mb-1">Phone Number</label>
            <input 
              type="tel" 
              required
              placeholder="+91 92466 24248"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-gold-600 to-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send size={14} /> Send Query on WhatsApp
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export const MainLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [welcomeOfferOpen, setWelcomeOfferOpen] = useState(false);
  const [onlineConsultationOpen, setOnlineConsultationOpen] = useState(false);

  // Rotating Cloud Pop-up Indexes
  const [aiMsgIndex, setAiMsgIndex] = useState(0);
  const [bookingMsgIndex, setBookingMsgIndex] = useState(0);
  const [offerMsgIndex, setOfferMsgIndex] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll position for Scroll-to-Top CTA
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle Cloud Messages every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setAiMsgIndex((prev) => (prev + 1) % AI_CLOUD_MESSAGES.length);
      setBookingMsgIndex((prev) => (prev + 1) % BOOKING_CLOUD_MESSAGES.length);
      setOfferMsgIndex((prev) => (prev + 1) % OFFER_CLOUD_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsApp = useCallback(() => {
    try {
      supabase.from('bookings').insert({
        name: 'WhatsApp CTA Click',
        phone: '',
        consultation_type: 'WhatsApp Enquiry',
        status: 'whatsapp_redirect',
        source: 'floating_dock',
      });
    } catch { /* best effort */ }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Dr. Rao, I would like to enquire about Vastu consultation.')}`, '_blank');
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative bg-stone-50 dark:bg-[#0a0a0f] text-stone-900 dark:text-stone-100 overflow-x-hidden transition-colors duration-300">
      {!isMobile && <CosmicParticles />}
      {!isMobile && <MagneticCursor />}
      <Navbar />
      <main className="flex-1 flex flex-col relative z-10 pt-16">
        <Outlet />
      </main>
      <div className="hidden md:block relative z-10 pb-8">
        <Footer />
      </div>
      <StickyMarquee />
      <MobileBottomNav />

      {/* ═══════ Floating Blueprint Badge (Bottom Left - Desktop Only) ═══════ */}
      <button 
        onClick={() => setDrawingModalOpen(true)}
        className="fixed bottom-12 left-6 z-40 group cursor-pointer hidden lg:block outline-none"
      >
        <div className="flex items-center rounded-full p-1.5 pr-4 overflow-hidden w-[52px] group-hover:w-[360px] transition-all duration-500 ease-out shadow-lg border border-gold-500/30 bg-white/90 dark:bg-stone-900/90 hover:shadow-[0_0_20px_rgba(212,114,10,0.3)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-stone-800 to-stone-900 flex items-center justify-center text-gold-400 shrink-0 shadow-inner group-active:scale-95 transition-transform">
            <Compass size={20} className="group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="ml-3 text-xs font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            మీ ఇంటి ప్లాన్స్ &amp; డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును
          </span>
        </div>
      </button>

      {/* ═══════ Luxury Floating Action Dock (Bottom Right) ═══════ */}
      {/* Vertical Stacking Order (from Top to Bottom):
          1. Scroll to Top
          2. Ask Vastu AI (with animated Cloud Pop-up message)
          3. Book Consultation (with animated Cloud Pop-up message)
          4. WhatsApp Chat
          5. Call Now (at the bottom/end)
      */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-6 z-40 flex flex-col items-end gap-3">
        
        {/* 1. TOP-MOST: Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-md text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 flex items-center justify-center shadow-lg hover:border-gold-500 transition-colors cursor-pointer"
              title="Scroll to Top"
              aria-label="Scroll to Top"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* 2. SPECIAL LIMITED OFFERS (DIVINITY VIBES): Button with Animated Horizontal Cloud Message */}
        <div className="relative flex items-center">
          {/* Popping Divine Speech Bubble on the Left */}
          <div className="absolute right-full mr-3.5 pointer-events-none hidden sm:flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={offerMsgIndex}
                initial={{ scale: 0.7, opacity: 0, x: 15 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.7, opacity: 0, x: 15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="relative bg-gradient-to-r from-amber-500 via-[#d4720a] to-[#ff5436] text-white font-bold text-xs px-4 py-2 rounded-2xl shadow-[0_8px_25px_rgba(212,114,10,0.45)] whitespace-nowrap flex items-center gap-1.5 border border-amber-300/80"
              >
                {/* Right Triangle Pointer */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#ff5436] rotate-45" />
                <span>{OFFER_CLOUD_MESSAGES[offerMsgIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Offer Floating Button */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setWelcomeOfferOpen(true)}
            className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#ff5436] via-[#d4720a] to-amber-400 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(255,84,54,0.45)] border-2 border-amber-200 cursor-pointer overflow-hidden"
            title="Limited Time Special Offers (Click to Claim)"
            aria-label="Limited Time Special Offers"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Gift size={22} className="relative z-10" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 text-[8px] font-black text-stone-950 items-center justify-center">₹</span>
            </span>
          </motion.button>
        </div>

        {/* 3. ASK VASTU AI: Button with Animated Horizontal Cloud Message */}
        <div className="relative flex items-center">
          {/* Popping Speech Bubble Cloud on the Left */}
          {!aiAssistantOpen && (
            <div className="absolute right-full mr-3.5 pointer-events-none hidden sm:flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aiMsgIndex}
                  initial={{ scale: 0.7, opacity: 0, x: 15 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.7, opacity: 0, x: 15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="relative bg-gradient-to-r from-amber-500/95 via-gold-500/95 to-[#d4720a]/95 text-stone-950 font-bold text-xs px-4 py-2 rounded-2xl shadow-[0_8px_25px_rgba(212,114,10,0.35)] whitespace-nowrap flex items-center gap-1.5 border border-white/40"
                >
                  {/* Right Triangle Pointer */}
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#d4720a] rotate-45" />
                  <span>{AI_CLOUD_MESSAGES[aiMsgIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* AI Floating Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAiAssistantOpen(prev => !prev)}
            className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#d4720a] via-amber-500 to-gold-400 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(212,114,10,0.45)] border border-white/30 cursor-pointer overflow-hidden"
            title="Ask Vastu AI Assistant"
            aria-label="Ask Vastu AI Assistant"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Sparkles size={22} className="relative z-10 animate-pulse" />
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </motion.button>
        </div>

        {/* 4. BOOK CONSULTATION: Button with Animated Horizontal Cloud Message */}
        <div className="relative flex items-center">
          {/* Popping Speech Bubble Cloud on the Left */}
          <div className="absolute right-full mr-3.5 pointer-events-none hidden sm:flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={bookingMsgIndex}
                initial={{ scale: 0.7, opacity: 0, x: 15 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.7, opacity: 0, x: 15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="relative bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-gold-500/40 text-stone-900 dark:text-stone-100 font-bold text-xs px-4 py-2 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] whitespace-nowrap flex items-center gap-1.5"
              >
                {/* Right Triangle Pointer */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-stone-900 border-r border-t border-gold-500/40 rotate-45" />
                <span className="text-gold-600 dark:text-gold-400">{BOOKING_CLOUD_MESSAGES[bookingMsgIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Booking Floating Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOnlineConsultationOpen(true)}
            className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-stone-900 text-gold-400 border-2 border-gold-500/50 hover:border-gold-400 flex items-center justify-center shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer"
            title="Book Online Vastu Video Consultation (₹999)"
            aria-label="Book Online Vastu Video Consultation"
          >
            <Video size={20} />
          </motion.button>
        </div>

        {/* 5. WHATSAPP CHAT: Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-600/35 border border-green-400/30 cursor-pointer"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageSquare size={19} />
        </motion.button>

        {/* 6. AT THE END (BOTTOM): Call Now Button */}
        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-600 hover:brightness-110 text-white flex items-center justify-center shadow-lg shadow-teal-900/35 border border-emerald-400/30 cursor-pointer"
          title="Direct Call"
          aria-label="Direct Call"
        >
          <Phone size={19} />
        </motion.a>

      </div>

      {/* ═══════ Floating Intelligent Vastu AI Assistant Chat Window ═══════ */}
      <VastuAIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)} 
      />

      {/* Grand Welcome Limited Offer Pop-up */}
      <WelcomeOfferModal 
        open={welcomeOfferOpen} 
        onClose={() => setWelcomeOfferOpen(false)} 
        onOpenConsultation={() => {
          setWelcomeOfferOpen(false);
          setOnlineConsultationOpen(true);
        }}
      />

      {/* Instant ₹999 Online Vastu Consultation Checkout Modal */}
      <OnlineConsultationModal 
        isOpen={onlineConsultationOpen} 
        onClose={() => setOnlineConsultationOpen(false)} 
      />

      {/* Automatic 2-Minute Featured Lead Generation Popup */}
      <FeaturedLeadPopup />

      {/* Booking Modal */}
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      
      {/* Drawing Request Modal */}
      <AnimatePresence>
        {drawingModalOpen && (
          <DrawingRequestModal onClose={() => setDrawingModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;

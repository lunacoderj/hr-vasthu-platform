import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';
import { StickyMarquee } from '../ui';
import { Phone, MessageSquare, CalendarCheck, ArrowUp, X, Send, CheckCircle2, Loader2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../core/services/supabase';
import { useTranslation } from '../../../core/hooks/useTranslation';

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

    // Redirect to WhatsApp manually instead of background bot
    const ADMIN_WHATSAPP_NUMBER = '919246624248';
    const messageText = `*New Consultation Request*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email || 'N/A'}\n*Consultation Type:* ${form.consultType}`;
    
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`, '_blank');

    setStatus('confirmed');
  };

  const handleClose = () => {
    setStatus('idle');
    setForm({ name: '', phone: '', email: '', consultType: CONSULT_TYPES[0] });
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] booking-overlay flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="booking-modal rounded-3xl p-8 md:p-10 w-full max-w-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
            <X size={20} className="text-stone-500" />
          </button>

          {/* States */}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl clay-card-gold flex items-center justify-center">
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white">{t('bookConsultation')}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Dr. Rao's team will reach out to you</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('fullName')} *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('phoneNumber')} *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Email <span className="text-stone-400 normal-case">(optional)</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('consultationType')}</label>
                    <select
                      value={form.consultType}
                      onChange={(e) => setForm({ ...form, consultType: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                    >
                      {CONSULT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl clay-card-gold font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <Send size={16} /> {t('bookConsultation')}
                  </button>
                </form>
              </motion.div>
            )}

            {status === 'sending' && (
              <motion.div
                key="sending"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={48} className="text-gold-500" />
                </motion.div>
                <p className="mt-6 text-lg font-serif font-bold text-stone-900 dark:text-white">{t('sending')}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Connecting to Dr. Rao's team</p>
              </motion.div>
            )}

            {status === 'sent' && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                  className="w-20 h-20 rounded-full clay-card-emerald flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={36} />
                </motion.div>
                <p className="text-xl font-serif font-bold text-stone-900 dark:text-white">{t('messageSent')}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Waiting for admin confirmation...</p>
                <motion.div
                  className="mt-4 flex gap-1"
                  initial="hidden"
                  animate="visible"
                >
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gold-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {status === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full clay-card-emerald flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <p className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Confirmed!</p>
                <p className="text-stone-600 dark:text-stone-300 mt-3 max-w-xs">
                  Admin will contact you soon. Thank you for choosing <strong>HR Vasthu</strong>.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-8 px-8 py-3 rounded-xl neomorphic-btn text-sm font-bold text-stone-700 dark:text-stone-300 hover:scale-[1.03] active:scale-[0.97] transition-transform cursor-pointer"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Main Layout ─── */
export const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();

  // Floating CTA Looping Text
  const FLOATING_CTA_TEXT = [
    'Book Consultation',
    'Need House Plans?',
    'Check Your Vastu',
    'Talk to an Expert',
  ];
  const [floatingIndex, setFloatingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingIndex((prev) => (prev + 1) % FLOATING_CTA_TEXT.length);
    }, 4000); // 4 seconds so the text is fully readable
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleWhatsApp = useCallback(() => {
    // Log WhatsApp click to Supabase
    try {
      supabase.from('bookings').insert({
        name: 'WhatsApp CTA Click',
        phone: '',
        consultation_type: 'WhatsApp Enquiry',
        status: 'whatsapp_redirect',
        source: 'floating_cta',
      });
    } catch { /* best effort */ }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Dr. Rao, I would like to enquire about Vastu consultation.')}`, '_blank');
  }, []);

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

      {/* ═══════ Floating Blueprint Badge (Bottom Left) ═══════ */}
      <button 
        onClick={() => setDrawingModalOpen(true)}
        className="fixed bottom-24 md:bottom-12 left-4 md:left-6 z-50 group cursor-pointer hidden sm:block outline-none"
      >
        <div className="flex items-center glass-fab rounded-full p-1.5 pr-4 overflow-hidden w-[52px] group-hover:w-[360px] transition-all duration-500 ease-out shadow-lg border border-gold-500/30 bg-white/90 dark:bg-stone-900/90 hover:shadow-[0_0_20px_rgba(212,114,10,0.3)]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-stone-800 to-stone-900 flex items-center justify-center text-gold-400 shrink-0 shadow-inner group-active:scale-95 transition-transform">
            <Compass size={20} className="group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="ml-3 text-[11px] md:text-xs font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            మీ ఇంటి ప్లాన్స్ &amp; డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును
          </span>
        </div>
      </button>

      {/* ═══════ Absolute Floating CTA Dock ═══════ */}
      <div className="fixed bottom-24 md:bottom-12 right-4 md:right-6 z-50 flex flex-col gap-3 items-center">

        {/* Book Consultation Container */}
        <div className="relative flex items-center">
          {/* Pop-out Speech Bubble / Cloud */}
          <div className="absolute right-full mr-4 pointer-events-none flex items-center h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={floatingIndex}
                initial={{ scale: 0.5, opacity: 0, x: 20, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, x: 20, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="relative bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-gold-500/30 shadow-[0_8px_30px_rgba(212,114,10,0.15)] rounded-2xl px-5 py-3 flex items-center justify-center whitespace-nowrap"
              >
                {/* Triangle pointer to the right */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white/90 dark:bg-stone-900/90 border-r border-t border-gold-500/30 rotate-45 backdrop-blur-md" />
                
                <span className={`relative z-10 font-bold tracking-wide text-sm md:text-[15px] ${
                  FLOATING_CTA_TEXT[floatingIndex] === 'Need House Plans?' ? 'text-gold-500' : 'text-stone-800 dark:text-stone-200'
                }`}>
                  {FLOATING_CTA_TEXT[floatingIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBookingOpen(true)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white flex items-center justify-center group transition-all cursor-pointer shadow-[0_0_20px_rgba(212,114,10,0.5)] animate-pulse-slow overflow-hidden relative"
            aria-label={t('bookConsultation')}
            title={t('bookConsultation')}
          >
            {/* Sweeping shine effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine left-[-125%]" />
            <CalendarCheck size={22} className="relative z-10 shrink-0" />
          </motion.button>
        </div>

        {/* WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full glass-fab flex items-center justify-center group transition-all cursor-pointer shadow-lg"
          aria-label={t('whatsappChat')}
          title={t('whatsappChat')}
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-500/20">
            <MessageSquare size={18} className="group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>

        {/* Call Now */}
        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full glass-fab flex items-center justify-center group transition-all cursor-pointer shadow-lg"
          aria-label={t('directCall')}
          title={t('directCall')}
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Phone size={18} className="group-hover:scale-110 transition-transform" />
          </div>
        </motion.a>
      </div>

      {/* Booking Modal */}
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      
      {/* ═══════ Drawing Request Modal ═══════ */}
      <AnimatePresence>
        {drawingModalOpen && (
          <DrawingRequestModal onClose={() => setDrawingModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Drawing Request Modal Component ─── */
const DrawingRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    
    // Redirect to WhatsApp
    const message = `Hello, I am interested in House Plans & Drawings.\n\nName: ${form.name}\nPhone: ${form.phone}`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors bg-stone-100 dark:bg-stone-800 rounded-full p-2">
          <X size={20} />
        </button>
        
        <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-copper-500 rounded-full flex items-center justify-center text-white mb-6">
          <Compass size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Request House Plans</h3>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
          మీ ఇంటి ప్లాన్స్ & డ్రాయింగ్స్ వాస్తు ప్రకారం రూపొందించబడును. Enter your details to contact us on WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Your Name</label>
            <input 
              required
              type="text" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mobile Number</label>
            <input 
              required
              type="tel" 
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
              placeholder="+91 99999 99999"
            />
          </div>
          <button 
            type="submit"
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold-500 to-copper-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} />
            Continue to WhatsApp
          </button>
        </form>
      </motion.div>
    </div>
  );
};

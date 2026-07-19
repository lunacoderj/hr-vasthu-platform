import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';
import { Phone, MessageSquare, CalendarCheck, ArrowUp, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
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
      // Silently continue – best-effort database write
    }

    // Simulate network delay for animation
    setTimeout(() => setStatus('sent'), 1200);
    // Simulate admin acknowledging
    setTimeout(() => setStatus('confirmed'), 3000);
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
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();

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
      <div className="hidden md:block relative z-10">
        <Footer />
      </div>
      <MobileBottomNav />

      {/* ═══════ Absolute Floating CTA Dock ═══════ */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-6 z-50 flex flex-col gap-3 items-center">

        {/* Book Consultation */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setBookingOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full glass-fab flex items-center justify-center group transition-all cursor-pointer shadow-lg"
          aria-label={t('bookConsultation')}
          title={t('bookConsultation')}
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#d4720a] to-[#e68a1c] flex items-center justify-center text-white shadow-md shadow-[#d4720a]/20">
            <CalendarCheck size={18} className="group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>

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
    </div>
  );
};

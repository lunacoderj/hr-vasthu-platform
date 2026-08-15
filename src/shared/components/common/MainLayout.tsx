import { useState, useEffect, useCallback } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Footer, MobileBottomNav } from './index';
import CosmicParticles from '../effects/CosmicParticles';
import MagneticCursor from '../effects/MagneticCursor';
import { StickyMarquee } from '../ui';
import { Phone, MessageSquare, CalendarCheck, Sparkles, Compass, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../core/services/supabase';
import { useTranslation } from '../../../core/hooks/useTranslation';
import { VastuAIAssistant } from '../ai/VastuAIAssistant';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-md bg-stone-900 border border-gold-500/30 rounded-3xl p-6 shadow-2xl"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
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
        className="relative z-10 w-full max-w-sm bg-stone-900 border border-gold-500/30 rounded-3xl p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors">
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
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

      {/* ═══════ Harmonized Luxury Floating Action Dock (Bottom Right) ═══════ */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-6 z-50 flex items-center gap-2.5">
        {/* Direct WhatsApp Consultation */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-600/30 border border-green-400/30 cursor-pointer"
          title="Chat on WhatsApp"
        >
          <MessageSquare size={18} />
        </motion.button>

        {/* Direct Call Button */}
        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 border border-emerald-400/30 cursor-pointer"
          title="Direct Call"
        >
          <Phone size={18} />
        </motion.a>

        {/* Book Appointment CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setBookingOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-3 bg-stone-900 text-white border border-gold-500/40 rounded-full shadow-lg hover:border-gold-500 text-xs font-bold transition-all cursor-pointer"
        >
          <CalendarCheck size={16} className="text-gold-400" />
          <span>Book Appointment</span>
        </motion.button>
      </div>

      {/* ═══════ Floating Intelligent Vastu AI Assistant Chat Window ═══════ */}
      <VastuAIAssistant />

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

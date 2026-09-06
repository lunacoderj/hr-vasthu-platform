import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  Gift,
  Video,
  Flame,
  Award
} from 'lucide-react';

const WELCOME_OFFER_KEY = 'hrv_welcome_offer_seen_v1';

interface WelcomeOfferModalProps {
  open?: boolean;
  onClose?: () => void;
  onOpenConsultation?: () => void;
}

export const WelcomeOfferModal: React.FC<WelcomeOfferModalProps> = ({
  open: controlledOpen,
  onClose: controlledOnClose,
  onOpenConsultation,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const location = useLocation();

  const isControlled = typeof controlledOpen === 'boolean';
  const isOpen = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (isControlled) return;

    // Don't show if already seen in localStorage
    const hasSeen = localStorage.getItem(WELCOME_OFFER_KEY);
    if (hasSeen) return;

    // Immersion routes check
    const p = location.pathname.toLowerCase();
    if (
      p.startsWith('/shorts') || 
      p.startsWith('/video/') || 
      p.startsWith('/videos/') ||
      p.startsWith('/books/') ||
      p.startsWith('/privacy') ||
      p.startsWith('/terms')
    ) {
      return;
    }

    // Trigger politely after 3.5 seconds on initial landing
    const timer = setTimeout(() => {
      setInternalOpen(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [location.pathname, isControlled]);

  const handleDismiss = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
    try {
      localStorage.setItem(WELCOME_OFFER_KEY, 'true');
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        data-modal-active="true"
        className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-24 pb-8 overflow-y-auto bg-black/85 backdrop-blur-md font-['DM_Sans',sans-serif]"
      >
        {/* Backdrop click dismiss */}
        <div className="fixed inset-0" onClick={handleDismiss} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-[96vw] sm:w-[92vw] md:w-[86vw] lg:w-[82vw] max-w-5xl max-h-[calc(100vh-6rem)] md:max-h-[820px] bg-stone-900 border-2 border-amber-400/80 rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col my-auto text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Vedic Announcement Ribbon */}
          <div className="bg-gradient-to-r from-[#ff5436] via-[#d4720a] to-[#0f766e] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <Sparkles size={16} className="text-yellow-200 animate-pulse" />
              <span>✦ మీ ఇంటికి శాంతి, శుభం, సంపద కావాలా? • ప్రత్యేక ఆఫర్</span>
              <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                LIMITED PERIOD DEAL
              </span>
            </div>
            
            {/* Prominent Close Button */}
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all cursor-pointer shadow-md hover:scale-105"
              title="Close Offer (Esc)"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            
            {/* Header Title Section */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Compass size={13} className="text-[#d4720a]" />
                <span>వాస్తు సిద్ధాంతి డా॥ కుంచాల హనుమంత రావు గారిచే ప్రత్యక్ష పరిష్కారం</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                వాస్తు పరిష్కారం — <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-[#d4720a]">ఇప్పుడు ఆన్‌లైన్‌లో!</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                సరైన వాస్తు... సంతోషమైన జీవితం... • వాస్తు జ్ఞాని, వాస్తు కళా సామ్రాట్ అవార్డుల గ్రహీత
              </p>
            </div>

            {/* 2 High-Converting Offer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
              
              {/* ═══ OFFER 1: ₹999 ONLINE VASTU CONSULTATION (FEATURED) ═══ */}
              <div className="relative rounded-3xl bg-gradient-to-b from-stone-800/90 to-stone-900 border-2 border-amber-400/60 p-5 sm:p-6 flex flex-col justify-between shadow-xl overflow-hidden group">
                {/* Popular Badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ff5436] to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Flame size={12} className="fill-white" /> MOST POPULAR
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                    <Video size={24} />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                      1-on-1 Online Vastu Consultation
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold mt-0.5">
                      WhatsApp Video Call లేదా Google Meet ద్వారా ప్రత్యక్షంగా
                    </p>
                  </div>

                  {/* Bullet Points from Dr. Rao Poster */}
                  <ul className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>మీ ఇంట్లో ఎటువంటి వాస్తు దోషాలు ఉన్నా పూర్తి పరిష్కారం</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>మీరు కట్టబోయే బిల్డింగ్ &amp; డ్రాయింగ్స్ పరిశీలన</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>డాక్టర్ రావు గారితో ముఖాముఖి వీడియో కాల్ సంభాషణ</span>
                    </li>
                  </ul>

                  {/* Complimentary Gift Box */}
                  <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Gift size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">
                        🎁 ఉచిత కాంప్లిమెంటరీ గిఫ్ట్ (FREE)
                      </span>
                      <span className="text-xs text-stone-200">
                        ₹500 విలువైన <strong>వాస్తు బుక్ PDF ఫైల్</strong> ఉచితంగా లభించును
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-5 border-t border-white/10 mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Consultation Fee</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm line-through text-stone-400 font-normal">₹3,000</span>
                        <span className="text-2xl font-black text-amber-400 font-serif">₹999/-</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                          67% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {onOpenConsultation ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleDismiss();
                        onOpenConsultation();
                      }}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-[#d4720a] to-[#ff5436] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer text-center"
                    >
                      <Video size={16} />
                      <span>Book Video Consultation (₹999)</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <Link
                      to="/appointment"
                      onClick={handleDismiss}
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-[#d4720a] to-[#ff5436] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer text-center"
                    >
                      <Video size={16} />
                      <span>Book Video Consultation (₹999)</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>

              {/* ═══ OFFER 2: ₹99 VASTU CAD DRAWING PACKS (80% OFF) ═══ */}
              <div className="relative rounded-3xl bg-stone-800/60 border border-white/10 p-5 sm:p-6 flex flex-col justify-between shadow-xl overflow-hidden group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-400/30">
                    <Layers size={24} />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                      100% Vastu House Drawings &amp; 3D Elevations
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      38+ శాస్త్రీయ ఆర్కిటెక్చరల్ CAD బ్లూప్రింట్ ప్యాక్‌లు
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>ఈస్ట్, నార్త్, వెస్ట్, సౌత్ అన్ని దిశల హౌస్ ప్లాన్స్</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>Photorealistic 3D ఎలివేషన్స్ &amp; 2D వర్కింగ్ డ్రాయింగ్స్</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>తక్షణ డౌన్‌లోడ్ &amp; వాట్సాప్ CAD PDF డెలివరీ</span>
                    </li>
                  </ul>

                  <div className="p-3 rounded-2xl bg-stone-900/80 border border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide block">
                        Digital Library eBooks
                      </span>
                      <span className="text-xs text-stone-300">
                        విజయబాట వాస్తు గ్రంథాలు కూడా కేవలం <span className="line-through text-stone-500">₹500</span> <strong>₹99/- మాత్రమే</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-5 border-t border-white/10 mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">CAD Drawing Pack</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm line-through text-stone-400 font-normal">₹500</span>
                        <span className="text-2xl font-black text-white font-serif">₹99/-</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                          80% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/drawings"
                    onClick={handleDismiss}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center"
                  >
                    <Layers size={16} />
                    <span>Claim Drawing Pack (₹99)</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Direct Contact Strip */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Award size={16} className="text-amber-400 shrink-0" />
                <span>ప్రత్యక్ష సంప్రదింపుల కొరకు: <strong>+91 92466 24248</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:+919246624248"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={13} />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/919246624248?text=Hello%20Dr.%20Rao%20garu,%20I%20would%20like%20to%20claim%20the%20special%20online%20Vastu%20consultation%20offer%20(Rs.999)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeOfferModal;

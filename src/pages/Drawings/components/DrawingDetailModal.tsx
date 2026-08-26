import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Compass, 
  Layers, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ShieldCheck,
  Share2,
  Download,
  Lock,
  Building,
  FileText
} from 'lucide-react';
import { type Drawing } from '../../../core/types/drawing';
import { cashfreeService } from '../../../core/services/cashfree.service';

interface DrawingDetailModalProps {
  drawing: Drawing | null;
  onClose: () => void;
  onUnlock: (drawing: Drawing) => void;
}

export const DrawingDetailModal: React.FC<DrawingDetailModalProps> = ({ drawing, onClose, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!drawing) return null;

  const isUnlocked = cashfreeService.isDrawingUnlocked(drawing.id);
  const price = drawing.price || 99;

  const whatsappMessage = `Hello Vasthu Siddanthi Dr. Hanumanthu Rao garu,
I am interested in the Vastu architectural drawing:
*Title:* ${drawing.title}
*Facing:* ${drawing.facing} Facing
*Dimensions:* ${drawing.dimensions}
*Configuration:* ${drawing.bedrooms || 'N/A'} · ${drawing.floors || 'N/A'}
*Price:* ₹${price}

Please guide me on custom modification and implementation for my plot.`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=919246624248&text=${encodeURIComponent(whatsappMessage)}`;

  const handleDownload = () => {
    if (isUnlocked) {
      const pdf = drawing.pdfUrl || drawing.imageUrl || drawing.blurredPreviewPath || '';
      const link = document.createElement('a');
      link.href = pdf;
      link.target = '_blank';
      link.download = `${drawing.title.replace(/[^a-zA-Z0-9]/g, '_')}_Vastu_Plan.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      onUnlock(drawing);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: drawing.title,
        text: `Vastu Floor Plan & 3D Building: ${drawing.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentDisplayImage = 
    activeTab === '3d' 
      ? (drawing.constructedImageUrl || drawing.imageUrl) 
      : drawing.imageUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative max-w-5xl w-full bg-white dark:bg-[#0e0e14] border border-stone-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-white/10 flex items-center justify-between bg-stone-50/80 dark:bg-[#15151e]/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#d4720a] to-[#e68a1c] text-white shadow-md">
                <Compass size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4720a]">
                  HR Vasthu Drawing &amp; 3D Elevation
                </span>
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white line-clamp-1">
                  {drawing.title}
                </h2>
              </div>
            </div>

            {/* Switcher & Controls */}
            <div className="flex items-center gap-2">
              {/* 3D vs 2D Toggle */}
              <div className="flex bg-stone-200/60 dark:bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === '3d' 
                      ? 'bg-amber-500 text-stone-950 shadow-sm' 
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <Building size={12} /> 3D Elevation
                </button>
                <button
                  onClick={() => setActiveTab('2d')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeTab === '2d' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <Layers size={12} /> 2D Blueprint
                </button>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition-colors"
                title="Share Drawing"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Image Canvas / Blueprint View */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center group">
              <img
                src={currentDisplayImage}
                alt={drawing.title}
                className={`w-full transition-all duration-300 ${
                  isZoomed ? 'object-contain max-h-[80vh] scale-125' : 'object-contain max-h-[48vh] sm:max-h-[52vh]'
                }`}
              />

              {/* Blueprint Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-transform hover:scale-105 shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                {isZoomed ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">{isZoomed ? 'Normal View' : 'Zoom Visual'}</span>
              </button>

              {/* Watermark / Badge */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white flex items-center gap-2">
                <ShieldCheck size={14} className="text-gold-400" />
                <span className="font-semibold">
                  {activeTab === '3d' ? '3D Constructed Building Render' : 'Vedic Certified CAD Blueprint'}
                </span>
              </div>
            </div>

            {/* Main Specs & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Description */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white mb-2">
                    Drawing Overview &amp; Architectural Specifications
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {drawing.description || 'Authentic Vastu-compliant architectural floor plan drafted with sacred Vedic geometry calculations and photorealistic 3D building visualization.'}
                  </p>
                </div>

                {/* Key Vastu Room Placements */}
                <div className="bg-stone-50 dark:bg-white/[0.03] border border-stone-200/80 dark:border-white/5 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4720a]">
                    <Sparkles size={14} />
                    <span>Sacred Vastu Orientations &amp; Pada Alignment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/50 dark:border-white/5">
                      <span className="text-stone-400 block text-[10px] font-bold uppercase">Main Entrance (Simha Dwaram)</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{drawing.facing} Facing Auspicious Pada</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/50 dark:border-white/5">
                      <span className="text-stone-400 block text-[10px] font-bold uppercase">Pooja Mandir</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{drawing.vastuZones?.pooja || 'North-East (Ishanya)'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/50 dark:border-white/5">
                      <span className="text-stone-400 block text-[10px] font-bold uppercase">Kitchen (Agni Sthanam)</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{drawing.vastuZones?.kitchen || 'South-East (Agneya)'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/50 dark:border-white/5">
                      <span className="text-stone-400 block text-[10px] font-bold uppercase">Master Bedroom</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{drawing.vastuZones?.masterBedroom || 'South-West (Nairuthi)'}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-stone-200/50 dark:border-white/5 sm:col-span-2">
                      <span className="text-stone-400 block text-[10px] font-bold uppercase">Brahmasthan &amp; Water Element</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{drawing.vastuZones?.brahmasthan || 'Open & Uncluttered Center Zone'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Download PDF & Cashfree Unlock Card */}
              <div className="space-y-4">
                <div className="bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-[#161622] dark:to-[#111118] border border-[#d4720a]/20 rounded-2xl p-5 space-y-4 shadow-md">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                      Downloadable Drawing CAD PDF
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      {isUnlocked ? (
                        <span className="text-2xl font-serif font-bold text-emerald-500">
                          UNLOCKED
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-serif font-bold text-[#d4720a]">
                            ₹{price}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">via Cashfree</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span>Dimensions: <strong>{drawing.dimensions}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span>Facing: <strong>{drawing.facing} Direction</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span>Config: <strong>{drawing.bedrooms || '2 BHK'} · {drawing.floors || 'Ground'}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span>Includes: <strong>High-Res CAD Drawing PDF</strong></span>
                    </li>
                  </ul>

                  {/* Main Cashfree Unlock / Download CTA */}
                  <button
                    onClick={handleDownload}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                        : 'bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Download size={18} />
                        <span>Download Drawing PDF Now</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Unlock &amp; Download PDF (₹{price})</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Support CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href="tel:+919246624248"
                    className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-white/5 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={14} className="text-[#d4720a]" />
                    <span>Call: +91 92466 24248</span>
                  </a>
                </div>

                {copied && (
                  <p className="text-center text-xs text-emerald-500 font-bold">
                    Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DrawingDetailModal;

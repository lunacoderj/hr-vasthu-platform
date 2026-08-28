import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Compass, 
  ArrowLeft, 
  Lock, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Layers, 
  Building, 
  Maximize2,
  Calendar,
  Check,
  FileText,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import { Spinner } from '../../shared/components/ui';
import { drawingService } from '../../core/services/drawing.service';
import { type Drawing } from '../../core/types/drawing';
import { DRAWING_BUNDLES, type DrawingBundleItem } from '../../core/data/drawing-bundles';
import { UnlockDrawingModal } from './components/UnlockDrawingModal';

export const DrawingDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [bundleData, setBundleData] = useState<DrawingBundleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      loadDrawing(slug);
    }
  }, [slug]);

  const loadDrawing = async (slugOrId: string) => {
    setIsLoading(true);
    try {
      const data = await drawingService.getDrawingBySlug(slugOrId);
      setDrawing(data);

      const matchedBundle = DRAWING_BUNDLES.find(
        b => b.slug === slugOrId || b.id === slugOrId || (data && b.plotSize === (data as any).plotSize)
      );
      setBundleData(matchedBundle || null);
    } catch (err) {
      console.error('Failed to load drawing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a0a0f] pt-32 pb-20 flex flex-col justify-center items-center gap-4 font-['DM_Sans',sans-serif]">
        <Spinner size="lg" variant="primary" />
        <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
          Loading Vastu Architectural Blueprint...
        </p>
      </div>
    );
  }

  if (!drawing) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a0a0f] pt-32 pb-20 font-['DM_Sans',sans-serif]">
        <Container size="md">
          <div className="text-center py-20 bg-white dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 rounded-3xl p-8">
            <Compass size={48} className="mx-auto mb-4 text-[#d4720a]" />
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
              Drawing Not Found
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-sm mx-auto">
              The requested architectural house plan may have been archived or moved.
            </p>
            <Link
              to="/drawings"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4720a] text-white text-xs font-bold shadow-md hover:bg-[#b86108] transition-all"
            >
              <ArrowLeft size={14} /> Back to Drawings Archive
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const price = drawing.price || 99;
  const currentImage = activeTab === '3d' ? drawing.aiPreviewPath : drawing.blurredPreviewPath;
  const drawingFiles = bundleData?.files || [];

  const whatsappUrl = `https://api.whatsapp.com/send?phone=919246624248&text=${encodeURIComponent(
    `Hello Dr. Hanumanthu Rao garu, I am reviewing the Vastu drawing: "${drawing.title}" (${drawing.facing} Facing, Price: ₹${price}). Please share more details.`
  )}`;

  return (
    <>
      <Helmet>
        <title>{drawing.title} — 100% Vastu House Plan | HR Vasthu</title>
        <meta name="description" content={drawing.description || `${drawing.title} certified Vastu blueprint with 3D elevation and CAD download.`} />
      </Helmet>

      <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a0a0f] text-stone-900 dark:text-stone-100 pt-28 pb-20 font-['DM_Sans',sans-serif]">
        
        {/* Navigation Breadcrumb */}
        <div className="border-b border-stone-200/70 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md sticky top-16 z-20">
          <Container size="xl">
            <div className="py-3 flex items-center justify-between text-xs">
              <Link
                to="/drawings"
                className="inline-flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-[#d4720a] dark:hover:text-[#d4720a] font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>All Drawings Archive</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-[#0f766e] dark:text-emerald-400 font-bold uppercase tracking-wider">
                  {drawing.facing} Facing
                </span>
                <span>•</span>
                <span className="text-stone-500 font-mono">
                  {drawing.dimensions || `${drawing.plotWidth}×${drawing.plotLength} ft`}
                </span>
              </div>
            </div>
          </Container>
        </div>

        <Container size="xl" className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ═══ LEFT COLUMN: 3D VISUAL & SECURE PROTECTED BLUEPRINT ═══ */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Media Preview Frame (Anti-Theft Protected) */}
              <div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-950 border border-stone-200/80 dark:border-white/10 shadow-2xl group select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* 1. Underlying Image Element (Non-draggable, Select-none) */}
                <img
                  src={currentImage}
                  alt={drawing.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className={`w-full h-full object-cover transition-all duration-500 select-none pointer-events-none ${
                    activeTab === '2d' 
                      ? 'blur-[24px] scale-115 opacity-65' 
                      : ''
                  }`}
                />

                {/* 2. Invisible Transparent Anti-Theft Shield (Captures all clicks & right-clicks) */}
                <div 
                  className="absolute inset-0 z-20 bg-transparent select-none cursor-default"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* 3. Security Watermark Ribbon on Blueprint */}
                {activeTab === '2d' && (
                  <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center overflow-hidden">
                    <div className="rotate-[-25deg] text-amber-300/30 font-black text-lg md:text-2xl uppercase tracking-[0.25em] select-none text-center whitespace-nowrap drop-shadow-md">
                      ✦ HR VAASTHU COPYRIGHT • PURCHASE TO DOWNLOAD HIGH-RES CAD ✦
                    </div>
                  </div>
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10" />

                {/* Direction Compass Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-2 shadow-lg z-30">
                  <Compass size={14} className="text-[#d4720a] animate-spin-slow" />
                  <span>{drawing.facing} Facing Vastu Plan</span>
                </div>

                {/* 3D vs 2D Blurred Switcher */}
                <div className="absolute bottom-4 left-4 flex bg-black/75 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl z-30">
                  <button
                    type="button"
                    onClick={() => setActiveTab('3d')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === '3d'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Building size={13} />
                    <span>3D Conceptual Elevation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('2d')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === '2d'
                        ? 'bg-[#0f766e] text-white shadow-md'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Lock size={12} />
                    <span>90% Blurred Blueprint</span>
                  </button>
                </div>

                {/* 90% Blurred Blueprint Lock Overlay */}
                {activeTab === '2d' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 pointer-events-none z-25">
                    <div className="p-4 rounded-full bg-black/80 backdrop-blur-md border-2 border-amber-400 text-amber-400 shadow-2xl mb-3 transform scale-110">
                      <Lock size={32} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-white drop-shadow-md">
                      Protected Sthapatya Veda Drawing
                    </span>
                    <p className="text-xs text-amber-300 font-bold max-w-xs mt-1.5">
                      90% Blurred Preview • Unlock Full High-Res CAD Pack for ₹{price}
                    </p>
                  </div>
                )}
              </div>

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 text-center">
                  <ShieldCheck size={20} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 block">
                    100% Vastu Tested
                  </span>
                  <span className="text-[10px] text-stone-500">Dr. Rao Certified</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 text-center">
                  <Download size={20} className="mx-auto text-[#d4720a] mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 block">
                    Instant CAD Download
                  </span>
                  <span className="text-[10px] text-stone-500">Full Unlocked Pack</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/5 text-center">
                  <Building size={20} className="mx-auto text-amber-500 mb-1" />
                  <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 block">
                    Photorealistic 3D
                  </span>
                  <span className="text-[10px] text-stone-500">Conceptual Elevation</span>
                </div>
              </div>

              {/* ═══ INCLUDED DRAWING SHEETS BREAKDOWN (PROTECTED WITH SHIELDS) ═══ */}
              {drawingFiles.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#111118] border border-stone-200 dark:border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-[#d4720a]" />
                        <span>Included Drawing Sheets ({drawingFiles.length} Plans)</span>
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Technical drawings are protected by copyright. Unlock to download the full unblurred CAD pack.
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      All for ₹{price}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {drawingFiles.map((file, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setIsUnlockModalOpen(true);
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`relative rounded-2xl overflow-hidden border p-3 flex gap-3 items-center transition-all select-none ${
                          idx === 0 
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 hover:border-amber-500 cursor-pointer' 
                            : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 hover:border-amber-500/50 cursor-pointer'
                        }`}
                      >
                        {/* Thumbnail with Transparent Anti-Theft Shield */}
                        <div 
                          className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <img 
                            src={file.previewUrl} 
                            alt={file.label}
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            className="w-full h-full object-cover blur-[14px] scale-125 opacity-60 select-none pointer-events-none"
                          />
                          {/* Invisible shield */}
                          <div 
                            className="absolute inset-0 z-10 bg-transparent select-none" 
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
                            <Lock size={16} className="text-amber-400" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Lock size={9} /> Protected CAD Sheet
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-stone-900 dark:text-white mt-1 truncate">
                            {file.label}
                          </h4>
                          <span className="text-[10px] text-stone-500">
                            Click to unlock HD drawing (₹{price})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ═══ RIGHT COLUMN: SPECIFICATIONS & UNLOCK ACTION ═══ */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Header Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111118] border border-stone-200 dark:border-white/10 shadow-xl space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4720a]/15 text-[#d4720a] text-xs font-bold">
                  <Sparkles size={12} />
                  <span>HR Vasthu Architectural Series</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white leading-tight">
                  {drawing.title}
                </h1>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {drawing.description}
                </p>

                {/* Plot Specs Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Plot Dimensions</span>
                    <span className="text-sm font-bold text-stone-900 dark:text-white font-mono">
                      {drawing.dimensions || `${drawing.plotWidth}×${drawing.plotLength} ft`}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Cardinal Direction</span>
                    <span className="text-sm font-bold text-[#d4720a]">
                      {drawing.facing} Facing
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Bedrooms / BHK</span>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {drawing.bedrooms || '2 BHK'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Floors</span>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {drawing.floors || 'Ground Floor'}
                    </span>
                  </div>
                </div>

                {/* Unlock Action Area */}
                <div className="pt-4 border-t border-stone-200 dark:border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Complete CAD Download
                      </span>
                      <span className="text-2xl font-serif font-black text-stone-900 dark:text-white">
                        ₹{price} <span className="text-xs font-normal text-stone-400">One-Time Fee</span>
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Instant Access
                    </span>
                  </div>

                  <button
                    onClick={() => setIsUnlockModalOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock size={16} />
                    <span>Unlock Full Drawing Pack (₹{price})</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Direct Consultation (+91 92466 24248)</span>
                  </a>
                </div>

              </div>

              {/* Vastu Purusha Features Checklist */}
              {drawing.vastuFeatures && drawing.vastuFeatures.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#111118] border border-stone-200 dark:border-white/10 space-y-3">
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white flex items-center gap-2">
                    <Compass size={18} className="text-[#d4720a]" />
                    <span>Authentic Vastu Purusha Alignment</span>
                  </h3>
                  <div className="space-y-2 pt-1">
                    {drawing.vastuFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </Container>

      </div>

      {/* Smart Responsive Unlock Modal */}
      <UnlockDrawingModal
        drawing={drawing}
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
      />
    </>
  );
};

export default DrawingDetail;

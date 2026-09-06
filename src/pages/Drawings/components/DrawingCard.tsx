import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Building, 
  Layers,
  FileText,
  Eye,
  CheckCircle2,
  Check
} from 'lucide-react';
import { type Drawing } from '../../../core/types/drawing';

interface DrawingCardProps {
  drawing: Drawing;
  onSelect: (drawing: Drawing) => void;
  onUnlock: (drawing: Drawing) => void;
}

export const DrawingCard: React.FC<DrawingCardProps> = ({ drawing, onSelect, onUnlock }) => {
  const navigate = useNavigate();
  const [activeViewMode, setActiveViewMode] = useState<'3d' | '2d'>('3d');
  const price = drawing.price || 99;

  const handleCardClick = () => {
    navigate(`/drawings/${drawing.slug || drawing.id}`);
  };

  const currentDisplayImage = activeViewMode === '3d'
    ? (drawing.aiPreviewPath || drawing.imageUrl)
    : (drawing.blurredPreviewPath || drawing.imageUrl);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full bg-[#fdfcf9] dark:bg-[#111118] border border-stone-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#d4720a]/40 dark:hover:border-[#d4720a]/40 transition-all duration-300"
    >
      {/* ═══ 1. VISUAL HERO (3D AI VISUAL vs 90% BLURRED 2D BLUEPRINT) ═══ */}
      <div 
        className="relative aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={currentDisplayImage}
          alt={drawing.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            activeViewMode === '2d' 
              ? 'blur-[22px] scale-115 opacity-65 select-none pointer-events-none' 
              : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Direction Badge */}
        <div className="absolute top-3.5 left-3.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-md">
          <Compass size={13} className="text-[#d4720a] animate-spin-slow" />
          <span>{drawing.facing} Facing</span>
        </div>

        {/* Price Tag Badge */}
        <div className="absolute top-3.5 right-3.5">
          <span className="bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5">
            <span className="line-through text-amber-200/80 font-normal text-[10px]">₹500</span>
            <Lock size={11} /> ₹{price}
          </span>
        </div>

        {/* 90% Blurred Blueprint Lock Watermark Overlay */}
        {activeViewMode === '2d' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-xs pointer-events-none text-center">
            <div className="p-3 rounded-full bg-black/75 border border-amber-400 text-amber-400 shadow-2xl mb-1.5 transform scale-110">
              <Lock size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white drop-shadow-md">
              Protected Sthapatya Veda Plan
            </span>
            <span className="text-[10px] text-amber-300 font-bold mt-0.5">
              90% Blurred Blueprint • Unlock for ₹{price}
            </span>
          </div>
        )}

        {/* 3D vs 2D Blurred Switcher Pill */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute bottom-3.5 left-3.5 flex bg-black/70 backdrop-blur-md p-0.5 rounded-xl border border-white/20 shadow-md z-10"
        >
          <button
            type="button"
            onClick={() => setActiveViewMode('3d')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeViewMode === '3d' 
                ? 'bg-amber-500 text-stone-950 shadow-sm' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Building size={11} /> 3D Elevation
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('2d')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeViewMode === '2d' 
                ? 'bg-[#0f766e] text-white shadow-sm' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Lock size={10} /> 90% Blurred Plan
          </button>
        </div>

        {/* View Details Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="absolute bottom-3.5 right-3.5 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all transform hover:scale-110 shadow-lg cursor-pointer z-10"
          title="View Full Drawing Details"
        >
          <Eye size={15} />
        </button>
      </div>

      {/* ═══ 2. CARD CONTENT & SPECS ═══ */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Plot Size & Category Pill */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#0f766e] dark:text-emerald-400 uppercase tracking-wider">
              {drawing.category || 'Vastu Plan'}
            </span>
            <span className="bg-stone-100 dark:bg-white/5 px-2.5 py-0.5 rounded-lg border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 font-mono">
              {drawing.dimensions || `${drawing.plotWidth}×${drawing.plotLength} ft`}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={handleCardClick}
            className="font-serif font-bold text-base text-stone-900 dark:text-white leading-snug line-clamp-2 hover:text-[#d4720a] dark:hover:text-[#d4720a] transition-colors cursor-pointer"
            title={drawing.title}
          >
            {drawing.title}
          </h3>

          {/* Short Vasthu Description */}
          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {drawing.description || 'Authentic Vedic Vastu layout designed by Master Dr. Kunchala Hanumanthu Rao with scientific Ayadi measurements.'}
          </p>

          {/* Key Vastu highlights preview */}
          {drawing.vastuFeatures && drawing.vastuFeatures.length > 0 && (
            <div className="space-y-1 pt-1">
              {drawing.vastuFeatures.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                  <Check size={12} className="text-[#0f766e] dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ 3. SPECS STRIP & UNLOCK CTA ═══ */}
        <div className="pt-3 border-t border-stone-200/80 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#d4720a]" />
              <span>{drawing.bedrooms || '2 BHK'}</span>
              <span>•</span>
              <span>{drawing.floors || 'Ground Floor'}</span>
            </div>
            <span className="text-[11px] text-[#0f766e] dark:text-emerald-400 font-bold flex items-center gap-1">
              <FileText size={12} /> Instant CAD Download
            </span>
          </div>

          {/* ₹99 UNLOCK DRAWING CTA BUTTON */}
          <button
            onClick={() => onUnlock(drawing)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Lock size={14} />
            <span>Pay <span className="line-through opacity-75 font-normal">₹500</span> ₹{price} &amp; Unlock Pack</span>
            <ArrowRight size={14} />
          </button>

          {/* View Details Link */}
          <button
            onClick={handleCardClick}
            className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-white/5 dark:hover:bg-white/10 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Details &amp; Analysis</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DrawingCard;

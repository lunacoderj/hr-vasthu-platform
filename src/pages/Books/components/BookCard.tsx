import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Lock, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  X,
  ArrowRight,
  Eye
} from 'lucide-react';
import { type Book } from '../../../core/types/book';
import { Card, Button } from '../../../shared/components/ui';
import Typography from '../../../shared/components/content/Typography';
import { LANGUAGES } from '../../../core/store/language.store';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const languageName = LANGUAGES.find(l => l.code === book.language)?.name || book.language;
  const isEnglish = book.id === 'english-book' || book.language === 'en';
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const priceText = '₹99';
  const whatsappBuyMessage = encodeURIComponent(
    `Hello Dr. Rao, I want to purchase the complete eBook copy of "${book.title}" (₹99) from hrvasthu.com.`
  );

  return (
    <>
      <Card className="flex flex-col h-full group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300" elevation="sm">
        
        {/* Uncropped 100% Visible Book Cover Frame */}
        <div className="relative h-80 w-full flex items-center justify-center p-3 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 rounded-2xl mb-5 border border-stone-200 dark:border-stone-800 overflow-hidden">
          <picture className="h-full flex items-center justify-center">
            <source srcSet={book.coverImage?.replace(/\.png$/, '.webp')} type="image/webp" />
            <img 
              src={book.coverImage} 
              alt={book.title} 
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-xl rounded-lg transition-transform duration-500 group-hover:scale-105"
            />
          </picture>

          {/* Category Pill */}
          <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs border border-white/10">
            {book.category}
          </div>

          {/* Free / Paid Access Pill */}
          {isEnglish ? (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles size={11} /> Free Online Reading
            </div>
          ) : (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Lock size={11} /> Complete Paid Edition (₹99)
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1">
          <Typography variant="h3" className="mb-2 text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors leading-snug line-clamp-2">
            {book.title}
          </Typography>
          
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-5 leading-relaxed font-sans">
            {book.description}
          </p>

          <div className="mt-auto space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            {/* Meta Row */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-gold-500" />
                {book.pages} Pages
              </span>
              <span className="uppercase tracking-wider font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-0.5 rounded-full text-[10px]">
                {languageName}
              </span>
            </div>

            {/* Action Buttons */}
            {isEnglish ? (
              <div className="flex flex-col gap-2">
                <Link to={`/books/${book.id}`} className="w-full">
                  <button className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all transform hover:scale-102 cursor-pointer uppercase tracking-wider">
                    <BookOpen size={14} /> Read Online (100% Free)
                  </button>
                </Link>
                <button 
                  onClick={() => setPurchaseModalOpen(true)}
                  className="w-full py-2 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  <Download size={13} /> Download Offline PDF (₹99)
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setPurchaseModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all transform hover:scale-102 cursor-pointer uppercase tracking-wider"
                >
                  <Lock size={14} /> Unlock Complete Telugu Grandham (₹99)
                </button>
                <button 
                  onClick={() => setPurchaseModalOpen(true)}
                  className="w-full py-2 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  <Download size={13} /> Buy & Download PDF (₹99)
                </button>
              </div>
            )}

          </div>
        </div>
      </Card>

      {/* Book Purchase Modal */}
      {purchaseModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-['DM_Sans',sans-serif]"
          onClick={() => setPurchaseModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border-2 border-amber-300 text-stone-900 dark:text-white space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full inline-block">
                  ✦ Authentic Vedic Publication
                </span>
                <h3 className="font-serif text-lg font-bold">
                  {isEnglish ? 'Download English eBook' : 'Unlock Complete Telugu Grandham'}
                </h3>
              </div>
              <button 
                onClick={() => setPurchaseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Book Info Summary */}
            <div className="flex gap-4 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 items-center">
              <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-contain rounded-lg shadow-sm shrink-0" />
              <div className="min-w-0 space-y-1">
                <h4 className="font-bold text-xs line-clamp-2">{book.title}</h4>
                <p className="text-[11px] text-stone-500">{book.pages} Pages • Full High-Res PDF</p>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{priceText}</span>
              </div>
            </div>

            {/* Instant Purchase Options */}
            <div className="space-y-3">
              <p className="text-xs text-stone-600 dark:text-stone-400 text-center">
                Contact Dr. Kunchala Hanumantha Rao's office directly to receive your copy immediately via WhatsApp or Email:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                <a
                  href={`https://wa.me/919246624248?text=${whatsappBuyMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 uppercase tracking-wider"
                >
                  <MessageCircle size={15} /> Buy on WhatsApp ({priceText})
                </a>

                <a
                  href="tel:+919246624248"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102 uppercase tracking-wider"
                >
                  <Phone size={15} /> Call Office (+91 92466 24248)
                </a>
              </div>
            </div>

            <p className="text-[10px] text-center text-stone-400">
              Immediate PDF delivery after payment confirmation via UPI / Bank Transfer.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;

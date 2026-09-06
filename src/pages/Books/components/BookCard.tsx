import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Lock, 
  Sparkles, 
  CreditCard
} from 'lucide-react';
import { type Book } from '../../../core/types/book';
import { Card } from '../../../shared/components/ui';
import Typography from '../../../shared/components/content/Typography';
import { LANGUAGES } from '../../../core/store/language.store';
import { Link } from 'react-router-dom';
import { UnlockBookModal } from './UnlockBookModal';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const languageName = LANGUAGES.find(l => l.code === book.language)?.name || book.language;
  const isEnglish = book.id === 'english-book' || book.id === '1' || book.language === 'en' || book.language?.toLowerCase() === 'english' || book.isFree === true || book.price === 0;
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const priceText = '₹99';

  const handleFreeDownload = () => {
    const link = document.createElement('a');
    link.href = book.pdfUrl || '/books/Vijayabata Vaasthu Book English.pdf';
    link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {isFreeToReadPill(isEnglish)}
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-1">
          <Typography variant="h3" className="mb-2 text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-white group-hover:text-[#d4720a] dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
            {book.title}
          </Typography>
          
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-5 leading-relaxed font-sans">
            {book.description}
          </p>

          <div className="mt-auto space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            {/* Meta Row */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#d4720a]" />
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
                  onClick={handleFreeDownload}
                  className="w-full py-2 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  <Download size={13} /> Download Free PDF
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setUnlockModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-[#d4720a] to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all transform hover:scale-102 cursor-pointer uppercase tracking-wider"
                >
                  <CreditCard size={14} /> Unlock Complete Telugu Grandham ({priceText})
                </button>
                <button 
                  onClick={() => setUnlockModalOpen(true)}
                  className="w-full py-2 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
                >
                  <Download size={13} /> Buy &amp; Download PDF ({priceText})
                </button>
              </div>
            )}

          </div>
        </div>
      </Card>

      {/* Cashfree Secure Unlock Modal */}
      <UnlockBookModal
        book={book}
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onPaymentSuccess={() => {
          setUnlockModalOpen(false);
        }}
      />
    </>
  );
};

function isFreeToReadPill(isEnglish: boolean) {
  if (isEnglish) {
    return (
      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
        <Sparkles size={11} /> Free Online Reading
      </div>
    );
  }
  return (
    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
      <Lock size={11} /> Complete Paid Edition (₹99)
    </div>
  );
}

export default BookCard;

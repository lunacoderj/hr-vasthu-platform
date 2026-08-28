import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Maximize2, 
  Download, 
  BookOpen, 
  Lock, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { Spinner } from '../../shared/components/ui';
import Typography from '../../shared/components/content/Typography';
import { bookService } from '../../core/services/book.service';
import { type Book } from '../../core/types/book';
import { JsonLd } from '../../shared/components/seo/JsonLd';

export const BookReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBook();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-white gap-3">
        <Spinner size="lg" variant="primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Loading Vedic Publication...</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 px-4 text-white text-center">
        <Typography variant="h2" className="mb-4">Book Not Found</Typography>
        <Link to="/books" className="inline-flex items-center text-gold-400 font-bold text-sm bg-stone-800 px-6 py-3 rounded-full hover:bg-stone-700 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Library
        </Link>
      </div>
    );
  }

  const isEnglish = book.id === 'english-book' || book.language === 'en';
  const cleanPdfUrl = encodeURI(book.pdfUrl || '');
  const pdfViewerUrl = `${cleanPdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  const pageUrl = `https://hrvasthu.com/books/${book.id}`;
  const priceText = '₹99';

  const whatsappMessage = encodeURIComponent(
    `Hello Dr. Rao, I would like to purchase the complete eBook edition of "${book.title}" (₹99) from hrvasthu.com.`
  );

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": "Dr. Kunchala Hanumantha Rao"
    },
    "description": book.description || `Authoritative Vastu Shastra guide written by Dr. Kunchala Hanumantha Rao.`,
    "inLanguage": book.language || "en",
    "numberOfPages": book.pages || 310,
    "publisher": {
      "@type": "Organization",
      "name": "HR Vasthu Digital Publications"
    },
    "url": pageUrl
  };

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-50 overflow-hidden font-['DM_Sans',sans-serif]">
      <Helmet>
        <title>{`${book.title} | ${isEnglish ? 'Read Free Online' : 'Premium Edition'} | HR Vasthu`}</title>
        <meta name="description" content={book.description || `Read and explore ${book.title} by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <JsonLd data={bookSchema} />

      {/* Reader Top Bar */}
      <header className="bg-stone-950 border-b border-stone-800 p-3 sm:p-4 flex items-center justify-between shrink-0 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/books')}
            className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-full p-2 sm:px-4 sm:py-2 transition-colors cursor-pointer"
            title="Go Back to Library"
          >
            <ArrowLeft size={18} className="sm:mr-1.5" />
            <span className="hidden sm:inline font-bold text-xs">Exit Reader</span>
          </button>
          
          <div className="hidden sm:block pl-3 border-l border-stone-800">
            <h1 className="text-sm font-bold font-serif text-amber-400 truncate max-w-[420px]">
              {book.title}
            </h1>
            <span className="text-[10px] text-stone-400">
              By Dr. Kunchala Hanumantha Rao • {isEnglish ? '100% Free Online Reading' : 'Premium Telugu Grandham'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download PDF CTA Button */}
          <button
            onClick={() => setDownloadModalOpen(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              isEnglish 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Download size={14} />
            <span>Download Offline PDF ({priceText})</span>
          </button>

          <button 
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
              } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                }
              }
            }}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <div className="flex-1 w-full relative bg-stone-950 overflow-hidden">
        {isEnglish ? (
          /* Free English PDF Embedded Viewer */
          <iframe
            src={pdfViewerUrl}
            className="absolute inset-0 w-full h-full border-none"
            title={`PDF Reader: ${book.title}`}
          />
        ) : (
          /* Telugu Paid Edition Paywall Banner */
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-stone-900 to-black">
            <div className="max-w-lg w-full bg-stone-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
              
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Lock size={28} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                  ✦ Complete Paid Edition ✦
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  విజయబాట వాస్తు గ్రంథం (Telugu)
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                  డాక్టర్ కుంచాల హనుమంతరావు గారిచే రచించబడిన 240 పేజీల సంపూర్ణ వాస్తు గ్రంథం. గృహ నిర్మాణం, ఆయది గణితం మరియు నివారణల సంపూర్ణ సమగ్ర పిడిఎఫ్ ప్రతిని వెంటనే పొందండి.
                </p>
              </div>

              {/* Uncropped Telugu Book Cover */}
              <div className="h-44 flex items-center justify-center p-2 bg-stone-950 rounded-2xl border border-stone-800">
                <img src={book.coverImage} alt={book.title} className="h-full w-auto object-contain drop-shadow-xl rounded-md" />
              </div>

              {/* Instant Purchase Options */}
              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 uppercase tracking-wider"
                >
                  <MessageCircle size={16} /> Unlock on WhatsApp (₹99)
                </a>

                <a
                  href="tel:+919246624248"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 uppercase tracking-wider"
                >
                  <Phone size={16} /> Call Dr. Rao (+91 92466 24248)
                </a>
              </div>

              <p className="text-[11px] text-stone-400">
                Instant delivery of high-resolution PDF copy directly to your WhatsApp or Email.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Download Purchase Modal */}
      {downloadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-['DM_Sans',sans-serif]"
          onClick={() => setDownloadModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-stone-900 rounded-3xl p-6 shadow-2xl border-2 border-amber-300 text-white space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full inline-block border border-amber-400/30">
                  ✦ High-Resolution Offline Edition
                </span>
                <h3 className="font-serif text-lg font-bold">
                  Download Full PDF ({priceText})
                </h3>
              </div>
              <button 
                onClick={() => setDownloadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-4 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 items-center">
              <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-contain rounded-lg shadow-sm shrink-0" />
              <div className="min-w-0 space-y-1">
                <h4 className="font-bold text-xs line-clamp-2">{book.title}</h4>
                <p className="text-[11px] text-stone-400">{book.pages} Pages • Full Offline Copy</p>
                <span className="text-sm font-black text-emerald-400">{priceText}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={`https://wa.me/919246624248?text=${whatsappMessage}`}
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

            <p className="text-[10px] text-center text-stone-400">
              Immediate PDF delivery after UPI / Bank confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;

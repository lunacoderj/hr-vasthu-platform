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
  X,
  ExternalLink,
  RotateCw
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
  const [pdfLoadError, setPdfLoadError] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      setIsLoading(true);
      setPdfLoadError(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900 text-white gap-3 font-['DM_Sans',sans-serif]">
        <Spinner size="lg" variant="primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Loading Vedic Publication...</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 px-4 text-white text-center font-['DM_Sans',sans-serif]">
        <Typography variant="h2" className="mb-4">Book Not Found</Typography>
        <p className="text-stone-400 text-sm mb-6">The requested publication could not be found.</p>
        <Link to="/books" className="inline-flex items-center text-stone-900 font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 rounded-full hover:brightness-110 transition-all shadow-lg">
          <ArrowLeft size={18} className="mr-2" /> Back to Library
        </Link>
      </div>
    );
  }

  const isFreeToRead = book.isFree || book.id === 'english-book' || book.id === '1' || book.language === 'English' || book.language === 'en' || book.price === 0;
  const rawPdfUrl = book.pdfUrl || '/books/Vijayabata Vaasthu Book English.pdf';
  const cleanPdfUrl = encodeURI(rawPdfUrl);
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
    "inLanguage": book.language || "English",
    "numberOfPages": book.pages || 215,
    "publisher": {
      "@type": "Organization",
      "name": "HR Vasthu Digital Publications"
    },
    "url": pageUrl
  };

  const handleOpenPdfDirectly = () => {
    window.open(cleanPdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-screen bg-stone-950 text-stone-50 overflow-hidden font-['DM_Sans',sans-serif]">
      <Helmet>
        <title>{`${book.title} | ${isFreeToRead ? 'Read Free Online' : 'Premium Edition'} | HR Vasthu`}</title>
        <meta name="description" content={book.description || `Read and explore ${book.title} by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <JsonLd data={bookSchema} />

      {/* Reader Top Bar */}
      <header className="bg-stone-900 border-b border-stone-800 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/books')}
            className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-full p-2 sm:px-4 sm:py-2 transition-colors cursor-pointer border border-white/10"
            title="Go Back to Library"
          >
            <ArrowLeft size={18} className="sm:mr-1.5" />
            <span className="hidden sm:inline font-bold text-xs">Exit Reader</span>
          </button>
          
          <div className="hidden md:block pl-3 border-l border-stone-800">
            <h1 className="text-sm font-bold font-serif text-amber-400 truncate max-w-[380px] lg:max-w-[500px]">
              {book.title}
            </h1>
            <span className="text-[10px] text-stone-400">
              By Dr. Kunchala Hanumantha Rao • {isFreeToRead ? '100% Free Online Reading' : 'Premium Edition'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isFreeToRead && (
            <button
              onClick={handleOpenPdfDirectly}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-400/30 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Open full PDF directly in browser"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Open Full Screen</span>
              <span className="sm:hidden">Full PDF</span>
            </button>
          )}

          {/* Download PDF CTA Button */}
          <button
            onClick={() => {
              if (isFreeToRead) {
                const link = document.createElement('a');
                link.href = cleanPdfUrl;
                link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                setDownloadModalOpen(true);
              }
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              isFreeToRead 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
            }`}
          >
            <Download size={14} />
            <span>{isFreeToRead ? 'Download PDF (Free)' : `Download PDF (${priceText})`}</span>
          </button>

          <button 
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
              } else if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full transition-colors cursor-pointer border border-white/10 hidden sm:flex"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <div className="flex-1 w-full relative bg-stone-950 overflow-hidden flex flex-col">
        {isFreeToRead ? (
          /* Free English PDF Embedded Viewer with multi-layer fallback */
          <div className="w-full h-full relative flex-1 flex flex-col bg-stone-900">
            {pdfLoadError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <BookOpen size={30} />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Read {book.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Your browser may require direct PDF opening for large documents. Click below to read the complete book immediately:
                </p>
                <button
                  onClick={handleOpenPdfDirectly}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-102 transition-transform cursor-pointer"
                >
                  <BookOpen size={18} />
                  <span>Open Full PDF in Browser</span>
                </button>
              </div>
            ) : (
              <object
                data={cleanPdfUrl}
                type="application/pdf"
                className="w-full h-full flex-1 border-none"
                onError={() => setPdfLoadError(true)}
              >
                {/* Fallback iframe */}
                <iframe
                  src={cleanPdfUrl}
                  className="w-full h-full flex-1 border-none"
                  title={`PDF Reader: ${book.title}`}
                  onError={() => setPdfLoadError(true)}
                >
                  {/* Fallback HTML if both object and iframe are blocked by device */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto h-full">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <BookOpen size={30} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-300">
                      Click below to view the entire high-resolution PDF online:
                    </p>
                    <button
                      onClick={handleOpenPdfDirectly}
                      className="w-full py-3 px-5 rounded-2xl bg-amber-400 text-stone-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen size={18} />
                      <span>Open Book PDF Viewer</span>
                    </button>
                  </div>
                </iframe>
              </object>
            )}

            {/* Mobile Bottom Quick Bar for easy reading on phones */}
            <div className="md:hidden bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-2.5 px-4 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-stone-400 truncate max-w-[180px]">
                {book.title}
              </span>
              <button
                onClick={handleOpenPdfDirectly}
                className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <ExternalLink size={12} />
                <span>Fullscreen PDF</span>
              </button>
            </div>
          </div>
        ) : (
          /* Telugu Paid Edition Paywall Banner */
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-stone-900 to-black overflow-y-auto">
            <div className="max-w-lg w-full bg-stone-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl my-auto">
              
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Lock size={28} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                  ✦ Complete Paid Edition ✦
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {book.title}
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                  {book.description || 'డాక్టర్ కుంచాల హనుమంతరావు గారిచే రచించబడిన సంపూర్ణ వాస్తు గ్రంథం. గృహ నిర్మాణం, ఆయది గణితం మరియు నివారణల సంపూర్ణ సమగ్ర పిడిఎఫ్ ప్రతిని వెంటనే పొందండి.'}
                </p>
              </div>

              {/* Uncropped Book Cover */}
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
                  <MessageCircle size={16} /> Unlock on WhatsApp ({priceText})
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
              Immediate PDF delivery after payment confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;

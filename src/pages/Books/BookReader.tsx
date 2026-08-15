import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Maximize2, Download, BookOpen, Share2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <Typography variant="h2" className="mb-6">Book Not Found</Typography>
        <Link to="/books" className="inline-flex items-center text-gold-600 font-medium text-lg bg-stone-200 px-6 py-3 rounded-full hover:bg-stone-300 transition-colors">
          <ArrowLeft size={24} className="mr-2" /> Back to Library
        </Link>
      </div>
    );
  }

  const cleanPdfUrl = encodeURI(book.pdfUrl || '');
  const pdfViewerUrl = `${cleanPdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  const pageUrl = `https://hrvasthu.com/books/${book.id}`;

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": "Dr. Kunchala Hanumantha Rao"
    },
    "description": book.description || `Authoritative Vastu Shastra guide written by Dr. Kunchala Hanumantha Rao.`,
    "inLanguage": book.language || "te",
    "numberOfPages": book.pages || 250,
    "publisher": {
      "@type": "Organization",
      "name": "HR Vasthu Digital Publications"
    },
    "url": pageUrl
  };

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-50 overflow-hidden">
      <Helmet>
        <title>{`${book.title} | Read Free Vastu Book | HR Vasthu`}</title>
        <meta name="description" content={book.description || `Read and download ${book.title} by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${book.title} | HR Vasthu`} />
        <meta property="og:description" content={book.description || book.title} />
        <meta property="og:type" content="book" />
      </Helmet>

      <JsonLd data={bookSchema} />

      {/* Reader Header */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/books')}
            className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-full p-2 md:px-4 md:py-2 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={20} className="md:mr-2" />
            <span className="hidden md:inline font-medium text-sm">Exit Reader</span>
          </button>
          
          <div className="hidden sm:block pl-4 border-l border-stone-700">
            <h1 className="text-base md:text-lg font-bold font-serif text-gold-400 truncate max-w-[450px]">
              {book.title}
            </h1>
            <span className="text-[10px] text-stone-400">By Dr. Kunchala Hanumantha Rao • {book.language}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={cleanPdfUrl}
            download
            className="p-2 md:px-3.5 md:py-1.5 bg-gold-600 hover:bg-gold-500 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            title="Download PDF"
          >
            <Download size={16} />
            <span className="hidden md:inline">Download</span>
          </a>

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
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </header>

      {/* Full PDF Iframe Container */}
      <div className="flex-1 w-full relative bg-stone-900 overflow-hidden">
        <iframe
          src={pdfViewerUrl}
          className="absolute inset-0 w-full h-full border-none"
          title={`PDF Reader: ${book.title}`}
        />
      </div>
    </div>
  );
};

export default BookReader;

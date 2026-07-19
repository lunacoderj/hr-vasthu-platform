import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { Spinner } from '../../shared/components/ui';
import Typography from '../../shared/components/content/Typography';
import { bookService } from '../../core/services/book.service';
import { type Book } from '../../core/types/book';

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

  // Uses the browser's built-in PDF viewer seamlessly inside an iframe
  // '#toolbar=0&navpanes=0&scrollbar=0' is added to PDF URL to request browsers to hide default heavy UI 
  // giving a cleaner "in-app" reading experience (works best in Chrome/Edge).
  const pdfViewerUrl = `${book.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

  return (
    <div className="flex flex-col h-screen bg-stone-900 text-stone-50 overflow-hidden">
      {/* Reader Header (Always visible at the top) */}
      <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/books')}
            className="inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-full p-2 md:px-4 md:py-2 transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={24} className="md:mr-2" />
            <span className="hidden md:inline font-medium text-lg">Exit Reader</span>
          </button>
          
          <div className="hidden sm:block pl-4 border-l border-stone-700">
            <h1 className="text-xl md:text-2xl font-bold font-lora text-gold-500 truncate max-w-[500px]">
              {book.title}
            </h1>
          </div>
        </div>

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
          className="p-2 md:px-4 md:py-2 bg-stone-800 hover:bg-gold-600 hover:text-white text-stone-300 rounded-full transition-colors flex items-center"
          title="Toggle Fullscreen"
        >
          <Maximize2 size={24} className="md:mr-2" />
          <span className="hidden md:inline font-medium">Fullscreen</span>
        </button>
      </header>

      {/* Full PDF Iframe Container */}
      <div className="flex-1 w-full relative bg-stone-800 overflow-hidden">
        <iframe
          src={pdfViewerUrl}
          className="absolute inset-0 w-full h-full border-none"
          title={`PDF Reader: ${book.title}`}
          // allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default BookReader;

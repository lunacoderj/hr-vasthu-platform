import React, { useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { type Book } from '../../../core/types/book';
import { Card, Button } from '../../../shared/components/ui';
import { supabase } from '../../../core/services/supabase';
import Typography from '../../../shared/components/content/Typography';
import { LANGUAGES } from '../../../core/store/language.store';

import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const languageName = LANGUAGES.find(l => l.code === book.language)?.name || book.language;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      // Log the download to admin via bookings table
      await supabase.from('bookings').insert({
        name: 'PDF Download',
        phone: 'N/A',
        email: 'N/A',
        consultation_type: book.title,
        status: 'completed',
        source: 'website_pdf_download',
      });
    } catch (e) {
      console.error("Failed to log download", e);
    }

    // Force file download
    const a = document.createElement("a");
    a.href = book.pdfUrl;
    a.download = `${book.title}.pdf`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setIsProcessing(false);
  };

  return (
    <Card className="flex flex-col h-full group" elevation="sm">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-6 bg-stone-100 dark:bg-stone-800">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-gold-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
          {book.category}
        </div>
        {book.isFree && (
          <div className="absolute top-3 left-3 bg-green-500/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm backdrop-blur-sm">
            Free
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <Typography variant="h3" className="mb-2 text-xl group-hover:text-gold-600 dark:group-hover:text-gold-500 transition-colors">
          {book.title}
        </Typography>
        
        <Typography variant="body" className="text-sm text-stone-500 dark:text-stone-400 line-clamp-3 mb-6">
          {book.description}
        </Typography>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />
              {book.pages} pages
            </span>
            <span className="uppercase tracking-wider bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">
              {languageName}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/books/${book.id}`} className="w-full">
              <Button 
                className="w-full" 
                variant="secondary" 
                icon={<BookOpen size={16} />} 
                iconPosition="left"
              >
                Read Now
              </Button>
            </Link>
            <Button 
              className="w-full" 
              variant="primary" 
              icon={isProcessing ? undefined : <Download size={16} />} 
              iconPosition="left"
              onClick={handleDownload}
              isDisabled={isProcessing}
            >
              {isProcessing ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;

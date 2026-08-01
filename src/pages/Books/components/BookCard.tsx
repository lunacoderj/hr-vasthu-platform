import React, { useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadPayment = () => {
    // If we don't have Razorpay injected or API key is missing
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      alert("Payment system is not available right now. Please try again later.");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    
    // Fallback behavior if no key is provided (so the site doesn't break)
    if (!razorpayKey) {
      console.warn("VITE_RAZORPAY_KEY is missing. In production, this will fail.");
      alert("Payment gateway not configured. Please contact the administrator.");
      return;
    }

    setIsProcessing(true);

    const options = {
      key: razorpayKey,
      amount: 9900, // 99 INR in paise
      currency: "INR",
      name: "HR Vasthu",
      description: `Download ${book.title}`,
      image: "/logo.png",
      handler: function (response: any) {
        // Payment Succeeded!
        setIsProcessing(false);
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}\nYour PDF is now downloading.`);
        
        // Force file download
        const a = document.createElement("a");
        a.href = book.pdfUrl;
        a.download = `${book.title}.pdf`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      theme: {
        color: "#C98A2E" // Our Gold Color
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      setIsProcessing(false);
      alert("Payment Failed: " + response.error.description);
    });
    
    rzp.open();
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
                variant="outline" 
                icon={<BookOpen size={16} />} 
                iconPosition="left"
              >
                Read Now (Free)
              </Button>
            </Link>
            <Button 
              className="w-full" 
              variant="primary" 
              icon={isProcessing ? undefined : <Download size={16} />} 
              iconPosition="left"
              onClick={handleDownloadPayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Download PDF (₹99)"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;

import React from 'react';
import { BookOpen } from 'lucide-react';
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

          <Link to={`/books/${book.id}`} className="w-full">
            <Button 
              className="w-full" 
              variant="primary" 
              icon={<BookOpen size={16} />} 
              iconPosition="left"
            >
              Read Now
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;

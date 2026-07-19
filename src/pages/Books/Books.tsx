import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Spinner } from '../../shared/components/ui';
import { BookCard } from './components/BookCard';
import { bookService } from '../../core/services/book.service';
import { type Book } from '../../core/types/book';
import { useTranslation } from '../../core/hooks/useTranslation';

export const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await bookService.getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12">
      <Container size="xl">
        <div className="mb-16 max-w-2xl">
          <Typography variant="display" className="mb-4">
            {t('digitalLibrary')}
          </Typography>
          <Typography variant="body" className="text-stone-600 dark:text-stone-400 text-lg">
            {t('digitalLibrarySub')}
          </Typography>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
            <Spinner size="lg" variant="primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Books;

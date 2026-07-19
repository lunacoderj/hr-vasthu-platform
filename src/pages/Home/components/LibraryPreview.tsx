import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button } from '../../../shared/components/ui';
import { bookService } from '../../../core/services/book.service';
import { type Book } from '../../../core/types/book';

export const LibraryPreview: React.FC = () => {
  const navigate = useNavigate();
  const [previewBooks, setPreviewBooks] = useState<Book[]>([]);

  useEffect(() => {
    bookService.getBooks().then(books => {
      setPreviewBooks(books.slice(0, 2));
    });
  }, []);

  return (
    <section className="py-24 bg-transparent border-t border-white/5">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-[#d4720a] font-bold tracking-widest uppercase text-xs mb-4">
              <BookOpen size={16} />
              <span>Digital Library</span>
            </div>
            <Typography variant="h2" className="mb-4 text-stone-900 dark:text-white font-serif">Wisdom at Your Fingertips</Typography>
            <p className="text-stone-600 dark:text-stone-300 text-lg font-light leading-relaxed">
              Explore the definitive collection of Vastu literature authored by Dr. Rao. Deepen your understanding of spatial energy and cosmic geometry.
            </p>
          </div>
          <button 
            onClick={() => navigate('/books')}
            className="shrink-0 px-6 py-2.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-800 dark:text-white rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 magnetic"
          >
            <span>Explore Library</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {previewBooks.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group cursor-pointer max-w-sm mx-auto w-full"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              {/* 3D Book Cover Effect (similar to Books page) */}
              <div className="relative aspect-[3/4] mb-6 perspective-[1000px]">
                <div className="w-full h-full relative transition-transform duration-500 transform-style-3d group-hover:rotate-y-[-10deg] group-hover:scale-105 shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_50px_rgba(212,114,10,0.15)] rounded-r-2xl rounded-l-sm border border-stone-200/50 dark:border-white/10">
                  <div className="absolute inset-0 bg-[#0a0a0f] rounded-r-2xl rounded-l-sm overflow-hidden">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-transparent to-transparent"></div>
                    
                    {/* Spine Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/20 to-transparent z-10 border-l border-white/30"></div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-sm">
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-2 group-hover:text-[#d4720a] transition-colors">
                  {book.title}
                </h3>
                <p className="text-stone-400 text-sm font-light">By Dr. Kunchala Hanumantha Rao</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

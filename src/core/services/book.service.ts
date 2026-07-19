import { type Book } from '../types/book';
import { supabase } from './supabase';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Vijayabata Vaasthu Book (English)',
    description: 'A comprehensive guide to Vastu Shastra for achieving prosperity and harmony.',
    coverImage: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=2073&auto=format&fit=crop',
    pdfUrl: '/books/Vijayabata Vaasthu Book English.pdf',
    language: 'en',
    pages: 120,
    category: 'Vastu',
    isFree: true,
  },
  {
    id: '2',
    title: 'Vasthu Telugu Book',
    description: 'వాస్తు శాస్త్రం - Complete Vastu guide in Telugu for your home and business.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop',
    pdfUrl: '/books/vasthu telugu book.pdf',
    language: 'te',
    pages: 85,
    category: 'Vastu',
    isFree: true,
  }
];

class BookService {
  async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data && data.length > 0) ? data : mockBooks;
    } catch (error) {
      console.error('Failed to fetch books from Supabase:', error);
      return mockBooks;
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || mockBooks.find(b => b.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch book with id ${id}:`, error);
      return mockBooks.find(b => b.id === id) || null;
    }
  }
}

export const bookService = new BookService();

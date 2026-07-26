import { type Book } from '../types/book';
import { supabase } from './supabase';

const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Science of Vasthu',
    description: 'A comprehensive guide to understanding the ancient science of architecture and spatial geometry.',
    coverImage: '/books/telugu-book-cover.png',
    pdfUrl: '/books/vasthu telugu book.pdf',
    language: 'Telugu',
    pages: 342,
    category: 'Vasthu',
    isFree: true,
    price: 0
  },
  {
    id: '2',
    title: 'Sacred Geometry Explained',
    description: 'Learn how to apply sacred geometry in your home for harmony and peace.',
    coverImage: '/books/english-book-cover.png',
    pdfUrl: '/books/vijayabata Vaasthu Book English.pdf',
    language: 'English',
    pages: 215,
    category: 'Vasthu',
    isFree: false,
    price: 499
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
      if (data && data.length > 0) {
        return data.map(b => ({
          id: b.id,
          title: b.title,
          description: b.description || '',
          coverImage: b.cover_image || b.coverImage,
          pdfUrl: b.pdf_url || b.pdfUrl,
          language: b.language,
          pages: b.pages,
          category: b.category,
          isFree: b.is_free !== undefined ? b.is_free : b.isFree,
          price: b.price
        }));
      }
      return MOCK_BOOKS;
    } catch (error) {
      console.error('Failed to fetch books from Supabase:', error);
      return MOCK_BOOKS;
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
      if (data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          coverImage: data.cover_image || data.coverImage,
          pdfUrl: data.pdf_url || data.pdfUrl,
          language: data.language,
          pages: data.pages,
          category: data.category,
          isFree: data.is_free !== undefined ? data.is_free : data.isFree,
          price: data.price
        };
      }
      return MOCK_BOOKS.find(b => b.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch book with id ${id}:`, error);
      return MOCK_BOOKS.find(b => b.id === id) || null;
    }
  }
}

export const bookService = new BookService();

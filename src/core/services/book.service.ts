import { type Book } from '../types/book';
import { supabase } from './supabase';

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
      return [];
    } catch (error) {
      console.error('Failed to fetch books from Supabase:', error);
      return [];
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
      return null;
    } catch (error) {
      console.error(`Failed to fetch book with id ${id}:`, error);
      return null;
    }
  }
}

export const bookService = new BookService();

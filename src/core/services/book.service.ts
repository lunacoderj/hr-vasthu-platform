import { type Book } from '../types/book';
import { supabase } from './supabase';

const DEFAULT_BOOKS: Book[] = [
  {
    id: 'english-book',
    title: 'Pathway to Success Through Vedic Vasthu (English)',
    description: 'Authoritative guide to ancient Vedic architectural wisdom by Dr. Kunchala Hanumantha Rao. Detailed insights on plot selection, room orientations, non-demolition remedies, and positive energy flow.',
    coverImage: '/books/english-book-cover.png',
    pdfUrl: '/books/Vijayabata%20Vaasthu%20Book%20English.pdf',
    language: 'en',
    pages: 310,
    category: 'Vasthu Shastra',
    isFree: true, // Free online reading, paid download
    price: 99
  },
  {
    id: 'telugu-book',
    title: 'విజయబాట వాస్తు గ్రంథం (Telugu)',
    description: 'డాక్టర్ కుంచాల హనుమంతరావు గారిచే రచించబడిన ప్రామాణిక వాస్తు శాస్త్ర గ్రంథం. గృహ నిర్మాణం, దిశల ప్రాముఖ్యత, ఆయది గణితం మరియు దోష నివారణల సంపూర్ణ సమగ్ర గ్రంథం.',
    coverImage: '/books/telugu-book-cover.png',
    pdfUrl: '/books/vasthu%20telugu%20book.pdf',
    language: 'te',
    pages: 240,
    category: 'Vasthu Shastra',
    isFree: false, // Completely paid edition
    price: 99
  }
];

class BookService {
  async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase books query returned error, using fallback books:', error);
        return DEFAULT_BOOKS;
      }

      if (data && data.length > 0) {
        return data.map(b => {
          const isEnglish = b.id === 'english-book' || b.language === 'en';
          const defaultCover = isEnglish ? '/books/english-book-cover.png' : '/books/telugu-book-cover.png';
          const defaultPdf = isEnglish ? '/books/Vijayabata%20Vaasthu%20Book%20English.pdf' : '/books/vasthu%20telugu%20book.pdf';

          return {
            id: b.id,
            title: b.title,
            description: b.description || '',
            coverImage: b.cover_image && !b.cover_image.includes('hrvasthu.com/books') ? b.cover_image : defaultCover,
            pdfUrl: b.pdf_url && !b.pdf_url.includes('hrvasthu.com/books') ? b.pdf_url : defaultPdf,
            language: b.language,
            pages: b.pages,
            category: b.category,
            isFree: isEnglish,
            price: 99
          };
        });
      }
      return DEFAULT_BOOKS;
    } catch (error) {
      console.warn('Failed to fetch books from Supabase, serving local library:', error);
      return DEFAULT_BOOKS;
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    try {
      const allBooks = await this.getBooks();
      const match = allBooks.find(b => b.id === id || b.language === id);
      if (match) return match;

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const isEnglish = data.id === 'english-book' || data.language === 'en';
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          coverImage: isEnglish ? '/books/english-book-cover.png' : '/books/telugu-book-cover.png',
          pdfUrl: isEnglish ? '/books/Vijayabata%20Vaasthu%20Book%20English.pdf' : '/books/vasthu%20telugu%20book.pdf',
          language: data.language,
          pages: data.pages,
          category: data.category,
          isFree: isEnglish,
          price: 99
        };
      }
      return DEFAULT_BOOKS.find(b => b.id === id) || null;
    } catch (error) {
      console.warn(`Failed to fetch book with id ${id}, checking fallback:`, error);
      return DEFAULT_BOOKS.find(b => b.id === id) || null;
    }
  }
}

export const bookService = new BookService();

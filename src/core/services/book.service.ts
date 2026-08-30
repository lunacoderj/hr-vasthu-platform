import { type Book } from '../types/book';
import { supabase } from './supabase';

export const OFFICIAL_BOOKS: Book[] = [
  {
    id: 'english-book',
    title: 'Vijayabata Vaasthu Grandham (English Edition)',
    description: 'Complete authoritative treatise on Vastu Shastra authored by Dr. Kunchala Hanumantha Rao. 100% free to read online in high resolution.',
    coverImage: '/books/english-book-cover.webp',
    pdfUrl: '/books/Vijayabata Vaasthu Book English.pdf',
    language: 'English',
    pages: 215,
    category: 'Vastu Shastra',
    isFree: true,
    price: 0
  },
  {
    id: 'telugu-book',
    title: 'విజయబాట వాస్తు గ్రంథం (Telugu Grandham)',
    description: 'డాక్టర్ కుంచాల హనుమంతరావు గారిచే రచించబడిన 240 పేజీల సంపూర్ణ వాస్తు గ్రంథం. గృహ నిర్మాణం, ఆయది గణితం మరియు నివారణల సంపూర్ణ సమగ్ర గ్రంథం.',
    coverImage: '/books/telugu-book-cover.webp',
    pdfUrl: '/books/vasthu telugu book.pdf',
    language: 'Telugu',
    pages: 342,
    category: 'వాస్తు శాస్త్రం',
    isFree: false,
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

      if (!error && data && data.length > 0) {
        return data.map(b => ({
          id: b.id,
          title: b.title,
          description: b.description || '',
          coverImage: b.cover_image || b.coverImage || '/books/english-book-cover.webp',
          pdfUrl: b.pdf_url || b.pdfUrl || '/books/Vijayabata Vaasthu Book English.pdf',
          language: b.language || 'English',
          pages: b.pages || 215,
          category: b.category || 'Vastu Shastra',
          isFree: b.is_free !== undefined ? b.is_free : b.isFree ?? (b.price === 0),
          price: b.price ?? 0
        }));
      }
      return OFFICIAL_BOOKS;
    } catch (error) {
      console.warn('Loading default official publications:', error);
      return OFFICIAL_BOOKS;
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    if (!id) return null;
    const cleanId = decodeURIComponent(id).toLowerCase().trim();

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          coverImage: data.cover_image || data.coverImage || '/books/english-book-cover.webp',
          pdfUrl: data.pdf_url || data.pdfUrl || '/books/Vijayabata Vaasthu Book English.pdf',
          language: data.language || 'English',
          pages: data.pages || 215,
          category: data.category || 'Vastu Shastra',
          isFree: data.is_free !== undefined ? data.is_free : data.isFree ?? (data.price === 0),
          price: data.price ?? 0
        };
      }
    } catch (err) {
      console.warn(`Database lookup for book ${id} skipped, falling back to official publications:`, err);
    }

    // Match against official local books
    const matched = OFFICIAL_BOOKS.find(b => 
      b.id.toLowerCase() === cleanId ||
      (cleanId === '1' && b.id === 'english-book') ||
      (cleanId === '2' && b.id === 'telugu-book') ||
      (cleanId.includes('english') && b.id === 'english-book') ||
      (cleanId.includes('telugu') && b.id === 'telugu-book') ||
      (cleanId.includes('vijayabata') && b.id === 'english-book')
    );

    return matched || OFFICIAL_BOOKS[0];
  }
}

export const bookService = new BookService();

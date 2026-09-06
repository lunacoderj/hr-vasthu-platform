import axios from 'axios';
import { type Book } from '../types/book';
import { supabase } from './supabase';
import { cashfreeService } from './cashfree.service';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

export interface CreateBookOrderParams {
  bookId: string;
  mobile: string;
  name?: string;
  email?: string;
  marketingConsent?: boolean;
}

export interface CreateBookOrderResponse {
  success: boolean;
  orderId: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  customerId: string;
  isMock?: boolean;
  message?: string;
}

export interface VerifyBookPaymentResponse {
  success: boolean;
  paymentStatus: string;
  entitlementToken?: string;
  orderId: string;
  bookId: string;
  message?: string;
}

export interface BookDownloadResponse {
  success: boolean;
  downloadUrl: string;
  fileName: string;
  expirySeconds: number;
}

export const OFFICIAL_BOOKS: Book[] = [
  {
    id: 'english-book',
    title: 'Pathway to Success Through Vedic Vasthu (English Edition)',
    description: 'Complete authoritative treatise on Vastu Shastra authored by Dr. Kunchala Hanumantha Rao. 100% free to read online in high resolution.',
    coverImage: '/books/english-book-cover.webp',
    pdfUrl: '/books/Vijayabata Vaasthu Book English.pdf',
    language: 'English',
    pages: 310,
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
    pages: 240,
    category: 'వాస్తు శాస్త్రం',
    isFree: false,
    price: 99
  }
];

class BookService {
  /**
   * Fetch all books from Supabase or Backend API
   */
  async getBooks(): Promise<Book[]> {
    try {
      const res = await axios.get(`${API_BASE}/api/books`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.books) && res.data.books.length > 0) {
        return res.data.books.map(this.mapBookRecord);
      }
    } catch {
      // Backend offline fallback
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(this.mapBookRecord);
      }
    } catch {
      // Offline fallback
    }

    return OFFICIAL_BOOKS;
  }

  /**
   * Fetch single book by ID or Slug
   */
  async getBookById(id: string): Promise<Book | null> {
    if (!id) return null;
    const cleanId = decodeURIComponent(id).toLowerCase().trim();

    try {
      const res = await axios.get(`${API_BASE}/api/books/${encodeURIComponent(id)}`, { timeout: 3000 });
      if (res.data?.success && res.data.book) {
        return this.mapBookRecord(res.data.book);
      }
    } catch {}

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return this.mapBookRecord(data);
      }
    } catch {}

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

  /**
   * Level 1 Security: Create Cashfree payment order on backend for ₹99 Books
   */
  async createOrder(params: CreateBookOrderParams): Promise<CreateBookOrderResponse> {
    const book = await this.getBookById(params.bookId);
    const bookTitle = book?.title || params.bookId;

    // Save lead to Supabase bookings table
    try {
      await supabase.from('bookings').insert({
        name: params.name || 'Anonymous User',
        phone: params.mobile || 'N/A',
        email: params.email || 'N/A',
        consultation_type: `eBook Purchase: ${bookTitle}`,
        message: `Customer checkout for eBook (${bookTitle} - ₹99). Phone: ${params.mobile}`,
        status: 'lead_captured',
        source: 'book_marketplace_lead',
        created_at: new Date().toISOString()
      });
    } catch {}

    // Attempt backend API order creation
    try {
      const res = await axios.post(`${API_BASE}/api/books/create-order`, params, { timeout: 15000 });
      if (res.data && res.data.success && res.data.paymentSessionId) {
        return res.data;
      }
      throw new Error(res.data?.message || 'Could not initiate book order session.');
    } catch (backendErr: any) {
      const errorMsg = backendErr.response?.data?.message || backendErr.message || 'Unable to connect to payment gateway. Please try again.';
      console.error('[BookService] Backend order API error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Level 2 Security: Verify payment with Cashfree & obtain download entitlement
   */
  async verifyPayment(orderId: string, bookId: string): Promise<VerifyBookPaymentResponse> {
    try {
      const res = await axios.post(`${API_BASE}/api/books/verify-payment`, {
        orderId,
        bookId,
      }, { timeout: 15000 });

      if (res.data?.success) {
        cashfreeService.markBookUnlocked(bookId);
      }
      return res.data;
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || 'Book payment verification failed.';
      console.error('[BookService] Payment verification error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Level 3 Security: Request temporary signed download URL
   */
  async getSecureDownloadUrl(bookId: string, entitlementToken: string): Promise<BookDownloadResponse> {
    try {
      const res = await axios.post(
        `${API_BASE}/api/books/${bookId}/download`,
        {},
        {
          headers: {
            Authorization: `Bearer ${entitlementToken}`,
          },
          timeout: 10000
        }
      );
      return res.data;
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || 'Could not retrieve eBook download link.';
      console.error('[BookService] Secure book download error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  isBookUnlocked(bookId: string): boolean {
    return cashfreeService.isBookUnlocked(bookId);
  }

  private mapBookRecord(b: any): Book {
    return {
      id: b.id,
      title: b.title,
      description: b.description || '',
      coverImage: b.cover_image || b.coverImage || '/books/english-book-cover.webp',
      pdfUrl: b.pdf_url || b.pdfUrl || '/books/Vijayabata Vaasthu Book English.pdf',
      language: b.language === 'te' ? 'Telugu' : (b.language === 'en' ? 'English' : b.language || 'English'),
      pages: b.pages || 240,
      category: b.category || 'Vastu Shastra',
      isFree: b.is_free !== undefined ? b.is_free : b.isFree ?? (b.price === 0),
      price: b.price !== undefined ? Number(b.price) : (b.is_free ? 0 : 99)
    };
  }
}

export const bookService = new BookService();

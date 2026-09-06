declare global {
  interface Window {
    Cashfree?: any;
  }
}

const CASHFREE_SCRIPT_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
const STORAGE_KEY_DRAWINGS = 'unlocked_vastu_drawings';
const STORAGE_KEY_BOOKS = 'unlocked_vastu_books';

export interface LaunchCheckoutOptions {
  paymentSessionId: string;
  returnUrl?: string;
  onSuccess?: (data: any) => void;
  onFailure?: (data: any) => void;
}

class CashfreeClientService {
  private sdkPromise: Promise<any> | null = null;

  /**
   * Dynamically loads official Cashfree Web JS SDK v3
   */
  public loadSDK(): Promise<any> {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if (window.Cashfree) return Promise.resolve(window.Cashfree);

    if (!this.sdkPromise) {
      this.sdkPromise = new Promise((resolve) => {
        const existingScript = document.getElementById('cashfree-sdk-script');
        if (existingScript) {
          resolve(window.Cashfree);
          return;
        }

        const script = document.createElement('script');
        script.id = 'cashfree-sdk-script';
        script.src = CASHFREE_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
          try {
            const mode = (import.meta as any).env?.VITE_CASHFREE_ENV || 'sandbox';
            const cashfree = (window as any).Cashfree?.({ mode });
            resolve(cashfree);
          } catch (e) {
            console.warn('[Cashfree SDK] Initialization notice:', e);
            resolve(window.Cashfree);
          }
        };
        script.onerror = () => {
          console.warn('[Cashfree SDK] Failed to load remote script. Fallback flow ready.');
          resolve(null);
        };
        document.body.appendChild(script);
      });
    }

    return this.sdkPromise;
  }

  /**
   * Launch Cashfree Modal / Redirect Checkout
   */
  public async launchCheckout(options: LaunchCheckoutOptions): Promise<boolean> {
    if (!options.paymentSessionId) {
      throw new Error('Payment Session ID is required to launch Cashfree gateway.');
    }

    const cashfree = await this.loadSDK();
    if (!cashfree || typeof cashfree.checkout !== 'function') {
      console.warn('[Cashfree SDK] SDK not available, continuing with server handshake.');
      return false;
    }

    try {
      await cashfree.checkout({
        paymentSessionId: options.paymentSessionId,
        redirectTarget: '_modal',
      });
      return true;
    } catch (err: any) {
      console.warn('[Cashfree SDK] Modal checkout notice:', err.message);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Unlocked State Management (Drawings & Books)
  // ─────────────────────────────────────────────────────────────────────────
  public isDrawingUnlocked(drawingId: string): boolean {
    return this.isItemUnlocked(STORAGE_KEY_DRAWINGS, drawingId);
  }

  public markDrawingUnlocked(drawingId: string): void {
    this.markItemUnlocked(STORAGE_KEY_DRAWINGS, drawingId);
  }

  public isBookUnlocked(bookId: string): boolean {
    return this.isItemUnlocked(STORAGE_KEY_BOOKS, bookId);
  }

  public markBookUnlocked(bookId: string): void {
    this.markItemUnlocked(STORAGE_KEY_BOOKS, bookId);
  }

  private isItemUnlocked(storageKey: string, id: string): boolean {
    if (typeof window === 'undefined' || !id) return false;
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return false;
      const ids: string[] = JSON.parse(stored);
      return ids.includes(id);
    } catch {
      return false;
    }
  }

  private markItemUnlocked(storageKey: string, id: string): void {
    if (typeof window === 'undefined' || !id) return;
    try {
      const stored = localStorage.getItem(storageKey);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(storageKey, JSON.stringify(ids));
      }
    } catch (e) {
      console.error('Error saving unlocked item:', e);
    }
  }
}

export const cashfreeService = new CashfreeClientService();

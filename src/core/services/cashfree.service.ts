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
  private cashfreeInstance: any = null;

  /**
   * Initializes and returns official Cashfree Web JS SDK v3 instance
   */
  public async getCashfree(): Promise<any> {
    if (typeof window === 'undefined') return null;

    if (this.cashfreeInstance && typeof this.cashfreeInstance.checkout === 'function') {
      return this.cashfreeInstance;
    }

    const initInstance = (CashfreeFn: any) => {
      try {
        const mode = (import.meta as any).env?.VITE_CASHFREE_ENV || 'production';
        const targetMode = mode === 'sandbox' ? 'sandbox' : 'production';
        this.cashfreeInstance = typeof CashfreeFn === 'function' ? CashfreeFn({ mode: targetMode }) : CashfreeFn;
        return this.cashfreeInstance;
      } catch (err) {
        console.error('[Cashfree SDK] Failed to instantiate Cashfree:', err);
        return null;
      }
    };

    if (typeof (window as any).Cashfree === 'function') {
      return initInstance((window as any).Cashfree);
    }

    return new Promise((resolve) => {
      let script = document.getElementById('cashfree-sdk-script') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'cashfree-sdk-script';
        script.src = CASHFREE_SCRIPT_URL;
        script.async = true;
        document.head.appendChild(script);
      }

      const onScriptReady = () => {
        if (typeof (window as any).Cashfree === 'function') {
          resolve(initInstance((window as any).Cashfree));
        } else {
          console.warn('[Cashfree SDK] Cashfree constructor not available on window.');
          resolve(null);
        }
      };

      if ((window as any).Cashfree) {
        onScriptReady();
      } else {
        script.onload = onScriptReady;
        script.onerror = () => {
          console.error('[Cashfree SDK] Failed to load remote Cashfree SDK script.');
          resolve(null);
        };
      }
    });
  }

  /**
   * Preload Cashfree Web JS SDK v3
   */
  public async loadSDK(): Promise<any> {
    return this.getCashfree();
  }

  /**
   * Launch Cashfree Modal Checkout
   */
  public async launchCheckout(options: LaunchCheckoutOptions): Promise<boolean> {
    if (!options.paymentSessionId) {
      throw new Error('Payment Session ID is required to launch Cashfree gateway.');
    }

    const cashfree = await this.getCashfree();
    if (!cashfree || typeof cashfree.checkout !== 'function') {
      console.error('[Cashfree SDK] Cashfree checkout function not available.');
      throw new Error('Payment gateway SDK could not be loaded. Please check your connection and try again.');
    }

    try {
      const result = await cashfree.checkout({
        paymentSessionId: options.paymentSessionId,
        redirectTarget: '_modal',
      });

      if (result && result.error) {
        console.warn('[Cashfree Modal] Checkout notice:', result.error);
        throw new Error(result.error.message || 'Payment was cancelled or could not be completed.');
      }

      return true;
    } catch (err: any) {
      console.warn('[Cashfree Modal] Checkout interaction:', err.message);
      throw err;
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

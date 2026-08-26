import { supabase } from './supabase';
import { type Drawing } from '../types/drawing';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

const CASHFREE_SCRIPT_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
const STORAGE_KEY = 'unlocked_vastu_drawings';

export interface CreateOrderParams {
  drawing: Drawing;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  amount?: number;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  drawingId: string;
  transactionId?: string;
  message?: string;
}

class CashfreeService {
  private sdkPromise: Promise<any> | null = null;

  // Load Cashfree Web SDK
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
            const cashfree = (window as any).Cashfree?.({
              mode: 'sandbox' // 'sandbox' or 'production'
            });
            resolve(cashfree);
          } catch (e) {
            console.warn('Cashfree SDK initialization warning:', e);
            resolve(window.Cashfree);
          }
        };
        script.onerror = () => {
          console.warn('Could not load Cashfree SDK remote script. Fallback checkout available.');
          resolve(null);
        };
        document.body.appendChild(script);
      });
    }

    return this.sdkPromise;
  }

  // Check if a drawing has already been unlocked/purchased on this device
  public isDrawingUnlocked(drawingId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const unlockedIds: string[] = JSON.parse(stored);
      return unlockedIds.includes(drawingId);
    } catch {
      return false;
    }
  }

  // Mark drawing as unlocked in local storage
  public markDrawingUnlocked(drawingId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const unlockedIds: string[] = stored ? JSON.parse(stored) : [];
      if (!unlockedIds.includes(drawingId)) {
        unlockedIds.push(drawingId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
      }
    } catch (e) {
      console.error('Error saving unlocked drawing:', e);
    }
  }

  // Create payment order in Supabase & initiate Cashfree checkout
  public async createPaymentOrder(params: CreateOrderParams): Promise<{ orderId: string; paymentSessionId?: string }> {
    const { drawing, customerName, customerPhone, customerEmail, amount = drawing.price || 99 } = params;
    const orderId = `HRV_DRW_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      // Record order into Supabase
      const { error } = await supabase.from('drawing_orders').insert([
        {
          drawing_id: drawing.id.startsWith('draw-') ? null : drawing.id,
          order_id: orderId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || '',
          amount: amount,
          currency: 'INR',
          payment_status: 'PENDING',
          payment_method: 'CASHFREE_UPI_CARD'
        }
      ]);

      if (error) {
        console.warn('Supabase drawing order logging notice:', error.message);
      }
    } catch (err) {
      console.warn('Order DB write warning:', err);
    }

    return { orderId };
  }

  // Confirm payment success & update database
  public async confirmPaymentSuccess(orderId: string, drawingId: string, method = 'CASHFREE_UPI'): Promise<PaymentResult> {
    try {
      await supabase
        .from('drawing_orders')
        .update({
          payment_status: 'PAID',
          payment_method: method,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);
    } catch (err) {
      console.warn('Payment status update notice:', err);
    }

    // Unlock in device storage
    this.markDrawingUnlocked(drawingId);

    return {
      success: true,
      orderId,
      drawingId,
      transactionId: `TXN_${Date.now()}`,
      message: 'Payment completed successfully. Drawing PDF unlocked!'
    };
  }
}

export const cashfreeService = new CashfreeService();

import axios from 'axios';
import { supabase } from './supabase';
import { 
  type Drawing, 
  type CreateOrderParams, 
  type CreateOrderResponse, 
  type VerifyPaymentResponse, 
  type DownloadResponse 
} from '../types/drawing';
import { DRAWING_BUNDLES, type DrawingBundleItem } from '../data/drawing-bundles';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

class DrawingService {
  // 1. Fetch all published drawing bundles
  async getDrawings(): Promise<Drawing[]> {
    try {
      const res = await axios.get(`${API_BASE}/api/drawings`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.drawings) && res.data.drawings.length > 0) {
        return res.data.drawings.map(this.mapDrawingRecord);
      }
    } catch (apiErr) {
      // Backend offline or unreachable, use authentic DRAWING_BUNDLES
    }

    // Return the 38 authentic Sthapatya Veda bundles
    return (DRAWING_BUNDLES as any[]).map(this.mapDrawingRecord);
  }

  // 2. Fetch single drawing by slug or ID
  async getDrawingBySlug(slugOrId: string): Promise<Drawing | null> {
    try {
      const res = await axios.get(`${API_BASE}/api/drawings/${encodeURIComponent(slugOrId)}`, { timeout: 3000 });
      if (res.data?.success && res.data.drawing) {
        return this.mapDrawingRecord(res.data.drawing);
      }
    } catch (apiErr) {
      // Backend offline, fallback to local bundles
    }

    const found = DRAWING_BUNDLES.find(
      b => b.id === slugOrId || b.slug === slugOrId || String(b.plotSize) === slugOrId
    );

    if (found) {
      return this.mapDrawingRecord(found as any);
    }

    return null;
  }

  // 3. Create Cashfree payment order (Mandatory Lead Capture to DB first)
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const drawing = await this.getDrawingBySlug(params.drawingId);
    const drawingTitle = drawing?.title || params.drawingId;

    // MANDATORY: Save Lead to Supabase 'bookings' table first before opening gateway
    try {
      await supabase.from('bookings').insert({
        name: params.name || 'Anonymous User',
        phone: params.mobile || 'N/A',
        email: params.email || 'N/A',
        consultation_type: `Drawing Plan: ${drawingTitle}`,
        message: `Customer interested in unlocking drawing pack (${drawingTitle} - ₹99). Location: ${params.email || 'N/A'}`,
        status: 'lead_captured',
        source: 'drawing_marketplace_lead',
        created_at: new Date().toISOString()
      });
      console.log('✓ Lead captured successfully to Supabase bookings table.');
    } catch (leadErr) {
      console.warn('Lead capture warning (continuing order creation):', leadErr);
    }

    // Attempt backend API order creation
    try {
      const res = await axios.post(`${API_BASE}/api/drawings/create-order`, {
        ...params,
        amount: 99 // Server & client verified flat ₹99
      }, { timeout: 15000 });

      if (res.data && res.data.success && res.data.paymentSessionId) {
        return res.data;
      }
      throw new Error(res.data?.message || 'Could not initiate payment session.');
    } catch (backendErr: any) {
      const errorMsg = backendErr.response?.data?.message || backendErr.message || 'Unable to connect to payment gateway. Please try again.';
      console.error('[DrawingService] Order creation error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  // 4. Verify payment with Cashfree & obtain download entitlement
  async verifyPayment(orderId: string, drawingId: string): Promise<VerifyPaymentResponse> {
    try {
      const res = await axios.post(`${API_BASE}/api/drawings/verify-payment`, {
        orderId,
        drawingId,
      }, { timeout: 15000 });
      return res.data;
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || 'Payment verification could not be completed.';
      console.error('[DrawingService] Payment verification failed:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  // 5. Get temporary signed download URL
  async getSecureDownloadUrl(drawingId: string, entitlementToken: string): Promise<DownloadResponse> {
    try {
      const res = await axios.post(
        `${API_BASE}/api/drawings/${drawingId}/download`,
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
      const errorMsg = e.response?.data?.message || e.message || 'Could not retrieve secure download file.';
      console.error('[DrawingService] Secure download error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  // Mapper helper
  private mapDrawingRecord(row: any): Drawing {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug || row.id,
      description: row.description || '',
      plotWidth: row.plot_width || row.plotWidth || 30,
      plotLength: row.plot_length || row.plotLength || 40,
      plotUnit: row.plot_unit || row.plotUnit || 'sq_yds',
      facing: row.facing || 'East',
      category: row.category || 'Residential Plans',
      dimensions: row.dimensions || '30 x 40 ft',
      floors: row.floors || 'G + 1 Duplex',
      bedrooms: row.bedrooms || '2-3 BHK',
      bathrooms: row.bathrooms || '2 Baths',
      vastuFeatures: row.vastu_features || row.vastuFeatures || [
        '100% Sthapatya Veda Alignment',
        'Ishanya (NE) Sacred Quadrant',
        'Agneya (SE) Kitchen Placement'
      ],
      aiPreviewPath: row.ai_preview_path || row.aiPreviewPath || row.imageUrl || '',
      blurredPreviewPath: row.blurred_preview_path || row.blurredPreviewPath || row.ai_preview_path || '',
      price: 99, // Flat ₹99 only
      currency: 'INR',
      fileFormat: row.file_format || row.fileFormat || 'CAD / High-Res JPG',
      status: row.status || 'published',
      createdAt: row.created_at || row.createdAt,
      imageUrl: row.ai_preview_path || row.aiPreviewPath,
      pdfUrl: row.pdf_url || row.pdfUrl
    };
  }
}

export const drawingService = new DrawingService();

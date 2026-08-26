import axios from 'axios';
import { supabase } from './supabase';
import { 
  type Drawing, 
  type CreateOrderParams, 
  type CreateOrderResponse, 
  type VerifyPaymentResponse, 
  type DownloadResponse 
} from '../types/drawing';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

class DrawingService {
  // 1. Fetch all published drawings (with fallback to direct Supabase query)
  async getDrawings(): Promise<Drawing[]> {
    try {
      const res = await axios.get(`${API_BASE}/api/drawings`, { timeout: 4000 });
      if (res.data?.success && Array.isArray(res.data.drawings)) {
        return res.data.drawings.map(this.mapDrawingRecord);
      }
    } catch (apiErr) {
      console.warn('[DrawingService] Backend API offline or unreachable, querying Supabase directly:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('drawings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(this.mapDrawingRecord);
      }
      return [];
    } catch (error) {
      console.error('[DrawingService] Failed to fetch drawings:', error);
      return [];
    }
  }

  // 2. Fetch single drawing by slug or ID
  async getDrawingBySlug(slugOrId: string): Promise<Drawing | null> {
    try {
      const res = await axios.get(`${API_BASE}/api/drawings/${encodeURIComponent(slugOrId)}`, { timeout: 4000 });
      if (res.data?.success && res.data.drawing) {
        return this.mapDrawingRecord(res.data.drawing);
      }
    } catch (apiErr) {
      console.warn('[DrawingService] Single drawing API fallback to Supabase:', apiErr);
    }

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      const query = supabase.from('drawings').select('*');
      const { data, error } = isUuid 
        ? await query.eq('id', slugOrId).single()
        : await query.eq('slug', slugOrId).single();

      if (error) throw error;
      if (data) {
        return this.mapDrawingRecord(data);
      }
      return null;
    } catch (error) {
      console.error(`[DrawingService] Failed to fetch drawing ${slugOrId}:`, error);
      return null;
    }
  }

  // 3. Create Cashfree payment order on backend
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
    const res = await axios.post(`${API_BASE}/api/drawings/create-order`, params);
    return res.data;
  }

  // 4. Verify payment with Cashfree on backend & obtain cryptographic download entitlement
  async verifyPayment(orderId: string, drawingId: string): Promise<VerifyPaymentResponse> {
    const res = await axios.post(`${API_BASE}/api/drawings/verify-payment`, {
      orderId,
      drawingId,
    });
    return res.data;
  }

  // 5. Get temporary (60-second) signed download URL using cryptographic entitlement token
  async getSecureDownloadUrl(drawingId: string, entitlementToken: string): Promise<DownloadResponse> {
    const res = await axios.post(
      `${API_BASE}/api/drawings/${drawingId}/download`,
      {},
      {
        headers: {
          Authorization: `Bearer ${entitlementToken}`,
        },
      }
    );
    return res.data;
  }

  // Helper mapper to normalize drawing records
  private mapDrawingRecord(d: any): Drawing {
    const plotW = d.plot_width !== undefined ? Number(d.plot_width) : 30;
    const plotL = d.plot_length !== undefined ? Number(d.plot_length) : 40;
    const unit = d.plot_unit || 'ft';
    const computedDimensions = `${plotW}×${plotL} ${unit} (${plotW * plotL} sq.${unit})`;

    let vastuFeatures: string[] = [];
    if (Array.isArray(d.vastu_features)) {
      vastuFeatures = d.vastu_features;
    } else if (typeof d.vastu_features === 'string') {
      try {
        vastuFeatures = JSON.parse(d.vastu_features);
      } catch {
        vastuFeatures = [];
      }
    }

    const aiVisual = d.ai_preview_path || d.constructed_image_url || d.image_url || '';
    const blurredPreview = d.blurred_preview_path || d.image_url || aiVisual;

    return {
      id: d.id,
      title: d.title || 'Vastu Architectural House Plan',
      slug: d.slug || (d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : d.id),
      description: d.description || '',
      plotWidth: plotW,
      plotLength: plotL,
      plotUnit: unit,
      dimensions: d.dimensions || computedDimensions,
      facing: d.facing || 'East',
      category: d.category || 'Residential Plans',
      bedrooms: d.bedrooms || '2 BHK',
      bathrooms: d.bathrooms || '2',
      floors: d.floors || 'Ground Floor',
      vastuFeatures: vastuFeatures.length > 0 ? vastuFeatures : [
        'Simhadwaram aligned with auspicious celestial pada',
        'Pooja room located strictly in Eshanya (North-East)',
        'Kitchen cooking platform positioned in Agneya (South-East)',
        'Master bedroom grounded in Niruthi (South-West)',
        'Brahmasthana kept open and lightweight for cosmic energy circulation'
      ],
      aiPreviewPath: aiVisual,
      blurredPreviewPath: blurredPreview,
      imageUrl: blurredPreview,
      constructedImageUrl: aiVisual,
      price: d.price !== undefined ? Number(d.price) : 99,
      currency: d.currency || 'INR',
      fileFormat: d.file_format || 'image/png',
      status: d.status || 'published',
      createdAt: d.created_at,
    };
  }
}

export const drawingService = new DrawingService();

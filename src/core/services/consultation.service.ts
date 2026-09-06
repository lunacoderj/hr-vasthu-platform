import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

export interface CreateConsultationOrderParams {
  name: string;
  mobile: string;
  email?: string;
  consultationType?: string;
  preferredPlatform?: 'whatsapp_video' | 'google_meet';
  preferredDate?: string;
  preferredTimeSlot?: string;
  propertyDetails?: string;
  notes?: string;
}

export interface ConsultationOrderResponse {
  success: boolean;
  orderId: string;
  paymentSessionId?: string;
  amount: number;
  currency: string;
  message?: string;
}

export interface ConsultationVerificationResponse {
  success: boolean;
  paymentStatus: string;
  orderId: string;
  transactionId?: string;
  consultationDetails?: any;
  complimentaryBooks?: Array<{
    title: string;
    language: string;
    pdfUrl: string;
  }>;
  message?: string;
}

class ConsultationService {
  /**
   * 1. Create ₹999 Online Vastu Consultation Order via Cashfree Production Gateway
   */
  async createOrder(params: CreateConsultationOrderParams): Promise<ConsultationOrderResponse> {
    const res = await axios.post<ConsultationOrderResponse>(`${API_BASE}/api/consultations/create-order`, params);
    return res.data;
  }

  /**
   * 2. Authoritative Verification of ₹999 Consultation Payment
   */
  async verifyPayment(orderId: string): Promise<ConsultationVerificationResponse> {
    const res = await axios.post<ConsultationVerificationResponse>(`${API_BASE}/api/consultations/verify-payment`, { orderId });
    return res.data;
  }
}

export const consultationService = new ConsultationService();

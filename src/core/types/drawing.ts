export interface Drawing {
  id: string;
  title: string;
  slug: string;
  description: string;
  plotWidth?: number;
  plotLength?: number;
  plotUnit?: string;
  facing: 'East' | 'North' | 'West' | 'South' | 'North-East' | 'South-East' | 'North-West' | 'South-West' | string;
  category?: string;
  dimensions?: string;
  floors?: string;
  bedrooms?: string;
  bathrooms?: string;
  vastuFeatures?: string[];
  aiPreviewPath: string; // Public 3D architectural elevation visual
  blurredPreviewPath: string; // Public server-blurred & watermarked drawing preview
  price: number; // Dynamic price from DB (e.g. 99 INR)
  currency: string;
  fileFormat?: string;
  status?: string;
  createdAt?: string;
  
  // Legacy compatibility getters
  imageUrl?: string;
  constructedImageUrl?: string;
  pdfUrl?: string;
  vastuZones?: {
    pooja?: string;
    kitchen?: string;
    masterBedroom?: string;
    living?: string;
    waterSource?: string;
    brahmasthan?: string;
  };
}

export type FacingFilter = 'All' | 'East' | 'North' | 'West' | 'South' | 'North-East' | 'South-East' | 'North-West' | 'South-West';
export type PriceFilter = 'All' | 'Free' | 'Paid';

export interface CreateOrderParams {
  drawingId: string;
  mobile: string;
  email?: string;
  name?: string;
  marketingConsent?: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  customerId: string;
  isMock?: boolean;
}

export interface VerifyPaymentResponse {
  success: boolean;
  paymentStatus: string;
  entitlementToken: string;
  orderId: string;
  drawingId?: string;
  message?: string;
}

export interface DownloadResponse {
  success: boolean;
  downloadUrl: string;
  fileName: string;
  expirySeconds: number;
}

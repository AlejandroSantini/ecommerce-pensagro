import { api } from '@/lib/api';

interface ShippingQuotePayload {
  postal_code: string;
}

interface ShippingQuoteApiResponse {
  status: boolean;
  postal_code?: string;
  best_price?: number;
  best_carrier?: string;
  options: Array<{
    carrier: string;
    service_type: string;
    delivery_days: string;
    estimated_delivery: string | null;
    price_incl_tax: number;
    tags: string[];
    pickup_points: Array<{
      point_id: number;
      description: string;
      open_hours: string | null;
      phone: string | null;
      location: {
        street: string | null;
        street_number: string | null;
        street_extras: string | null;
        city: string | null;
        state: string | null;
        zipcode: string | null;
        geolocation: {
          lat: number;
          lng: number;
          distance: number;
        };
      };
    }>;
  }>;
}

export const shippingService = {
  // POST /api/shipping/quote - Cotizar envío
  quote: async (payload: ShippingQuotePayload): Promise<ShippingQuoteApiResponse> => {
    const response = await api.post<ShippingQuoteApiResponse>('/api/shipping/quote', payload);
    return response;
  },
};

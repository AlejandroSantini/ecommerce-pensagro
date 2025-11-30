import { api, ApiResponse } from '@/lib/api';
import type {
  ShippingAddress,
  CreateShippingAddressPayload,
  ShippingQuotePayload,
} from '@/types';

// Mantener la interfaz interna para la respuesta específica del quote
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

  // GET /api/shipping/client/:clientId - Obtener direcciones del cliente
  getByClient: async (clientId: number): Promise<ShippingAddress[]> => {
    const response = await api.get<ApiResponse<ShippingAddress[]>>(`/api/shipping/client/${clientId}`);
    
    return response.data;
  },

  // POST /api/shipping - Crear nueva dirección
  create: async (payload: CreateShippingAddressPayload): Promise<ShippingAddress> => {
    const response = await api.post<ApiResponse<ShippingAddress>>('/api/shipping', payload);
    return response.data;
  },
};

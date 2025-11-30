// Shipping Types

export interface ShippingAddress {
  id: number;
  client_id: number;
  first_name: string;
  last_name: string;
  address: string;
  apartment: string | null;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  comment: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateShippingAddressPayload {
  client_id: number;
  first_name: string;
  last_name: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  comment?: string;
}

export interface ShippingQuotePayload {
  postal_code: string;
  city?: string;
  province?: string;
  products?: {
    product_id: number;
    variant_id?: number | null;
    quantity: number;
  }[];
}

export interface PickupPoint {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  hours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ShippingOption {
  id: number;
  name: string;
  description: string;
  cost: number;
  estimated_days: string;
  pickup_points: PickupPoint[];
}

export interface ShippingQuoteResponse {
  status: boolean;
  data: ShippingOption[];
}

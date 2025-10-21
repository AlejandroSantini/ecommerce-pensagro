// Coupon Types
export interface Coupon {
  id: number;
  codigo: string;
  descripcion?: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  montoMinimo?: number;
  cantidadMaxima?: number;
  cantidadUsada: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  codigo: string;
  descripcion?: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  montoMinimo?: number;
  cantidadMaxima?: number;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export interface UpdateCouponDto {
  codigo?: string;
  descripcion?: string;
  tipo?: 'porcentaje' | 'fijo';
  valor?: number;
  montoMinimo?: number;
  cantidadMaxima?: number;
  fechaInicio?: string;
  fechaFin?: string;
  activo?: boolean;
}

export interface ValidateCouponDto {
  codigo: string;
  montoVenta: number;
}

export interface ValidateCouponResponse {
  valido: boolean;
  mensaje?: string;
  descuento?: number;
  cupon?: Coupon;
}

// Sale Types
export interface SaleItem {
  id?: number;
  productId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
  producto?: {
    id: number;
    nombre: string;
    sku: string;
    imagen?: string;
  };
}

export interface Sale {
  id: number;
  clienteId: number;
  numeroVenta: string;
  fecha: string;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'mercadopago' | 'getnet';
  estadoPago: 'pendiente' | 'pagado' | 'cancelado' | 'reembolsado';
  estadoVenta: 'pendiente' | 'procesando' | 'completada' | 'cancelada';
  tipoVenta: 'online' | 'offline';
  comentarios?: string;
  items: SaleItem[];
  cuponId?: number;
  envioId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleDto {
  clienteId: number;
  items: {
    productId: number;
    cantidad: number;
    precioUnitario: number;
    descuento?: number;
  }[];
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'mercadopago' | 'getnet';
  tipoVenta: 'online' | 'offline';
  cuponId?: number;
  comentarios?: string;
}

export interface UpdateSaleDto {
  estadoPago?: 'pendiente' | 'pagado' | 'cancelado' | 'reembolsado';
  estadoVenta?: 'pendiente' | 'procesando' | 'completada' | 'cancelada';
  comentarios?: string;
}

export interface SaleFilters {
  clienteId?: number;
  estadoPago?: string;
  estadoVenta?: string;
  tipoVenta?: 'online' | 'offline';
  fechaDesde?: string;
  fechaHasta?: string;
  metodoPago?: string;
}

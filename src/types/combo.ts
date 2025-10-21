// Combo Types
export interface ComboItem {
  productId: number;
  cantidad: number;
  producto?: {
    id: number;
    nombre: string;
    precio: number;
    imagen?: string;
  };
}

export interface Combo {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOriginal: number;
  descuento: number;
  imagen?: string;
  activo: boolean;
  items: ComboItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComboDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  descuento?: number;
  imagen?: string;
  activo?: boolean;
  items: {
    productId: number;
    cantidad: number;
  }[];
}

export interface UpdateComboDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  descuento?: number;
  imagen?: string;
  activo?: boolean;
  items?: {
    productId: number;
    cantidad: number;
  }[];
}

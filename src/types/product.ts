// Product Types
export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  precio: number;
  precioAnterior?: number;
  stock: number;
  stockMinimo?: number;
  iva: number;
  imagen?: string;
  imagenes?: string[];
  destacado: boolean;
  activo: boolean;
  peso?: number;
  dimensiones?: string;
  marca?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  nombre: string;
  descripcion?: string;
  sku: string;
  precio: number;
  precioAnterior?: number;
  stock: number;
  stockMinimo?: number;
  iva: number;
  imagen?: string;
  imagenes?: string[];
  destacado?: boolean;
  activo?: boolean;
  peso?: number;
  dimensiones?: string;
  marca?: string;
}

export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  sku?: string;
  precio?: number;
  precioAnterior?: number;
  stock?: number;
  stockMinimo?: number;
  iva?: number;
  imagen?: string;
  imagenes?: string[];
  destacado?: boolean;
  activo?: boolean;
  peso?: number;
  dimensiones?: string;
  marca?: string;
}

export interface ProductFilters {
  destacado?: boolean;
  activo?: boolean;
  categoria?: number;
  precioMin?: number;
  precioMax?: number;
  search?: string;
}

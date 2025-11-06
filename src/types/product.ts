// Product Types - API Response Structure
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  price_wholesale_usd: string;
  price_retail_usd: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
}

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  stock: number;
  iva: string;
  featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  image_urls: string[];
  categories: ProductCategory[];
  subcategories: ProductCategory[];
  related_products: RelatedProduct[];
  variants: ProductVariant[];
}

export interface ApiProductsResponse {
  status: boolean;
  data: ApiProduct[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Product Types - Internal App Structure (legacy compatibility)
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
  // New fields from API
  variants?: ProductVariant[];
  categories?: ProductCategory[];
  subcategories?: ProductCategory[];
  related_products?: RelatedProduct[];
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

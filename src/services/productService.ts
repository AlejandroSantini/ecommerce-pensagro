import { api } from '@/lib/api';
import type {
  Product,
  ApiProduct,
  ApiProductsResponse,
  PaginatedProductsResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '@/types/product';

// Función para mapear ApiProduct a Product
const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const defaultPrice = apiProduct.variants && apiProduct.variants.length > 0 
    ? parseFloat(apiProduct.variants[0].price_retail_usd)
    : 0;

  return {
    id: parseInt(apiProduct.id),
    nombre: apiProduct.name,
    descripcion: apiProduct.description,
    sku: apiProduct.sku,
    precio: defaultPrice,
    stock: apiProduct.stock,
    iva: parseFloat(apiProduct.iva),
    imagen: apiProduct.image_urls?.[0] || undefined,
    imagenes: apiProduct.image_urls,
    destacado: apiProduct.featured,
    activo: apiProduct.status === 'active',
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
    variants: apiProduct.variants,
    categories: apiProduct.categories,
    subcategories: apiProduct.subcategories,
    related_products: apiProduct.related_products
  };
};

export const productService = {
  // GET /api/products - Listar productos (con filtros y paginación)
  getAll: async (filters?: ProductFilters): Promise<PaginatedProductsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.destacado !== undefined) params.append('featured', String(filters.destacado));
      if (filters.activo !== undefined) params.append('status', filters.activo ? 'active' : 'inactive');
      if (filters.categoria) params.append('category', String(filters.categoria));
      if (filters.precioMin) params.append('priceMin', String(filters.precioMin));
      if (filters.precioMax) params.append('priceMax', String(filters.precioMax));
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const response = await api.get<ApiProductsResponse>(`/api/products${queryString ? `?${queryString}` : ''}`);
    
    return {
      products: response.data.map(mapApiProductToProduct),
      pagination: response.meta
    };
  },

  // GET /api/products/:id - Obtener producto por ID
  getById: async (id: number): Promise<Product> => {
    const response = await api.get<{ status: boolean; data: ApiProduct }>(`/api/products/${id}`);
    return mapApiProductToProduct(response.data);
  },

  // POST /api/products - Crear producto
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<{ status: boolean; data: ApiProduct }>('/api/products', data);
    return mapApiProductToProduct(response.data);
  },

  // PUT /api/products/:id - Actualizar producto
  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put<{ status: boolean; data: ApiProduct }>(`/api/products/${id}`, data);
    return mapApiProductToProduct(response.data);
  },

  // DELETE /api/products/:id - Archivar producto (soft delete)
  delete: async (id: number): Promise<void> => {
    await api.delete<{ status: boolean; message: string }>(`/api/products/${id}`);
  },

  // GET /api/products/search?q= - Buscador
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<ApiProductsResponse>(`/api/products/search?q=${encodeURIComponent(query)}`);
    return response.data.map(mapApiProductToProduct);
  },
};

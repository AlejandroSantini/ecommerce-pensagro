import { fetchApi } from '@/lib/api';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from '@/types/product';

export const productService = {
  // GET /products - Listar productos (con filtros)
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.destacado !== undefined) params.append('destacado', String(filters.destacado));
      if (filters.activo !== undefined) params.append('activo', String(filters.activo));
      if (filters.categoria) params.append('categoria', String(filters.categoria));
      if (filters.precioMin) params.append('precioMin', String(filters.precioMin));
      if (filters.precioMax) params.append('precioMax', String(filters.precioMax));
      if (filters.search) params.append('search', filters.search);
    }

    const queryString = params.toString();
    return fetchApi(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // GET /products/:id - Obtener producto por ID
  getById: async (id: number): Promise<Product> => {
    return fetchApi(`/products/${id}`);
  },

  // POST /products - Crear producto
  create: async (data: CreateProductDto): Promise<Product> => {
    return fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /products/:id - Actualizar producto
  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    return fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /products/:id - Archivar producto (soft delete)
  delete: async (id: number): Promise<void> => {
    return fetchApi(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /products/search?q= - Buscador
  search: async (query: string): Promise<Product[]> => {
    return fetchApi(`/products/search?q=${encodeURIComponent(query)}`);
  },
};

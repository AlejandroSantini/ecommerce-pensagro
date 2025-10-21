import { fetchApi } from '@/lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  LinkProductCategoryDto,
  UnlinkProductCategoryDto,
} from '@/types/category';

export const categoryService = {
  // GET /categories - Listar categorías
  getAll: async (): Promise<Category[]> => {
    return fetchApi('/categories');
  },

  // GET /categories/:id - Obtener categoría por ID
  getById: async (id: number): Promise<Category> => {
    return fetchApi(`/categories/${id}`);
  },

  // POST /categories - Crear categoría
  create: async (data: CreateCategoryDto): Promise<Category> => {
    return fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /categories/:id - Actualizar categoría
  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /categories/:id - Eliminar categoría (soft delete)
  delete: async (id: number): Promise<void> => {
    return fetchApi(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // POST /categories/link - Asociar producto a categoría
  linkProduct: async (data: LinkProductCategoryDto): Promise<void> => {
    return fetchApi('/categories/link', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /categories/product/:product_id - Obtener categorías de un producto
  getByProductId: async (productId: number): Promise<Category[]> => {
    return fetchApi(`/categories/product/${productId}`);
  },

  // DELETE /categories/unlink - Quitar producto de categoría
  unlinkProduct: async (data: UnlinkProductCategoryDto): Promise<void> => {
    return fetchApi('/categories/unlink', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },
};

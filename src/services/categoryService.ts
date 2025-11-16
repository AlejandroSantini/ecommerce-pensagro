import { api } from '@/lib/api';
import type {
  Category,
  ApiCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  LinkProductCategoryDto,
  UnlinkProductCategoryDto,
} from '@/types/category';

const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => {
  return {
    id: parseInt(apiCategory.id),
    nombre: apiCategory.name,
    descripcion: '',
    slug: apiCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    activo: apiCategory.active,
    orden: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subcategorias: apiCategory.subcategories?.map(sub => ({
      id: sub.id,
      nombre: sub.nombre,
      categoriaId: sub.categoria_id
    })) || []
  };
};

export const categoryService = {
  // GET /api/categories - Listar categorías
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<{ status: boolean; data: ApiCategory[] }>('/api/categories');
    return response.data.map(mapApiCategoryToCategory);
  },

  // GET /api/categories/:id - Obtener categoría por ID
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<{ status: boolean; data: ApiCategory }>(`/api/categories/${id}`);
    return mapApiCategoryToCategory(response.data);
  },

  // POST /api/categories - Crear categoría
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<{ status: boolean; data: ApiCategory }>('/api/categories', data);
    return mapApiCategoryToCategory(response.data);
  },

  // PUT /api/categories/:id - Actualizar categoría
  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put<{ status: boolean; data: ApiCategory }>(`/api/categories/${id}`, data);
    return mapApiCategoryToCategory(response.data);
  },

  // DELETE /api/categories/:id - Eliminar categoría (soft delete)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/categories/${id}`);
  },

  // POST /api/categories/link - Asociar producto a categoría
  linkProduct: async (data: LinkProductCategoryDto): Promise<void> => {
    return api.post<void>('/api/categories/link', data);
  },

  // GET /api/categories/product/:product_id - Obtener categorías de un producto
  getByProductId: async (productId: number): Promise<Category[]> => {
    const response = await api.get<{ status: boolean; data: ApiCategory[] }>(`/api/categories/product/${productId}`);
    return response.data.map(mapApiCategoryToCategory);
  },

  // DELETE /api/categories/unlink - Quitar producto de categoría
  unlinkProduct: async (data: UnlinkProductCategoryDto): Promise<void> => {
    // Para DELETE con body, usamos POST con método personalizado o query params
    return api.post<void>('/api/categories/unlink', data);
  },
};

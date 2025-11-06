import { api } from '@/lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  LinkProductCategoryDto,
  UnlinkProductCategoryDto,
} from '@/types/category';

// Sample categories for fallback
const SAMPLE_CATEGORIES = [
  {
    id: 1,
    nombre: 'Herbicidas',
    descripcion: 'Productos para el control de malezas',
    slug: 'herbicidas',
    activo: true,
    orden: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 2,
    nombre: 'Fertilizantes',
    descripcion: 'Nutrientes para tus cultivos',
    slug: 'fertilizantes',
    activo: true,
    orden: 2,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 3,
    nombre: 'Semillas',
    descripcion: 'Semillas de alta calidad para diferentes cultivos',
    slug: 'semillas',
    activo: true,
    orden: 3,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    id: 4,
    nombre: 'Insecticidas',
    descripcion: 'Control de plagas para tus cultivos',
    slug: 'insecticidas',
    activo: true,
    orden: 4,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

export const categoryService = {
  // GET /api/categories - Listar categorías
  getAll: async (): Promise<Category[]> => {
    try {
      return await api.get<Category[]>('/api/categories');
    } catch (error) {
      console.warn('Error fetching categories, using sample data:', error);
      return SAMPLE_CATEGORIES;
    }
  },

  // GET /api/categories/:id - Obtener categoría por ID
  getById: async (id: number): Promise<Category> => {
    return api.get<Category>(`/api/categories/${id}`);
  },

  // POST /api/categories - Crear categoría
  create: async (data: CreateCategoryDto): Promise<Category> => {
    return api.post<Category>('/api/categories', data);
  },

  // PUT /api/categories/:id - Actualizar categoría
  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return api.put<Category>(`/api/categories/${id}`, data);
  },

  // DELETE /api/categories/:id - Eliminar categoría (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/categories/${id}`);
  },

  // POST /api/categories/link - Asociar producto a categoría
  linkProduct: async (data: LinkProductCategoryDto): Promise<void> => {
    return api.post<void>('/api/categories/link', data);
  },

  // GET /api/categories/product/:product_id - Obtener categorías de un producto
  getByProductId: async (productId: number): Promise<Category[]> => {
    return api.get<Category[]>(`/api/categories/product/${productId}`);
  },

  // DELETE /api/categories/unlink - Quitar producto de categoría
  unlinkProduct: async (data: UnlinkProductCategoryDto): Promise<void> => {
    // Para DELETE con body, usamos POST con método personalizado o query params
    return api.post<void>('/api/categories/unlink', data);
  },
};

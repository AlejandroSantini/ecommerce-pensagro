// Category Types
export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  slug: string;
  imagen?: string;
  activo: boolean;
  orden?: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  nombre: string;
  descripcion?: string;
  slug: string;
  imagen?: string;
  activo?: boolean;
  orden?: number;
  parentId?: number;
}

export interface UpdateCategoryDto {
  nombre?: string;
  descripcion?: string;
  slug?: string;
  imagen?: string;
  activo?: boolean;
  orden?: number;
  parentId?: number;
}

export interface LinkProductCategoryDto {
  productId: number;
  categoryId: number;
}

export interface UnlinkProductCategoryDto {
  productId: number;
  categoryId: number;
}

export interface ApiSubcategory {
  id: number;
  nombre: string;
  categoria_id: number;
}

export interface ApiCategory {
  id: string;
  name: string;
  active: boolean;
  subcategories: ApiSubcategory[];
}

export interface Subcategory {
  id: number;
  nombre: string;
  categoriaId: number;
}

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
  subcategorias?: Subcategory[];
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

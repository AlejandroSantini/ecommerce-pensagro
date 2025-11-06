import { api } from '@/lib/api';
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ValidateCouponResponse,
} from '@/types/coupon';

export const couponService = {
  // GET /api/coupons - Listar cupones
  getAll: async (): Promise<Coupon[]> => {
    return api.get<Coupon[]>('/api/coupons');
  },

  // GET /api/coupons/:id - Obtener cupón
  getById: async (id: number): Promise<Coupon> => {
    return api.get<Coupon>(`/api/coupons/${id}`);
  },

  // POST /api/coupons - Crear cupón
  create: async (data: CreateCouponDto): Promise<Coupon> => {
    return api.post<Coupon>('/api/coupons', data);
  },

  // PUT /api/coupons/:id - Actualizar cupón
  update: async (id: number, data: UpdateCouponDto): Promise<Coupon> => {
    return api.put<Coupon>(`/api/coupons/${id}`, data);
  },

  // DELETE /api/coupons/:id - Eliminar cupón
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/coupons/${id}`);
  },

  // POST /api/coupons/validate - Validar cupón para una venta
  validate: async (data: ValidateCouponDto): Promise<ValidateCouponResponse> => {
    return api.post<ValidateCouponResponse>('/api/coupons/validate', data);
  },
};

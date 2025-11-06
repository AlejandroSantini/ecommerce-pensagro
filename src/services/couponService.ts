import { api } from '@/lib/api';
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ValidateCouponResponse,
} from '@/types/coupon';

export const couponService = {
  // GET /coupons - Listar cupones
  getAll: async (): Promise<Coupon[]> => {
    return api.get<Coupon[]>('/coupons');
  },

  // GET /coupons/:id - Obtener cupón
  getById: async (id: number): Promise<Coupon> => {
    return api.get<Coupon>(`/coupons/${id}`);
  },

  // POST /coupons - Crear cupón
  create: async (data: CreateCouponDto): Promise<Coupon> => {
    return api.post<Coupon>('/coupons', data);
  },

  // PUT /coupons/:id - Actualizar cupón
  update: async (id: number, data: UpdateCouponDto): Promise<Coupon> => {
    return api.put<Coupon>(`/coupons/${id}`, data);
  },

  // DELETE /coupons/:id - Eliminar cupón
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/coupons/${id}`);
  },

  // POST /coupons/validate - Validar cupón para una venta
  validate: async (data: ValidateCouponDto): Promise<ValidateCouponResponse> => {
    return api.post<ValidateCouponResponse>('/coupons/validate', data);
  },
};

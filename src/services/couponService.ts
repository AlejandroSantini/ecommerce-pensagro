import { fetchApi } from '@/lib/api';
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
    return fetchApi('/coupons');
  },

  // GET /coupons/:id - Obtener cupón
  getById: async (id: number): Promise<Coupon> => {
    return fetchApi(`/coupons/${id}`);
  },

  // POST /coupons - Crear cupón
  create: async (data: CreateCouponDto): Promise<Coupon> => {
    return fetchApi('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /coupons/:id - Actualizar cupón
  update: async (id: number, data: UpdateCouponDto): Promise<Coupon> => {
    return fetchApi(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /coupons/:id - Eliminar cupón
  delete: async (id: number): Promise<void> => {
    return fetchApi(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  // POST /coupons/validate - Validar cupón para una venta
  validate: async (data: ValidateCouponDto): Promise<ValidateCouponResponse> => {
    return fetchApi('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

import { api } from '@/lib/api';
import type {
  BusinessConfig,
  UpdateConfigDto,
  TaxRate,
  UpdateTaxDto,
} from '@/types/config';

export const configService = {
  // GET /api/config - Obtener configuración actual
  get: async (): Promise<BusinessConfig> => {
    return api.get<BusinessConfig>('/api/config');
  },

  // PUT /api/config - Actualizar configuración
  update: async (data: UpdateConfigDto): Promise<BusinessConfig> => {
    return api.put<BusinessConfig>('/api/config', data);
  },

  // GET /api/config/tax - Obtener IVA disponible
  getTaxRates: async (): Promise<TaxRate[]> => {
    return api.get<TaxRate[]>('/api/config/tax');
  },

  // PUT /api/config/tax - Actualizar tasas de IVA
  updateTaxRates: async (data: UpdateTaxDto): Promise<TaxRate[]> => {
    return api.put<TaxRate[]>('/api/config/tax', data);
  },
};

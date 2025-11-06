import { api } from '@/lib/api';
import type {
  BusinessConfig,
  UpdateConfigDto,
  TaxRate,
  UpdateTaxDto,
} from '@/types/config';

export const configService = {
  // GET /config - Obtener configuración actual
  get: async (): Promise<BusinessConfig> => {
    return api.get<BusinessConfig>('/config');
  },

  // PUT /config - Actualizar configuración
  update: async (data: UpdateConfigDto): Promise<BusinessConfig> => {
    return api.put<BusinessConfig>('/config', data);
  },

  // GET /config/tax - Obtener IVA disponible
  getTaxRates: async (): Promise<TaxRate[]> => {
    return api.get<TaxRate[]>('/config/tax');
  },

  // PUT /config/tax - Actualizar tasas de IVA
  updateTaxRates: async (data: UpdateTaxDto): Promise<TaxRate[]> => {
    return api.put<TaxRate[]>('/config/tax', data);
  },
};

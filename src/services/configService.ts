import { fetchApi } from '@/lib/api';
import type {
  BusinessConfig,
  UpdateConfigDto,
  TaxRate,
  UpdateTaxDto,
} from '@/types/config';

export const configService = {
  // GET /config - Obtener configuración actual
  get: async (): Promise<BusinessConfig> => {
    return fetchApi('/config');
  },

  // PUT /config - Actualizar configuración
  update: async (data: UpdateConfigDto): Promise<BusinessConfig> => {
    return fetchApi('/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // GET /config/tax - Obtener IVA disponible
  getTaxRates: async (): Promise<TaxRate[]> => {
    return fetchApi('/config/tax');
  },

  // PUT /config/tax - Actualizar tasas de IVA
  updateTaxRates: async (data: UpdateTaxDto): Promise<TaxRate[]> => {
    return fetchApi('/config/tax', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

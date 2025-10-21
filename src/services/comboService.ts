import { fetchApi } from '@/lib/api';
import type { Combo, CreateComboDto, UpdateComboDto } from '@/types/combo';

export const comboService = {
  // GET /combos - Listar combos
  getAll: async (): Promise<Combo[]> => {
    return fetchApi('/combos');
  },

  // GET /combos/:id - Obtener combo
  getById: async (id: number): Promise<Combo> => {
    return fetchApi(`/combos/${id}`);
  },

  // POST /combos - Crear combo
  create: async (data: CreateComboDto): Promise<Combo> => {
    return fetchApi('/combos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /combos/:id - Actualizar combo
  update: async (id: number, data: UpdateComboDto): Promise<Combo> => {
    return fetchApi(`/combos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /combos/:id - Eliminar combo (soft delete)
  delete: async (id: number): Promise<void> => {
    return fetchApi(`/combos/${id}`, {
      method: 'DELETE',
    });
  },
};

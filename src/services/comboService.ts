import { api } from '@/lib/api';
import type { Combo, CreateComboDto, UpdateComboDto } from '@/types/combo';

export const comboService = {
  // GET /api/combos - Listar combos
  getAll: async (): Promise<Combo[]> => {
    return api.get<Combo[]>('/api/combos');
  },

  // GET /api/combos/:id - Obtener combo
  getById: async (id: number): Promise<Combo> => {
    return api.get<Combo>(`/api/combos/${id}`);
  },

  // POST /api/combos - Crear combo
  create: async (data: CreateComboDto): Promise<Combo> => {
    return api.post<Combo>('/api/combos', data);
  },

  // PUT /api/combos/:id - Actualizar combo
  update: async (id: number, data: UpdateComboDto): Promise<Combo> => {
    return api.put<Combo>(`/api/combos/${id}`, data);
  },

  // DELETE /api/combos/:id - Eliminar combo (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/combos/${id}`);
  },
};

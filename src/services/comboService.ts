import { api } from '@/lib/api';
import type { Combo, CreateComboDto, UpdateComboDto } from '@/types/combo';

export const comboService = {
  // GET /combos - Listar combos
  getAll: async (): Promise<Combo[]> => {
    return api.get<Combo[]>('/combos');
  },

  // GET /combos/:id - Obtener combo
  getById: async (id: number): Promise<Combo> => {
    return api.get<Combo>(`/combos/${id}`);
  },

  // POST /combos - Crear combo
  create: async (data: CreateComboDto): Promise<Combo> => {
    return api.post<Combo>('/combos', data);
  },

  // PUT /combos/:id - Actualizar combo
  update: async (id: number, data: UpdateComboDto): Promise<Combo> => {
    return api.put<Combo>(`/combos/${id}`, data);
  },

  // DELETE /combos/:id - Eliminar combo (soft delete)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/combos/${id}`);
  },
};

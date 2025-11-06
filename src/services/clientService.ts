import { api } from '@/lib/api';
import type { Client, UpdateClientDto } from '@/types/client';

export const clientService = {
  // GET /api/clients - Listar clientes
  getAll: async (): Promise<Client[]> => {
    return api.get<Client[]>('/api/clients');
  },

  // GET /api/clients/:id - Obtener cliente por ID
  getById: async (id: number): Promise<Client> => {
    return api.get<Client>(`/api/clients/${id}`);
  },

  // PUT /api/clients/:id - Actualizar cliente
  update: async (id: number, data: UpdateClientDto): Promise<Client> => {
    return api.put<Client>(`/api/clients/${id}`, data);
  },
};

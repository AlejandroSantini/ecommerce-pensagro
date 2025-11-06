import { api } from '@/lib/api';
import type { Client, UpdateClientDto } from '@/types/client';

export const clientService = {
  // GET /clients - Listar clientes
  getAll: async (): Promise<Client[]> => {
    return api.get<Client[]>('/clients');
  },

  // GET /clients/:id - Obtener cliente por ID
  getById: async (id: number): Promise<Client> => {
    return api.get<Client>(`/clients/${id}`);
  },

  // PUT /clients/:id - Actualizar cliente
  update: async (id: number, data: UpdateClientDto): Promise<Client> => {
    return api.put<Client>(`/clients/${id}`, data);
  },
};

import { fetchApi } from '@/lib/api';
import type { Client, UpdateClientDto } from '@/types/client';

export const clientService = {
  // GET /clients - Listar clientes
  getAll: async (): Promise<Client[]> => {
    return fetchApi('/clients');
  },

  // GET /clients/:id - Obtener cliente por ID
  getById: async (id: number): Promise<Client> => {
    return fetchApi(`/clients/${id}`);
  },

  // PUT /clients/:id - Actualizar cliente
  update: async (id: number, data: UpdateClientDto): Promise<Client> => {
    return fetchApi(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

import { api } from '@/lib/api';
import type {
  User,
  UpdateUserDto,
} from '@/types/user';

export const userService = {
  // GET /api/users - Listar todos los usuarios (protegida)
  getAll: async (): Promise<User[]> => {
    return api.get<User[]>('/api/users');
  },

  // GET /api/users/:id - Obtener usuario por ID (protegida)
  getById: async (id: number): Promise<User> => {
    return api.get<User>(`/api/users/${id}`);
  },

  // PUT /api/users/:id - Actualizar datos de usuario (protegida)
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    return api.put<User>(`/api/users/${id}`, data);
  },

  // DELETE /api/users/:id - Eliminar usuario (protegida)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/users/${id}`);
  },
};

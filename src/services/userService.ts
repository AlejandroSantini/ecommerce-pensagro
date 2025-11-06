import { api } from '@/lib/api';
import type {
  User,
  UpdateUserDto,
} from '@/types/user';

export const userService = {
  // GET /users - Listar todos los usuarios (protegida)
  getAll: async (): Promise<User[]> => {
    return api.get<User[]>('/users');
  },

  // GET /users/:id - Obtener usuario por ID (protegida)
  getById: async (id: number): Promise<User> => {
    return api.get<User>(`/users/${id}`);
  },

  // PUT /users/:id - Actualizar datos de usuario (protegida)
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    return api.put<User>(`/users/${id}`, data);
  },

  // DELETE /users/:id - Eliminar usuario (protegida)
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/users/${id}`);
  },
};

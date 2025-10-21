import { fetchApi } from '@/lib/api';
import type {
  User,
  RegisterUserDto,
  LoginDto,
  LoginResponse,
  UpdateUserDto,
} from '@/types/user';

export const userService = {
  // POST /users/register - Crear usuario
  register: async (data: RegisterUserDto): Promise<LoginResponse> => {
    return fetchApi('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // POST /users/login - Login y obtención de token
  login: async (data: LoginDto): Promise<LoginResponse> => {
    return fetchApi('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /users - Listar todos los usuarios
  getAll: async (): Promise<User[]> => {
    return fetchApi('/users');
  },

  // GET /users/:id - Obtener usuario por ID
  getById: async (id: number): Promise<User> => {
    return fetchApi(`/users/${id}`);
  },

  // PUT /users/:id - Actualizar datos de usuario
  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  client_id?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  dni: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  password?: string;
  estado?: 'activo' | 'inactivo';
}

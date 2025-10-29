// User Types
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  rol: 'admin' | 'cliente';
  estado: 'activo' | 'inactivo';
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol?: 'admin' | 'cliente';
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

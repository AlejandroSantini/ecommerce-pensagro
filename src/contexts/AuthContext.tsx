'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import { api, ApiResponse, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: { name: string; email: string; phone: string; password: string; dni: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/users/login', {
        email,
        password
      });
      
      if (response.status && response.data) {
        const authData = response.data;
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({
          id: authData.user.id,
          name: authData.user.name,
          email: authData.user.email,
          client_id: authData.user.client_id
        }));
        setUser(authData.user);
        return authData;
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new Error(error.message || 'Credenciales incorrectas');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string; dni: string }): Promise<AuthResponse> => {
    if (isLoading) {
      throw new Error('Ya hay un registro en proceso');
    }
    
    setIsLoading(true);
    try {
      interface RegisterData {
        id: string;
        name: string;
        email: string;
        client_id: string;
      }
      const response = await api.post<ApiResponse<RegisterData>>('/api/users/register', userData);
      
      if (response.status && response.data) {
        const user: User = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          client_id: parseInt(response.data.client_id)
        };
        
        const authData: AuthResponse = {
          user,
          token: ''
        };
        
        setUser(user);
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        
        return authData;
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/api/users/logout');
    } catch (error) {
      console.warn('Error al hacer logout en el servidor:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const getCurrentUser = (): AuthResponse | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        return {
          user: JSON.parse(userData),
          token: token
        };
      }
      return null;
    } catch {
      return null;
    }
  };



  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser && savedUser.token) {
      setUser(savedUser.user);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

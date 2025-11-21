// API Helper usando Axios para hacer llamadas al backend
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Debug: verificar qué URL se está usando
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(statusText);
    this.name = 'ApiError';
  }
}

// Interfaces for API responses
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Lista de endpoints públicos que no requieren autenticación
const PUBLIC_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/combos',
  '/api/popups',
  '/api/shipping/quote',
  '/api/config',
];

// Función para verificar si un endpoint es público
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Solo agregar token si existe Y el endpoint no es público
      if (token && config.url && !isPublicEndpoint(config.url)) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status || 0;
    const statusText = error.response?.statusText || 'Network Error';
    const errorData = error.response?.data || error.message;
    const requestUrl = error.config?.url || '';

    // Si es error 401 en un endpoint protegido (no público), limpiar token y mostrar mensaje amigable
    if (status === 401 && !isPublicEndpoint(requestUrl)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      throw new ApiError(
        401, 
        'Necesitas estar logueado para realizar esta acción',
        { message: 'Necesitas estar logueado para realizar esta acción' }
      );
    }

    throw new ApiError(status, statusText, errorData);
  }
);

export const api = {
  get: async <T = unknown>(endpoint: string): Promise<T> => {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  },

  post: async <T = unknown>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(endpoint, data);
    return response.data;
  },

  put: async <T = unknown>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.put<T>(endpoint, data);
    return response.data;
  },

  patch: async <T = unknown>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.patch<T>(endpoint, data);
    return response.data;
  },

  delete: async <T = unknown>(endpoint: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(endpoint);
    return response.data;
  },
};

// Exportar la instancia por si se necesita acceso directo
export { axiosInstance };

// Re-export para compatibilidad
export const fetchApi = api.get;

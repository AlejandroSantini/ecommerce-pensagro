// API Helper para hacer llamadas al backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

// Define a flag to determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // In server environment with no API URL, use mock data silently in development
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    if (isDevelopment) {
      console.warn(`API_BASE_URL not defined in server environment. Endpoint: ${endpoint}`);
      // Return an empty array for GET requests or null for other methods
      // This allows the application to continue without errors
      return (options.method === undefined || options.method === 'GET' ? [] : null) as T;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Timeout para evitar esperas infinitas
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

  try {
    // Obtener token de las cookies si existe (solo en cliente)
    const token = typeof window !== 'undefined' 
      ? document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1]
      : null;

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => headers.set(key, value));
      } else if (Array.isArray(options.headers)) {
        (options.headers as string[][]).forEach(([key, value]) => headers.set(key, value));
      } else {
        Object.entries(options.headers as Record<string, unknown>).forEach(([key, value]) =>
          headers.set(key, String(value))
        );
      }
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Si la respuesta no es OK, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, response.statusText, errorData);
    }

    // Si la respuesta es 204 No Content, retornar null
    if (response.status === 204) {
      return null as T;
    }

    // Parsear y retornar JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Si es AbortError, significa que se excedió el timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('API request timed out. Please try again later.');
    }
    
    // Si es ApiError, re-lanzar
    if (error instanceof ApiError) {
      throw error;
    }

    // Si es error de red u otro, lanzar error genérico
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

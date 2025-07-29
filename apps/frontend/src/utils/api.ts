const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '/api' // Use Vercel API routes in production
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// Usar la API key desde las= variables de entorno
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// API configuration loaded

// Create axios instance with default configuration
const api = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'x-api-key': API_KEY }),
  },
};

// Generic request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Corregido: evitar duplicar '/api' en la URL
  let baseUrl = api.baseURL;
  let cleanEndpoint = endpoint;

  // Si baseUrl termina con '/api' y endpoint comienza con '/api', elimina uno
  if (baseUrl.endsWith('/api') && endpoint.startsWith('/api')) {
    cleanEndpoint = endpoint.replace(/^\/api/, '');
  }

  // Si baseUrl termina con '/' y endpoint comienza con '/', elimina uno
  if (baseUrl.endsWith('/') && cleanEndpoint.startsWith('/')) {
    cleanEndpoint = cleanEndpoint.substring(1);
  }

  // Eliminar todos los dobles slashes excepto después de 'http(s):'
  const url = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${cleanEndpoint}`
    .replace(/([^:]\/)\/+/, '$1/')
    .replace(/([^:]\/)\/+/, '$1/'); // Aplica dos veces para casos consecutivos

  // Optimized: removed debug log for better performance

  const config: RequestInit = {
    credentials: 'include', // Include cookies for sessions
    headers: {
      ...api.headers,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API methods
export const apiClient = {
  // Search endpoints
  search: {
    offerings: (params: Record<string, unknown> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request(`/search?${searchParams.toString()}`);
    },
    filters: () => request('/search/filters'),
    byId: (id: number) => request(`/search/${id}`),
  },

  // Careers endpoints
  careers: {
    list: (params: Record<string, unknown> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request(`/careers?${searchParams.toString()}`);
    },
    byId: (id: number) => request(`/careers/${id}`),
    byInstitution: (
      institution: string,
      params: Record<string, unknown> = {}
    ) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request(
        `/careers/institution/${encodeURIComponent(institution)}?${searchParams.toString()}`
      );
    },
  },

  // Institutions endpoints
  institutions: {
    list: (params: Record<string, unknown> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request(`/institutions?${searchParams.toString()}`);
    },
    byName: (name: string) =>
      request(`/institutions/${encodeURIComponent(name)}`),
  },

  // Chatbot endpoints
  chatbot: {
    sendMessage: (message: string, context?: string) =>
      request('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
      }),
    health: () => request('/chatbot/health'),
  },

  // Health check
  health: () => request('/health'),
};

export default apiClient;
// Agregar importación para RequestInit si no está disponible globalmente
// import type { RequestInit } from 'node-fetch'; // Descomentar si es necesario

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
// API_KEY removed - using session-based authentication

// Create axios instance with default configuration
const api = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Generic request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${api.baseURL}${endpoint}`;

  const config: RequestInit = {
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
    offerings: (params: Record<string, any> = {}) => {
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
    list: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      return request(`/careers?${searchParams.toString()}`);
    },
    byId: (id: number) => request(`/careers/${id}`),
    byInstitution: (institution: string, params: Record<string, any> = {}) => {
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
    list: (params: Record<string, any> = {}) => {
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

// Refactored API Client - SOLID principles, DRY, Clean Code
import {
  API,
  ApiResponse,
  FilterOptions,
  SearchFilters,
  SearchResult,
} from '@academic/shared-types';

// Global type declarations for Node.js environment
declare global {
  interface RequestInit {
    headers?: Record<string, string>;
    method?: string;
    body?: string;
    signal?: AbortSignal;
  }
}

class ApiClient {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // API Key for development - in production use proper authentication
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'x-api-key': this.apiKey }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`API request failed for ${endpoint}:`, error);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', endpoint);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown API error',
        endpoint
      );
    }
  }

  // Search operations
  readonly search = {
    offerings: async (
      filters: SearchFilters = {}
    ): Promise<ApiResponse<SearchResult>> => {
      const queryParams = this.buildQueryParams(filters);
      const endpoint = `/search${queryParams ? `?${queryParams}` : ''}`;
      return this.request<SearchResult>(endpoint);
    },

    filters: async (): Promise<ApiResponse<FilterOptions>> => {
      return this.request<FilterOptions>('/search/filters');
    },

    byId: async (id: string): Promise<ApiResponse<unknown>> => {
      return this.request(`/search/${encodeURIComponent(id)}`);
    },
  };

  // Chatbot operations
  readonly chatbot = {
    sendMessage: async (
      message: string
    ): Promise<ApiResponse<{ message: string }>> => {
      return this.request('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },

    health: async (): Promise<ApiResponse<{ status: string }>> => {
      return this.request('/chatbot/health');
    },
  };

  // Health check
  readonly health = async (): Promise<ApiResponse<{ status: string }>> => {
    return this.request('/health');
  };

  private buildQueryParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (this.isValidParam(value)) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  private isValidParam(value: unknown): boolean {
    return value !== undefined && value !== null && value !== '';
  }
}

// Custom error class for better error handling
export class ApiError extends Error {
  public endpoint: string;
  public statusCode?: number;

  constructor(message: string, endpoint: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.endpoint = endpoint;
    this.statusCode = statusCode;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Legacy exports for backward compatibility
export const fetchAcademicOfferings = () => apiClient.search.offerings();
export const sendChatMessage = (message: string) =>
  apiClient.chatbot.sendMessage(message);
export const searchOfferings = (filters: SearchFilters) =>
  apiClient.search.offerings(filters);

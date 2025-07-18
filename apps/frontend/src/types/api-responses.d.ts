// API Response type definitions for better type safety

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface ChatbotResponse {
  message: string;
  timestamp: string;
}

export interface SearchResponse {
  data: AcademicProgram[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    modalidades: string[];
    instituciones: string[];
    areas: string[];
    niveles: string[];
  };
}

export interface FilterOptionsResponse {
  modalidades: string[];
  instituciones: string[];
  areas: string[];
  niveles: string[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
  details?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Rate limit response
export interface RateLimitResponse extends ErrorResponse {
  retryAfter: number;
}

// Authentication responses
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// Health check response
export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services?: {
    database: 'up' | 'down';
    ai: 'up' | 'down';
    cache: 'up' | 'down';
  };
}

// Generic API client response wrapper
export type ApiClientResponse<T> = Promise<ApiResponse<T>>;

const apiResponsesTypes = {};
export default apiResponsesTypes;

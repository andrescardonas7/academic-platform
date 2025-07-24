// Shared types and interfaces to reduce duplication

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface SearchFilters {
  modalidad: string;
  institucion: string;
  carrera: string;
  precio: string;
}

export interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface BaseApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

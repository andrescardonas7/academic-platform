// Unified types - Single source of truth for frontend
export interface AcademicProgram {
  Id: string;
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion: string;
  nivel_programa: string;
  enlace: string;
}

export interface SearchFilters {
  q?: string;
  modalidad?: string;
  institucion?: string;
  nivel?: string;
  area?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  data: AcademicProgram[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: SearchFilters;
}

export interface FilterOptions {
  modalidades: string[];
  instituciones: string[];
  areas: string[];
  niveles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

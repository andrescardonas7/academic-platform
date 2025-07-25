// Basic types for Railway deployment (without workspace dependencies)

export interface AcademicProgram {
  Id: string;  // Changed from id: number to match Supabase column
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion?: string;
  nivel_programa?: string;
  enlace?: string;
  created_at?: string;
  updated_at?: string;
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

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

import { useEffect, useState } from 'react';
import { apiClient } from '../utils/api';

export interface AcademicOffering {
  id: number;
  nombre: string;
  descripcion: string;
  institucion: string;
  modalidad: string;
  nivel: string;
  area: string;
  duracion: number;
  costo?: number;
  requisitos?: string;
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
  data: AcademicOffering[];
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
  niveles: string[];
  areas: string[];
}

export function useAcademicOfferings() {
  const [offerings, setOfferings] = useState<AcademicOffering[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    SearchResult['pagination'] | null
  >(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );

  // Load filter options
  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.search.filters();
      setFilterOptions((response as { data?: FilterOptions }).data || null);
    } catch (err) {
      console.error('Error loading filter options:', err);
      setError('Error loading filter options');
    } finally {
      setLoading(false);
    }
  };

  // Search offerings with filters
  const searchOfferings = async (searchFilters: SearchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.search.offerings(
        searchFilters as Record<string, unknown>
      );

      setOfferings((response as { data?: AcademicOffering[] }).data || []);
      setPagination(
        (response as { pagination?: SearchResult['pagination'] }).pagination ||
          null
      );
      setFilters((response as { filters?: SearchFilters }).filters || {});
    } catch (err) {
      console.error('Error searching offerings:', err);
      setError(
        err instanceof Error ? err.message : 'Error searching offerings'
      );
      setOfferings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadFilterOptions();
    searchOfferings();
  }, []);

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      searchOfferings({ ...filters, page });
    }
  };

  const nextPage = () => {
    if (pagination?.hasNext) {
      goToPage(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrev) {
      goToPage(pagination.page - 1);
    }
  };

  // Filter functions
  const applyFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to page 1
    searchOfferings(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { page: 1 };
    searchOfferings(clearedFilters);
  };

  const updateSearchQuery = (query: string) => {
    applyFilters({ q: query });
  };

  return {
    offerings,
    loading,
    error,
    pagination,
    filters,
    filterOptions,
    searchOfferings,
    applyFilters,
    clearFilters,
    updateSearchQuery,
    goToPage,
    nextPage,
    prevPage,
    loadFilterOptions,
  };
}

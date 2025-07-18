import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SearchFilters {
  modalidad: string;
  institucion: string;
  carrera: string;
  precio: string;
  jornada: string;
}

interface SearchState {
  // State
  query: string;
  filters: SearchFilters;
  selectedProgram: Record<string, unknown> | null;
  currentPage: number;
  pageSize: number;

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  setSelectedProgram: (program: Record<string, unknown> | null) => void;
  setCurrentPage: (page: number) => void;
  resetSearch: () => void;
}

const initialFilters: SearchFilters = {
  modalidad: '',
  institucion: '',
  carrera: '',
  precio: '',
  jornada: '',
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      // Initial state
      query: '',
      filters: initialFilters,
      selectedProgram: null,
      currentPage: 1,
      pageSize: 12,

      // Actions
      setQuery: (query: string) => {
        set({ query, currentPage: 1 }); // Reset to first page when query changes
      },

      setFilters: (newFilters: Partial<SearchFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        }));
      },

      clearFilters: () => {
        set({ filters: initialFilters, currentPage: 1 });
      },

      setSelectedProgram: (program: Record<string, unknown> | null) => {
        set({ selectedProgram: program });
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      resetSearch: () => {
        set({
          query: '',
          filters: initialFilters,
          selectedProgram: null,
          currentPage: 1,
        });
      },
    }),
    {
      name: 'academic-search-storage',
      partialize: (state) => ({
        filters: state.filters,
        pageSize: state.pageSize,
      }),
    }
  )
);

/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach */

import { supabase } from '../../config/supabase';
import { AppError } from '../../utils/ErrorHandler';
import { SearchService } from '../SearchService';

// Mock helpers to reduce nesting
const createMockResponse = (
  data: any,
  error: any = null,
  count: number = 0
) => ({
  data,
  error,
  count,
});

const createMockRange = (response: any) =>
  jest.fn(() => Promise.resolve(response));

const createMockSelect = (rangeResponse: any) =>
  jest.fn(() => ({
    range: createMockRange(rangeResponse),
  }));

const createMockLimit = (response: any) =>
  jest.fn(() => Promise.resolve(response));

const createMockSelectWithLimit = (limitResponse: any) =>
  jest.fn(() => ({
    limit: createMockLimit(limitResponse),
  }));

// Mock de Supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('SearchService', () => {
  let searchService: SearchService;
  const mockSupabaseFrom = supabase.from as jest.MockedFunction<
    typeof supabase.from
  >;

  beforeEach(() => {
    searchService = new SearchService();
    jest.clearAllMocks();
  });

  describe('searchOfferings', () => {
    it('should return search results successfully', async () => {
      const mockData = [
        {
          Id: '1',
          carrera: 'Ingeniería de Sistemas',
          institucion: 'Universidad Test',
          modalidad: 'Presencial',
          duracion_semestres: 8,
          valor_semestre: 1000000,
          clasificacion: 'Ingeniería',
          nivel_programa: 'Pregrado',
          enlace: 'http://test.com',
        },
      ];

      const response = createMockResponse(mockData, null, 1);
      const mockSelect = createMockSelect(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.searchOfferings({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: mockData,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          page: 1,
          limit: 10,
        },
      });

      expect(mockSupabaseFrom).toHaveBeenCalledWith('oferta_academica');
      expect(mockSelect).toHaveBeenCalledWith('*', { count: 'exact' });
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };
      const response = createMockResponse(null, mockError, null);
      const mockSelect = createMockSelect(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      await expect(searchService.searchOfferings()).rejects.toThrow(AppError);
    });

    it('should apply pagination correctly', async () => {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        Id: `${i + 1}`,
        carrera: `Carrera ${i + 1}`,
        institucion: 'Universidad Test',
        modalidad: 'Presencial',
        duracion_semestres: 8,
        valor_semestre: 1000000,
        clasificacion: 'Test',
        nivel_programa: 'Pregrado',
        enlace: 'http://test.com',
      }));

      const response = createMockResponse(mockData.slice(0, 3), null, 5);
      const mockSelect = createMockSelect(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.searchOfferings({
        page: 1,
        limit: 3,
      });

      const mockRange = mockSelect().range;
      expect(mockRange).toHaveBeenCalledWith(0, 2); // offset 0, limit 3 -> range(0, 2)
      expect(result.pagination).toEqual({
        page: 1,
        limit: 3,
        total: 5,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should handle empty results', async () => {
      const response = createMockResponse([], null, 0);
      const mockSelect = createMockSelect(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.searchOfferings();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should limit maximum page size', async () => {
      const response = createMockResponse([], null, 0);
      const mockSelect = createMockSelect(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      await searchService.searchOfferings({
        limit: 1000, // Excede el límite máximo
      });

      // Debería usar el límite máximo permitido (100)
      const mockRange = mockSelect().range;
      expect(mockRange).toHaveBeenCalledWith(0, 99); // limit 100 -> range(0, 99)
    });
  });

  describe('getFilterOptions', () => {
    it('should return unique filter options', async () => {
      const mockData = [
        {
          modalidad: 'Presencial',
          institucion: 'Universidad A',
          clasificacion: 'Ingeniería',
          nivel_programa: 'Pregrado',
        },
        {
          modalidad: 'Virtual',
          institucion: 'Universidad A',
          clasificacion: 'Medicina',
          nivel_programa: 'Pregrado',
        },
        {
          modalidad: 'Presencial',
          institucion: 'Universidad B',
          clasificacion: 'Ingeniería',
          nivel_programa: 'Posgrado',
        },
      ];

      const response = { data: mockData, error: null };
      const mockSelect = createMockSelectWithLimit(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.getFilterOptions();

      expect(result).toEqual({
        modalidades: ['Presencial', 'Virtual'],
        instituciones: ['Universidad A', 'Universidad B'],
        areas: ['Ingeniería', 'Medicina'],
        niveles: ['Posgrado', 'Pregrado'], // Ordenados alfabéticamente
      });
    });

    it('should handle database errors in filter options', async () => {
      const mockError = { message: 'Database error' };
      const response = { data: null, error: mockError };
      const mockSelect = createMockSelectWithLimit(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as unknown);

      await expect(searchService.getFilterOptions()).rejects.toThrow(AppError);
    });

    it('should filter out null and undefined values', async () => {
      const mockData = [
        {
          modalidad: 'Presencial',
          institucion: null,
          clasificacion: 'Ingeniería',
          nivel_programa: undefined,
        },
        {
          modalidad: '',
          institucion: 'Universidad A',
          clasificacion: 'Medicina',
          nivel_programa: 'Pregrado',
        },
      ];

      const response = { data: mockData, error: null };
      const mockSelect = createMockSelectWithLimit(response);

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as unknown);

      const result = await searchService.getFilterOptions();

      expect(result).toEqual({
        modalidades: ['Presencial'],
        instituciones: ['Universidad A'],
        areas: ['Ingeniería', 'Medicina'],
        niveles: ['Pregrado'],
      });
    });
  });
});

import { supabase } from '../../config/supabase';
import { AppError } from '../../utils/ErrorHandler';
import { SearchService } from '../SearchService';

// Mock de Supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        range: jest.fn(() => ({
          data: [],
          error: null,
          count: 0,
        })),
      })),
    })),
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

      const mockSelect = jest.fn(() => ({
        range: jest.fn(() =>
          Promise.resolve({
            data: mockData,
            error: null,
            count: 1,
          })
        ),
      }));

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

      const mockSelect = jest.fn(() => ({
        range: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: mockError,
            count: null,
          })
        ),
      }));

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

      const mockRange = jest.fn(() =>
        Promise.resolve({
          data: mockData.slice(0, 3),
          error: null,
          count: 5,
        })
      );

      const mockSelect = jest.fn(() => ({
        range: mockRange,
      }));

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.searchOfferings({
        page: 1,
        limit: 3,
      });

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
      const mockSelect = jest.fn(() => ({
        range: jest.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
            count: 0,
          })
        ),
      }));

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await searchService.searchOfferings();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should limit maximum page size', async () => {
      const mockSelect = jest.fn(() => ({
        range: jest.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
            count: 0,
          })
        ),
      }));

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

      const mockSelect = jest.fn(() => ({
        limit: jest.fn(() =>
          Promise.resolve({
            data: mockData,
            error: null,
          })
        ),
      }));

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

      const mockSelect = jest.fn(() => ({
        limit: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: mockError,
          })
        ),
      }));

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

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

      const mockSelect = jest.fn(() => ({
        limit: jest.fn(() =>
          Promise.resolve({
            data: mockData,
            error: null,
          })
        ),
      }));

      mockSupabaseFrom.mockReturnValue({
        select: mockSelect,
      } as any);

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

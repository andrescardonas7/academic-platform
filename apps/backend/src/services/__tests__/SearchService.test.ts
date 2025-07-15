// TDD - Tests for SearchService
import { PAGINATION } from '@academic/shared-types';
import { SearchService } from '../SearchService';

// Mock Supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        range: jest.fn(() => ({
          then: jest.fn(),
        })),
        limit: jest.fn(() => ({
          then: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService();
    jest.clearAllMocks();
  });

  describe('searchOfferings', () => {
    it('should use default pagination when no filters provided', async () => {
      // Arrange
      const mockData = [{ Id: '1', carrera: 'Test' }];
      const mockSupabase = require('../../config/supabase').supabase;

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
            count: 1,
          }),
        }),
      });

      // Act
      const result = await searchService.searchOfferings();

      // Assert
      expect(result.pagination.limit).toBe(PAGINATION.DEFAULT_LIMIT);
      expect(result.pagination.page).toBe(PAGINATION.DEFAULT_PAGE);
    });

    it('should respect maximum limit', async () => {
      // Arrange
      const filters = { limit: 200 }; // Exceeds MAX_LIMIT

      // Act
      const result = await searchService.searchOfferings(filters);

      // Assert
      expect(result.pagination.limit).toBe(PAGINATION.MAX_LIMIT);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const mockSupabase = require('../../config/supabase').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
            count: 0,
          }),
        }),
      });

      // Act & Assert
      await expect(searchService.searchOfferings()).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getFilterOptions', () => {
    it('should return unique values for each filter', async () => {
      // Arrange
      const mockData = [
        { modalidad: 'Virtual', institucion: 'UNAL' },
        { modalidad: 'Virtual', institucion: 'UdeA' }, // Duplicate modalidad
        { modalidad: 'Presencial', institucion: 'UNAL' }, // Duplicate institucion
      ];

      const mockSupabase = require('../../config/supabase').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      // Act
      const result = await searchService.getFilterOptions();

      // Assert
      expect(result.modalidades).toHaveLength(2);
      expect(result.instituciones).toHaveLength(2);
      expect(result.modalidades).toContain('Virtual');
      expect(result.modalidades).toContain('Presencial');
    });
  });
});

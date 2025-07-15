// Refactored SearchService - SOLID principles
import {
  AcademicProgram,
  FilterOptions,
  PAGINATION,
  SearchFilters,
  SearchResult,
} from '@academic/shared-types';
import { supabase } from '../config/supabase';
import { ISearchService } from '../interfaces/ISearchService';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';

export class SearchService implements ISearchService {
  private readonly tableName = 'oferta_academica';

  async searchOfferings(filters: SearchFilters = {}): Promise<SearchResult> {
    try {
      const limit = Math.min(
        filters.limit || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
      );
      const page = Math.max(filters.page || PAGINATION.DEFAULT_PAGE, 1);
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new AppError(
          `Database error: ${error.message}`,
          500,
          'DATABASE_ERROR'
        );
      }

      return this.buildSearchResult(
        data || [],
        count || 0,
        page,
        limit,
        filters
      );
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.logError(appError, 'SearchService.searchOfferings');
      throw appError;
    }
  }

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('modalidad, institucion, clasificacion, nivel_programa')
        .limit(PAGINATION.MAX_LIMIT);

      if (error) {
        throw new AppError(
          `Database error: ${error.message}`,
          500,
          'DATABASE_ERROR'
        );
      }

      return this.extractUniqueValues(data || []);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.logError(appError, 'SearchService.getFilterOptions');
      throw appError;
    }
  }

  private buildSearchResult(
    data: AcademicProgram[],
    total: number,
    page: number,
    limit: number,
    filters: SearchFilters
  ): SearchResult {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters,
    };
  }

  private extractUniqueValues(data: any[]): FilterOptions {
    return {
      modalidades: this.getUniqueValues(data, 'modalidad'),
      instituciones: this.getUniqueValues(data, 'institucion'),
      areas: this.getUniqueValues(data, 'clasificacion'),
      niveles: this.getUniqueValues(data, 'nivel_programa'),
    };
  }

  private getUniqueValues(data: any[], field: string): string[] {
    return [...new Set(data.map((item) => item[field]).filter(Boolean))].sort();
  }
}

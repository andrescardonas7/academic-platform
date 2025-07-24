// Refactored SearchService - SOLID principles
import {
  AcademicProgram,
  FilterOptions,
  PAGINATION,
  SearchFilters,
  SearchResult,
} from '../types/railway';
import { supabase } from '../config/supabase';
import { ISearchService } from '../interfaces/ISearchService';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';

export class SearchService implements ISearchService {
  private readonly tableName = 'oferta_academica';
  private filterOptionsCache: FilterOptions | null = null;
  private filterOptionsCacheTime: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async searchOfferings(filters: SearchFilters = {}): Promise<SearchResult> {
    try {
      const limit = Math.min(
        filters.limit || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
      );
      const page = Math.max(filters.page || PAGINATION.DEFAULT_PAGE, 1);
      const offset = (page - 1) * limit;

      // Build optimized query with filters
      let query = supabase.from(this.tableName).select('*', { count: 'exact' });
      query = this.applyFilters(query, filters);

      // Apply sorting
      const sortField = this.mapSortField(filters.sortBy || 'carrera');
      const sortOrder = filters.sortOrder !== 'desc';
      query = query.order(sortField, { ascending: sortOrder });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

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
      // Check cache first
      const now = Date.now();
      if (
        this.filterOptionsCache &&
        now - this.filterOptionsCacheTime < this.CACHE_TTL
      ) {
        return this.filterOptionsCache;
      }

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

      const filterOptions = this.extractUniqueValues(data || []);

      // Update cache
      this.filterOptionsCache = filterOptions;
      this.filterOptionsCacheTime = now;

      return filterOptions;
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

  private extractUniqueValues(data: Record<string, unknown>[]): FilterOptions {
    return {
      modalidades: this.getUniqueValues(data, 'modalidad'),
      instituciones: this.getUniqueValues(data, 'institucion'),
      areas: this.getUniqueValues(data, 'clasificacion'),
      niveles: this.getUniqueValues(data, 'nivel_programa'),
    };
  }

  private getUniqueValues(
    data: Record<string, unknown>[],
    field: string
  ): string[] {
    return Array.from(
      new Set(
        data
          .map((item) => item[field])
          .filter(
            (value): value is string =>
              typeof value === 'string' && value.trim().length > 0
          )
      )
    ).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }

  private mapSortField(sortBy: string): string {
    const fieldMap: Record<string, string> = {
      nombre: 'carrera',
      carrera: 'carrera',
      institucion: 'institucion',
      modalidad: 'modalidad',
      duracion: 'duracion_semestres',
      precio: 'valor_semestre',
      nivel: 'nivel_programa',
    };
    return fieldMap[sortBy] || 'carrera';
  }

  private applyFilters(query: any, filters: SearchFilters): any {
    // Apply text search filter (optimized with full-text search)
    if (filters.q?.trim()) {
      const searchTerm = filters.q.trim();
      query = query.or(
        `carrera.ilike.%${searchTerm}%,institucion.ilike.%${searchTerm}%,clasificacion.ilike.%${searchTerm}%`
      );
    }

    // Apply specific filters
    if (filters.modalidad) {
      query = query.eq('modalidad', filters.modalidad);
    }

    if (filters.institucion) {
      query = query.eq('institucion', filters.institucion);
    }

    if (filters.nivel) {
      query = query.ilike('nivel_programa', `%${filters.nivel}%`);
    }

    if (filters.area) {
      query = query.ilike('clasificacion', `%${filters.area}%`);
    }

    return query;
  }

  async getOfferingById(id: number): Promise<AcademicProgram> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new AppError('Offering not found', 404, 'NOT_FOUND');
      }

      return data;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.logError(appError, 'SearchService.getOfferingById');
      throw appError;
    }
  }
}

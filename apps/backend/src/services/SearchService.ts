import { supabase } from '../config/supabase';
import { ISearchService } from '../interfaces/ISearchService';
import {
  AcademicProgram,
  FilterOptions,
  PAGINATION,
  SearchFilters,
  SearchResult,
} from '../types/railway';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';

export class SearchService implements ISearchService {
  private readonly tableName = 'oferta_academica';
  private filterOptionsCache: FilterOptions | null = null;
  private filterOptionsCacheTime: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

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

      // Debug: Log query details for Railway
      console.log('🔍 SearchService - About to execute query:', {
        tableName: this.tableName,
        filters,
        limit,
        offset,
      });

      const result = await query;

      if (result.error) {
        console.error('❌ Supabase query error:', result.error);
        throw new AppError(
          `Database error: ${result.error.message}`,
          500,
          'DATABASE_ERROR'
        );
      }

      const { data, count } = result;

      // Debug log for Railway
      console.log('🔍 SearchService - Query result:', {
        dataLength: data?.length || 0,
        count,
        hasData: !!data?.length,
        resultKeys: Object.keys(result),
      });

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

      const result = await supabase
        .from(this.tableName)
        .select('modalidad, institucion, clasificacion, nivel_programa')
        .limit(PAGINATION.MAX_LIMIT);

      if (result.error) {
        throw new AppError(
          `Database error: ${result.error.message}`,
          500,
          'DATABASE_ERROR'
        );
      }

      const { data } = result;
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
    // KISS: Improved text search with better keyword matching
    if (filters.q?.trim()) {
      const searchTerms = this.normalizeSearchTerms(filters.q.trim());
      const searchConditions = searchTerms.map(
        (term) =>
          `carrera.ilike.%${term}%,institucion.ilike.%${term}%,clasificacion.ilike.%${term}%`
      );

      // DRY: Apply all search conditions
      query = query.or(searchConditions.join(','));
    }

    // SonarQube: Consistent filter application
    const filterMappings = [
      { filter: filters.modalidad, column: 'modalidad', exact: true },
      { filter: filters.institucion, column: 'institucion', exact: true },
      { filter: filters.nivel, column: 'nivel_programa', exact: false },
      { filter: filters.area, column: 'clasificacion', exact: false },
    ];

    filterMappings.forEach(({ filter, column, exact }) => {
      if (filter) {
        query = exact
          ? query.eq(column, filter)
          : query.ilike(column, `%${filter}%`);
      }
    });

    return query;
  }

  private normalizeSearchTerms(searchText: string): string[] {
    // KISS: Simple normalization for better matching
    const normalized = searchText
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n');

    // DRY: Extract unique terms
    return [
      ...new Set(normalized.split(/\s+/).filter((term) => term.length > 2)),
    ];
  }

  async getOfferingById(id: number): Promise<AcademicProgram> {
    try {
      const result = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (result.error || !result.data) {
        throw new AppError('Offering not found', 404, 'NOT_FOUND');
      }

      return result.data;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.logError(appError, 'SearchService.getOfferingById');
      throw appError;
    }
  }
}

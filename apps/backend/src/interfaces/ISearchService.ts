// Interface Segregation Principle - Clean interfaces
import {
  FilterOptions,
  SearchFilters,
  SearchResult,
} from '@academic/shared-types';

export interface ISearchService {
  searchOfferings(filters?: SearchFilters): Promise<SearchResult>;
  getFilterOptions(): Promise<FilterOptions>;
}

export interface IDatabase {
  query<T>(table: string, filters?: Record<string, any>): Promise<T[]>;
  count(table: string, filters?: Record<string, any>): Promise<number>;
}

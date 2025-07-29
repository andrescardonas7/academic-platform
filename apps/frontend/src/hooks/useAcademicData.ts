// Clean hook - Single responsibility for academic data
import { AcademicProgram, FilterOptions } from '@/types';
import { useEffect, useState } from 'react';
import { apiClient } from '../utils/api';

interface UseAcademicDataReturn {
  programs: AcademicProgram[];
  filterOptions: FilterOptions;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAcademicData(): UseAcademicDataReturn {
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    modalidades: [],
    instituciones: [],
    areas: [],
    niveles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 useAcademicData: Starting data fetch...');

      const [programsResponse, filtersResponse] = await Promise.all([
        apiClient.search.offerings({ limit: 100 }),
        apiClient.search.filters(),
      ]);

      type ProgramsApiResponse = {
        success?: boolean;
        data?: AcademicProgram[];
      };
      type FiltersApiResponse = { success?: boolean; data?: FilterOptions };

      const pr = programsResponse as ProgramsApiResponse;
      const fr = filtersResponse as FiltersApiResponse;

      console.log('🔍 useAcademicData: API responses received:', {
        programsResponse: {
          success: pr.success,
          dataLength: pr.data?.length || 0,
          hasData: !!pr.data?.length,
        },
        filtersResponse: {
          success: fr.success,
          dataLength: fr.data ? Object.keys(fr.data).length : 0,
        },
      });

      setPrograms(pr.data || []);
      setFilterOptions(
        fr.data || {
          modalidades: [],
          instituciones: [],
          areas: [],
          niveles: [],
        }
      );

      console.log('🔍 useAcademicData: State updated successfully');
    } catch (err) {
      console.error('❌ useAcademicData: Error fetching academic data:', err);
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    programs,
    filterOptions,
    loading,
    error,
    refetch: () => {
      fetchData();
    },
  };
}

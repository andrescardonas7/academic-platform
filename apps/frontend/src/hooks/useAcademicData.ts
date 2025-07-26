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
        apiClient.search.offerings({ limit: 100 }), // Obtener hasta 100 programas por defecto
        apiClient.search.filters(),
      ]);

      console.log('🔍 useAcademicData: API responses received:', {
        programsResponse: {
          success: (programsResponse as any)?.success,
          dataLength: (programsResponse as any)?.data?.length || 0,
          hasData: !!(programsResponse as any)?.data?.length,
        },
        filtersResponse: {
          success: (filtersResponse as any)?.success,
          dataLength: (filtersResponse as any)?.data ? Object.keys((filtersResponse as any).data).length : 0,
        },
      });

      setPrograms(
        (programsResponse as { data?: AcademicProgram[] }).data || []
      );
      setFilterOptions(
        (filtersResponse as { data?: FilterOptions }).data || {
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

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

      const [programsResponse, filtersResponse] = await Promise.all([
        apiClient.search.offerings(),
        apiClient.search.filters(),
      ]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
      console.error('Error fetching academic data:', err);
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

import { fetchAcademicOfferings } from '@academic/api-client';
import { useEffect, useState } from 'react';
import { AcademicProgram, toAcademicProgram } from '../types/academic';

export function useAcademicOfferings() {
  const [data, setData] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAcademicOfferings()
      .then((response) => {
        const rawData = response.data?.data || [];
        const typedData = rawData.map(toAcademicProgram);
        setData(typedData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

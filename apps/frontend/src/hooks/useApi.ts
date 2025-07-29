import { useCallback, useState } from 'react';

interface UseApiOptions<T> {
  apiCall: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoExecute?: boolean;
}

/**
 * useApi hook
 * Ejecuta una llamada asíncrona y gestiona los estados de carga, datos y error.
 * Siempre retorna error como instancia de Error.
 */
export function useApi<T>({
  apiCall,
  onSuccess,
  onError,
  autoExecute = false,
}: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

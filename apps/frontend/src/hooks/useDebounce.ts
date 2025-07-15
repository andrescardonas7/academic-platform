// Custom hook - DRY principle for debouncing
import { UI } from '@academic/shared-types';
import { useEffect, useState } from 'react';

export function useDebounce<T>(
  value: T,
  delay: number = UI.SEARCH_DEBOUNCE
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

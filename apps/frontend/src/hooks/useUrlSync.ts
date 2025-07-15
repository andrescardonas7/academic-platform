import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SearchFilters, useSearchStore } from '../store/search';

export function useUrlSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, setCurrentPage } = useSearchStore();

  // Sync URL to store on mount and URL changes
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    let hasUrlFilters = false;

    // Extract filters from URL
    const modalidad = searchParams.get('modalidad');
    const institucion = searchParams.get('institucion');
    const carrera = searchParams.get('carrera');
    const precio = searchParams.get('precio');
    const jornada = searchParams.get('jornada');
    const page = searchParams.get('page');

    if (modalidad) {
      urlFilters.modalidad = modalidad;
      hasUrlFilters = true;
    }
    if (institucion) {
      urlFilters.institucion = institucion;
      hasUrlFilters = true;
    }
    if (carrera) {
      urlFilters.carrera = carrera;
      hasUrlFilters = true;
    }
    if (precio) {
      urlFilters.precio = precio;
      hasUrlFilters = true;
    }
    if (jornada) {
      urlFilters.jornada = jornada;
      hasUrlFilters = true;
    }

    // Update store if URL has filters
    if (hasUrlFilters) {
      setFilters(urlFilters);
    }

    // Update page if URL has page
    if (page) {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
  }, [searchParams, setFilters, setCurrentPage]);

  // Sync store to URL
  const updateUrl = (newFilters: Partial<SearchFilters>, page?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update filter params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Update page param
    if (page !== undefined) {
      if (page > 1) {
        params.set('page', page.toString());
      } else {
        params.delete('page');
      }
    }

    // Update URL without page reload
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(newUrl, { scroll: false });
  };

  return { updateUrl };
}

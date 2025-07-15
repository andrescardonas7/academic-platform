// HomePage - Academic Platform
'use client';

import { AcademicProgram, SearchFilters } from '@academic/shared-types';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ChatbotWidget from '../components/ChatbotWidget';
import HeroSection from '../components/HeroSection';
import ProgramCard from '../components/ProgramCard';
import SearchForm from '../components/SearchForm';
import { useAcademicData } from '../hooks/useAcademicData';

export default function HomePage() {
  const { programs, filterOptions, loading, error, refetch } =
    useAcademicData();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedProgram, setSelectedProgram] =
    useState<AcademicProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = useFilteredPrograms(programs, filters, searchQuery);

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <HeroSection onSearch={setSearchQuery} />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <SearchForm
            data={programs}
            onSelect={setSelectedProgram}
            placeholder='Buscar programas académicos...'
          />
        </div>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <Search className='w-5 h-5 text-gray-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              Resultados de búsqueda
            </h2>
            <span className='bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full'>
              {filteredPrograms.length} programas
            </span>
          </div>

          {selectedProgram && (
            <button
              onClick={() => setSelectedProgram(null)}
              className='flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
            >
              <X className='w-4 h-4' />
              Limpiar selección
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <div className='col-span-full text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-600'>Cargando programas...</p>
            </div>
          ) : selectedProgram ? (
            <div className='col-span-full'>
              <ProgramCard program={selectedProgram} />
            </div>
          ) : filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <ProgramCard key={program.Id} program={program} />
            ))
          ) : (
            <div className='col-span-full text-center py-8'>
              <p className='text-gray-600'>
                No se encontraron programas que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      <ChatbotWidget />
    </div>
  );
}

// Error state component
function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <X className='w-8 h-8 text-red-600' />
        </div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Error al cargar los datos
        </h2>
        <p className='text-gray-600 mb-4'>{error}</p>
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

// Custom hook for filtering programs
function useFilteredPrograms(
  programs: AcademicProgram[],
  filters: SearchFilters,
  searchQuery: string
): AcademicProgram[] {
  return useMemo(() => {
    return programs.filter((program) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          program.carrera.toLowerCase().includes(query) ||
          program.institucion.toLowerCase().includes(query) ||
          program.modalidad.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Other filters
      if (filters.modalidad && program.modalidad !== filters.modalidad)
        return false;
      if (filters.institucion && program.institucion !== filters.institucion)
        return false;
      if (filters.nivel && program.nivel_programa !== filters.nivel)
        return false;
      if (filters.area && program.clasificacion !== filters.area) return false;

      return true;
    });
  }, [programs, filters, searchQuery]);
}

// HomePage - Academic Platform
'use client';

import { AcademicProgram } from '@academic/shared-types';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ChatbotWidget } from '../app/components/ChatbotWidget';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ProgramCard from '../components/ProgramCard';
import SearchForm from '../components/SearchForm';
import { useAcademicData } from '../hooks/useAcademicData';
import { filterPrograms } from '../utils/programFilters';

export default function HomePage() {
  const { programs, loading, error, refetch } = useAcademicData();
  const [selectedProgram, setSelectedProgram] =
    useState<AcademicProgram | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [clearTrigger, setClearTrigger] = useState(0);

  const filteredPrograms = useMemo(
    () => filterPrograms(programs, {}, searchQuery),
    [programs, searchQuery]
  );

  // Cuando searchQuery se limpia, también limpiar selección
  useEffect(() => {
    if (!searchQuery) setSelectedProgram(null);
  }, [searchQuery]);

  // Función para renderizar el contenido de programas (extrae lógica ternaria compleja)
  const renderProgramContent = () => {
    if (loading) {
      return (
        <div className='col-span-full text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Cargando programas...</p>
        </div>
      );
    }

    if (selectedProgram) {
      return (
        <div className='col-span-full'>
          <ProgramCard program={selectedProgram} />
        </div>
      );
    }

    if (filteredPrograms.length > 0) {
      return filteredPrograms.map((program) => (
        <ProgramCard key={program.Id} program={program} />
      ));
    }

    return (
      <div className='col-span-full text-center py-8'>
        <p className='text-gray-600'>
          No se encontraron programas que coincidan con tu búsqueda.
        </p>
      </div>
    );
  };

  // Handler para limpiar todo
  const handleClear = () => {
    setSearchQuery('');
    setClearTrigger((c) => c + 1);
    setSelectedProgram(null);
  };

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <HeroSection onSearch={setSearchQuery} clearTrigger={clearTrigger} />
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <SearchForm
            data={programs}
            onSelect={setSelectedProgram}
            onSearch={setSearchQuery}
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
          {(selectedProgram || searchQuery) && (
            <button
              onClick={handleClear}
              className='flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
            >
              <X className='w-4 h-4' />
              Limpiar selección
            </button>
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {renderProgramContent()}
        </div>
      </main>
      <ChatbotWidget />
      <Footer />
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

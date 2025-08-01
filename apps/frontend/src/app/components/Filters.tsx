import { ChevronDown, Filter, X } from 'lucide-react';
import React, { useState } from 'react';

type FiltersState = {
  carrera?: string;
  institucion?: string;
  modalidad?: string;
  jornada?: string;
  precio?: string;
  [key: string]: unknown;
};

interface FiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  options: {
    modalidad: string[];
    institucion: string[];
    carrera: string[];
    precio?: string[];
    jornada?: string[];
  };
  className?: string;
}

export function Filters({
  filters,
  setFilters,
  options,
  className = '',
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters
  const countActiveFilters = () => {
    return Object.values(filters).filter((value) => value !== '').length;
  };

  const clearAllFilters = () => {
    setFilters({
      modalidad: '',
      institucion: '',
      carrera: '',
      precio: '',
      jornada: '',
    });
  };

  const clearFilter = (filterName: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: '' }));
  };

  const activeFiltersCount = countActiveFilters();

  return (
    <div className={`${className}`}>
      {/* Mobile Filter Toggle */}
      <div className='lg:hidden mb-4'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm'
        >
          <div className='flex items-center gap-2'>
            <Filter className='w-5 h-5 text-gray-600' />
            <span className='font-medium text-gray-700'>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                {activeFiltersCount}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Desktop Filters */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
          {/* Filter Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Filter className='w-5 h-5 text-gray-600' />
              <h3 className='font-semibold text-gray-900'>Filtros</h3>
              {activeFiltersCount > 0 && (
                <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className='text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1'
              >
                <X className='w-4 h-4' />
                Limpiar todo
              </button>
            )}
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full'
                  >
                    <span className='capitalize'>{key}:</span>
                    <span>
                      {typeof value === 'string'
                        ? value
                        : typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                    </span>
                    <button
                      onClick={() => clearFilter(key)}
                      className='ml-1 hover:bg-blue-200 rounded-full p-0.5'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Filter Grid - chips/buttons for modalidad */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
            {/* Modalidad Filter as chips */}
            <div className='space-y-2'>
              <span className='block text-sm font-medium text-gray-700'>
                Modalidad
              </span>
              <div className='flex flex-wrap gap-2'>
                {options.modalidad.map((m: string) => (
                  <button
                    key={m}
                    type='button'
                    className={`px-4 py-2 rounded-full bg-slate-100 text-gray-700 font-medium shadow hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${filters.modalidad === m ? 'bg-blue-600 text-white' : ''}`}
                    onClick={() =>
                      setFilters((f: Record<string, unknown>) => ({
                        ...f,
                        modalidad: filters.modalidad === m ? '' : m,
                      }))
                    }
                    aria-pressed={filters.modalidad === m}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Institución Filter */}
            <div className='space-y-2'>
              <label
                htmlFor='institucion-select'
                className='block text-sm font-medium text-gray-700'
              >
                Institución
              </label>
              <select
                id='institucion-select'
                value={filters.institucion}
                onChange={(e) =>
                  setFilters((f: Record<string, unknown>) => ({
                    ...f,
                    institucion: e.target.value,
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
              >
                <option value=''>Todas las instituciones</option>
                {options.institucion.map((i: string) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Carrera Filter */}
            <div className='space-y-2'>
              <label
                htmlFor='carrera-select'
                className='block text-sm font-medium text-gray-700'
              >
                Carrera
              </label>
              <select
                id='carrera-select'
                value={filters.carrera}
                onChange={(e) =>
                  setFilters((f: Record<string, unknown>) => ({
                    ...f,
                    carrera: e.target.value,
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
              >
                <option value=''>Todas las carreras</option>
                {options.carrera.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Jornada Filter */}
            {options.jornada && (
              <div className='space-y-2'>
                <label
                  htmlFor='jornada-select'
                  className='block text-sm font-medium text-gray-700'
                >
                  Jornada
                </label>
                <select
                  id='jornada-select'
                  value={filters.jornada || ''}
                  onChange={(e) =>
                    setFilters((f: Record<string, unknown>) => ({
                      ...f,
                      jornada: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                >
                  <option value=''>Todas las jornadas</option>
                  {options.jornada.map((j: string) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Precio Filter */}
            {options.precio && (
              <div className='space-y-2'>
                <label
                  htmlFor='precio-select'
                  className='block text-sm font-medium text-gray-700'
                >
                  Rango de Precio
                </label>
                <select
                  id='precio-select'
                  value={filters.precio || ''}
                  onChange={(e) =>
                    setFilters((f: Record<string, unknown>) => ({
                      ...f,
                      precio: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
                >
                  <option value=''>Cualquier precio</option>
                  <option value='0-1000000'>Hasta $1M</option>
                  <option value='1000000-3000000'>$1M - $3M</option>
                  <option value='3000000-5000000'>$3M - $5M</option>
                  <option value='5000000+'>Más de $5M</option>
                  <option value='gratuito'>Consultar</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FiltersProps {
  filters: {
    modalidad: string;
    institucion: string;
    carrera: string;
    precio?: string;
    jornada?: string;
  };
  setFilters: (filters: any) => void;
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
  className = ""
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Count active filters
  const countActiveFilters = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const clearAllFilters = () => {
    setFilters({
      modalidad: '',
      institucion: '',
      carrera: '',
      precio: '',
      jornada: ''
    });
  };

  const clearFilter = (filterName: string) => {
    setFilters((prev: any) => ({ ...prev, [filterName]: '' }));
  };

  const activeFiltersCount = countActiveFilters();

  return (
    <div className={`${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
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
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpiar todo
              </button>
            )}
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    <span className="capitalize">{key}:</span>
                    <span>{value}</span>
                    <button
                      onClick={() => clearFilter(key)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Modalidad Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Modalidad
              </label>
              <select
                value={filters.modalidad}
                onChange={(e) =>
                  setFilters((f: any) => ({ ...f, modalidad: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Todas las modalidades</option>
                {options.modalidad.map((m: string) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Institución Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Institución
              </label>
              <select
                value={filters.institucion}
                onChange={(e) =>
                  setFilters((f: any) => ({ ...f, institucion: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Todas las instituciones</option>
                {options.institucion.map((i: string) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Carrera Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Carrera
              </label>
              <select
                value={filters.carrera}
                onChange={(e) => setFilters((f: any) => ({ ...f, carrera: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Todas las carreras</option>
                {options.carrera.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Jornada Filter */}
            {options.jornada && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Jornada
                </label>
                <select
                  value={filters.jornada || ''}
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, jornada: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Todas las jornadas</option>
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rango de Precio
                </label>
                <select
                  value={filters.precio || ''}
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, precio: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Cualquier precio</option>
                  <option value="0-1000000">Hasta $1M</option>
                  <option value="1000000-3000000">$1M - $3M</option>
                  <option value="3000000-5000000">$3M - $5M</option>
                  <option value="5000000+">Más de $5M</option>
                  <option value="gratuito">Gratuito</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChevronDown, Search } from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface SearchItem {
  Id?: string;
  carrera?: string;
  institucion?: string;
  modalidad?: string;
  duracion_semestres?: number;
  [key: string]: string | number | undefined;
}

interface SearchFormProps {
  data: SearchItem[];
  onSelect: (item: SearchItem) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  data,
  onSelect,
  onSearch,
  placeholder = 'Buscar carrera o institución...',
  className = '',
}: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return data
      .filter(
        (o) =>
          o.carrera?.toLowerCase().includes(q) ||
          o.institucion?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery, data]);

  // Chips de filtros predeterminados
  const filterChips = [
    'Pregrado',
    'Posgrado',
    'Virtual',
    'Presencial',
    'Ingeniería',
    'Administración',
  ];

  // Handler para chips
  const handleChipClick = (chip: string) => {
    setQuery(chip);
    inputRef.current?.focus();
  };

  // Handler para búsqueda
  const handleSearch = () => {
    setDebouncedQuery(query);
    setIsOpen(false);
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Cambia el tipo del callback interno a SearchItem
  const handleSelect = useCallback(
    (item: SearchItem) => {
      onSelect(item);
      setIsOpen(false);
      setQuery(item.carrera || item.institucion || '');
    },
    [onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // Limpieza
  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} style={{ marginBottom: 24 }}>
      {/* Chips de filtros */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {filterChips.map((chip) => (
          <button
            key={chip}
            type='button'
            className={`px-4 py-2 rounded-full bg-slate-100 text-gray-700 font-medium shadow hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${query === chip ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => handleChipClick(chip)}
            aria-pressed={query === chip}
          >
            {chip}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className='relative'
      >
        <Search
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer'
          onClick={handleSearch}
        />
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            } else handleKeyDown(e);
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200'
          style={{ minWidth: '320px', fontSize: '16px' }}
        />
        {query && (
          <button
            type='button'
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
            onClick={handleClear}
            aria-label='Limpiar búsqueda'
          >
            ×
          </button>
        )}
        {isOpen && suggestions.length > 0 && (
          <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto'
          style={{ minWidth: '320px' }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.Id ?? suggestion.carrera}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className='flex flex-col'>
                <span className='font-semibold text-gray-900 text-sm'>
                  {suggestion.carrera}
                </span>
                <span className='text-gray-600 text-xs mt-1'>
                  {suggestion.institucion}
                </span>
                <div className='flex gap-2 mt-1'>
                  <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                    {suggestion.modalidad ?? ''}
                  </span>
                  <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                    {suggestion.duracion_semestres
                      ? `${suggestion.duracion_semestres} semestres`
                      : ''}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && suggestions.length === 0 && debouncedQuery && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500'>
          No se encontraron resultados para &quot;{debouncedQuery}&quot;
        </div>
      )}
    </div>
  );
}

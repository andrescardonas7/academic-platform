import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useRef, useState } from 'react';

interface Program {
  Id: string;
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion: string;
  nivel_programa: string;
  enlace: string;
}

interface SearchFormProps {
  data: Program[];
  onSelect: (item: Program) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  data,
  onSelect,
  placeholder = 'Buscar carrera, institución o programa...',
  className = '',
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getSuggestions(data, query);

  const handleSelect = useCallback(
    (item: Program) => {
      onSelect(item);
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          if (selectedIndex >= 0) {
            handleSelect(suggestions[selectedIndex]);
          } else if (query.trim() && onSearch) {
            onSearch(query.trim());
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, handleSelect, query, onSearch]
  );

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (
        event: Event & {
          results: { [key: number]: { [key: number]: { transcript: string } } };
        }
      ) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setIsOpen(true);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main search input */}
      <div className='relative group'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500'></div>
        <div className='relative bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex items-center p-4'>
            {/* Search icon */}
            <div className='flex-shrink-0 mr-3'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              placeholder={placeholder}
              className='flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg'
              aria-label='Buscar programas académicos'
              list='program-suggestions'
            />

            {/* Action buttons */}
            <div className='flex items-center gap-2 ml-3'>
              {query && (
                <button
                  onClick={clearSearch}
                  className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
                  aria-label='Limpiar búsqueda'
                >
                  <XMarkIcon className='h-4 w-4' />
                </button>
              )}

              <button
                onClick={handleVoiceSearch}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                aria-label='Búsqueda por voz'
              >
                <MicrophoneIcon className='h-4 w-4' />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                aria-label='Filtros'
              >
                <AdjustmentsHorizontalIcon className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Native datalist for accessibility */}
      <datalist id='program-suggestions'>
        {suggestions.map((suggestion) => (
          <option
            key={suggestion.Id}
            value={`${suggestion.carrera} - ${suggestion.institucion}`}
          />
        ))}
      </datalist>

      {/* Custom suggestions dropdown for enhanced UX */}
      {isOpen && (
        <SuggestionsList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onHover={setSelectedIndex}
          query={query}
        />
      )}

      {/* Quick filters */}
      {showFilters && (
        <div className='mt-4 p-4 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg'>
          <div className='flex flex-wrap gap-2'>
            <FilterChip label='Pregrado' onClick={() => setQuery('pregrado')} />
            <FilterChip label='Posgrado' onClick={() => setQuery('posgrado')} />
            <FilterChip label='Virtual' onClick={() => setQuery('virtual')} />
            <FilterChip
              label='Presencial'
              onClick={() => setQuery('presencial')}
            />
            <FilterChip
              label='Ingeniería'
              onClick={() => setQuery('ingeniería')}
            />
            <FilterChip
              label='Administración'
              onClick={() => setQuery('administración')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Suggestions list component
interface SuggestionsListProps {
  suggestions: Program[];
  selectedIndex: number;
  onSelect: (item: Program) => void;
  onHover: (index: number) => void;
  query: string;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  onHover,
  query,
}) => {
  if (suggestions.length === 0 && query) {
    return (
      <div className='absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl z-50 p-6 text-center'>
        <div className='text-gray-500 mb-2'>
          <MagnifyingGlassIcon className='h-8 w-8 mx-auto mb-2 opacity-50' />
          No se encontraron resultados para &quot;{query}&quot;
        </div>
        <p className='text-sm text-gray-400'>
          Intenta con otros términos como &quot;ingeniería&quot;,
          &quot;administración&quot; o el nombre de una institución
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div
      className='absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto'
      role='listbox'
      aria-label='Sugerencias de programas académicos'
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.Id}
          className={`px-6 py-4 cursor-pointer transition-all duration-200 text-left w-full ${
            index === selectedIndex
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500'
              : 'hover:bg-gray-50'
          } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-2xl' : ''}`}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => onHover(index)}
          role='option'
          aria-selected={index === selectedIndex}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(suggestion);
            }
          }}
        >
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center'>
              <AcademicCapIcon className='h-5 w-5 text-blue-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <h4 className='font-semibold text-gray-900 text-sm truncate'>
                {suggestion.carrera}
              </h4>
              <div className='flex items-center gap-2 mt-1'>
                <BuildingOfficeIcon className='h-3 w-3 text-gray-400' />
                <span className='text-gray-600 text-xs truncate'>
                  {suggestion.institucion}
                </span>
              </div>
              <div className='flex gap-2 mt-2'>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>
                  {suggestion.modalidad}
                </span>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
                  {suggestion.duracion_semestres} semestres
                </span>
                {suggestion.valor_semestre === 0 && (
                  <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'>
                    Consultar
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

// Filter chip component
interface FilterChipProps {
  label: string;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200'
  >
    {label}
  </button>
);

// Helper function
function getSuggestions(data: Program[], query: string): Program[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return data
    .filter(
      (program) =>
        program.carrera?.toLowerCase().includes(searchTerm) ||
        program.institucion?.toLowerCase().includes(searchTerm) ||
        program.modalidad?.toLowerCase().includes(searchTerm) ||
        program.nivel_programa?.toLowerCase().includes(searchTerm)
    )
    .slice(0, 6);
}

export default SearchForm;

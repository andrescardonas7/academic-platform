import React from 'react';

interface SearchItem {
  Id?: string;
  carrera?: string;
  institucion?: string;
  modalidad?: string;
  duracion_semestres?: number;
  [key: string]: string | number | undefined;
}

interface SearchSuggestionsProps {
  suggestions: SearchItem[];
  selectedIndex: number;
  onSelect: (item: SearchItem) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  query: string;
}

export function SearchSuggestions({
  suggestions,
  selectedIndex,
  onSelect,
  onKeyDown,
  query,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0 && query) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
        No se encontraron resultados para &quot;{query}&quot;
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <ul
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
      style={{ minWidth: '320px' }}
      onKeyDown={onKeyDown}
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion.Id || index}
          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
            index === selectedIndex
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : ''
          }`}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => {
            // Update selected index on hover
          }}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {suggestion.carrera}
            </span>
            <span className="text-gray-600 text-xs mt-1">
              {suggestion.institucion}
            </span>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {suggestion.modalidad ?? ''}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {suggestion.duracion_semestres
                  ? `${suggestion.duracion_semestres} semestres`
                  : ''}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

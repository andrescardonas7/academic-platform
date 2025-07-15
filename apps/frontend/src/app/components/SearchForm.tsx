import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchFormProps {
  data: any[];
  onSelect: (item: any) => void;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  data,
  onSelect,
  placeholder = "Buscar carrera o institución...",
  className = ""
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSelect = useCallback((item: any) => {
    onSelect(item);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
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

  return (
    <div className={`relative ${className}`} style={{ marginBottom: 24 }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          style={{
            minWidth: '320px',
            fontSize: '16px'
          }}
        />
        {isOpen && suggestions.length > 0 && (
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          style={{ minWidth: '320px' }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.Id}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
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
                    {suggestion.modalidad}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {suggestion.duracion_semestres} semestres
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && suggestions.length === 0 && debouncedQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No se encontraron resultados para "{debouncedQuery}"
        </div>
      )}
    </div>
  );
}

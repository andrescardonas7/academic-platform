import { AcademicProgram, SearchFilters } from '@/types';

/**
 * Filtra programas académicos basado en query de búsqueda y filtros
 * Función pura para facilitar testing y reutilización
 */
export function filterPrograms(
  programs: AcademicProgram[],
  filters: SearchFilters,
  searchQuery: string
): AcademicProgram[] {
  return programs.filter((program) => {
    // Filtro por query de búsqueda
    if (searchQuery && !matchesSearchQuery(program, searchQuery)) {
      return false;
    }

    // Filtros específicos
    if (filters.modalidad && program.modalidad !== filters.modalidad) {
      return false;
    }

    if (filters.institucion && program.institucion !== filters.institucion) {
      return false;
    }

    if (filters.nivel && program.nivel_programa !== filters.nivel) {
      return false;
    }

    if (filters.area && program.clasificacion !== filters.area) {
      return false;
    }

    return true;
  });
}

/**
 * Verifica si un programa coincide con la query de búsqueda
 */
function matchesSearchQuery(program: AcademicProgram, query: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return true;

  const searchableFields = [
    program.carrera,
    program.institucion,
    program.modalidad,
    program.clasificacion,
    program.nivel_programa,
  ];

  return searchableFields.some((field) =>
    field?.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Ordena programas según criterios especificados
 */
export function sortPrograms(
  programs: AcademicProgram[],
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): AcademicProgram[] {
  if (!sortBy) return programs;

  return [...programs].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'carrera':
        comparison = a.carrera.localeCompare(b.carrera);
        break;
      case 'institucion':
        comparison = a.institucion.localeCompare(b.institucion);
        break;
      case 'valor_semestre':
        comparison = (a.valor_semestre || 0) - (b.valor_semestre || 0);
        break;
      case 'duracion_semestres':
        comparison = a.duracion_semestres - b.duracion_semestres;
        break;
      default:
        return 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

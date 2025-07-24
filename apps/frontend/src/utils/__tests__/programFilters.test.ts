import { AcademicProgram, SearchFilters } from '@academic/shared-types';
import { filterPrograms, sortPrograms } from '../programFilters';

const mockPrograms: AcademicProgram[] = [
  {
    Id: '1',
    carrera: 'Ingeniería de Sistemas',
    institucion: 'Universidad Nacional',
    modalidad: 'Presencial',
    duracion_semestres: 8,
    valor_semestre: 2000000,
    clasificacion: 'Ingeniería',
    nivel_programa: 'Pregrado',
    enlace: 'https://test1.com',
  },
  {
    Id: '2',
    carrera: 'Medicina',
    institucion: 'Universidad Privada',
    modalidad: 'Presencial',
    duracion_semestres: 12,
    valor_semestre: 5000000,
    clasificacion: 'Ciencias de la Salud',
    nivel_programa: 'Pregrado',
    enlace: 'https://test2.com',
  },
  {
    Id: '3',
    carrera: 'Psicología',
    institucion: 'Universidad Nacional',
    modalidad: 'Virtual',
    duracion_semestres: 8,
    valor_semestre: 1500000,
    clasificacion: 'Ciencias Sociales',
    nivel_programa: 'Pregrado',
    enlace: 'https://test3.com',
  },
  {
    Id: '4',
    carrera: 'Maestría en Ingeniería',
    institucion: 'Universidad Privada',
    modalidad: 'Híbrida',
    duracion_semestres: 4,
    valor_semestre: 3000000,
    clasificacion: 'Ingeniería',
    nivel_programa: 'Posgrado',
    enlace: 'https://test4.com',
  },
];

describe('programFilters', () => {
  describe('filterPrograms', () => {
    it('should return all programs when no filters are applied', () => {
      const result = filterPrograms(mockPrograms, {}, '');
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockPrograms);
    });

    it('should filter by search query - carrera', () => {
      const result = filterPrograms(mockPrograms, {}, 'ingeniería');
      expect(result).toHaveLength(2);
      expect(result[0].carrera).toBe('Ingeniería de Sistemas');
      expect(result[1].carrera).toBe('Maestría en Ingeniería');
    });

    it('should filter by search query - institucion', () => {
      const result = filterPrograms(mockPrograms, {}, 'nacional');
      expect(result).toHaveLength(2);
      expect(
        result.every((p) => p.institucion === 'Universidad Nacional')
      ).toBe(true);
    });

    it('should filter by search query - modalidad', () => {
      const result = filterPrograms(mockPrograms, {}, 'virtual');
      expect(result).toHaveLength(1);
      expect(result[0].modalidad).toBe('Virtual');
    });

    it('should be case insensitive', () => {
      const result = filterPrograms(mockPrograms, {}, 'MEDICINA');
      expect(result).toHaveLength(1);
      expect(result[0].carrera).toBe('Medicina');
    });

    it('should trim whitespace from search query', () => {
      const result = filterPrograms(mockPrograms, {}, '  psicología  ');
      expect(result).toHaveLength(1);
      expect(result[0].carrera).toBe('Psicología');
    });

    it('should filter by modalidad filter', () => {
      const filters: SearchFilters = { modalidad: 'Presencial' };
      const result = filterPrograms(mockPrograms, filters, '');
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.modalidad === 'Presencial')).toBe(true);
    });

    it('should filter by institucion filter', () => {
      const filters: SearchFilters = { institucion: 'Universidad Privada' };
      const result = filterPrograms(mockPrograms, filters, '');
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.institucion === 'Universidad Privada')).toBe(
        true
      );
    });

    it('should filter by nivel filter', () => {
      const filters: SearchFilters = { nivel: 'Posgrado' };
      const result = filterPrograms(mockPrograms, filters, '');
      expect(result).toHaveLength(1);
      expect(result[0].nivel_programa).toBe('Posgrado');
    });

    it('should filter by area filter', () => {
      const filters: SearchFilters = { area: 'Ingeniería' };
      const result = filterPrograms(mockPrograms, filters, '');
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.clasificacion === 'Ingeniería')).toBe(true);
    });

    it('should combine search query and filters', () => {
      const filters: SearchFilters = { modalidad: 'Presencial' };
      const result = filterPrograms(mockPrograms, filters, 'medicina');
      expect(result).toHaveLength(1);
      expect(result[0].carrera).toBe('Medicina');
      expect(result[0].modalidad).toBe('Presencial');
    });

    it('should return empty array when no matches', () => {
      const filters: SearchFilters = { modalidad: 'Online' };
      const result = filterPrograms(mockPrograms, filters, '');
      expect(result).toHaveLength(0);
    });

    it('should handle empty programs array', () => {
      const result = filterPrograms([], {}, 'test');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortPrograms', () => {
    it('should return original array when no sortBy is provided', () => {
      const result = sortPrograms(mockPrograms);
      expect(result).toEqual(mockPrograms);
    });

    it('should sort by carrera ascending', () => {
      const result = sortPrograms(mockPrograms, 'carrera', 'asc');
      expect(result[0].carrera).toBe('Ingeniería de Sistemas');
      expect(result[1].carrera).toBe('Maestría en Ingeniería');
      expect(result[2].carrera).toBe('Medicina');
      expect(result[3].carrera).toBe('Psicología');
    });

    it('should sort by carrera descending', () => {
      const result = sortPrograms(mockPrograms, 'carrera', 'desc');
      expect(result[0].carrera).toBe('Psicología');
      expect(result[1].carrera).toBe('Medicina');
      expect(result[2].carrera).toBe('Maestría en Ingeniería');
      expect(result[3].carrera).toBe('Ingeniería de Sistemas');
    });

    it('should sort by institucion', () => {
      const result = sortPrograms(mockPrograms, 'institucion', 'asc');
      expect(result[0].institucion).toBe('Universidad Nacional');
      expect(result[1].institucion).toBe('Universidad Nacional');
      expect(result[2].institucion).toBe('Universidad Privada');
      expect(result[3].institucion).toBe('Universidad Privada');
    });

    it('should sort by valor_semestre', () => {
      const result = sortPrograms(mockPrograms, 'valor_semestre', 'asc');
      expect(result[0].valor_semestre).toBe(1500000);
      expect(result[1].valor_semestre).toBe(2000000);
      expect(result[2].valor_semestre).toBe(3000000);
      expect(result[3].valor_semestre).toBe(5000000);
    });

    it('should sort by duracion_semestres', () => {
      const result = sortPrograms(mockPrograms, 'duracion_semestres', 'asc');
      expect(result[0].duracion_semestres).toBe(4);
      expect(result[1].duracion_semestres).toBe(8);
      expect(result[2].duracion_semestres).toBe(8);
      expect(result[3].duracion_semestres).toBe(12);
    });

    it('should handle invalid sortBy field', () => {
      const result = sortPrograms(mockPrograms, 'invalid_field', 'asc');
      expect(result).toEqual(mockPrograms);
    });

    it('should not mutate original array', () => {
      const originalOrder = [...mockPrograms];
      sortPrograms(mockPrograms, 'carrera', 'desc');
      expect(mockPrograms).toEqual(originalOrder);
    });

    it('should handle programs with null valor_semestre', () => {
      const programsWithNull = [
        ...mockPrograms,
        {
          ...mockPrograms[0],
          Id: '5',
          valor_semestre: null as any,
        },
      ];

      const result = sortPrograms(programsWithNull, 'valor_semestre', 'asc');
      expect(result[0].valor_semestre).toBe(null);
    });
  });
});

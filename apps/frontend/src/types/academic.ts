// Academic program types
export interface AcademicProgram {
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

// Type guard to validate academic program data
export function isAcademicProgram(obj: unknown): obj is AcademicProgram {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as any).Id === 'string' &&
    typeof (obj as any).carrera === 'string' &&
    typeof (obj as any).institucion === 'string'
  );
}

// Safe conversion function
export function toAcademicProgram(obj: unknown): AcademicProgram {
  const program = obj as any;
  return {
    Id: String(program.Id || ''),
    carrera: String(program.carrera || ''),
    institucion: String(program.institucion || ''),
    modalidad: String(program.modalidad || ''),
    duracion_semestres: Number(program.duracion_semestres || 0),
    valor_semestre: Number(program.valor_semestre || 0),
    jornada: program.jornada ? String(program.jornada) : undefined,
    clasificacion: String(program.clasificacion || ''),
    nivel_programa: String(program.nivel_programa || ''),
    enlace: String(program.enlace || ''),
  };
}

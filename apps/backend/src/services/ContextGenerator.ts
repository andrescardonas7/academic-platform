// Single Responsibility - Only generates context
import { IContextGenerator } from '../interfaces/IChatService';
import { AcademicProgram } from '../types/railway';

export class ContextGenerator implements IContextGenerator {
  generateAcademicContext(academicData: AcademicProgram[]): string {
    if (!academicData || academicData.length === 0) {
      return 'No hay datos disponibles en la base de datos.';
    }

    const context = academicData
      .map((item, index) => this.formatProgram(item, index + 1))
      .join('\n');

    return this.buildContextTemplate(academicData.length, context);
  }

  private formatProgram(program: AcademicProgram, index: number): string {
    return `PROGRAMA ${index}:
- **Carrera:** ${program.carrera}
- **Institución:** ${program.institucion}
- **Modalidad:** ${program.modalidad}
- **Duración:** ${program.duracion_semestres} semestres
- **Precio:** ${this.formatPrice(program.valor_semestre)}
- **Jornada:** ${program.jornada || 'No especificada'}
- **Clasificación:** ${program.clasificacion}
- **Nivel:** ${program.nivel_programa}
- **Enlace oficial:** ${program.enlace}
---`;
  }

  private formatPrice(price: number): string {
    return price > 0
      ? `$${price.toLocaleString()} COP por semestre`
      : 'Gratuito';
  }

  private buildContextTemplate(totalPrograms: number, context: string): string {
    return `BASE DE DATOS DE PROGRAMAS ACADÉMICOS EN CARTAGO:
Total de programas disponibles: ${totalPrograms}

${context}

INFORMACIÓN ADICIONAL:
- Todos los precios están en pesos colombianos (COP)
- Las modalidades disponibles son: PRESENCIAL, VIRTUAL, HÍBRIDA
- Los niveles incluyen: TÉCNICO, TECNÓLOGO, PROFESIONAL, ESPECIALIZACIÓN, MAESTRÍA, DOCTORADO`;
  }
}

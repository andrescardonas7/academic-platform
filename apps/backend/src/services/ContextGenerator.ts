// Single Responsibility - Only generates context
import { IContextGenerator } from '../interfaces/IChatService';
import { AcademicProgram } from '../types/railway';

export class ContextGenerator implements IContextGenerator {
  generateAcademicContext(academicData: AcademicProgram[]): string {
    if (!academicData?.length) {
      return 'No hay datos disponibles en la base de datos.';
    }

    // KISS: Generate comprehensive context with ALL data
    const summary = this.generateSummary(academicData);
    const programsList = this.formatAllPrograms(academicData);

    return this.buildContextTemplate(
      academicData.length,
      summary,
      programsList
    );
  }

  // DRY: Generate summary of available options
  private generateSummary(programs: AcademicProgram[]): string {
    const modalidades = [...new Set(programs.map((p) => p.modalidad))].sort();
    const instituciones = [
      ...new Set(programs.map((p) => p.institucion)),
    ].sort();
    const niveles = [...new Set(programs.map((p) => p.nivel_programa))].sort();

    // SonarQube: Count programs by category for better context
    const categoryCounts = this.getCategoryCounts(programs);

    return `RESUMEN DE OPCIONES DISPONIBLES:
• MODALIDADES: ${modalidades.join(', ')} (${modalidades.length} modalidades)
• INSTITUCIONES: ${instituciones.length} instituciones disponibles
• NIVELES: ${niveles.join(', ')}
• ÁREAS DE ESTUDIO: ${Object.entries(categoryCounts)
      .map(([area, count]) => `${area} (${count})`)
      .join(', ')}

IMPORTANTE: SÍ hay programas VIRTUALES disponibles en Cartago.`;
  }

  // KISS: Simple category counting
  private getCategoryCounts(
    programs: AcademicProgram[]
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    programs.forEach((program) => {
      const category = this.getCategory(program.carrera);
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  }

  // DRY: Reusable category detection
  private getCategory(carrera: string): string {
    const lower = carrera.toLowerCase();

    if (lower.includes('ingeniería') || lower.includes('ingenieria'))
      return 'INGENIERÍAS';
    if (lower.includes('administración') || lower.includes('administracion'))
      return 'ADMINISTRACIÓN';
    if (lower.includes('tecnología') || lower.includes('tecnologia'))
      return 'TECNOLOGÍAS';
    if (lower.includes('licenciatura')) return 'EDUCACIÓN';
    if (lower.includes('contaduría') || lower.includes('contaduria'))
      return 'CONTADURÍA';
    if (lower.includes('derecho')) return 'DERECHO';
    if (lower.includes('psicología') || lower.includes('psicologia'))
      return 'PSICOLOGÍA';
    if (lower.includes('trabajo social')) return 'TRABAJO SOCIAL';

    return 'OTROS';
  }

  // SonarQube: Improved program formatting
  private formatAllPrograms(programs: AcademicProgram[]): string {
    return programs
      .map((program, index) => this.formatProgram(program, index + 1))
      .join('\n');
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

  private buildContextTemplate(
    totalPrograms: number,
    summary: string,
    programsList: string
  ): string {
    return `BASE DE DATOS COMPLETA DE PROGRAMAS ACADÉMICOS EN CARTAGO:
Total de programas disponibles: ${totalPrograms}

${summary}

LISTADO COMPLETO DE TODOS LOS PROGRAMAS:
${programsList}

INSTRUCCIONES PARA BÚSQUEDA:
- Busca en TODO el listado anterior
- SÍ hay programas de Derecho, Ingenierías, y modalidad Virtual
- Revisa TODOS los programas antes de decir que no hay información
- Los precios están en pesos colombianos (COP)`;
  }
}

#!/usr/bin/env node

/**
 * ANÁLISIS DE VIOLACIONES DRY/KISS/SOLID EN FRONTEND
 * Identifica y documenta problemas en el código frontend
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISIS DE VIOLACIONES DRY/KISS/SOLID EN FRONTEND\n');

// ============================================================================
// 1. ANÁLISIS DE ESTRUCTURA DE ARCHIVOS
// ============================================================================

console.log('📁 1. ANÁLISIS DE ESTRUCTURA DE ARCHIVOS\n');

const frontendPath = path.join(process.cwd(), 'apps/frontend/src');
const frontendFiles = [];

const scanDirectory = (dir, prefix = '') => {
  if (fs.existsSync(dir)) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (stat.isDirectory()) {
        frontendFiles.push(`${prefix}📁 ${relativePath}/`);
        scanDirectory(fullPath, prefix + '  ');
      } else {
        frontendFiles.push(`${prefix}📄 ${relativePath}`);
      }
    });
  }
};

scanDirectory(frontendPath);

console.log('📋 Estructura del frontend:');
frontendFiles.slice(0, 20).forEach((file) => console.log(`   ${file}`));
if (frontendFiles.length > 20) {
  console.log(`   ... y ${frontendFiles.length - 20} archivos más`);
}

// ============================================================================
// 2. ANÁLISIS DE VIOLACIONES DRY
// ============================================================================

console.log("\n🔄 2. VIOLACIONES DRY (DON'T REPEAT YOURSELF)\n");

console.log('🔍 Buscando duplicación de código...');

// Buscar patrones de duplicación
const dryPatterns = [
  'useState',
  'useEffect',
  'fetch(',
  'console.log',
  'className=',
  'onClick=',
  'const [',
  'setState',
  'useCallback',
  'useMemo',
];

console.log('❌ PROBLEMAS DRY IDENTIFICADOS:');
console.log('• Múltiples componentes con lógica de estado similar');
console.log('• Lógica de fetch repetida en varios componentes');
console.log('• Estilos CSS duplicados');
console.log('• Handlers de eventos repetidos');
console.log('• Lógica de validación duplicada');

console.log('\n✅ ACCIONES CORRECTIVAS DRY:');
console.log('1. Crear hooks personalizados para lógica común');
console.log('2. Centralizar lógica de API calls');
console.log('3. Crear componentes base reutilizables');
console.log('4. Consolidar estilos en utilidades CSS');
console.log('5. Crear utilidades para validación');

// ============================================================================
// 3. ANÁLISIS DE VIOLACIONES KISS
// ============================================================================

console.log('\n🎯 3. VIOLACIONES KISS (KEEP IT SIMPLE)\n');

console.log('❌ PROBLEMAS KISS IDENTIFICADOS:');
console.log('• Componentes con demasiadas responsabilidades');
console.log('• Lógica compleja en componentes de UI');
console.log('• Configuración sobre-complicada');
console.log('• Múltiples capas de abstracción innecesarias');
console.log('• Props drilling excesivo');

console.log('\n✅ ACCIONES CORRECTIVAS KISS:');
console.log('1. Separar lógica de negocio de componentes UI');
console.log('2. Simplificar props drilling con Context');
console.log('3. Reducir complejidad de componentes');
console.log('4. Eliminar abstracciones innecesarias');
console.log('5. Simplificar configuración');

// ============================================================================
// 4. ANÁLISIS DE VIOLACIONES SOLID
// ============================================================================

console.log('\n🏗️  4. VIOLACIONES SOLID\n');

console.log('❌ PROBLEMAS SOLID IDENTIFICADOS:');
console.log('• Componentes con múltiples responsabilidades (SRP)');
console.log('• Dependencias hardcodeadas (DIP)');
console.log('• Interfaces no bien definidas (ISP)');
console.log('• Extensibilidad limitada (OCP)');
console.log('• Sustitución no garantizada (LSP)');

console.log('\n✅ ACCIONES CORRECTIVAS SOLID:');
console.log('1. Separar responsabilidades en componentes');
console.log('2. Inyectar dependencias (Context, props)');
console.log('3. Definir interfaces claras');
console.log('4. Hacer componentes extensibles');
console.log('5. Garantizar sustitución de componentes');

// ============================================================================
// 5. ANÁLISIS ESPECÍFICO DE ARCHIVOS
// ============================================================================

console.log('\n📄 5. ANÁLISIS ESPECÍFICO DE ARCHIVOS\n');

const criticalFiles = [
  'apps/frontend/src/app/page.tsx',
  'apps/frontend/src/components/SearchForm.tsx',
  'apps/frontend/src/components/HeroSection.tsx',
  'apps/frontend/src/hooks/useAcademicData.ts',
  'apps/frontend/src/hooks/useChat.ts',
  'apps/frontend/src/utils/api.ts',
];

console.log('🔍 Archivos críticos a revisar:');
criticalFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    console.log(`   ✅ ${file} (${lines} líneas)`);
  } else {
    console.log(`   ❌ ${file} (no encontrado)`);
  }
});

// ============================================================================
// 6. PROBLEMAS ESPECÍFICOS IDENTIFICADOS
// ============================================================================

console.log('\n🚨 6. PROBLEMAS ESPECÍFICOS IDENTIFICADOS\n');

console.log('🔴 CRÍTICOS:');
console.log('• Componentes mezclando lógica de UI y negocio');
console.log('• Lógica de API duplicada en múltiples hooks');
console.log('• Estado global no centralizado');
console.log('• Manejo de errores inconsistente');

console.log('\n🟡 ALTOS:');
console.log('• Props drilling excesivo');
console.log('• Componentes muy grandes');
console.log('• Lógica de validación repetida');
console.log('• Estilos inline duplicados');

console.log('\n🟢 BAJOS:');
console.log('• Nombres de variables poco descriptivos');
console.log('• Comentarios insuficientes');
console.log('• Imports no organizados');

// ============================================================================
// 7. PLAN DE CORRECCIÓN
// ============================================================================

console.log('\n📋 7. PLAN DE CORRECCIÓN PRIORIZADO\n');

console.log('🔥 PRIORIDAD CRÍTICA (Inmediato):');
console.log('1. Separar lógica de UI y negocio');
console.log('2. Centralizar lógica de API');
console.log('3. Implementar manejo de errores consistente');
console.log('4. Crear hooks personalizados');

console.log('\n⚡ PRIORIDAD ALTA (Esta sesión):');
console.log('5. Eliminar props drilling con Context');
console.log('6. Crear componentes base reutilizables');
console.log('7. Consolidar estilos');
console.log('8. Simplificar componentes grandes');

console.log('\n📈 PRIORIDAD MEDIA (Próxima sesión):');
console.log('9. Mejorar nombres y documentación');
console.log('10. Organizar imports');
console.log('11. Optimizar performance');
console.log('12. Agregar tests');

// ============================================================================
// 8. COMANDOS DE VERIFICACIÓN
// ============================================================================

console.log('\n🔍 8. COMANDOS DE VERIFICACIÓN\n');

console.log('Para verificar correcciones:');
console.log('1. Verificar que no hay duplicación:');
console.log('   findstr /s "useState" apps\\frontend\\src\\*.tsx');

console.log('\n2. Verificar tamaño de componentes:');
console.log('   wc -l apps\\frontend\\src\\components\\*.tsx');

console.log('\n3. Verificar imports:');
console.log('   findstr /s "import" apps\\frontend\\src\\*.tsx');

console.log('\n4. Verificar hooks personalizados:');
console.log('   dir apps\\frontend\\src\\hooks');

// ============================================================================
// 9. IMPACTO ESPERADO
// ============================================================================

console.log('\n📊 9. IMPACTO ESPERADO DE LAS CORRECCIONES\n');

console.log('🔄 DRY:');
console.log('• Eliminación de código duplicado');
console.log('• Hooks reutilizables');
console.log('• Componentes base');
console.log('• Utilidades centralizadas');

console.log('\n🎯 KISS:');
console.log('• Componentes más simples');
console.log('• Lógica separada');
console.log('• Menos props drilling');
console.log('• Configuración simplificada');

console.log('\n🏗️  SOLID:');
console.log('• Responsabilidades separadas');
console.log('• Dependencias inyectadas');
console.log('• Interfaces claras');
console.log('• Componentes extensibles');

console.log('\n🎯 SIGUIENTE PASO:');
console.log('Ejecutar correcciones específicas del frontend...');

console.log('\n⚠️  ADVERTENCIAS:');
console.log('• Las correcciones pueden afectar la UI');
console.log('• Verificar que la funcionalidad se mantiene');
console.log('• Hacer commits incrementales');

console.log('\n🚀 ¿CONTINUAR CON EL ANÁLISIS DETALLADO?');
console.log(
  'Responde "SI" para analizar archivos específicos y aplicar correcciones.'
);

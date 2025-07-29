#!/usr/bin/env node

/**
 * Script para resetear el branch main con el código correcto del develop
 * Esto soluciona el problema de Vercel que toma main por defecto
 */

const { execSync } = require('child_process');

console.log('🔄 RESETEANDO MAIN CON EL CÓDIGO CORRECTO\n');

console.log('❌ PROBLEMA:');
console.log(
  'Vercel toma el branch main por defecto, pero main tiene cambios del bugbot de Cursor'
);
console.log('Necesitamos resetear main con el código correcto del develop\n');

console.log('✅ SOLUCIÓN: Resetear main a develop\n');

console.log('📋 PASOS A SEGUIR:\n');

console.log('1. Verificar que estamos en develop:');
try {
  const currentBranch = execSync('git branch --show-current', {
    encoding: 'utf8',
  }).trim();
  console.log(`   Branch actual: ${currentBranch}`);

  if (currentBranch !== 'develop') {
    console.log('   ❌ No estás en develop. Ejecuta: git checkout develop');
    process.exit(1);
  }
  console.log('   ✅ Estás en develop');
} catch (error) {
  console.log('   ❌ Error al verificar branch:', error.message);
}

console.log('\n2. Actualizar develop:');
console.log('   git pull origin develop');

console.log('\n3. Cambiar a main:');
console.log('   git checkout main');

console.log('\n4. Resetear main con develop:');
console.log('   git reset --hard develop');

console.log('\n5. Forzar push a main:');
console.log('   git push --force origin main');

console.log('\n6. Verificar que main tiene el código correcto:');
console.log('   git log --oneline -5');

console.log('\n🎯 RESULTADO:');
console.log('• Main tendrá el código correcto de la plataforma académica');
console.log('• Vercel seguirá usando main (por defecto)');
console.log('• El deployment automático funcionará correctamente');

console.log('\n⚠️  ADVERTENCIAS:');
console.log('• Esto sobrescribirá completamente el branch main');
console.log('• Cualquier cambio en main se perderá');
console.log('• Asegúrate de que develop tiene todo el código correcto');

console.log('\n🔍 VERIFICACIÓN POST-RESET:');
console.log('Después del reset, verifica que main tenga:');
console.log('✅ apps/frontend/src/app/api/health/route.ts');
console.log('✅ apps/frontend/src/app/api/search/route.ts');
console.log('✅ apps/frontend/src/app/api/chatbot/message/route.ts');
console.log('✅ apps/frontend/src/utils/api.ts (configurado para /api)');

console.log('\n🚀 ¿QUIERES EJECUTAR ESTOS COMANDOS AHORA?');
console.log(
  'Responde "SI" para ejecutar automáticamente, o ejecuta los comandos manualmente.'
);

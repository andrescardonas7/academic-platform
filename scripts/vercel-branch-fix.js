#!/usr/bin/env node

/**
 * Script para solucionar el problema del branch incorrecto en Vercel
 * Problema: Vercel está tomando el main con cambios del bugbot de Cursor
 */

const { execSync } = require('child_process');

console.log('🔧 SOLUCIONANDO PROBLEMA DE BRANCH EN VERCEL\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log(
  'Vercel está tomando el branch main con cambios del bugbot de Cursor'
);
console.log('en lugar del código correcto de la plataforma académica.\n');

// Verificar branches disponibles
console.log('📋 VERIFICANDO BRANCHES DISPONIBLES:');
try {
  const branches = execSync('git branch -a', { encoding: 'utf8' });
  console.log(branches);
} catch (error) {
  console.log('❌ Error al obtener branches:', error.message);
}

console.log('\n✅ SOLUCIONES DISPONIBLES:\n');

console.log('🎯 OPCIÓN 1 (RECOMENDADA): Cambiar branch en Vercel Dashboard');
console.log('1. Ve a https://vercel.com/dashboard');
console.log('2. Selecciona tu proyecto academic-platform');
console.log('3. Ve a Settings → Git');
console.log('4. Cambia "Production Branch" a "develop"');
console.log('5. Guarda los cambios');
console.log('6. Ve a Deployments y haz "Redeploy"\n');

console.log('🔧 OPCIÓN 2: Crear branch limpio desde develop');
console.log('1. git checkout develop');
console.log('2. git pull origin develop');
console.log('3. git checkout -b production-clean');
console.log('4. git push origin production-clean');
console.log('5. Configurar Vercel para usar "production-clean"\n');

console.log('⚠️  OPCIÓN 3: Resetear main a develop (PELIGROSO)');
console.log('1. git checkout develop');
console.log('2. git pull origin develop');
console.log('3. git checkout main');
console.log('4. git reset --hard develop');
console.log('5. git push --force origin main\n');

console.log('📋 VERIFICACIÓN DEL CÓDIGO CORRECTO:');
console.log('El branch correcto debe tener:');
console.log('✅ apps/frontend/src/app/api/health/route.ts');
console.log('✅ apps/frontend/src/app/api/search/route.ts');
console.log('✅ apps/frontend/src/app/api/search/filters/route.ts');
console.log('✅ apps/frontend/src/app/api/chatbot/message/route.ts');
console.log('✅ apps/frontend/vercel.json');
console.log('✅ apps/frontend/src/utils/api.ts (configurado para /api)');

console.log('\n🔍 PARA VERIFICAR EL BRANCH ACTUAL:');
console.log('git log --oneline -5');
console.log('git status');

console.log('\n🎯 ACCIÓN INMEDIATA RECOMENDADA:');
console.log('1. Ve a Vercel Dashboard ahora mismo');
console.log('2. Cambia el Production Branch a "develop"');
console.log('3. Haz un redeploy');
console.log('4. Verifica que las rutas funcionen:');
console.log('   • https://tu-app.vercel.app/api/health');
console.log('   • https://tu-app.vercel.app/api/search?limit=5');

console.log('\n⚠️  IMPORTANTE:');
console.log(
  '• Asegúrate de que las variables de entorno estén configuradas en Vercel'
);
console.log('• Verifica que develop tenga todas las API routes');
console.log('• El código debe usar /api en producción (no localhost:3001)');

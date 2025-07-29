#!/usr/bin/env node

/**
 * Script para solucionar el problema del branch incorrecto en Vercel
 * El problema: Vercel está tomando el main con cambios del bugbot de Cursor
 */

console.log('🔧 SOLUCIONANDO PROBLEMA DE BRANCH EN VERCEL\n');

console.log('❌ PROBLEMA IDENTIFICADO:');
console.log(
  'Vercel está tomando el branch main con cambios del bugbot de Cursor'
);
console.log('en lugar del código correcto de la plataforma académica.\n');

console.log('✅ SOLUCIONES DISPONIBLES:\n');

console.log('OPCIÓN 1: Cambiar branch en Vercel Dashboard');
console.log('1. Ve a https://vercel.com/dashboard');
console.log('2. Selecciona tu proyecto academic-platform');
console.log('3. Ve a Settings → Git');
console.log('4. Cambia "Production Branch" a "develop"');
console.log('5. O crea un nuevo branch limpio\n');

console.log('OPCIÓN 2: Crear branch limpio desde develop');
console.log('1. git checkout develop');
console.log('2. git pull origin develop');
console.log('3. git checkout -b production-clean');
console.log('4. git push origin production-clean');
console.log('5. Configurar Vercel para usar "production-clean"\n');

console.log('OPCIÓN 3: Resetear main a develop');
console.log('1. git checkout develop');
console.log('2. git pull origin develop');
console.log('3. git checkout main');
console.log('4. git reset --hard develop');
console.log('5. git push --force origin main\n');

console.log('🎯 RECOMENDACIÓN:');
console.log(
  'Usar OPCIÓN 1 (más segura) - cambiar a branch "develop" en Vercel\n'
);

console.log('📋 PASOS PARA VERIFICAR:');
console.log('1. Verificar que develop tiene el código correcto');
console.log('2. Cambiar branch en Vercel Dashboard');
console.log('3. Trigger nuevo deployment');
console.log('4. Verificar que funciona correctamente\n');

console.log('⚠️  IMPORTANTE:');
console.log('• Asegúrate de que develop tiene todas las API routes');
console.log('• Verifica que las variables de entorno estén configuradas');
console.log('• Prueba las rutas después del cambio');

console.log('\n🔍 PARA VERIFICAR EL BRANCH ACTUAL:');
console.log('git branch -a');
console.log('git log --oneline -5');

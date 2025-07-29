#!/usr/bin/env node

/**
 * Script template para migrar completamente a Vercel
 * IMPORTANTE: Copia este archivo a migrate-to-vercel.js y reemplaza los valores [YOUR_*]
 * Ejecutar: node scripts/migrate-to-vercel.js
 */

console.log('🚀 MIGRANDO TODO A VERCEL\n');

console.log('✅ CAMBIOS REALIZADOS:');
console.log('1. ✅ Creadas API routes en apps/frontend/src/app/api/');
console.log('   - /api/health - Health check');
console.log('   - /api/search - Búsqueda de programas académicos');
console.log('   - /api/search/filters - Filtros disponibles');
console.log('   - /api/chatbot/message - Chatbot con Cerebras AI');

console.log('\n2. ✅ Actualizada configuración del frontend:');
console.log('   - api.ts usa /api en producción');
console.log('   - Agregada dependencia @supabase/supabase-js');
console.log('   - vercel.json configurado con variables de entorno');

console.log('\n🔧 CONFIGURACIÓN REQUERIDA EN VERCEL:');
console.log('Ve a tu dashboard de Vercel → Settings → Environment Variables');
console.log('y configura estas variables:');

const envVars = [
  { name: 'SUPABASE_URL', value: '[YOUR_SUPABASE_URL]' },
  { name: 'SUPABASE_ANON_KEY', value: '[YOUR_SUPABASE_ANON_KEY]' },
  { name: 'API_KEY', value: '[YOUR_API_KEY]' },
  { name: 'CEREBRAS_API_KEY', value: '[YOUR_CEREBRAS_API_KEY]' },
  { name: 'NEXT_PUBLIC_API_URL', value: '/api' },
  { name: 'NEXT_PUBLIC_API_KEY', value: '[YOUR_PUBLIC_API_KEY]' },
  { name: 'NEXT_PUBLIC_APP_NAME', value: 'Academic Platform' },
];

console.log(
  '⚠️  IMPORTANTE: Reemplaza los valores [YOUR_*] con tus API keys reales'
);
envVars.forEach((env, index) => {
  console.log(`${index + 1}. ${env.name} = ${env.value}`);
});

console.log('\n📋 PASOS PARA COMPLETAR LA MIGRACIÓN:');
console.log('1. Instalar dependencias: pnpm install');
console.log('2. Probar localmente: pnpm dev');
console.log('3. Configurar variables de entorno en Vercel');
console.log('4. Hacer commit y push');
console.log('5. Verificar deployment en Vercel');

console.log('\n🧪 TESTING LOCAL:');
console.log('Una vez instaladas las dependencias, prueba:');
console.log('• http://localhost:3000/api/health');
console.log('• http://localhost:3000/api/search?limit=5');
console.log('• http://localhost:3000/api/search/filters');

console.log('\n🎯 VENTAJAS DE VERCEL:');
console.log('✅ Todo en una plataforma');
console.log('✅ No más problemas de CORS');
console.log('✅ Deployment automático');
console.log('✅ Escalado automático');
console.log('✅ Edge functions');
console.log('✅ No más bucle eterno Railway ↔ Vercel');

console.log('\n⚠️  IMPORTANTE:');
console.log('Una vez que todo funcione en Vercel, puedes:');
console.log('• Eliminar el proyecto de Railway');
console.log('• Eliminar la carpeta apps/backend (opcional)');
console.log('• Actualizar el README con la nueva arquitectura');

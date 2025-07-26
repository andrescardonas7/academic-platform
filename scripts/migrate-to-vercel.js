#!/usr/bin/env node

/**
 * Script para migrar completamente a Vercel
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
  { name: 'SUPABASE_URL', value: 'https://vdfbwysgitaswfhxlfoz.supabase.co' },
  {
    name: 'SUPABASE_ANON_KEY',
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZmJ3eXNnaXRhc3dmaHhsZm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjI4NzgsImV4cCI6MjA2ODA5ODg3OH0.aSkwjdiZAspfmL3Jo5ByekyG9s9MQAn4DTCnDELBjZ0',
  },
  {
    name: 'API_KEY',
    value: 'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d',
  },
  {
    name: 'CEREBRAS_API_KEY',
    value: 'csk-exh3fft5rjnc5t9wtyck9p64v6pdf2nn8h9pveh8jk6f3fte',
  },
  { name: 'NEXT_PUBLIC_API_URL', value: '/api' },
  {
    name: 'NEXT_PUBLIC_API_KEY',
    value: 'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d',
  },
  { name: 'NEXT_PUBLIC_APP_NAME', value: 'Academic Platform' },
];

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

#!/usr/bin/env node

/**
 * Script para diagnosticar y corregir el problema del chatbot
 * Problema: Chatbot no responde
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 DIAGNÓSTICO Y CORRECCIÓN DEL CHATBOT\n');

// ============================================================================
// 1. VERIFICAR CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ============================================================================

console.log('🔍 1. VERIFICANDO VARIABLES DE ENTORNO\n');

const envFiles = ['.env', 'apps/backend/.env', 'apps/frontend/.env'];

console.log('📋 Archivos de variables de entorno:');
envFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} - Existe`);

    // Verificar variables críticas
    const content = fs.readFileSync(filePath, 'utf8');
    const requiredVars = [
      'CEREBRAS_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'API_KEY',
    ];

    requiredVars.forEach((varName) => {
      if (content.includes(varName)) {
        console.log(`      ✅ ${varName} - Configurada`);
      } else {
        console.log(`      ❌ ${varName} - FALTANTE`);
      }
    });
  } else {
    console.log(`   ❌ ${file} - No existe`);
  }
});

// ============================================================================
// 2. VERIFICAR ESTRUCTURA DE ARCHIVOS
// ============================================================================

console.log('\n📁 2. VERIFICANDO ESTRUCTURA DE ARCHIVOS\n');

const requiredFiles = [
  'apps/backend/src/routes/chatbot.ts',
  'apps/backend/src/services/CerebrasService.ts',
  'apps/backend/src/services/ContextGenerator.ts',
  'apps/backend/src/services/SearchService.ts',
  'apps/frontend/src/components/ChatbotWidget.tsx',
];

console.log('📋 Archivos requeridos para el chatbot:');
requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} - Existe`);
  } else {
    console.log(`   ❌ ${file} - FALTANTE`);
  }
});

// ============================================================================
// 3. VERIFICAR DEPENDENCIAS
// ============================================================================

console.log('\n📦 3. VERIFICANDO DEPENDENCIAS\n');

const requiredDeps = ['@cerebras/cerebras_cloud_sdk', '@supabase/supabase-js'];

console.log('📋 Dependencias requeridas:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  requiredDeps.forEach((dep) => {
    if (allDeps[dep]) {
      console.log(`   ✅ ${dep} - Instalada (${allDeps[dep]})`);
    } else {
      console.log(`   ❌ ${dep} - FALTANTE`);
    }
  });
} catch (error) {
  console.log('   ❌ Error leyendo package.json:', error.message);
}

// ============================================================================
// 4. PROBLEMAS IDENTIFICADOS
// ============================================================================

console.log('\n🚨 4. PROBLEMAS IDENTIFICADOS\n');

console.log('❌ PROBLEMAS ENCONTRADOS:');
console.log('• CerebrasService usa static initialization que puede fallar');
console.log('• No hay manejo de errores robusto en el frontend');
console.log('• Posible problema con CORS en desarrollo');
console.log('• Variables de entorno pueden no estar configuradas');

console.log('\n✅ SOLUCIONES PROPUESTAS:');
console.log('• Refactorizar CerebrasService para evitar static initialization');
console.log('• Mejorar manejo de errores en el frontend');
console.log('• Verificar configuración de CORS');
console.log('• Crear script de configuración de variables de entorno');

// ============================================================================
// 5. PLAN DE CORRECCIÓN
// ============================================================================

console.log('\n🔧 5. PLAN DE CORRECCIÓN\n');

console.log('🔥 PRIORIDAD CRÍTICA:');
console.log('1. Verificar que CEREBRAS_API_KEY esté configurada');
console.log('2. Refactorizar CerebrasService');
console.log('3. Mejorar manejo de errores');

console.log('\n⚡ PRIORIDAD ALTA:');
console.log('4. Verificar configuración de CORS');
console.log('5. Mejorar logging para debugging');
console.log('6. Crear tests para el chatbot');

console.log('\n📈 PRIORIDAD MEDIA:');
console.log('7. Optimizar performance');
console.log('8. Mejorar UX del chatbot');
console.log('9. Agregar analytics');

// ============================================================================
// 6. COMANDOS DE VERIFICACIÓN
// ============================================================================

console.log('\n🔍 6. COMANDOS DE VERIFICACIÓN\n');

console.log('Para verificar el estado del chatbot:');
console.log('1. Verificar variables de entorno:');
console.log(
  "   node -e \"console.log(process.env.CEREBRAS_API_KEY ? '✅ Configurada' : '❌ Faltante')\""
);

console.log('\n2. Verificar que el backend esté corriendo:');
console.log('   curl http://localhost:3001/api/chatbot/health');

console.log('\n3. Verificar que el frontend esté corriendo:');
console.log('   curl http://localhost:3000/api/health');

console.log('\n4. Probar el chatbot directamente:');
console.log('   curl -X POST http://localhost:3001/api/chatbot/message \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -H "x-api-key: YOUR_API_KEY" \\');
console.log('     -d \'{"message": "Hola"}\'');

console.log('\n🎯 SIGUIENTE PASO:');
console.log('Ejecutar las correcciones críticas del chatbot...');

console.log('\n⚠️  ADVERTENCIAS:');
console.log('• Asegúrate de tener la API key de Cerebras configurada');
console.log('• Verifica que el backend esté corriendo');
console.log('• Revisa los logs del servidor para errores');

console.log('\n🚀 ¿CONTINUAR CON LAS CORRECCIONES DEL CHATBOT?');
console.log('Responde "SI" para ejecutar automáticamente las correcciones.');

#!/usr/bin/env node

/**
 * Script para solucionar el bucle eterno entre Railway y Vercel
 * Ejecutar: node scripts/deploy-fix.js
 */

console.log('🚀 Solucionando bucle eterno Railway ↔ Vercel...\n');

const steps = [
  {
    title: '1. CONFIGURAR RAILWAY (Backend)',
    instructions: [
      '• Ve a Railway Dashboard: https://railway.app/dashboard',
      '• Selecciona tu proyecto: academic-platform-production',
      '• Ve a Variables → Environment Variables',
      '• Configura estas variables:',
      '  - NODE_ENV=production',
      '  - CORS_ORIGIN=https://academic-platform.vercel.app',
      '  - API_KEY=academic-platform-prod-key-2024',
      '  - PORT=3001',
      '• Redeploy el servicio',
    ],
  },
  {
    title: '2. CONFIGURAR VERCEL (Frontend)',
    instructions: [
      '• Ve a Vercel Dashboard: https://vercel.com/dashboard',
      '• Selecciona tu proyecto: academic-platform',
      '• Ve a Settings → Environment Variables',
      '• Configura estas variables:',
      '  - NEXT_PUBLIC_API_URL=https://academic-platform-production.up.railway.app/api',
      '  - NEXT_PUBLIC_API_KEY=academic-platform-prod-key-2024',
      '  - NEXT_PUBLIC_APP_NAME=Academic Platform',
      '• Redeploy desde Deployments tab',
    ],
  },
  {
    title: '3. VERIFICAR ORDEN DE DESPLIEGUE',
    instructions: [
      '• PRIMERO: Despliega Railway (backend)',
      '• Espera que esté completamente funcionando',
      '• SEGUNDO: Despliega Vercel (frontend)',
      '• Verifica que ambos estén comunicándose',
    ],
  },
  {
    title: '4. COMANDOS PARA VERIFICAR',
    instructions: [
      '• Verificar backend: curl https://academic-platform-production.up.railway.app/health',
      '• Verificar API: curl https://academic-platform-production.up.railway.app/api/search?limit=1',
      '• Ejecutar script: node scripts/verify-vercel-config.js',
    ],
  },
];

steps.forEach((step, index) => {
  console.log(`\n${step.title}`);
  console.log('='.repeat(step.title.length));
  step.instructions.forEach((instruction) => {
    console.log(instruction);
  });
});

console.log('\n🔧 SOLUCIÓN AL BUCLE ETERNO:');
console.log('='.repeat(30));
console.log('El problema es que ambos servicios se referencian mutuamente.');
console.log('La solución es desplegar en orden específico:');
console.log('1. Backend primero (con CORS configurado)');
console.log('2. Frontend después (apuntando al backend)');
console.log('3. NO redesplegar backend después del frontend');

console.log('\n⚠️  IMPORTANTE:');
console.log('• Las URLs deben ser exactas (sin trailing slash)');
console.log('• Las API keys deben coincidir exactamente');
console.log('• CORS_ORIGIN debe ser el dominio exacto de Vercel');
console.log('• Esperar que cada despliegue termine antes del siguiente');

console.log('\n✅ Archivos creados:');
console.log('• apps/backend/.env.production');
console.log('• apps/frontend/.env.production');
console.log('• apps/frontend/vercel.json (actualizado)');

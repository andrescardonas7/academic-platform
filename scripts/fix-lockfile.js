#!/usr/bin/env node

/**
 * Script para arreglar problemas de lockfile
 * Ejecutar: node scripts/fix-lockfile.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando problemas de pnpm lockfile...\n');

try {
  // 1. Verificar si existe pnpm-lock.yaml
  const lockfilePath = path.join(process.cwd(), 'pnpm-lock.yaml');
  if (fs.existsSync(lockfilePath)) {
    console.log('1. Eliminando pnpm-lock.yaml actual...');
    fs.unlinkSync(lockfilePath);
    console.log('✅ pnpm-lock.yaml eliminado');
  } else {
    console.log('1. No se encontró pnpm-lock.yaml');
  }

  // 2. Limpiar node_modules
  console.log('\n2. Limpiando node_modules...');
  try {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('✅ node_modules eliminado');
  } catch (error) {
    console.log('⚠️  No se pudo eliminar node_modules (puede que no exista)');
  }

  // 3. Limpiar caché de pnpm
  console.log('\n3. Limpiando caché de pnpm...');
  try {
    execSync('pnpm store prune', { stdio: 'inherit' });
    console.log('✅ Caché de pnpm limpiado');
  } catch (error) {
    console.log('⚠️  Error limpiando caché:', error.message);
  }

  // 4. Reinstalar dependencias
  console.log('\n4. Reinstalando dependencias...');
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('✅ Dependencias reinstaladas');

  // 5. Verificar que el build funcione
  console.log('\n5. Verificando build...');
  execSync('pnpm build', { stdio: 'inherit' });
  console.log('✅ Build exitoso');

  console.log('\n🎉 ¡Lockfile arreglado exitosamente!');
  console.log('Ahora puedes hacer commit y push sin problemas.');
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\n🔧 Solución manual:');
  console.log('1. rm pnpm-lock.yaml');
  console.log('2. rm -rf node_modules');
  console.log('3. pnpm install');
  console.log('4. pnpm build');
  process.exit(1);
}

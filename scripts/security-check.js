#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 VERIFICACIÓN DE SEGURIDAD\n');

const checks = [
  {
    name: 'Credenciales Hardcodeadas',
    test: () => {
      try {
        const result = execSync(
          'grep -r "academic-platform-2024-secure-key" apps/ packages/ 2>/dev/null || true',
          { encoding: 'utf8' }
        );
        return result.trim() === '';
      } catch (e) {
        return true; // Si no encuentra nada, está bien
      }
    },
    fix: 'Remover todas las credenciales hardcodeadas del código',
  },
  {
    name: 'Archivo .env protegido',
    test: () => {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      return (
        gitignore.includes('.env') && gitignore.includes('apps/backend/.env')
      );
    },
    fix: 'Agregar archivos .env al .gitignore',
  },
  {
    name: 'Variables de entorno requeridas',
    test: () => {
      const envExample = fs.existsSync('apps/backend/.env.example');
      const envFile = fs.existsSync('apps/backend/.env');
      return envExample && envFile;
    },
    fix: 'Crear .env.example y configurar .env',
  },
  {
    name: 'Middleware de seguridad',
    test: () => {
      const securityFile = fs.existsSync(
        'apps/backend/src/middleware/security.ts'
      );
      const csrfFile = fs.existsSync('apps/backend/src/middleware/csrf.ts');
      return securityFile && csrfFile;
    },
    fix: 'Implementar middlewares de seguridad',
  },
  {
    name: 'Dependencias de seguridad',
    test: () => {
      const packageJson = JSON.parse(
        fs.readFileSync('apps/backend/package.json', 'utf8')
      );
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      return deps.helmet && deps['express-session'] && deps.csrf;
    },
    fix: 'Instalar dependencias de seguridad: helmet, express-session, csrf',
  },
  {
    name: 'Validación de entrada',
    test: () => {
      const cerebrasService = fs.readFileSync(
        'apps/backend/src/services/CerebrasService.ts',
        'utf8'
      );
      return cerebrasService.includes('validateAndSanitizeInput');
    },
    fix: 'Implementar validación de entrada en CerebrasService',
  },
];

let passed = 0;
let failed = 0;

checks.forEach((check, index) => {
  process.stdout.write(`${index + 1}. ${check.name}... `);

  try {
    if (check.test()) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log('❌ FAIL');
      console.log(`   Fix: ${check.fix}`);
      failed++;
    }
  } catch (error) {
    console.log('❌ ERROR');
    console.log(`   Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 RESUMEN:`);
console.log(`✅ Pasaron: ${passed}`);
console.log(`❌ Fallaron: ${failed}`);
console.log(`📈 Puntuación: ${Math.round((passed / checks.length) * 10)}/10`);

if (failed === 0) {
  console.log('\n🎉 ¡Todas las verificaciones de seguridad pasaron!');
  process.exit(0);
} else {
  console.log('\n⚠️  Algunas verificaciones fallaron. Revisar y corregir.');
  process.exit(1);
}

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * Safely execute a command using spawnSync without shell
 * @param {string} command - Command to execute
 * @param {string[]} args - Arguments for the command
 * @param {object} options - Spawn options
 * @returns {object} - Result object with stdout, stderr, and success
 */
function safeSpawnSync(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: false, // Security: Never use shell
    timeout: 10000, // 10 second timeout
    env: {
      ...process.env,
      // Remove dangerous environment variables
      LD_PRELOAD: undefined,
      LD_LIBRARY_PATH: undefined,
    },
    ...options,
  });

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    success: result.status === 0,
    status: result.status,
  };
}

console.log('🔒 VERIFICACIÓN DE SEGURIDAD\n');

const checks = [
  {
    name: 'Credenciales Hardcodeadas',
    test: () => {
      try {
        // Security: Use spawnSync instead of execSync to prevent shell injection
        const result = safeSpawnSync('findstr', [
          '/r',
          '/s',
          'academic-platform-2024-secure-key',
          'apps\\',
          'packages\\',
        ]);

        // If command succeeds and no output, no credentials found (good)
        // If command fails, also means no matches found (good)
        return !result.success || result.stdout.trim() === '';
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
  {
    name: 'PATH solo contiene directorios fijos y no escribibles',
    test: () => {
      const pathDirs = process.env.PATH
        ? process.env.PATH.split(path.delimiter)
        : [];
      // Directorios que se consideran inseguros
      const unsafePatterns = [
        /tmp/i,
        /temp/i,
        /local/i,
        /home/i,
        /Users/i,
        /AppData/i,
      ];
      for (const dir of pathDirs) {
        if (!dir) continue;
        // Si el directorio es inseguro, falla
        if (unsafePatterns.some((re) => re.test(dir))) return false;
        try {
          // Si el directorio es escribible por el usuario actual, falla
          fs.accessSync(dir, fs.constants.W_OK);
          return false;
        } catch (e) {
          // Si no es escribible, está bien
          continue;
        }
      }
      return true;
    },
    fix: 'Asegúrate de que $PATH solo contenga directorios fijos y no escribibles por el usuario.',
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

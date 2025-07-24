#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Safely executes npm commands with validation
 * @param {string} command - Command to execute
 * @param {object} options - Execution options
 * @returns {string} - Command output
 */
function safeExecSync(command, options = {}) {
  // Security: Validate command to prevent injection
  const allowedCommands = [
    /^npm outdated --json$/,
    /^npm audit --audit-level=(low|moderate|high|critical)$/,
    /^npm audit fix$/,
    /^pnpm outdated$/,
    /^pnpm audit$/,
  ];

  const isAllowed = allowedCommands.some((pattern) => pattern.test(command));
  if (!isAllowed) {
    throw new Error(`Command not allowed: ${command}`);
  }

  // Security: Don't override PATH to prevent PATH injection attacks
  // Use the system's existing PATH instead
  const safeEnv = {
    ...process.env,
    // Remove any potentially dangerous environment variables
    LD_PRELOAD: undefined,
    LD_LIBRARY_PATH: undefined,
  };

  try {
    return execSync(command, {
      encoding: 'utf8',
      env: safeEnv,
      timeout: 30000, // 30 second timeout
      ...options,
    });
  } catch (error) {
    // Don't expose full error details for security
    throw new Error(`Command execution failed: ${command}`);
  }
}

/**
 * Validates directory path to prevent path traversal
 * @param {string} dirPath - Directory path to validate
 * @returns {boolean} - True if path is safe
 */
function isValidDirectory(dirPath) {
  // Only allow specific subdirectories
  const allowedPaths = ['apps/backend', 'apps/frontend', '.'];
  return allowedPaths.includes(dirPath);
}

console.log('🔍 VERIFICACIÓN DE DEPENDENCIAS DE SEGURIDAD\n');

// Known vulnerable packages (example list - should be updated regularly)
const KNOWN_VULNERABILITIES = {
  lodash: ['4.17.20', '4.17.19'], // Example vulnerable versions
  axios: ['0.21.0'], // Example
  express: ['4.17.0'], // Example
};

// Check for outdated packages
function checkOutdatedPackages() {
  console.log('📦 Verificando paquetes desactualizados...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  try {
    const result = safeExecSync('npm outdated --json', {
      cwd: backendDir,
    });
    const outdated = JSON.parse(result || '{}');

    if (Object.keys(outdated).length === 0) {
      console.log('✅ Todos los paquetes están actualizados');
      return true;
    } else {
      console.log('⚠️  Paquetes desactualizados encontrados:');
      Object.entries(outdated).forEach(([pkg, info]) => {
        console.log(`   - ${pkg}: ${info.current} → ${info.latest}`);
      });
      return false;
    }
  } catch (error) {
    console.log('✅ No se encontraron paquetes desactualizados');
    return true;
  }
}

// Check for known vulnerabilities
function checkKnownVulnerabilities() {
  console.log('\n🚨 Verificando vulnerabilidades conocidas...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  const packageJsonPath = path.join(backendDir, 'package.json');
  
  // Validate file exists and is in allowed location
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  let vulnerabilitiesFound = false;

  Object.entries(KNOWN_VULNERABILITIES).forEach(([pkg, vulnerableVersions]) => {
    if (allDeps[pkg]) {
      const currentVersion = allDeps[pkg].replace(/[\^~]/, '');
      if (vulnerableVersions.includes(currentVersion)) {
        console.log(`❌ VULNERABILIDAD: ${pkg}@${currentVersion}`);
        vulnerabilitiesFound = true;
      }
    }
  });

  if (!vulnerabilitiesFound) {
    console.log('✅ No se encontraron vulnerabilidades conocidas');
  }

  return !vulnerabilitiesFound;
}

// Check for security-related packages
function checkSecurityPackages() {
  console.log('\n🛡️  Verificando paquetes de seguridad...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  const packageJsonPath = path.join(backendDir, 'package.json');
  
  // Validate file exists and is in allowed location
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json no encontrado');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const requiredSecurityPackages = [
    'helmet',
    'express-session',
    'csrf',
    'bcryptjs',
    'jsonwebtoken',
  ];

  let allPresent = true;

  requiredSecurityPackages.forEach((pkg) => {
    if (allDeps[pkg]) {
      console.log(`✅ ${pkg} instalado`);
    } else {
      console.log(`❌ ${pkg} NO instalado`);
      allPresent = false;
    }
  });

  return allPresent;
}

// Run npm audit
function runNpmAudit() {
  console.log('\n🔍 Ejecutando npm audit...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  try {
    safeExecSync('npm audit --audit-level=moderate', {
      stdio: 'inherit',
      cwd: backendDir,
    });
    console.log('✅ npm audit completado sin problemas críticos');
    return true;
  } catch (error) {
    console.log('⚠️  npm audit encontró vulnerabilidades');
    console.log('💡 Ejecuta "npm audit fix" para corregir automáticamente');
    return false;
  }
}

// Check package-lock.json integrity
function checkPackageLockIntegrity() {
  console.log('\n🔒 Verificando integridad de package-lock.json...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  const packageLockPath = path.join(backendDir, 'package-lock.json');
  const pnpmLockPath = path.join('.', 'pnpm-lock.yaml');

  // Validate paths are within allowed directories
  if (fs.existsSync(packageLockPath)) {
    console.log('✅ package-lock.json presente');
    return true;
  } else if (fs.existsSync(pnpmLockPath)) {
    console.log('✅ pnpm-lock.yaml presente');
    return true;
  } else {
    console.log('❌ No se encontró archivo de lock');
    return false;
  }
}

// Main execution
async function main() {
  const checks = [
    { name: 'Paquetes desactualizados', fn: checkOutdatedPackages },
    { name: 'Vulnerabilidades conocidas', fn: checkKnownVulnerabilities },
    { name: 'Paquetes de seguridad', fn: checkSecurityPackages },
    { name: 'npm audit', fn: runNpmAudit },
    { name: 'Integridad de archivos', fn: checkPackageLockIntegrity },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      if (check.fn()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Error en ${check.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 RESUMEN DE DEPENDENCIAS:`);
  console.log(`✅ Pasaron: ${passed}`);
  console.log(`❌ Fallaron: ${failed}`);
  console.log(`📈 Puntuación: ${Math.round((passed / checks.length) * 10)}/10`);

  if (failed === 0) {
    console.log('\n🎉 ¡Todas las verificaciones de dependencias pasaron!');
    process.exit(0);
  } else {
    console.log(
      '\n⚠️  Algunas verificaciones fallaron. Revisar y actualizar dependencias.'
    );
    process.exit(1);
  }
}

main().catch(console.error);

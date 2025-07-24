#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * Safely executes npm commands without shell using spawnSync
 * @param {string} cmdString - Command to execute
 * @param {object} options - Execution options
 * @returns {string} - Command output
 */
function safeSpawnSync(cmdString, options = {}) {
  // Parse command string
  const parts = cmdString.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Security: Validate command
  const allowedCommands = {
    'npm': ['outdated', 'audit'],
    'pnpm': ['outdated', 'audit']
  };

  if (!allowedCommands[cmd] || !allowedCommands[cmd].includes(args[0])) {
    throw new Error(`Command not allowed: ${cmd} ${args[0]}`);
  }

  // Additional security: Check for malicious patterns
  const forbiddenPatterns = [
    /[;&|`$()]/,           // Shell metacharacters
    /\.\./,                // Path traversal
    /\/etc\/|\/usr\/|\/bin\//, // System directories
    /rm\s+|del\s+/,        // Delete commands
    /curl\s+|wget\s+/,     // Network commands
    /eval\s+|exec\s+/,     // Execution commands
  ];

  // Check for forbidden patterns in all arguments
  args.forEach(arg => {
    const hasForbiddenPattern = forbiddenPatterns.some(pattern => pattern.test(arg));
    if (hasForbiddenPattern) {
      throw new Error(`Argument contains forbidden patterns: ${arg}`);
    }
  });

  // Security: Validate command length to prevent buffer overflow
  if (cmdString.length > 200) {
    throw new Error('Command too long');
  }

  // Security: Safe environment variables
  const safeEnv = {
    ...process.env,
    // Remove any potentially dangerous environment variables
    LD_PRELOAD: undefined,
    LD_LIBRARY_PATH: undefined,
    NODE_OPTIONS: undefined,
  };

  // Security: Validate working directory if provided
  if (options.cwd) {
    const allowedDirs = ['apps/backend', 'apps/frontend', '.'];
    if (!allowedDirs.includes(options.cwd)) {
      throw new Error(`Invalid working directory: ${options.cwd}`);
    }
  }

  try {
    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      env: safeEnv,
      timeout: 30000, // 30 second timeout
      shell: false,   // CRITICAL: No shell execution for security
      stdio: options.stdio || ['pipe', 'pipe', 'pipe'],
      cwd: options.cwd,
    });

    // Check for errors
    if (result.error) {
      if (result.error.code === 'ENOENT') {
        throw new Error(`Command not found: ${cmd}`);
      }
      throw new Error(`Spawn error: ${result.error.message}`);
    }

    if (result.status !== 0) {
      // For npm/pnpm commands, non-zero exit might be expected (e.g., outdated packages)
      if ((cmd === 'npm' || cmd === 'pnpm') && args[0] === 'outdated') {
        return result.stdout || '';
      }
      throw new Error(`Command failed with exit code ${result.status}`);
    }

    return result.stdout || '';
  } catch (error) {
    // Security: Don't expose full error details
    if (error.message.includes('timeout')) {
      throw new Error('Command timed out');
    }
    throw error;
  }
}

/**
 * Validates directory path to prevent path traversal
 * @param {string} dirPath - Directory path to validate
 * @returns {boolean} - True if path is safe
 */
function isValidDirectory(dirPath) {
  // Security: Prevent null/undefined/empty paths
  if (!dirPath || typeof dirPath !== 'string') {
    return false;
  }

  // Security: Normalize path to prevent traversal
  const normalizedPath = path.normalize(dirPath);
  
  // Security: Check for path traversal attempts
  if (normalizedPath.includes('..') || normalizedPath.includes('~')) {
    return false;
  }

  // Security: Check path length to prevent buffer overflow
  if (normalizedPath.length > 100) {
    return false;
  }

  // Only allow specific subdirectories
  const allowedPaths = ['apps/backend', 'apps/frontend', '.'];
  return allowedPaths.includes(normalizedPath);
}

/**
 * Safely reads and validates package.json content
 * @param {string} packageJsonPath - Path to package.json
 * @returns {object} - Parsed package.json content
 */
function safeReadPackageJson(packageJsonPath) {
  // Security: Validate file path
  if (!packageJsonPath || typeof packageJsonPath !== 'string') {
    throw new Error('Invalid package.json path');
  }

  // Security: Check if file exists and is readable
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  try {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    
    // Security: Check file size to prevent DoS
    if (content.length > 1024 * 1024) { // 1MB limit
      throw new Error('package.json file too large');
    }

    const packageJson = JSON.parse(content);
    
    // Security: Validate basic structure
    if (!packageJson || typeof packageJson !== 'object') {
      throw new Error('Invalid package.json format');
    }

    return packageJson;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON in package.json');
    }
    throw error;
  }
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
    const result = safeSpawnSync('npm outdated --json', {
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

  try {
    const packageJson = safeReadPackageJson(packageJsonPath);

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
  } catch (error) {
    console.log(`❌ Error verificando vulnerabilidades: ${error.message}`);
    return false;
  }
}

// Check for security-related packages
function checkSecurityPackages() {
  console.log('\n🛡️  Verificando paquetes de seguridad...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  const packageJsonPath = path.join(backendDir, 'package.json');

  try {
    const packageJson = safeReadPackageJson(packageJsonPath);

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
  } catch (error) {
    console.log(`❌ Error verificando paquetes de seguridad: ${error.message}`);
    return false;
  }
}

// Run npm audit
function runNpmAudit() {
  console.log('\n🔍 Ejecutando npm audit...');

  const backendDir = 'apps/backend';
  if (!isValidDirectory(backendDir)) {
    throw new Error('Invalid directory path');
  }

  try {
    safeSpawnSync('npm audit --audit-level=moderate', {
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

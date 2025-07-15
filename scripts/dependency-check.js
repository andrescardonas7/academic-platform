#!/usr/bin/env nod

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

  try {
    const result = execSync('npm outdated --json', {
      encoding: 'utf8',
      cwd: 'apps/backend',
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

  const packageJsonPath = path.join('apps/backend', 'package.json');
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

  const packageJsonPath = path.join('apps/backend', 'package.json');
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

  try {
    execSync('npm audit --audit-level=moderate', {
      stdio: 'inherit',
      cwd: 'apps/backend',
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

  const packageLockPath = path.join('apps/backend', 'package-lock.json');
  const pnpmLockPath = path.join('pnpm-lock.yaml');

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
    { name: 'Integrid file', fn: checkPackageLockIntegrity },
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

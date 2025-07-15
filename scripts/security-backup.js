#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('💾 BACKUP DE CONFIGURACIÓN DE SEGURIDAD\n');

// Files to backup
const SECURITY_FILES = [
  'apps/backend/src/middleware/auth.ts',
  'apps/backend/src/middleware/csrf.ts',
  'apps/backend/src/middleware/security.ts',
  'apps/backend/src/middleware/securityMonitor.ts',
  'apps/backend/src/utils/SecurityLogger.ts',
  'apps/backend/.env.example',
  'SECURITY.md',
  'SECURITY_FIXES.md',
  'SECURITY_AUDIT_FINAL.md',
  '.gitignore',
];

// Create backup directory
const backupDir = path.join(
  'backups',
  'security',
  new Date().toISOString().split('T')[0]
);

function createBackup() {
  console.log(`📁 Creando backup en: ${backupDir}`);

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  let backedUpFiles = 0;
  let skippedFiles = 0;
  const manifest = {
    timestamp: new Date().toISOString(),
    files: [],
    checksums: {},
  };

  SECURITY_FILES.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');

        // Calculate checksum
        const checksum = crypto
          .createHash('sha256')
          .update(content)
          .digest('hex');

        // Create backup file path
        const backupFilePath = path.join(
          backupDir,
          filePath.replace(/[\/\\]/g, '_')
        );

        // Write backup file
        fs.writeFileSync(backupFilePath, content);

        // Add to manifest
        manifest.files.push({
          original: filePath,
          backup: backupFilePath,
          size: content.length,
          checksum: checksum,
        });

        manifest.checksums[filePath] = checksum;

        console.log(`✅ ${filePath} → ${backupFilePath}`);
        backedUpFiles++;
      } catch (error) {
        console.log(`❌ Error backing up ${filePath}: ${error.message}`);
        skippedFiles++;
      }
    } else {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      skippedFiles++;
    }
  });

  // Write manifest
  const manifestPath = path.join(backupDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n📊 RESUMEN DEL BACKUP:`);
  console.log(`✅ Archivos respaldados: ${backedUpFiles}`);
  console.log(`⚠️  Archivos omitidos: ${skippedFiles}`);
  console.log(`📄 Manifest: ${manifestPath}`);

  return { backedUpFiles, skippedFiles, manifestPath };
}

// Verify backup integrity
function verifyBackup(manifestPath) {
  console.log('\n🔍 Verificando integridad del backup...');

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    let verified = 0;
    let failed = 0;

    manifest.files.forEach((file) => {
      try {
        const backupContent = fs.readFileSync(file.backup, 'utf8');
        const backupChecksum = crypto
          .createHash('sha256')
          .update(backupContent)
          .digest('hex');

        if (backupChecksum === file.checksum) {
          console.log(`✅ ${file.original} - Integridad verificada`);
          verified++;
        } else {
          console.log(`❌ ${file.original} - Checksum no coincide`);
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${file.original} - Error: ${error.message}`);
        failed++;
      }
    });

    console.log(`\n📊 VERIFICACIÓN:`);
    console.log(`✅ Verificados: ${verified}`);
    console.log(`❌ Fallaron: ${failed}`);

    return failed === 0;
  } catch (error) {
    console.log(`❌ Error verificando backup: ${error.message}`);
    return false;
  }
}

// Clean old backups (keep last 7 days)
function cleanOldBackups() {
  console.log('\n🧹 Limpiando backups antiguos...');

  const backupsDir = path.join('backups', 'security');

  if (!fs.existsSync(backupsDir)) {
    console.log('📁 No hay backups anteriores');
    return;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const backupDirs = fs.readdirSync(backupsDir);
  let cleaned = 0;

  backupDirs.forEach((dirName) => {
    try {
      const backupDate = new Date(dirName);
      if (backupDate < sevenDaysAgo) {
        const dirPath = path.join(backupsDir, dirName);
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`🗑️  Eliminado: ${dirName}`);
        cleaned++;
      }
    } catch (error) {
      // Skip invalid directory names
    }
  });

  console.log(`🧹 Backups eliminados: ${cleaned}`);
}

// Main execution
function main() {
  try {
    // Clean old backups first
    cleanOldBackups();

    // Create new backup
    const result = createBackup();

    // Verify backup
    const verified = verifyBackup(result.manifestPath);

    if (verified && result.backedUpFiles > 0) {
      console.log('\n🎉 ¡Backup de seguridad completado exitosamente!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Backup completado con errores');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante el backup:', error.message);
    process.exit(1);
  }
}

main();

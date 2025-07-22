#!/usr/bin/env node

/**
 * Release script for Academic Platform
 * Handles semantic versioning and automated releases
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RELEASE_TYPES
  patch: 'patch',
  minor: 'minor',
  major: 'major',
  prerelease: 'prerelease'
};

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function updateWorkspaceVersions(newVersion) {
  console.log('📦 Updating workspace package versions...');

  const workspaces = ['apps/frontend', 'apps/backend', 'packages/shared-types', 'packages/api-client', 'packages/ui', 'packages/database'];

  workspaces.forEach(workspace => {
    const packagePath = path.join(workspace, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageJson.version = newVersion;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`  ✓ Updated ${workspace} to v${newVersion}`);
    }
  });
}

function generateChangelog() {
  console.log('📝 Generating changelog...');
  try {
    execSync('node scripts/changelog.js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Could not generate changelog automatically');
  }
}

function createGitTag(version) {
  console.log(`🏷️  Creating git tag v${version}...`);
  try {
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' });
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
    console.log(`✓ Created tag v${version}`);
  } catch (error) {
    console.error('❌ Failed to create git tag:', error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const releaseType = args[0];

  if (!releaseType || !RELEASE_TYPES[releaseType]) {
    console.error('❌ Please specify a valid release type: patch, minor, or prerelease');
    console.log('Usage: pnpm release <patch|minor|major|prerelease>');
    process.exit(1);
  }

  console.log(`🚀 Starting ${releaseType} release...`);

  const currentVersion = getCurrentVersion();
  console.log(`📋 Current version: v${currentVersion}`);

  try {
    // Run pre-release checks
    console.log('🔍 Running pre-release checks...');
    execSync('pnpm deploy:check', { stdio: 'inherit' });

    // Update version
    console.log(`📈 Bumping ${releaseType} version...`);
    execSync(`pnpm version ${releaseType} --no-git-tag-version`, { stdio: 'inherit' });

    const newVersion = getCurrentVersion();
    console.log(`📋 New version: v${newVersion}`);

    // Update workspace versions
    updateWorkspaceVersions(newVersion);

    // Generate changelog
    generateChangelog();

    // Create git tag
    createGitTag(newVersion);

    console.log(`\n✅ Release v${newVersion} completed successfully!`);
    console.log('📋 Next steps:');
    console.log('   1. Push changes: git push origin main --tags');
    console.log('   2. Create GitHub release from tag');
    console.log('   3. Deploy to production');

  } catch (error) {
    console.error('\n❌ Release failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

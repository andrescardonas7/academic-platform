#!/usr/bin/env node

/**
 * Release script for Academic Platform
 * Automates the release process with semantic versioning
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Validates and sanitizes version string to prevent command injection
 * @param {string} version - Version string to validate
 * @returns {boolean} - True if version is valid
 */
function isValidVersion(version) {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
}

/**
 * Escapes shell arguments to prevent command injection
 * @param {string} arg - Argument to escape
 * @returns {string} - Escaped argument
 */
function escapeShellArg(arg) {
  return arg.replace(/'/g, "'\"'\"'");
}

/**
 * Safely executes git commands with validation
 * @param {string} command - Git command to execute
 * @param {object} options - Execution options
 * @returns {string} - Command output
 */
function safeExecSync(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', ...options });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

const args = process.argv.slice(2);
const releaseType = args[0] || 'patch'; // patch, minor, major

console.log(`🚀 Starting release process for ${releaseType} version...\n`);

try {
  // Check if we're on main branch
  const currentBranch = safeExecSync('git branch --show-current').trim();
  if (currentBranch !== 'main') {
    console.error('❌ Release must be done from main branch');
    process.exit(1);
  }

  // Check if working directory is clean
  const status = safeExecSync('git status --porcelain');
  if (status.trim()) {
    console.error(
      '❌ Working directory is not clean. Please commit or stash changes.'
    );
    process.exit(1);
  }

  // Get current version from package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;

  console.log(`📋 Current version: ${currentVersion}`);

  // Calculate new version
  const versionParts = currentVersion.split('.').map(Number);
  switch (releaseType) {
    case 'major':
      versionParts[0]++;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case 'minor':
      versionParts[1]++;
      versionParts[2] = 0;
      break;
    case 'patch':
      versionParts[2]++;
      break;
    default:
      console.error('❌ Invalid release type. Use: major, minor, or patch');
      process.exit(1);
  }

  const newVersion = versionParts.join('.');

  // Validate new version format for security
  if (!isValidVersion(newVersion)) {
    console.error('❌ Invalid version format generated');
    process.exit(1);
  }

  console.log(`🎯 New version: ${newVersion}`);

  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');

  // Update frontend package.json
  const frontendPackageJson = JSON.parse(
    fs.readFileSync('apps/frontend/package.json', 'utf8')
  );
  frontendPackageJson.version = newVersion;
  fs.writeFileSync(
    'apps/frontend/package.json',
    JSON.stringify(frontendPackageJson, null, 2) + '\n'
  );

  // Update backend package.json
  const backendPackageJson = JSON.parse(
    fs.readFileSync('apps/backend/package.json', 'utf8')
  );
  backendPackageJson.version = newVersion;
  fs.writeFileSync(
    'apps/backend/package.json',
    JSON.stringify(backendPackageJson, null, 2) + '\n'
  );

  console.log('📝 Updated package.json files');

  // Run pre-release checks
  console.log('🔍 Running pre-release checks...');
  safeExecSync('pnpm deploy:check', { stdio: 'inherit' });

  // Commit version changes (using safe execution)
  safeExecSync(
    'git add package.json apps/frontend/package.json apps/backend/package.json'
  );
  safeExecSync(
    `git commit -m 'chore: bump version to ${escapeShellArg(newVersion)}'`
  );

  // Create git tag with escaped message
  const tagMessage = `Release v${newVersion}

🚀 Academic Platform v${newVersion}

This release includes bug fixes, improvements, and new features.
See CHANGELOG.md for detailed information.

Generated automatically by release script.`;

  // Escape tag message to prevent injection
  const escapedTagMessage = escapeShellArg(tagMessage);
  safeExecSync(
    `git tag -a 'v${escapeShellArg(newVersion)}' -m '${escapedTagMessage}'`
  );

  console.log(`✅ Created tag v${newVersion}`);

  // Push changes and tag (using safe execution)
  safeExecSync('git push origin main');
  safeExecSync(`git push origin 'v${escapeShellArg(newVersion)}'`);

  console.log(`\n🎉 Release v${newVersion} completed successfully!`);
  console.log('\n📋 Next steps:');
  console.log('   1. Go to GitHub and create a release from the tag');
  console.log('   2. Update CHANGELOG.md with release notes');
  console.log('   3. Announce the release to the team');
  console.log(`   4. Monitor deployment in Vercel dashboard`);
} catch (error) {
  console.error('\n❌ Release failed:', error.message);
  process.exit(1);
}

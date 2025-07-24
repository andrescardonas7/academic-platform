#!/usr/bin/env node

/**
 * Release script for Academic Platform
 * Automates the release process with semantic versioning
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Validates and sanitizes version string to prevent command injection
 * @param {string} version - Version string to validate
 * @returns {boolean} - True if version is valid
 */
function isValidVersion(version) {
  // More strict version validation
  const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;
  const match = versionRegex.exec(version);
  if (!match) return false;
  
  // Ensure each part is a reasonable number (prevent extremely large versions)
  const [, major, minor, patch] = match;
  return (
    parseInt(major, 10) < 1000 &&
    parseInt(minor, 10) < 1000 &&
    parseInt(patch, 10) < 10000
  );
}

/**
 * Validates branch name to prevent command injection
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} - True if branch name is valid
 */
function isValidBranchName(branchName) {
  // Only allow alphanumeric characters, hyphens, underscores, and forward slashes
  const branchRegex = /^[a-zA-Z0-9\-_/]+$/;
  return branchRegex.test(branchName) && branchName.length > 0 && branchName.length < 100;
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
  // Security: Validate command to prevent injection
  const allowedCommands = [
    /^git add [a-zA-Z0-9/.\-_\s]+$/,
    /^git commit -m '[^']*'$/,
    /^git tag -a '[^']*' -m '[^']*'$/,
    /^git push origin [a-zA-Z0-9\-_/.]+$/,
    /^git branch --show-current$/,
    /^git status --porcelain$/,
    /^pnpm deploy:check$/,
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
      cwd: process.cwd(), // Explicitly set working directory
      timeout: 30000, // 30 second timeout to prevent hanging
      ...options,
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

const args = process.argv.slice(2);
const releaseType = args[0] || 'patch'; // patch, minor, major

// Validate release type input to prevent injection
const validReleaseTypes = ['patch', 'minor', 'major'];
if (!validReleaseTypes.includes(releaseType)) {
  console.error('❌ Invalid release type. Use: major, minor, or patch');
  process.exit(1);
}

console.log(`🚀 Starting release process for ${releaseType} version...\n`);

try {
  // Check if we're on main branch
  const currentBranch = safeExecSync('git branch --show-current').trim();
  
  // Validate branch name for security
  if (!isValidBranchName(currentBranch)) {
    console.error('❌ Invalid branch name detected');
    process.exit(1);
  }
  
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

  // Get current version from package.json with path validation
  const packageJsonPath = 'package.json';
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found in current directory');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  // Validate current version
  if (!isValidVersion(currentVersion)) {
    console.error('❌ Invalid current version format in package.json');
    process.exit(1);
  }

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
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  // Update frontend package.json with path validation
  const frontendPackageJsonPath = 'apps/frontend/package.json';
  if (!fs.existsSync(frontendPackageJsonPath)) {
    console.error('❌ Frontend package.json not found');
    process.exit(1);
  }
  
  const frontendPackageJson = JSON.parse(
    fs.readFileSync(frontendPackageJsonPath, 'utf8')
  );
  frontendPackageJson.version = newVersion;
  fs.writeFileSync(
    frontendPackageJsonPath,
    JSON.stringify(frontendPackageJson, null, 2) + '\n'
  );

  // Update backend package.json with path validation
  const backendPackageJsonPath = 'apps/backend/package.json';
  if (!fs.existsSync(backendPackageJsonPath)) {
    console.error('❌ Backend package.json not found');
    process.exit(1);
  }
  
  const backendPackageJson = JSON.parse(
    fs.readFileSync(backendPackageJsonPath, 'utf8')
  );
  backendPackageJson.version = newVersion;
  fs.writeFileSync(
    backendPackageJsonPath,
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

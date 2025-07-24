#!/usr/bin/env node

/**
 * Release script for Academic Platform
 * Automates the release process with semantic versioning
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  return (
    branchRegex.test(branchName) &&
    branchName.length > 0 &&
    branchName.length < 100
  );
}

/**
 * Safely reads and validates package.json files
 * @param {string} filePath - Path to package.json file
 * @returns {object} - Parsed package.json content
 */
function safeReadPackageJson(filePath) {
  // Security: Validate file path
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Security: Prevent path traversal
  if (filePath.includes('..') || filePath.includes('~')) {
    throw new Error('Invalid file path: path traversal detected');
  }

  // Security: Only allow specific package.json files
  const allowedFiles = [
    'package.json',
    'apps/frontend/package.json',
    'apps/backend/package.json',
  ];

  if (!allowedFiles.includes(filePath)) {
    throw new Error(`File not allowed: ${filePath}`);
  }

  // Security: Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Security: Check file size to prevent DoS
    if (content.length > 1024 * 1024) {
      // 1MB limit
      throw new Error('package.json file too large');
    }

    const packageJson = JSON.parse(content);

    // Security: Validate basic structure
    if (!packageJson || typeof packageJson !== 'object') {
      throw new Error('Invalid package.json format');
    }

    // Security: Validate version field if present
    if (packageJson.version && !isValidVersion(packageJson.version)) {
      throw new Error('Invalid version format in package.json');
    }

    return packageJson;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON in package.json');
    }
    throw error;
  }
}

/**
 * Safely executes commands without shell using spawnSync
 * @param {string} cmdString - Command string to parse
 * @param {object} options - Execution options
 * @returns {string} - Command output
 */
function safeSpawnSync(cmdString, options = {}) {
  // Parse command string more intelligently
  let cmd, args;

  // Handle specific command patterns
  if (cmdString.startsWith('git commit -m ')) {
    cmd = 'git';
    const message = cmdString.substring('git commit -m '.length);
    args = ['commit', '-m', message];
  } else if (cmdString.startsWith('git tag -a ')) {
    cmd = 'git';
    const parts = cmdString.substring('git tag -a '.length).split(' -m ');
    const tagName = parts[0];
    const tagMessage = parts[1] || '';
    args = ['tag', '-a', tagName, '-m', tagMessage];
  } else if (cmdString.startsWith('git push origin ')) {
    cmd = 'git';
    const target = cmdString.substring('git push origin '.length);
    args = ['push', 'origin', target];
  } else {
    // Standard parsing for simple commands
    const parts = cmdString.trim().split(/\s+/);
    cmd = parts[0];
    args = parts.slice(1);
  }

  // Security: Validate command
  const allowedCommands = ['git', 'pnpm'];
  if (!allowedCommands.includes(cmd)) {
    throw new Error(`Command not allowed: ${cmd}`);
  }

  // Additional security validations for git commands
  if (cmd === 'git') {
    const allowedGitSubcommands = [
      'add',
      'commit',
      'tag',
      'push',
      'branch',
      'status',
    ];
    if (args.length === 0 || !allowedGitSubcommands.includes(args[0])) {
      throw new Error(`Git subcommand not allowed: ${args[0]}`);
    }
  }

  // Security: Check for dangerous patterns in all arguments
  const forbiddenPatterns = [
    /[;&|`$()]/, // Shell metacharacters
    /\.\./, // Path traversal
    /\/etc\/|\/usr\/|\/bin\//, // System directories
    /rm\s+|del\s+/, // Delete commands
    /curl\s+|wget\s+/, // Network commands
    /eval\s+|exec\s+/, // Execution commands
    /sudo\s+|su\s+/, // Privilege escalation
  ];

  args.forEach((arg) => {
    const hasForbiddenPattern = forbiddenPatterns.some((pattern) =>
      pattern.test(arg)
    );
    if (hasForbiddenPattern) {
      throw new Error(`Argument contains forbidden patterns: ${arg}`);
    }
  });

  // Security: Validate total command length
  const fullCommand = [cmd, ...args].join(' ');
  if (fullCommand.length > 1000) {
    throw new Error('Command too long');
  }

  // Security: Safe environment variables
  const safeEnv = {
    ...process.env,
    // Remove any potentially dangerous environment variables
    LD_PRELOAD: undefined,
    LD_LIBRARY_PATH: undefined,
    NODE_OPTIONS: undefined,
    PYTHONPATH: undefined,
    RUBYLIB: undefined,
  };

  // Security: Validate working directory
  const workingDir = options.cwd || process.cwd();
  if (workingDir.includes('..') || workingDir.includes('~')) {
    throw new Error('Invalid working directory');
  }

  try {
    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      env: safeEnv,
      cwd: workingDir,
      timeout: 30000, // 30 second timeout
      shell: false, // CRITICAL: No shell execution for security
      stdio: options.stdio || ['pipe', 'pipe', 'pipe'],
    });

    // Check for errors
    if (result.error) {
      if (result.error.code === 'ENOENT') {
        throw new Error(`Command not found: ${cmd}`);
      }
      throw new Error(`Spawn error: ${result.error.message}`);
    }

    if (result.status !== 0) {
      const errorOutput = result.stderr || 'Unknown error';
      throw new Error(
        `Command failed with exit code ${result.status}: ${errorOutput}`
      );
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
  const currentBranch = safeSpawnSync('git branch --show-current').trim();

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
  const status = safeSpawnSync('git status --porcelain');
  if (status.trim()) {
    console.error(
      '❌ Working directory is not clean. Please commit or stash changes.'
    );
    process.exit(1);
  }

  // Get current version from package.json with safe reading
  const packageJsonPath = 'package.json';
  const packageJson = safeReadPackageJson(packageJsonPath);
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
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // Update frontend package.json with safe reading
  const frontendPackageJsonPath = 'apps/frontend/package.json';
  const frontendPackageJson = safeReadPackageJson(frontendPackageJsonPath);
  frontendPackageJson.version = newVersion;
  fs.writeFileSync(
    frontendPackageJsonPath,
    JSON.stringify(frontendPackageJson, null, 2) + '\n'
  );

  // Update backend package.json with safe reading
  const backendPackageJsonPath = 'apps/backend/package.json';
  const backendPackageJson = safeReadPackageJson(backendPackageJsonPath);
  backendPackageJson.version = newVersion;
  fs.writeFileSync(
    backendPackageJsonPath,
    JSON.stringify(backendPackageJson, null, 2) + '\n'
  );

  console.log('📝 Updated package.json files');

  // Run pre-release checks
  console.log('🔍 Running pre-release checks...');
  safeSpawnSync('pnpm deploy:check', { stdio: 'inherit' });

  // Commit version changes (using safe execution)
  safeSpawnSync(
    'git add package.json apps/frontend/package.json apps/backend/package.json'
  );
  safeSpawnSync(`git commit -m chore: bump version to ${newVersion}`);

  // Create git tag with message
  const tagMessage = `Release v${newVersion}

🚀 Academic Platform v${newVersion}

This release includes bug fixes, improvements, and new features.
See CHANGELOG.md for detailed information.

Generated automatically by release script.`;

  // Create tag safely without shell escaping (spawnSync handles this)
  safeSpawnSync(`git tag -a v${newVersion} -m ${tagMessage}`);

  console.log(`✅ Created tag v${newVersion}`);

  // Push changes and tag (using safe execution)
  safeSpawnSync('git push origin main');
  safeSpawnSync(`git push origin v${newVersion}`);

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

#!/usr/bin/env node

/**
 * Deployment script for Academic Platform
 * Handles pre-deployment checks and optimizations
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Safely executes deployment commands without shell using spawnSync
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
    pnpm: ['build', 'type-check'],
  };

  if (!allowedCommands[cmd] || !allowedCommands[cmd].includes(args[0])) {
    throw new Error(`Command not allowed: ${cmd} ${args[0]}`);
  }

  // Additional validation for pnpm commands
  if (cmd === 'pnpm') {
    const validFilters = [
      '--filter=@academic/shared-types',
      '--filter=@academic/api-client',
      '--filter=@academic/ui',
      '--filter=@academic/frontend',
    ];

    if (
      args.includes('--filter') ||
      args.some((arg) => arg.startsWith('--filter='))
    ) {
      const hasValidFilter = args.some((arg) => validFilters.includes(arg));
      if (!hasValidFilter) {
        throw new Error(
          `Invalid filter: ${args.find((arg) => arg.startsWith('--filter'))}`
        );
      }
    }
  }

  // Security: Check for dangerous patterns
  const forbiddenPatterns = [
    /[;&|`$()]/, // Shell metacharacters
    /\.\./, // Path traversal
    /\/etc\/|\/usr\/|\/bin\//, // System directories
    /rm\s+|del\s+/, // Delete commands
    /curl\s+|wget\s+/, // Network commands
    /eval\s+|exec\s+/, // Execution commands
  ];

  args.forEach((arg) => {
    const hasForbiddenPattern = forbiddenPatterns.some((pattern) =>
      pattern.test(arg)
    );
    if (hasForbiddenPattern) {
      throw new Error(`Argument contains forbidden patterns: ${arg}`);
    }
  });

  // Security: Safe environment variables
  const safeEnv = {
    ...process.env,
    LD_PRELOAD: undefined,
    LD_LIBRARY_PATH: undefined,
    NODE_OPTIONS: undefined,
  };

  try {
    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      env: safeEnv,
      timeout: 300000, // 5 minute timeout for build processes
      shell: false, // CRITICAL: No shell execution for security
      stdio: options.stdio || ['pipe', 'pipe', 'pipe'],
    });

    if (result.error) {
      if (result.error.code === 'ENOENT') {
        throw new Error(`Command not found: ${cmd}`);
      }
      throw new Error(`Spawn error: ${result.error.message}`);
    }

    if (result.status !== 0) {
      throw new Error(
        `Command failed with exit code ${result.status}: ${cmdString}`
      );
    }

    return result.stdout || '';
  } catch (error) {
    throw error;
  }
}

console.log('🚀 Starting deployment process...\n');

// Check if we're in the right directory
const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'apps', 'frontend');

if (!fs.existsSync(frontendDir)) {
  console.error(
    "❌ Frontend directory not found. Make sure you're in the project root."
  );
  process.exit(1);
}

// Pre-deployment checks
console.log('🔍 Running pre-deployment checks...');

try {
  // Check if all workspace dependencies are built
  console.log('📦 Building workspace dependencies...');
  safeSpawnSync('pnpm build --filter=@academic/shared-types', {
    stdio: 'inherit',
  });
  safeSpawnSync('pnpm build --filter=@academic/api-client', {
    stdio: 'inherit',
  });
  safeSpawnSync('pnpm build --filter=@academic/ui', { stdio: 'inherit' });

  // Type check
  console.log('🔧 Running type check...');
  safeSpawnSync('pnpm type-check --filter=@academic/frontend', {
    stdio: 'inherit',
  });

  // Build frontend
  console.log('🏗️  Building frontend for production...');
  safeSpawnSync('pnpm build --filter=@academic/frontend', { stdio: 'inherit' });

  console.log('\n✅ Deployment preparation completed successfully!');
  console.log('📋 Next steps:');
  console.log('   1. Push your changes to the develop branch');
  console.log('   2. Vercel will automatically deploy');
  console.log('   3. Check deployment status in Vercel dashboard');
} catch (error) {
  console.error('\n❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

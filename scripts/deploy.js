#!/usr/bin/env node

/**
 * Deployment script for Academic Platform
 * Handles pre-deployment checks and optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Safely executes deployment commands with validation
 * @param {string} command - Command to execute
 * @param {object} options - Execution options
 * @returns {string} - Command output
 */
function safeExecSync(command, options = {}) {
  // Security: Validate command to prevent injection
  const allowedCommands = [
    /^pnpm build --filter=@academic\/shared-types$/,
    /^pnpm build --filter=@academic\/api-client$/,
    /^pnpm build --filter=@academic\/ui$/,
    /^pnpm type-check --filter=@academic\/frontend$/,
    /^pnpm build --filter=@academic\/frontend$/,
  ];

  const isAllowed = allowedCommands.some((pattern) => pattern.test(command));
  if (!isAllowed) {
    throw new Error(`Command not allowed: ${command}`);
  }

  // Security: Use system PATH instead of hardcoded paths
  const safeEnv = {
    ...process.env,
    // Remove dangerous environment variables
    LD_PRELOAD: undefined,
    LD_LIBRARY_PATH: undefined,
  };

  try {
    return execSync(command, {
      stdio: 'inherit',
      env: safeEnv,
      timeout: 300000, // 5 minute timeout for build processes
      ...options,
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
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
  safeExecSync('pnpm build --filter=@academic/shared-types');
  safeExecSync('pnpm build --filter=@academic/api-client');
  safeExecSync('pnpm build --filter=@academic/ui');

  // Type check
  console.log('🔧 Running type check...');
  safeExecSync('pnpm type-check --filter=@academic/frontend');

  // Build frontend
  console.log('🏗️  Building frontend for production...');
  safeExecSync('pnpm build --filter=@academic/frontend');

  console.log('\n✅ Deployment preparation completed successfully!');
  console.log('📋 Next steps:');
  console.log('   1. Push your changes to the develop branch');
  console.log('   2. Vercel will automatically deploy');
  console.log('   3. Check deployment status in Vercel dashboard');
} catch (error) {
  console.error('\n❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

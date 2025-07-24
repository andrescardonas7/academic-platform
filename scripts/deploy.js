#!/usr/bin/env node

/**
 * Deployment script for Academic Platform
 * Handles pre-deployment checks and optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  execSync('pnpm build --filter=@academic/shared-types', {
    stdio: 'inherit',
    env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
  });
  execSync('pnpm build --filter=@academic/api-client', {
    stdio: 'inherit',
    env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
  });
  execSync('pnpm build --filter=@academic/ui', {
    stdio: 'inherit',
    env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
  });

  // Type check
  console.log('🔧 Running type check...');
  execSync('pnpm type-check --filter=@academic/frontend', {
    stdio: 'inherit',
    env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
  });

  // Build frontend
  console.log('🏗️  Building frontend for production...');
  execSync('pnpm build --filter=@academic/frontend', {
    stdio: 'inherit',
    env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
  });

  console.log('\n✅ Deployment preparation completed successfully!');
  console.log('📋 Next steps:');
  console.log('   1. Push your changes to the develop branch');
  console.log('   2. Vercel will automatically deploy');
  console.log('   3. Check deployment status in Vercel dashboard');
} catch (error) {
  console.error('\n❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

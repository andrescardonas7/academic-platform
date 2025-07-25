#!/usr/bin/env node

/**
 * Development setup script for Academic Platform
 * Builds workspace dependencies and checks configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up development environment...\n');

// Check if we're in the right directory
const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');

if (!fs.existsSync(packagesDir)) {
  console.error(
    "❌ Packages directory not found. Make sure you're in the project root."
  );
  process.exit(1);
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build shared packages in correct order
  console.log('🏗️  Building shared packages...');

  const buildOrder = [
    '@academic/tsconfig',
    '@academic/eslint-config',
    '@academic/shared-types',
    '@academic/api-client',
    '@academic/ui',
  ];

  for (const pkg of buildOrder) {
    try {
      console.log(`   Building ${pkg}...`);
      execSync(`pnpm build --filter=${pkg}`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`   ⚠️  Warning: Could not build ${pkg} (may not exist)`);
    }
  }

  // Check environment variables
  console.log('🔍 Checking environment configuration...');
  const envPath = path.join(rootDir, '.env');

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please copy .env.example to .env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'API_KEY',
    'NEXT_PUBLIC_API_KEY',
  ];

  const missingVars = requiredVars.filter((varName) => {
    const regex = new RegExp(`^${varName}=.+`, 'm');
    return (
      !regex.test(envContent) ||
      envContent.includes(`${varName}=your_`) ||
      envContent.includes(`${varName}=TU_`)
    );
  });

  if (missingVars.length > 0) {
    console.warn(
      '⚠️  Warning: The following environment variables need to be configured:'
    );
    missingVars.forEach((varName) => {
      console.warn(`   - ${varName}`);
    });
    console.warn('   Please update your .env file with real values.');
  }

  console.log('\n✅ Development environment setup completed!');
  console.log('📋 Next steps:');
  console.log('   1. Update .env with your real Supabase credentials');
  console.log('   2. Run: pnpm dev');
  console.log('   3. Frontend: http://localhost:3000');
  console.log('   4. Backend: http://localhost:3001');
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}

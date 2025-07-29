#!/usr/bin/env node

/**
 * Deploy script for Vercel
 * Prepares the application for deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

console.log('🚀 Preparing for Vercel deployment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

try {
  // 1. Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // 2. Build backend
  console.log('🔧 Building backend...');
  execSync('cd apps/backend && pnpm build', { stdio: 'inherit' });

  // 3. Build frontend
  console.log('🎨 Building frontend...');
  execSync('cd apps/frontend && pnpm build', { stdio: 'inherit' });

  // 4. Check environment variables
  console.log('🔍 Checking environment variables...');
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CEREBRAS_API_KEY',
    'API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:');
    missingVars.forEach((varName) => console.warn(`   - ${varName}`));
    console.warn('   Make sure to set these in Vercel dashboard');
  }

  console.log('\n✅ Deployment preparation completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Push your changes to GitHub');
  console.log('2. Connect your repository to Vercel');
  console.log('3. Set environment variables in Vercel dashboard');
  console.log('4. Deploy!');
} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

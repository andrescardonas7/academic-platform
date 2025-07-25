#!/usr/bin/env node

/**
 * API Test script for Academic Platform
 * Tests all endpoints to verify configuration
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
const API_KEY = 'dev-api-key-12345';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  timeout: 10000,
});

async function testEndpoint(name, endpoint, method = 'GET', data = null) {
  try {
    console.log(`🧪 Testing ${name}...`);
    const config = { method, url: endpoint };
    if (data) config.data = data;

    const response = await apiClient(config);
    console.log(`✅ ${name}: ${response.status} - ${response.statusText}`);

    if (response.data && response.data.data) {
      const dataLength = Array.isArray(response.data.data)
        ? response.data.data.length
        : 1;
      console.log(`   📊 Data items: ${dataLength}`);
    }

    return true;
  } catch (error) {
    console.log(
      `❌ ${name}: ${error.response?.status || 'ERROR'} - ${error.message}`
    );
    if (error.response?.data) {
      console.log(`   📝 Error details:`, error.response.data);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');

  const tests = [
    // Health checks
    ['Health Check', '/health'],
    ['API Health', '/api/health'],

    // Search endpoints
    ['Search Offerings', '/api/search'],
    ['Search Filters', '/api/search/filters'],

    // Careers endpoints
    ['Careers List', '/api/careers'],

    // Institutions endpoints
    ['Institutions List', '/api/institutions'],

    // Chatbot endpoints
    ['Chatbot Health', '/api/chatbot/health'],
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, endpoint, method, data] of tests) {
    const result = await testEndpoint(name, endpoint, method, data);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    console.log(''); // Empty line for readability
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`
  );

  if (failed > 0) {
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running: pnpm dev:backend');
    console.log('2. Check your .env file has all required variables');
    console.log('3. Verify Supabase credentials are correct');
    console.log('4. Check the server logs for detailed error messages');
  } else {
    console.log('\n🎉 All tests passed! Your API is working correctly.');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Test without API key (for development mode)
async function testWithoutApiKey() {
  console.log('🧪 Testing endpoints without API key (development mode)...\n');

  const noAuthClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  try {
    const response = await noAuthClient.get('/api/search');
    console.log('✅ Development mode: API works without authentication');
    return true;
  } catch (error) {
    console.log('❌ Development mode: API requires authentication');
    console.log('   This is expected in production mode');
    return false;
  }
}

// Run tests
(async () => {
  await testWithoutApiKey();
  console.log('');
  await runTests();
})();

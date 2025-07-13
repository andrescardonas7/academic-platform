// Test script for API endpoints
const http = require('http');
const https = require('https');
const { URL } = require('url');

const testEndpoint = async (url, description) => {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📡 URL: ${url}`);

    const response = await makeRequest(url);

    console.log(`✅ Status: ${response.statusCode}`);
    console.log(`📄 Response:`, response.data);
  } catch (error) {
    console.log(`❌ Error:`, error.message);
  }
};

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;

    const req = lib.request(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: JSON.stringify(parsedData, null, 2),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

const runTests = async () => {
  console.log('🚀 Testing Academic Platform API\n');

  // Test health endpoint
  await testEndpoint('http://localhost:3002/health', 'Health Check');

  // Test API docs
  await testEndpoint('http://localhost:3002/api/docs', 'API Documentation');

  // Test institutions
  await testEndpoint(
    'http://localhost:3002/api/institutions',
    'All Institutions'
  );

  // Test specific institution
  await testEndpoint(
    'http://localhost:3002/api/institutions/1',
    'Institution by ID'
  );

  // Test careers
  await testEndpoint('http://localhost:3002/api/careers', 'All Careers');

  console.log('\n✨ API testing completed!');
};

runTests();

// Debug script para probar la API
const API_URL = 'http://localhost:3001/api';
const API_KEY = 'your-api-key-here'; // Replace with your actual API key

async function testAPI() {
  console.log('🔍 Testing API connection...');
  console.log('API_URL:', API_URL);
  console.log('API_KEY:', API_KEY ? 'Present' : 'Missing');

  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('Health status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);

    // Test 2: Search with API key
    console.log('\n2. Testing search endpoint with API key...');
    const searchResponse = await fetch(`${API_URL}/search`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    console.log('Search status:', searchResponse.status);

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('Search data length:', searchData.data?.length || 0);
      console.log('Search success:', searchData.success);
    } else {
      const errorText = await searchResponse.text();
      console.log('Search error:', errorText);
    }

    // Test 3: Filters with API key
    console.log('\n3. Testing filters endpoint with API key...');
    const filtersResponse = await fetch(`${API_URL}/search/filters`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    console.log('Filters status:', filtersResponse.status);

    if (filtersResponse.ok) {
      const filtersData = await filtersResponse.json();
      console.log('Filters data:', filtersData);
    } else {
      const errorText = await filtersResponse.text();
      console.log('Filters error:', errorText);
    }
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
}

testAPI();

const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = 'http://localhost:3001/api';
const API_KEY =
  'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d';

async function testFrontendAPI() {
  console.log('🔍 Testing Frontend API configuration...\n');

  try {
    console.log('📊 Testing chatbot message endpoint...');
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/message`,
      {
        message: 'Busco carreras virtuales',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      }
    );

    console.log('✅ Success! Response:', {
      success: response.data.success,
      messageLength: response.data.data?.message?.length || 0,
      timestamp: response.data.data?.timestamp,
    });

    console.log('\n🤖 Bot response preview:');
    console.log(response.data.data?.message?.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log('💡 API key issue - check authentication');
    } else if (error.response?.status === 403) {
      console.log('💡 Forbidden - API key might be invalid');
    }
  }
}

console.log('🔍 Configuration:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_KEY:', API_KEY.substring(0, 10) + '...');
console.log('');

testFrontendAPI();

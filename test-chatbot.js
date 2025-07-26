const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = 'http://localhost:3001';
const API_KEY = 'academic-platform-dev-key';

async function testChatbot() {
  console.log('🤖 Testing Chatbot functionality...\n');

  try {
    // Test 1: Health check
    console.log('📊 Test 1: Chatbot health check...');
    const healthResponse = await axios.get(
      `${API_BASE_URL}/api/chatbot/health`,
      {
        headers: { 'x-api-key': API_KEY },
      }
    );

    console.log('✅ Health check response:', healthResponse.data);

    // Test 2: Send a test message
    console.log('\n📊 Test 2: Sending test message...');
    const messageResponse = await axios.post(
      `${API_BASE_URL}/api/chatbot/message`,
      {
        message: '¿Qué carreras hay disponibles en Cartago?',
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Message response:', messageResponse.data);
    console.log('🤖 Bot response:', messageResponse.data.data.message);
  } catch (error) {
    console.log(
      '❌ Error testing chatbot:',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      console.log('💡 API key issue - check authentication');
    } else if (error.response?.status === 500) {
      console.log('💡 Server error - check backend logs');
      console.log('   - Verify CEREBRAS_API_KEY is valid');
      console.log('   - Check Supabase connection');
      console.log('   - Review backend console for errors');
    } else if (error.code === 'ECONNREFUSED') {
      console.log(
        '💡 Connection refused - make sure backend is running on port 3001'
      );
    }
  }
}

console.log('🔍 Configuration check:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_KEY:', API_KEY);
console.log(
  'CEREBRAS_API_KEY:',
  process.env.CEREBRAS_API_KEY ? '✅ Set' : '❌ Missing'
);
console.log('');

testChatbot();

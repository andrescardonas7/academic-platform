const Cerebras = require('@cerebras/cerebras_cloud_sdk').default;
require('dotenv').config();

const cerebrasApiKey = process.env.CEREBRAS_API_KEY;

console.log('🧠 Testing Cerebras API...');
console.log(
  'API Key:',
  cerebrasApiKey ? `${cerebrasApiKey.substring(0, 10)}...` : '❌ Missing'
);

if (!cerebrasApiKey) {
  console.log('❌ CEREBRAS_API_KEY not found in .env');
  process.exit(1);
}

const client = new Cerebras({
  apiKey: cerebrasApiKey,
});

async function testCerebras() {
  try {
    console.log('\n📊 Testing Cerebras connection...');

    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello, just testing connection' }],
      model: 'qwen-3-235b-a22b',
      max_tokens: 10,
      temperature: 0.1,
    });

    console.log('✅ Cerebras API working!');
    console.log('Response:', response.choices?.[0]?.message?.content);
    console.log('Tokens used:', response.usage?.total_tokens);
  } catch (error) {
    console.log('❌ Cerebras API error:', error.message);

    if (error.message.includes('401')) {
      console.log(
        '💡 Invalid API key - get a new one from https://cloud.cerebras.ai/'
      );
    } else if (error.message.includes('403')) {
      console.log('💡 API key expired or insufficient permissions');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded - wait and try again');
    } else {
      console.log('💡 Check your internet connection and API key');
    }
  }
}

testCerebras();

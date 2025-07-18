// Test script para verificar la API desde el navegador
// Ejecutar en la consola del navegador

console.log('🔍 Testing API from browser...');

// Configuración
const API_URL = 'http://localhost:3001/api';
const API_KEY = 'your-api-key-here'; // Replace with your actual API key

// Test function
async function testBrowserAPI() {
  try {
    console.log('Testing search endpoint...');

    const response = await fetch(`${API_URL}/search`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log('Data length:', data.data?.length || 0);
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Ejecutar test
testBrowserAPI();

// También exportar para uso manual
window.testBrowserAPI = testBrowserAPI;

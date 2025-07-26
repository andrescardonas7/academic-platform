#!/usr/bin/env

/**
 * Script para probar la migración a Vercel
 * Ejecutar: node scripts/test-vercel-migration.js
 */

const http = require('http');

console.log('🧪 PROBANDO MIGRACIÓN A VERCEL\n');

const API_KEY =
  'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d';
const BASE_URL = 'http://localhost:3000';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      timeout: 5000,
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testHealth() {
  console.log('1. 🏥 Probando /api/health...');
  try {
    const response = await makeRequest('/api/health');
    console.log('✅ Health Check:', {
      status: response.status,
      platform: response.data.platform,
      environment: response.data.environment,
    });
    return true;
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
    return false;
  }
}

async function testSearch() {
  console.log('\n2. 🔍 Probando /api/search...');
  try {
    const response = await makeRequest('/api/search?limit=3', {
      headers: { 'x-api-key': API_KEY },
    });
    console.log('✅ Search API:', {
      status: response.status,
      success: response.data.success,
      dataLength: response.data.data?.length || 0,
      hasData: !!response.data.data?.length,
    });
    return true;
  } catch (error) {
    console.log('❌ Search API Error:', error.message);
    return false;
  }
}

async function testFilters() {
  console.log('\n3. 🎛️ Probando /api/search/filters...');
  try {
    const response = await makeRequest('/api/search/filters', {
      headers: { 'x-api-key': API_KEY },
    });
    console.log('✅ Filters API:', {
      status: response.status,
      success: response.data.success,
      hasModalidades: !!response.data.data?.modalidades?.length,
      hasInstituciones: !!response.data.data?.instituciones?.length,
    });
    return true;
  } catch (error) {
    console.log('❌ Filters API Error:', error.message);
    return false;
  }
}

async function testChatbot() {
  console.log('\n4. 🤖 Probando /api/chatbot/message...');
  try {
    const response = await makeRequest('/api/chatbot/message', {
      method: 'POST',
      headers: { 'x-api-key': API_KEY },
      body: JSON.stringify({
        message: 'Hola, ¿qué carreras de ingeniería hay disponibles?',
      }),
    });
    console.log('✅ Chatbot API:', {
      status: response.status,
      success: response.data.success,
      hasResponse: !!response.data.response,
    });
    return true;
  } catch (error) {
    console.log('❌ Chatbot API Error:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n5. 🌐 Probando frontend...');
  try {
    const response = await makeRequest('/');
    console.log('✅ Frontend:', {
      status: response.status,
      contentType: response.headers['content-type'],
    });
    return true;
  } catch (error) {
    console.log('❌ Frontend Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('Probando APIs en:', BASE_URL);
  console.log('API Key:', API_KEY.substring(0, 10) + '...\n');

  const results = {
    health: await testHealth(),
    search: await testSearch(),
    filters: await testFilters(),
    chatbot: await testChatbot(),
    frontend: await testFrontend(),
  };

  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('Health Check:', results.health ? '✅' : '❌');
  console.log('Search API:', results.search ? '✅' : '❌');
  console.log('Filters API:', results.filters ? '✅' : '❌');
  console.log('Chatbot API:', results.chatbot ? '✅' : '❌');
  console.log('Frontend:', results.frontend ? '✅' : '❌');

  const allPassed = Object.values(results).every(Boolean);

  if (allPassed) {
    console.log('\n🎉 ¡MIGRACIÓN A VERCEL EXITOSA!');
    console.log('Todo está funcionando correctamente.');
    console.log('\nPróximos pasos:');
    console.log('1. Configurar variables de entorno en Vercel');
    console.log('2. Hacer commit y push');
    console.log('3. Verificar deployment en producción');
  } else {
    console.log('\n⚠️ PROBLEMAS DETECTADOS:');
    if (!results.health) console.log('- Health check no funciona');
    if (!results.search) console.log('- Search API no funciona');
    if (!results.filters) console.log('- Filters API no funciona');
    if (!results.chatbot)
      console.log(
        '- Chatbot API no funciona (puede ser por falta de CEREBRAS_API_KEY)'
      );
    if (!results.frontend) console.log('- Frontend no está accesible');

    console.log('\n🔧 SOLUCIONES:');
    console.log('1. Verificar que pnpm dev esté corriendo');
    console.log('2. Verificar variables de entorno en .env');
    console.log('3. Verificar que Supabase esté configurado');
  }
}

main().catch(console.error);

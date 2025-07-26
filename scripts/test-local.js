#!/usr/bin/env node
/**
 * Script para verificar que todo funcione en local
 * Ejecutar: node scripts/test-local.js
 */

const http = require('http');

console.log('🧪 Verificando configuración LOCAL...\n');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
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

async function checkBackend() {
  console.log('1. Verificando backend local (puerto 3001)...');
  try {
    const response = await makeRequest('http://localhost:3001/health');
    console.log('✅ Backend local funcionando:', {
      status: response.status,
      environment: response.data.environment,
      cors_origin: response.data.cors_origin,
      has_api_key: response.data.has_api_key,
    });
    return true;
  } catch (error) {
    console.log('❌ Backend local no responde:', error.message);
    console.log('   → Asegúrate de ejecutar: pnpm dev:backend');
    return false;
  }
}

async function checkAPI() {
  console.log('\n2. Verificando API local...');
  try {
    const response = await makeRequest(
      'http://localhost:3001/api/search?limit=1'
    );
    console.log('✅ API local funcionando:', {
      status: response.status,
      hasData: !!response.data.data,
      dataLength: response.data.data?.length || 0,
    });
    return true;
  } catch (error) {
    console.log('❌ API local no responde:', error.message);
    return false;
  }
}

async function checkFrontend() {
  console.log('\n3. Verificando frontend local (puerto 3000)...');
  try {
    const response = await makeRequest('http://localhost:3000');
    console.log('✅ Frontend local funcionando:', {
      status: response.status,
      contentType: response.headers['content-type'],
    });
    return true;
  } catch (error) {
    console.log('❌ Frontend local no responde:', error.message);
    console.log('   → Asegúrate de ejecutar: pnpm dev:frontend');
    return false;
  }
}

async function main() {
  const results = {
    backend: await checkBackend(),
    api: await checkAPI(),
    frontend: await checkFrontend(),
  };

  console.log('\n📊 Resumen LOCAL:');
  console.log('Backend:', results.backend ? '✅' : '❌');
  console.log('API:', results.api ? '✅' : '❌');
  console.log('Frontend:', results.frontend ? '✅' : '❌');

  if (results.backend && results.api && results.frontend) {
    console.log('\n🎉 ¡Todo funciona en LOCAL!');
    console.log('Ahora puedes proceder a configurar producción.');
  } else {
    console.log('\n⚠️  Problemas en LOCAL que necesitan atención:');
    if (!results.backend) console.log('- Ejecutar: pnpm dev:backend');
    if (!results.api) console.log('- Verificar configuración de Supabase');
    if (!results.frontend) console.log('- Ejecutar: pnpm dev:frontend');
  }

  console.log('\n🔧 Comandos útiles:');
  console.log('• Limpiar: pnpm clean && rm -rf node_modules && pnpm install');
  console.log('• Backend: pnpm dev:backend');
  console.log('• Frontend: pnpm dev:frontend');
  console.log('• Ambos: pnpm dev');
}

main().catch(console.error);

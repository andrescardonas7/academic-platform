#!/unode

/**
 * Script de diagnóstico completo para el frontend
 * Ejecutar: node debug-frontend.js
 */

const http = require('http');

console.log('🔍 DIAGNÓSTICO COMPLETO DEL FRONTEND\n');

// Verificar variables de entorno
console.log('1. VARIABLES DE ENTORNO:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log(
  'NEXT_PUBLIC_API_URL:',
  process.env.NEXT_PUBLIC_API_URL || 'undefined'
);
console.log(
  'NEXT_PUBLIC_API_KEY:',
  process.env.NEXT_PUBLIC_API_KEY || 'undefined'
);

// Función para hacer requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 5000,
    };

    const client = urlObj.protocol === 'https:' ? require('https') : http;

    const req = client.request(requestOptions, (res) => {
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

async function testBackendHealth() {
  console.log('\n2. PRUEBA DE SALUD DEL BACKEND:');
  try {
    const response = await makeRequest('http://localhost:3001/health');
    console.log('✅ Backend health:', {
      status: response.status,
      environment: response.data.environment,
      version: response.data.version,
    });
    return true;
  } catch (error) {
    console.log('❌ Backend health failed:', error.message);
    return false;
  }
}

async function testBackendAPI() {
  console.log('\n3. PRUEBA DE API SIN KEY:');
  try {
    const response = await makeRequest(
      'http://localhost:3001/api/search?limit=1'
    );
    console.log('❌ API sin key (debería fallar):', {
      status: response.status,
      error: response.data.error,
      message: response.data.message,
    });
  } catch (error) {
    console.log('❌ API sin key error:', error.message);
  }
}

async function testBackendAPIWithKey() {
  console.log('\n4. PRUEBA DE API CON KEY:');
  try {
    const response = await makeRequest(
      'http://localhost:3001/api/search?limit=1',
      {
        headers: {
          'x-api-key':
            'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ API con key:', {
      status: response.status,
      success: response.data.success,
      dataLength: response.data.data?.length || 0,
      hasData: !!response.data.data,
    });
    return true;
  } catch (error) {
    console.log('❌ API con key error:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n5. PRUEBA DEL FRONTEND:');
  try {
    const response = await makeRequest('http://localhost:3000');
    console.log('✅ Frontend:', {
      status: response.status,
      contentType: response.headers['content-type'],
    });
    return true;
  } catch (error) {
    console.log('❌ Frontend error:', error.message);
    return false;
  }
}

async function testCORS() {
  console.log('\n6. PRUEBA DE CORS:');
  try {
    const response = await makeRequest(
      'http://localhost:3001/api/search?limit=1',
      {
        headers: {
          Origin: 'http://localhost:3000',
          'x-api-key':
            'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d',
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ CORS:', {
      status: response.status,
      accessControlAllowOrigin: response.headers['access-control-allow-origin'],
      success: response.data.success,
    });
    return true;
  } catch (error) {
    console.log('❌ CORS error:', error.message);
    return false;
  }
}

async function main() {
  const results = {
    backendHealth: await testBackendHealth(),
    backendAPI: await testBackendAPIWithKey(),
    frontend: await testFrontend(),
    cors: await testCORS(),
  };

  await testBackendAPI(); // Esta debería fallar

  console.log('\n📊 RESUMEN:');
  console.log('Backend Health:', results.backendHealth ? '✅' : '❌');
  console.log('Backend API:', results.backendAPI ? '✅' : '❌');
  console.log('Frontend:', results.frontend ? '✅' : '❌');
  console.log('CORS:', results.cors ? '✅' : '❌');

  if (
    results.backendHealth &&
    results.backendAPI &&
    results.frontend &&
    results.cors
  ) {
    console.log('\n🎉 TODO ESTÁ FUNCIONANDO CORRECTAMENTE!');
    console.log('Si aún ves "Failed to fetch" en el navegador:');
    console.log('1. Abre la consola del navegador (F12)');
    console.log('2. Busca logs de "🔍 Frontend API Config"');
    console.log('3. Verifica que API_KEY no sea "undefined"');
    console.log('4. Busca logs de "API Request URL"');
    console.log('5. Verifica que las URLs sean correctas');
  } else {
    console.log('\n⚠️  PROBLEMAS DETECTADOS:');
    if (!results.backendHealth)
      console.log('- Backend no está respondiendo (ejecuta: pnpm dev:backend)');
    if (!results.backendAPI)
      console.log('- API del backend no funciona con la key');
    if (!results.frontend)
      console.log(
        '- Frontend no está respondiendo (ejecuta: pnpm dev:frontend)'
      );
    if (!results.cors) console.log('- Problemas de CORS');
  }

  console.log('\n🔧 COMANDOS ÚTILES:');
  console.log('• Reiniciar backend: pnpm dev:backend');
  console.log('• Reiniciar frontend: pnpm dev:frontend');
  console.log('• Ver logs del frontend en el navegador: F12 → Console');
  console.log('• Verificar puertos: netstat -an | findstr ":3000\\|:3001"');
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Script para verificar que producción funcione correctamente
 * Ejecutar: node scripts/verify-production.js
 */

const https = require('https');
const http = require('http');

console.log('🚀 VERIFICANDO CONFIGURACIÓN DE PRODUCCIÓN\n');

const RAILWAY_URL = 'https://academic-platform-production.up.railway.app';
const VERCEL_URL = 'https://academic-platform.vercel.app';
const API_KEY =
  'a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 15000,
    };

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

async function checkRailwayHealth() {
  console.log('1. 🚂 Verificando Railway (Backend)...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/health`);
    console.log('✅ Railway Health:', {
      status: response.status,
      environment: response.data.environment,
      version: response.data.version,
    });
    return true;
  } catch (error) {
    console.log('❌ Railway Health Error:', error.message);
    return false;
  }
}

async function checkRailwayAPI() {
  console.log('\n2. 🔑 Verificando Railway API con key...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/api/search?limit=1`, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        Origin: VERCEL_URL,
      },
    });
    console.log('✅ Railway API:', {
      status: response.status,
      success: response.data.success,
      dataLength: response.data.data?.length || 0,
      corsHeader: response.headers['access-control-allow-origin'],
    });
    return true;
  } catch (error) {
    console.log('❌ Railway API Error:', error.message);
    return false;
  }
}

async function checkVercel() {
  console.log('\n3. ▲ Verificando Vercel (Frontend)...');
  try {
    const response = await makeRequest(VERCEL_URL);
    console.log('✅ Vercel:', {
      status: response.status,
      contentType: response.headers['content-type'],
    });
    return true;
  } catch (error) {
    console.log('❌ Vercel Error:', error.message);
    return false;
  }
}

async function checkCORS() {
  console.log('\n4. 🌐 Verificando CORS entre Vercel y Railway...');
  try {
    const response = await makeRequest(`${RAILWAY_URL}/api/search?limit=1`, {
      headers: {
        Origin: VERCEL_URL,
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ CORS:', {
      status: response.status,
      allowOrigin: response.headers['access-control-allow-origin'],
      allowCredentials: response.headers['access-control-allow-credentials'],
      success: response.data.success,
    });
    return true;
  } catch (error) {
    console.log('❌ CORS Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('URLs a verificar:');
  console.log('• Railway (Backend):', RAILWAY_URL);
  console.log('• Vercel (Frontend):', VERCEL_URL);
  console.log('• API Key:', API_KEY.substring(0, 10) + '...\n');

  const results = {
    railway: await checkRailwayHealth(),
    api: await checkRailwayAPI(),
    vercel: await checkVercel(),
    cors: await checkCORS(),
  };

  console.log('\n📊 RESUMEN DE PRODUCCIÓN:');
  console.log('Railway (Backend):', results.railway ? '✅' : '❌');
  console.log('Railway API:', results.api ? '✅' : '❌');
  console.log('Vercel (Frontend):', results.vercel ? '✅' : '❌');
  console.log('CORS:', results.cors ? '✅' : '❌');

  if (results.railway && results.api && results.vercel && results.cors) {
    console.log('\n🎉 ¡PRODUCCIÓN FUNCIONANDO CORRECTAMENTE!');
    console.log('El bucle eterno está resuelto.');
  } else {
    console.log('\n⚠️  PROBLEMAS EN PRODUCCIÓN:');
    if (!results.railway) console.log('- Railway no está respondiendo');
    if (!results.api)
      console.log('- API de Railway no funciona (verificar API_KEY)');
    if (!results.vercel) console.log('- Vercel no está accesible');
    if (!results.cors)
      console.log('- Problemas de CORS (verificar CORS_ORIGIN en Railway)');

    console.log('\n🔧 PASOS PARA SOLUCIONAR:');
    console.log('1. Configurar variables de entorno en Railway');
    console.log('2. Configurar variables de entorno en Vercel');
    console.log('3. Redesplegar Railway PRIMERO');
    console.log('4. Redesplegar Vercel DESPUÉS');
    console.log('5. NO redesplegar Railway después de Vercel');
  }
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Script para verificar la configuración de Vercel
 * Ejecutar: node scripts/verify-vercel-config.js
 */

const https = require('https');
const http = require('http');

const API_URL = 'https://academic-platform-production.up.railway.app';
const FRONTEND_URL = 'https://academic-platform.vercel.app';

console.log('🔍 Verificando configuración de Vercel...\n');

// Función para hacer requests HTTP/HTTPS
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
      timeout: 10000,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
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

async function checkBackendHealth() {
  console.log('1. Verificando backend (Railway)...');
  try {
    const response = await makeRequest(`${API_URL}/health`);
    console.log('✅ Backend está funcionando:', {
      status: response.status,
      environment: response.data.environment,
      cors_origin: response.data.cors_origin,
      has_api_key: response.data.has_api_key,
    });
    return true;
  } catch (error) {
    console.log('❌ Error conectando al backend:', error.message);
    return false;
  }
}

async function checkBackendAPI() {
  console.log('\n2. Verificando API del backend...');
  try {
    const response = await makeRequest(`${API_URL}/api/search?limit=1`);
    console.log('✅ API del backend responde:', {
      status: response.status,
      hasData: !!response.data.data,
      dataLength: response.data.data?.length || 0,
    });
    return true;
  } catch (error) {
    console.log('❌ Error en API del backend:', error.message);
    return false;
  }
}

async function checkFrontend() {
  console.log('\n3. Verificando frontend (Vercel)...');
  try {
    const response = await makeRequest(FRONTEND_URL);
    console.log('✅ Frontend está funcionando:', {
      status: response.status,
      contentType: response.headers['content-type'],
    });
    return true;
  } catch (error) {
    console.log('❌ Error conectando al frontend:', error.message);
    return false;
  }
}

async function checkCORS() {
  console.log('\n4. Verificando CORS...');
  try {
    const response = await makeRequest(`${API_URL}/api/search?limit=1`, {
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Vercel-Verification-Script',
      },
    });
    console.log('✅ CORS está configurado correctamente:', {
      status: response.status,
      accessControlAllowOrigin: response.headers['access-control-allow-origin'],
    });
    return true;
  } catch (error) {
    console.log('❌ Error de CORS:', error.message);
    return false;
  }
}

async function main() {
  const results = {
    backend: await checkBackendHealth(),
    api: await checkBackendAPI(),
    frontend: await checkFrontend(),
    cors: await checkCORS(),
  };

  console.log('\n📊 Resumen de verificación:');
  console.log('Backend (Railway):', results.backend ? '✅' : '❌');
  console.log('API del backend:', results.api ? '✅' : '❌');
  console.log('Frontend (Vercel):', results.frontend ? '✅' : '❌');
  console.log('CORS:', results.cors ? '✅' : '❌');

  if (results.backend && results.api && results.frontend && results.cors) {
    console.log('\n🎉 Todo parece estar funcionando correctamente!');
    console.log('Si los datos no se muestran en Vercel, verifica:');
    console.log('1. Variables de entorno en Vercel (NEXT_PUBLIC_API_KEY)');
    console.log('2. Console del navegador para errores de JavaScript');
    console.log('3. Network tab para errores de red');
  } else {
    console.log('\n⚠️  Hay problemas que necesitan atención:');
    if (!results.backend) console.log('- El backend no está respondiendo');
    if (!results.api) console.log('- La API del backend no está funcionando');
    if (!results.frontend) console.log('- El frontend no está accesible');
    if (!results.cors) console.log('- Hay problemas de CORS');
  }
}

main().catch(console.error);
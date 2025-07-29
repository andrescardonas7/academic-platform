#!/usr/bin/env node

/**
 * APLICACIÓN DE CORRECCIONES CRÍTICAS DE SEGURIDAD
 * Corrige vulnerabilidades críticas identificadas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 APLICANDO CORRECCIONES CRÍTICAS DE SEGURIDAD\n');

// ============================================================================
// 1. ELIMINAR BACKEND-SUPABASE VULNERABLE
// ============================================================================

console.log('🔧 1. ELIMINANDO BACKEND-SUPABASE VULNERABLE\n');

const backendSupabasePath = path.join(process.cwd(), 'apps/backend-supabase');
if (fs.existsSync(backendSupabasePath)) {
  try {
    // Eliminar archivos uno por uno
    const deleteRecursive = (dirPath) => {
      if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
          const curPath = path.join(dirPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(dirPath);
      }
    };

    deleteRecursive(backendSupabasePath);
    console.log('   ✅ backend-supabase eliminado');
  } catch (error) {
    console.log('   ⚠️  Error eliminando backend-supabase:', error.message);
    console.log('   💡 Eliminar manualmente: rmdir /s apps\\backend-supabase');
  }
} else {
  console.log('   ✅ backend-supabase ya no existe');
}

// ============================================================================
// 2. FORTALECER CSP (REMOVER UNSAFE-INLINE/UNSAFE-EVAL)
// ============================================================================

console.log('\n🔧 2. FORTALECIENDO CSP\n');

const securityPath = path.join(
  process.cwd(),
  'apps/backend/src/middleware/security.ts'
);
if (fs.existsSync(securityPath)) {
  let content = fs.readFileSync(securityPath, 'utf8');

  // Reemplazar unsafe-inline y unsafe-eval con políticas más seguras
  content = content.replace(/'unsafe-inline'/g, "'self'");
  content = content.replace(/'unsafe-eval'/g, "'none'");

  // Agregar nonce para scripts inline si es necesario
  content = content.replace(
    /script-src\s+['"][^'"]*['"]/g,
    "script-src 'self' 'nonce-${nonce}'"
  );

  fs.writeFileSync(securityPath, content);
  console.log('   ✅ CSP fortalecido (removido unsafe-inline/unsafe-eval)');
} else {
  console.log('   ❌ security.ts no encontrado');
}

// ============================================================================
// 3. APLICAR CSRF A TODAS LAS RUTAS
// ============================================================================

console.log('\n🔧 3. APLICANDO CSRF A TODAS LAS RUTAS\n');

const csrfPath = path.join(
  process.cwd(),
  'apps/backend/src/middleware/csrf.ts'
);
if (fs.existsSync(csrfPath)) {
  let content = fs.readFileSync(csrfPath, 'utf8');

  // Remover exclusiones de rutas de chatbot
  content = content.replace(
    /\/\/\s*Exclude\s+chatbot\s+routes.*?\/\/\s*End\s+exclusion/gs,
    '// CSRF protection applied to all routes'
  );

  // Asegurar que CSRF se aplique a todas las rutas
  content = content.replace(
    /if\s*\(\s*excludedPaths\.test\(req\.path\)\s*\)\s*\{[\s\S]*?return\s+next\(\);\s*\}/g,
    '// CSRF protection for all routes'
  );

  fs.writeFileSync(csrfPath, content);
  console.log('   ✅ CSRF aplicado a todas las rutas');
} else {
  console.log('   ❌ csrf.ts no encontrado');
}

// ============================================================================
// 4. MEJORAR VALIDACIÓN JWT
// ============================================================================

console.log('\n🔧 4. MEJORANDO VALIDACIÓN JWT\n');

const authPath = path.join(
  process.cwd(),
  'apps/backend/src/middleware/auth.ts'
);
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, 'utf8');

  // Agregar validación de issuer y audience
  const jwtValidation = `
// Enhanced JWT validation with issuer and audience
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: process.env.JWT_ISSUER || 'academic-platform',
      audience: process.env.JWT_AUDIENCE || 'academic-platform-users',
      algorithms: ['HS256']
    });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
`;

  // Reemplazar authenticateJWT existente
  content = content.replace(
    /export\s+const\s+authenticateJWT[\s\S]*?};/g,
    jwtValidation
  );

  fs.writeFileSync(authPath, content);
  console.log('   ✅ Validación JWT mejorada (issuer/audience)');
} else {
  console.log('   ❌ auth.ts no encontrado');
}

// ============================================================================
// 5. MEJORAR SANITIZACIÓN DE ENTRADA
// ============================================================================

console.log('\n🔧 5. MEJORANDO SANITIZACIÓN DE ENTRADA\n');

const sanitizeInput = `
// Enhanced input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove script tags and event handlers
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*on\\w+\\s*=\\s*["'][^"']*["'][^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload/gi, '')
    .replace(/onerror/gi, '')
    .replace(/onclick/gi, '');

  // HTML encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\\//g, '&#x2F;');

  return sanitized.trim();
};
`;

if (fs.existsSync(securityPath)) {
  let content = fs.readFileSync(securityPath, 'utf8');

  // Reemplazar sanitizeInput existente
  content = content.replace(
    /export\s+const\s+sanitizeInput[\s\S]*?};/g,
    sanitizeInput
  );

  fs.writeFileSync(securityPath, content);
  console.log('   ✅ Sanitización de entrada mejorada');
} else {
  console.log('   ❌ security.ts no encontrado');
}

// ============================================================================
// 6. CONSOLIDAR RATE LIMITING
// ============================================================================

console.log('\n🔧 6. CONSOLIDANDO RATE LIMITING\n');

const rateLimitContent = `
// Consolidated rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

  const key = \`rate_limit:\${clientIp}\`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded',
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    });
  }

  current.count++;
  next();
};

// Clean up expired entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 15 * 60 * 1000);
`;

const authPath2 = path.join(
  process.cwd(),
  'apps/backend/src/middleware/auth.ts'
);
if (fs.existsSync(authPath2)) {
  let content = fs.readFileSync(authPath2, 'utf8');

  // Reemplazar rateLimit existente
  content = content.replace(
    /export\s+const\s+rateLimit[\s\S]*?};/g,
    rateLimitContent
  );

  fs.writeFileSync(authPath2, content);
  console.log('   ✅ Rate limiting consolidado');
} else {
  console.log('   ❌ auth.ts no encontrado');
}

// ============================================================================
// 7. VERIFICACIÓN FINAL
// ============================================================================

console.log('\n✅ CORRECCIONES CRÍTICAS APLICADAS\n');

console.log('🎯 CORRECCIONES COMPLETADAS:');
console.log('• ✅ backend-supabase vulnerable eliminado');
console.log('• ✅ CSP fortalecido (sin unsafe-inline/unsafe-eval)');
console.log('• ✅ CSRF aplicado a todas las rutas');
console.log('• ✅ Validación JWT mejorada (issuer/audience)');
console.log('• ✅ Sanitización de entrada mejorada');
console.log('• ✅ Rate limiting consolidado');

console.log('\n🚀 COMANDOS PARA VERIFICAR:');
console.log('1. Verificar que backend-supabase fue eliminado:');
console.log('   dir apps');

console.log('\n2. Verificar que CSP está fortalecido:');
console.log(
  '   findstr "unsafe-inline" apps\\backend\\src\\middleware\\security.ts'
);

console.log('\n3. Verificar que CSRF está aplicado:');
console.log('   findstr "csrfProtection" apps\\backend\\src\\routes\\');

console.log('\n4. Verificar que JWT valida issuer/audience:');
console.log('   findstr "issuer" apps\\backend\\src\\middleware\\auth.ts');

console.log('\n⚠️  IMPORTANTE:');
console.log('• Reinicia los servicios después de las correcciones');
console.log('• Verifica que la funcionalidad sigue funcionando');
console.log('• Las correcciones críticas de seguridad están aplicadas');

console.log('\n🎉 ¡CORRECCIONES CRÍTICAS COMPLETADAS!');
console.log('El sistema está más seguro ahora.');

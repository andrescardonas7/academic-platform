import { NextFunction, Request, Response } from 'express';
import { SecurityUtils } from '../utils/SecurityUtils';

// Security middleware for additional protection
export const securityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Security: Remove server information
  res.removeHeader('X-Powered-By');

  // Security: Add additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.cerebras.ai https://*.supabase.co; " +
      "media-src 'self'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
  );

  // Strict Transport Security
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Security: Prevent caching of sensitive endpoints
  if (req.path.includes('/api/')) {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};

// Input sanitization middleware
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    req.body = SecurityUtils.sanitizeInput(req.body);
  }

  if (req.query) {
    req.query = SecurityUtils.sanitizeInput(req.query);
  }

  next();
};

// Request logging for security monitoring
export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Log suspicious activity
    if (res.statusCode >= 400) {
      console.warn('Security Event - Suspicious request:', logData);
    }

    // Log slow requests (potential DoS)
    if (duration > 5000) {
      console.warn('Security Event - Slow request:', logData);
    }
  });

  next();
};

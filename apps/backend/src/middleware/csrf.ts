import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

// Simple CSRF protection middleware
export interface CSRFRequest extends Request {
  csrfToken?: string;
}

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF protection middleware
export const csrfProtection = (
  req: CSRFRequest,
  res: Response,
  next: NextFunction
) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for health check
  if (req.path === '/health') {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID',
    });
  }

  next();
};

// Endpoint to get CSRF token
export const getCSRFToken = (req: CSRFRequest, res: Response) => {
  const token = generateCSRFToken();

  if (!req.session) {
    return res.status(500).json({
      error: 'Session not initialized',
      code: 'SESSION_ERROR',
    });
  }

  req.session.csrfToken = token;

  res.json({
    success: true,
    csrfToken: token,
  });
};

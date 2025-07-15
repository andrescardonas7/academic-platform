import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

// JWT Authentication middleware
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token required',
      code: 'TOKEN_REQUIRED',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
      code: 'TOKEN_INVALID',
    });
  }
};

// API Key validation (for backward compatibility)
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required',
      code: 'API_KEY_REQUIRED',
    });
  }

  // Validate API key (use environment variable)
  const validApiKey = process.env.API_KEY;
  if (!validApiKey) {
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'API key not configured',
      code: 'API_KEY_NOT_CONFIGURED',
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
      code: 'INVALID_API_KEY',
    });
  }

  next();
};

// Enhanced rate limiting with better security
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

  // Clean up expired entries
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }

  const clientData = rateLimitStore.get(clientIp);

  if (!clientData) {
    // First request from this IP
    rateLimitStore.set(clientIp, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (now > clientData.resetTime) {
    // Reset window
    rateLimitStore.set(clientIp, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (clientData.count >= maxRequests) {
    // Rate limit exceeded
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
  }

  // Increment counter
  clientData.count++;
  rateLimitStore.set(clientIp, clientData);
  next();
};

// Authorization middleware
export const authorize = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role || '')) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    next();
  };
};

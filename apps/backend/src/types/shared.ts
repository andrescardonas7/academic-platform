// Shared backend types to reduce duplication
import { Request } from 'express';

export interface BaseError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  headers: Request['headers'];
}

export interface SecurityEventData {
  timestamp: string;
  type: string;
  severity: string;
  message: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: unknown;
}

export interface RateLimitData {
  count: number;
  resetTime: number;
}

export interface BaseService {
  checkHealth(): Promise<boolean>;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// Database query interface - using generic but parameters need implementation
export interface DatabaseQuery {
  query<T>(table: string, filters?: Record<string, unknown>): Promise<T[]>;
  count(table: string, filters?: Record<string, unknown>): Promise<number>;
}

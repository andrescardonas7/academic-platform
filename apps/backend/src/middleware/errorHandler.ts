import { NextFunction, Request, Response } from 'express';

import { BaseError as AppError } from '../types/shared';

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Security: Enhanced logging with security context
  const logData = {
    message: error.message,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    code: error.code || 'UNKNOWN_ERROR',
    isOperational: error.isOperational || false,
  };

  if (isDevelopment || error.isOperational) {
    console.error('Security Event - Error details:', {
      ...logData,
      stack: error.stack,
    });
  } else {
    // In production, log minimal info for non-operational errors
    console.error('Security Event - Non-operational error:', logData);
  }

  // Prepare response based on environment
  let responseMessage: string;
  if (isDevelopment) {
    responseMessage = message;
  } else if (statusCode >= 500) {
    responseMessage = 'Something went wrong';
  } else {
    responseMessage = message;
  }

  const response = {
    error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
    message: responseMessage,
    code: error.code || 'UNKNOWN_ERROR',
  } as Record<string, unknown>;

  // Only include stack trace in development
  if (isDevelopment && error.stack) {
    response.stack = error.stack;
  }

  // Include validation details if available
  if (error.code === 'VALIDATION_ERROR' && 'details' in error) {
    response.details = (error as ValidationError).details;
  }

  res.status(statusCode).json(response);
};

// Custom error classes
export class ValidationError extends Error implements AppError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;

  constructor(
    message: string,
    public details?: unknown[]
  ) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class AuthenticationError extends Error implements AppError {
  statusCode = 401;
  code = 'AUTHENTICATION_ERROR';
  isOperational = true;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error implements AppError {
  statusCode = 403;
  code = 'AUTHORIZATION_ERROR';
  isOperational = true;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error implements AppError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  isOperational = true;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

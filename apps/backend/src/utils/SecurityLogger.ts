import { Request } from 'express';
import fs from 'fs';
import path from 'path';

// Security event types
export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_VIOLATION = 'CSRF_VIOLATION',
  INPUT_VALIDATION_FAILURE = 'INPUT_VALIDATION_FAILURE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  API_KEY_INVALID = 'API_KEY_INVALID',
  SERVER_ERROR = 'SERVER_ERROR',
  SECURITY_CONFIG = 'SECURITY_CONFIG',
}

// Security event severity
export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// Security event interface
export interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  message: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: any;
}

// Security logger class
export class SecurityLogger {
  private static logDir = process.env.SECURITY_LOG_DIR || 'logs/security';
  private static logFile = path.join(SecurityLogger.logDir, 'security.log');
  private static consoleOutput = process.env.NODE_ENV !== 'production';

  // Initialize logger
  static initialize() {
    // Create log directory if it doesn't exist
    if (!fs.existsSync(SecurityLogger.logDir)) {
      fs.mkdirSync(SecurityLogger.logDir, { recursive: true });
    }

    // Log initialization
    SecurityLogger.log({
      type: SecurityEventType.SECURITY_CONFIG,
      severity: SecurityEventSeverity.INFO,
      message: 'Security logger initialized',
      details: {
        logFile: SecurityLogger.logFile,
        consoleOutput: SecurityLogger.consoleOutput,
        environment: process.env.NODE_ENV || 'development',
      },
    });
  }

  // Log security event
  static log(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Sanitize sensitive data
    if (securityEvent.details) {
      securityEvent.details = SecurityLogger.sanitizeSensitiveData(
        securityEvent.details
      );
    }

    // Write to file
    try {
      fs.appendFileSync(
        SecurityLogger.logFile,
        JSON.stringify(securityEvent) + '\n'
      );
    } catch (error) {
      console.error('Failed to write security log:', error);
    }

    // Console output in non-production environments
    if (SecurityLogger.consoleOutput) {
      const color = SecurityLogger.getSeverityColor(securityEvent.severity);
      console.log(
        `${color}[SECURITY] ${securityEvent.severity} - ${securityEvent.type}: ${
          securityEvent.message
        }${SecurityLogger.getResetColor()}`
      );
    }
  }

  // Log security event from request
  static logFromRequest(
    req: Request,
    type: SecurityEventType,
    severity: SecurityEventSeverity,
    message: string,
    details?: any
  ) {
    SecurityLogger.log({
      type,
      severity,
      message,
      userId: (req as any).user?.id,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      details,
    });
  }

  // Sanitize sensitive data
  private static sanitizeSensitiveData(data: any): any {
    if (!data) return data;

    // Clone the data to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(data));

    // List of sensitive field names
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'api_key',
      'secret',
      'credential',
      'authorization',
      'jwt',
      'session',
      'cookie',
    ];

    // Recursively sanitize objects
    const sanitizeObject = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach((key) => {
        // Check if this is a sensitive field
        const isLowerCaseSensitive = sensitiveFields.includes(
          key.toLowerCase()
        );
        const containsSensitive = sensitiveFields.some((field) =>
          key.toLowerCase().includes(field)
        );

        if (isLowerCaseSensitive || containsSensitive) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      });
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  // Get color code for severity
  private static getSeverityColor(severity: SecurityEventSeverity): string {
    switch (severity) {
      case SecurityEventSeverity.INFO:
        return '\x1b[36m'; // Cyan
      case SecurityEventSeverity.WARNING:
        return '\x1b[33m'; // Yellow
      case SecurityEventSeverity.ERROR:
        return '\x1b[31m'; // Red
      case SecurityEventSeverity.CRITICAL:
        return '\x1b[41m\x1b[37m'; // White on red background
      default:
        return '\x1b[0m'; // Reset
    }
  }

  // Reset color code
  private static getResetColor(): string {
    return '\x1b[0m';
  }
}

// Initialize on import
SecurityLogger.initialize();

export default SecurityLogger;

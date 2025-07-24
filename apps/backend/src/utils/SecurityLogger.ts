import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { SecurityUtils } from './SecurityUtils';

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
  private static readonly consoleOutput = process.env.NODE_ENV !== 'production';

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
    return SecurityUtils.sanitizeData(data);
  }

  // Get color code for severity
  private static getSeverityColor(severity: SecurityEventSeverity): string {
    return SecurityUtils.getSeverityColor(severity);
  }

  // Reset color code
  private static getResetColor(): string {
    return SecurityUtils.getResetColor();
  }
}

// Initialize on import
SecurityLogger.initialize();

export default SecurityLogger;

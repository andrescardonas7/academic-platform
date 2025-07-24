import { NextFunction, Request, Response } from 'express';
import SecurityLogger, {
  SecurityEventSeverity,
  SecurityEventType,
} from '../utils/SecurityLogger';
import { SecurityUtils } from '../utils/SecurityUtils';

// Rate limiting for suspicious activity
const suspiciousActivityTracker = new Map<
  string,
  { count: number; resetTime: number }
>();

export const securityMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  // Check for suspicious patterns in request
  const suspiciousActivity = detectSuspiciousActivity(req);

  if (suspiciousActivity.length > 0) {
    // Log suspicious activity
    SecurityLogger.logFromRequest(
      req,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventSeverity.WARNING,
      `Suspicious activity detected: ${suspiciousActivity.join(', ')}`,
      {
        patterns: suspiciousActivity,
        body: req.body,
        query: req.query,
        headers: sanitizeHeaders(req.headers),
      }
    );

    // Track suspicious activity per IP
    trackSuspiciousActivity(clientIp);

    // Check if IP should be temporarily blocked
    if (shouldBlockIP(clientIp)) {
      SecurityLogger.logFromRequest(
        req,
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        SecurityEventSeverity.CRITICAL,
        'IP temporarily blocked due to repeated suspicious activity',
        { blockedUntil: new Date(Date.now() + 3600000).toISOString() } // 1 hour
      );

      return res.status(429).json({
        error: 'Too Many Suspicious Requests',
        message:
          'Your IP has been temporarily blocked due to suspicious activity',
        code: 'IP_BLOCKED',
        retryAfter: 3600, // 1 hour
      });
    }
  }

  // Monitor for unusual request patterns
  monitorRequestPatterns(req);

  next();
};

// Detect suspicious activity in request
function detectSuspiciousActivity(req: Request): string[] {
  const requestData = {
    body: JSON.stringify(req.body || {}),
    query: JSON.stringify(req.query || {}),
    params: JSON.stringify(req.params || {}),
    path: req.path,
    headers: JSON.stringify(req.headers || {}),
  };

  return SecurityUtils.detectSuspiciousActivity(requestData);
}

// Track suspicious activity per IP
function trackSuspiciousActivity(ip: string) {
  const now = Date.now();
  const windowMs = 3600000; // 1 hour

  const current = suspiciousActivityTracker.get(ip);

  if (!current || now > current.resetTime) {
    suspiciousActivityTracker.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
  } else {
    current.count++;
    suspiciousActivityTracker.set(ip, current);
  }
}

// Check if IP should be blocked
function shouldBlockIP(ip: string): boolean {
  const data = suspiciousActivityTracker.get(ip);
  return data ? data.count >= 5 : false; // Block after 5 suspicious activities
}

// Monitor request patterns
function monitorRequestPatterns(req: Request) {
  const userAgent = req.headers['user-agent'] || '';
  const path = req.path;

  // Check for bot-like behavior
  if (isBotLike(userAgent)) {
    SecurityLogger.logFromRequest(
      req,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventSeverity.INFO,
      'Bot-like user agent detected',
      { userAgent }
    );
  }

  // Check for unusual paths
  if (isUnusualPath(path)) {
    SecurityLogger.logFromRequest(
      req,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventSeverity.WARNING,
      'Unusual path accessed',
      { path }
    );
  }
}

// Check if user agent looks like a bot
function isBotLike(userAgent: string): boolean {
  return SecurityUtils.isBotLike(userAgent);
}

// Check if path is unusual
function isUnusualPath(path: string): boolean {
  return SecurityUtils.isUnusualPath(path);
}

// Sanitize headers for logging
function sanitizeHeaders(
  headers: Record<string, unknown>
): Record<string, unknown> {
  return SecurityUtils.sanitizeHeaders(headers);
}

// Shared security utilities
export class SecurityUtils {
  // Sensitivterns
  private static readonly SENSITIVE_FIELDS = [
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

  // Suspicious patterns
  static readonly PATTERNS = {
    SQL_INJECTION: [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/i,
      /(\bOR\s+1=1\b|\bAND\s+1=1\b)/i,
      /(--|\/\*|\*\/)/,
    ],
    XSS_ATTEMPTS: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
    ],
    PATH_TRAVERSAL: [/\.\.\//g, /\.\.\\/g, /%2e%2e%2f/gi, /%2e%2e%5c/gi],
    COMMAND_INJECTION: [/[;&|`$()]/, /\b(cat|ls|pwd|whoami|id|uname)\b/i],
  };

  // Bot patterns
  static readonly BOT_PATTERNS = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /^$/,
  ];

  // Unusual path patterns
  static readonly UNUSUAL_PATHS = [
    /\.php$/i,
    /\.asp$/i,
    /\.jsp$/i,
    /wp-admin/i,
    /admin/i,
    /phpmyadmin/i,
    /\.env$/i,
    /\.git/i,
    /\.svn/i,
  ];

  // Sanitize sensitive data
  static sanitizeData(data: unknown): unknown {
    if (!data) return data;
    const sanitized = JSON.parse(JSON.stringify(data));
    this.sanitizeObject(sanitized);
    return sanitized;
  }

  private static sanitizeObject(obj: Record<string, unknown>): void {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
      const isLowerCaseSensitive = this.SENSITIVE_FIELDS.includes(
        key.toLowerCase()
      );
      const containsSensitive = this.SENSITIVE_FIELDS.some((field) =>
        key.toLowerCase().includes(field)
      );

      if (isLowerCaseSensitive || containsSensitive) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key] as Record<string, unknown>);
      }
    });
  }

  // Sanitize input for XSS prevention
  static sanitizeInput(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeInput(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return obj;
  }

  // Detect suspicious patterns
  static detectSuspiciousActivity(
    requestData: Record<string, string>
  ): string[] {
    const suspicious: string[] = [];
    const dataValues = Object.values(requestData);

    // Check each pattern type
    Object.entries(this.PATTERNS).forEach(([type, patterns]) => {
      patterns.forEach((pattern) => {
        if (dataValues.some((data) => pattern.test(data))) {
          suspicious.push(type);
        }
      });
    });

    return Array.from(new Set(suspicious));
  }

  // Check if user agent is bot-like
  static isBotLike(userAgent: string): boolean {
    return this.BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
  }

  // Check if path is unusual
  static isUnusualPath(path: string): boolean {
    return this.UNUSUAL_PATHS.some((pattern) => pattern.test(path));
  }

  // Sanitize headers
  static sanitizeHeaders(
    headers: Record<string, unknown>
  ): Record<string, unknown> {
    const sanitized = { ...headers };
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    return sanitized;
  }

  // Get severity color for console output
  static getSeverityColor(severity: string): string {
    const colors = {
      INFO: '\x1b[36m', // Cyan
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
      CRITICAL: '\x1b[41m\x1b[37m', // White on red
    };
    return colors[severity as keyof typeof colors] || '\x1b[0m';
  }

  static getResetColor(): string {
    return '\x1b[0m';
  }
}

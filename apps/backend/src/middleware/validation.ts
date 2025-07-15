import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

// Validation schemas
export const searchQuerySchema = z.object({
  q: z.string().optional(),
  modalidad: z.string().optional(),
  institucion: z.string().optional(),
  nivel: z.string().optional(),
  area: z.string().optional(),
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(15),
  sortBy: z
    .enum(['nombre', 'institucion', 'modalidad', 'nivel', 'area', 'duracion'])
    .optional()
    .default('nombre'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long')
    .trim()
    .refine((val) => {
      // Security: Block potential injection patterns
      const dangerousPatterns = [
        /ignore\s+previous\s+instructions/gi,
        /forget\s+everything/gi,
        /system\s*:/gi,
        /assistant\s*:/gi,
        /\[INST\]/gi,
        /\[\/INST\]/gi,
        /<\|.*?\|>/gi,
      ];
      return !dangerousPatterns.some((pattern) => pattern.test(val));
    }, 'Message contains invalid content'),
  context: z.string().optional(),
});

// Generic validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query parameters for GET requests
      if (req.method === 'GET') {
        schema.parse(req.query);
      }
      // Validate body for POST/PUT requests
      else if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        schema.parse(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid request parameters',
          code: 'VALIDATION_ERROR',
          details: validationErrors,
        });
      }

      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid request format',
        code: 'INVALID_REQUEST',
      });
    }
  };
};

// Specific validation middlewares
export const validateSearchQuery = validateRequest(searchQuerySchema);
export const validateChatMessage = validateRequest(chatMessageSchema);

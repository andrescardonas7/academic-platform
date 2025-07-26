// Refactored CerebrasService - Single Responsibility
// CEREBRAS configuration for Railway deployment
const CEREBRAS = {
  MODEL: 'qwen-3-235b-a22b',
  CONTEXT_LIMIT: 50, // KISS: Show ALL data for better context
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.1, // DRY: Low temperature for precise answers
} as const;
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { IChatService } from '../interfaces/IChatService';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';
import { ContextGenerator } from './ContextGenerator';
import { SearchService } from './SearchService';

export class CerebrasService implements IChatService {
  private static client: Cerebras;
  private static readonly contextGenerator = new ContextGenerator();
  private static readonly searchService = new SearchService();

  static {
    this.client = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    if (!process.env.CEREBRAS_API_KEY) {
      throw new AppError(
        'CEREBRAS_API_KEY is required',
        500,
        'MISSING_API_KEY'
      );
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Security: Validate and sanitize input
      const sanitizedMessage = this.validateAndSanitizeInput(message);

      console.log('🔍 Processing message (length):', sanitizedMessage.length);

      const academicContext = await this.getAcademicContext(sanitizedMessage);
      const systemPrompt = this.buildSystemPrompt(academicContext);

      const response = await this.callCerebrasAPI(
        sanitizedMessage,
        systemPrompt
      );

      console.log('🤖 Response generated successfully');
      return response;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorHandler.logError(appError, 'CerebrasService.sendMessage');

      return this.getFallbackResponse();
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const testCompletion =
        await CerebrasService.client.chat.completions.create({
          messages: [{ role: 'user', content: 'Hello' }],
          model: CEREBRAS.MODEL,
          max_tokens: 10,
          temperature: 0.1,
        });

      return !!(testCompletion.choices as any)?.[0]?.message?.content;
    } catch (error) {
      ErrorHandler.logError(
        ErrorHandler.handle(error),
        'CerebrasService.checkHealth'
      );
      return false;
    }
  }

  private async getAcademicContext(userMessage?: string): Promise<string> {
    // KISS: Get ALL data first for complete context
    const allDataResult = await CerebrasService.searchService.searchOfferings({
      limit: CEREBRAS.CONTEXT_LIMIT, // Get all 50 programs
    });

    // DRY: Generate comprehensive context with ALL data
    return CerebrasService.contextGenerator.generateAcademicContext(
      allDataResult.data
    );
  }

  private extractKeywords(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const keywords: string[] = [];

    // KISS: Simple keyword mapping
    const keywordMap = {
      ingenieria: ['ingeniería', 'ingenieria'],
      sistemas: ['sistemas', 'sistema'],
      software: ['software'],
      electronica: ['electrónica', 'electronica'],
      administracion: ['administración', 'administracion'],
      contaduria: ['contaduría', 'contaduria'],
      derecho: ['derecho'],
      psicologia: ['psicología', 'psicologia'],
      educacion: ['educación', 'educacion'],
      tecnologia: ['tecnología', 'tecnologia'],
    };

    Object.entries(keywordMap).forEach(([key, variants]) => {
      if (variants.some((variant) => lowerMessage.includes(variant))) {
        keywords.push(key);
      }
    });

    return keywords;
  }

  private buildSystemPrompt(academicContext: string): string {
    return `Eres "Orienta Cartago", asistente académico especializado en programas educativos de Cartago, Valle del Cauca, Colombia.

## CONTEXTO COMPLETO DE PROGRAMAS ACADÉMICOS
${academicContext}

## INSTRUCCIONES CRÍTICAS
1. **REVISAR TODO**: Antes de responder, revisa COMPLETAMENTE el contexto anterior
2. **DATOS DISPONIBLES**: El contexto contiene TODOS los 27 programas disponibles
3. **NO NEGAR INFORMACIÓN**: Si preguntan por Derecho, Ingenierías o Virtual, SÍ están disponibles
4. **BUSCAR EXHAUSTIVAMENTE**: Revisa todo el listado antes de decir "no hay información"

## REGLAS DE RESPUESTA
- Responde SOLO en español colombiano
- Usa ÚNICAMENTE información del contexto
- Lista programas con detalles completos: nombre, institución, modalidad, precio
- Formato claro con viñetas y texto en negrita
- Si encuentras programas, muéstralos todos

## IMPORTANTE
Los datos SÍ están en el contexto. Revisa TODO antes de responder.`;
  }

  private async callCerebrasAPI(
    message: string,
    systemPrompt: string
  ): Promise<string> {
    const chatCompletion = await CerebrasService.client.chat.completions.create(
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        model: CEREBRAS.MODEL,
        max_tokens: CEREBRAS.MAX_TOKENS,
        temperature: CEREBRAS.TEMPERATURE,
      }
    );

    let result = (chatCompletion.choices as any)?.[0]?.message?.content || '';
    console.log('📊 Tokens used:', (chatCompletion.usage as any)?.total_tokens);

    // Clean up any unwanted internal process text
    result = this.cleanResponse(result);

    return result;
  }

  private cleanResponse(response: string): string {
    // Remove <think> tags and their content
    response = response.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Remove any remaining XML-like tags
    response = response.replace(/<[^>]*>/g, '');

    // Clean up extra whitespace
    response = response.replace(/\s+/g, ' ').trim();

    return response;
  }

  private getFallbackResponse(): string {
    return '¡Hola! Soy Orienta Cartago, tu asistente de orientación académica. Actualmente tengo algunos problemas técnicos, pero estoy aquí para ayudarte con información sobre programas académicos en Cartago. ¿En qué puedo asistirte?';
  }

  private validateAndSanitizeInput(message: string): string {
    if (!message || typeof message !== 'string') {
      throw new AppError('Invalid message format', 400, 'INVALID_INPUT');
    }

    // Security: Length validation
    if (message.length > 1000) {
      throw new AppError('Message too long', 400, 'MESSAGE_TOO_LONG');
    }

    if (message.length < 1) {
      throw new AppError('Message cannot be empty', 400, 'EMPTY_MESSAGE');
    }

    // Security: Basic sanitization - remove potential injection patterns
    let sanitized = message.trim();

    // Remove potential prompt injection patterns
    const dangerousPatterns = [
      /ignore\s+previous\s+instructions/gi,
      /forget\s+everything/gi,
      /system\s*:/gi,
      /assistant\s*:/gi,
      /\[INST\]/gi,
      /\[\/INST\]/gi,
      /<\|.*?\|>/gi,
    ];

    dangerousPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    if (sanitized.length === 0) {
      throw new AppError(
        'Message contains only invalid content',
        400,
        'INVALID_CONTENT'
      );
    }

    return sanitized;
  }
}

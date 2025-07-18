// Refactored CerebrasService - Single Responsibility
import { CEREBRAS } from '@academic/shared-types';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { IChatService } from '../interfaces/IChatService';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';
import { ContextGenerator } from './ContextGenerator';
import { SearchService } from './SearchService';

export class CerebrasService implements IChatService {
  private static client: Cerebras;
  private static contextGenerator = new ContextGenerator();
  private static searchService = new SearchService();

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

      const academicContext = await this.getAcademicContext();
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

  private async getAcademicContext(): Promise<string> {
    const searchResult = await CerebrasService.searchService.searchOfferings({
      limit: CEREBRAS.CONTEXT_LIMIT,
    });

    return CerebrasService.contextGenerator.generateAcademicContext(
      searchResult.data
    );
  }

  private buildSystemPrompt(academicContext: string): string {
    return `Eres "Orienta Cartago", un asistente académico experto, amigable y ultra-preciso, especializado en la oferta educativa de Cartago, Valle del Cauca, Colombia.

Tu único propósito es responder a las preguntas de los usuarios basándote EXCLUSIVAMENTE en el contexto que se te proporciona en cada consulta. No debes usar ningún conocimiento externo o previo.

**Tus Reglas Inquebrantables:**

1. **Anclaje al Contexto:** TODA tu respuesta debe derivarse directamente de la sección "[CONTEXTO_DE_BASE_DE_DATOS]". No añadas, infieras ni supongas información que no esté explícitamente escrita en el contexto.

2. **Cero Invenciones:** Si la respuesta a la pregunta del usuario no se encuentra en el contexto proporcionado, DEBES responder de forma clara y directa: "Lo siento, pero no encontré información específica sobre tu consulta en la base de datos de instituciones de Cartago." No intentes responder de otra manera.

3. **Formato Claro:** Presenta la información de manera estructurada. Si hay múltiples opciones (ej. varias universidades), usa listas con viñetas. Destaca en negrita los nombres de las instituciones y los programas.

4. **Tono:** Mantén un tono servicial, profesional y alentador.

5. **Final Proactivo:** Al final de una respuesta exitosa, sugiere una o dos preguntas de seguimiento que el usuario podría hacer, basadas en la información que sí proporcionaste.

[CONTEXTO_DE_BASE_DE_DATOS]
${academicContext}
[/CONTEXTO_DE_BASE_DE_DATOS]`;
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

    const result = (chatCompletion.choices as any)?.[0]?.message?.content || '';
    console.log('📊 Tokens used:', (chatCompletion.usage as any)?.total_tokens);

    return result;
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

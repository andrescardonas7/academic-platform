import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase configuration with validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only create client if environment variables are available
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Cerebras configuration
const CEREBRAS_CONFIG = {
  MODEL: 'qwen-3-235b-a22b',
  CONTEXT_LIMIT: 50,
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.1,
} as const;

// API Key validation
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

  if (!expectedKey) {
    console.warn('⚠️ No API key configured');
    return true;
  }

  return apiKey === expectedKey;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error(
        '❌ Supabase not configured - missing environment variables'
      );
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'Database service not configured',
        },
        { status: 503 }
      );
    }

    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'API key required',
          code: 'API_KEY_REQUIRED',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate Cerebras API key
    if (!process.env.CEREBRAS_API_KEY) {
      return NextResponse.json(
        {
          error: 'Service Unavailable',
          message: 'Chatbot service not configured',
        },
        { status: 503 }
      );
    }

    // Get academic context from database
    const academicContext = await getAcademicContext(message);
    const systemPrompt = buildSystemPrompt(academicContext);

    // Call Cerebras API
    const response = await callCerebrasAPI(message, systemPrompt);

    return NextResponse.json({
      success: true,
      response,
      context: academicContext.length,
    });
  } catch (error) {
    console.error('❌ Chatbot API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

async function getAcademicContext(message: string): Promise<any[]> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('❌ Supabase not configured in getAcademicContext');
      return [];
    }

    // Extract search terms from message
    const searchTerms = extractSearchTerms(message);

    if (searchTerms.length === 0) {
      return [];
    }

    // Search for relevant academic programs
    let query = supabase
      .from('oferta_academica')
      .select(
        'carrera, institucion, modalidad, nivel_programa, duracion_semestres, valor_semestre'
      )
      .limit(CEREBRAS_CONFIG.CONTEXT_LIMIT);

    // Apply search filters
    const searchConditions = searchTerms.map(
      (term) =>
        `carrera.ilike.%${term}%,institucion.ilike.%${term}%,clasificacion.ilike.%${term}%`
    );
    query = query.or(searchConditions.join(','));

    const result = await query;
    return result.data || [];
  } catch (error) {
    console.error('❌ Error getting academic context:', error);
    return [];
  }
}

function extractSearchTerms(message: string): string[] {
  const normalized = message
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n');

  return [
    ...new Set(normalized.split(/\s+/).filter((term) => term.length > 2)),
  ];
}

function buildSystemPrompt(academicContext: any[]): string {
  const contextData =
    academicContext.length > 0
      ? JSON.stringify(academicContext, null, 2)
      : 'No hay datos específicos disponibles.';

  return `Eres un asistente especializado en educación superior en Colombia. Tu función es ayudar a estudiantes a encontrar programas académicos que se ajusten a sus necesidades.

CONTEXTO ACADÉMICO DISPONIBLE:
${contextData}

INSTRUCCIONES:
1. Responde SOLO sobre educación superior, carreras universitarias, instituciones educativas
2. Usa ÚNICAMENTE la información del contexto académico proporcionado
3. Si no tienes información específica, sugiere búsquedas más específicas
4. Sé conciso, útil y profesional
5. Incluye detalles como modalidad, duración y costos cuando estén disponibles
6. NO inventes información que no esté en el contexto

FORMATO DE RESPUESTA:
- Respuesta directa y clara
- Información específica de programas cuando sea relevante
- Sugerencias para refinar la búsqueda si es necesario`;
}

async function callCerebrasAPI(
  message: string,
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch(
      'https://api.cerebras.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: CEREBRAS_CONFIG.MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          max_tokens: CEREBRAS_CONFIG.MAX_TOKENS,
          temperature: CEREBRAS_CONFIG.TEMPERATURE,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      'Lo siento, no pude generar una respuesta.'
    );
  } catch (error) {
    console.error('❌ Cerebras API call failed:', error);
    throw new Error('Failed to get AI response');
  }
}

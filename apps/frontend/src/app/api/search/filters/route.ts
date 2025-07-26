import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FilterOptions {
  modalidades: string[];
  instituciones: string[];
  areas: string[];
  niveles: string[];
}

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

export async function GET(request: NextRequest) {
  try {
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

    const result = await supabase
      .from('oferta_academica')
      .select('modalidad, institucion, clasificacion, nivel_programa')
      .limit(1000);

    if (result.error) {
      console.error('❌ Supabase query error:', result.error);
      return NextResponse.json(
        { error: 'Database error', message: result.error.message },
        { status: 500 }
      );
    }

    const { data } = result;
    const filterOptions = extractUniqueValues(data || []);

    return NextResponse.json({
      success: true,
      data: filterOptions,
    });
  } catch (error) {
    console.error('❌ Filters API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

function extractUniqueValues(data: Record<string, unknown>[]): FilterOptions {
  return {
    modalidades: getUniqueValues(data, 'modalidad'),
    instituciones: getUniqueValues(data, 'institucion'),
    areas: getUniqueValues(data, 'clasificacion'),
    niveles: getUniqueValues(data, 'nivel_programa'),
  };
}

function getUniqueValues(
  data: Record<string, unknown>[],
  field: string
): string[] {
  return Array.from(
    new Set(
      data
        .map((item) => item[field])
        .filter(
          (value): value is string =>
            typeof value === 'string' && value.trim().length > 0
        )
    )
  ).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

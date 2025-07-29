import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase configuration with validation
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only create client if environment variables are available
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Types
interface SearchFilters {
  q?: string;
  modalidad?: string;
  institucion?: string;
  nivel?: string;
  area?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface AcademicProgram {
  Id: string;
  institucion: string;
  clasificacion: string;
  nivel_programa: string;
  carrera: string;
  duracion_semestres: number;
  modalidad: string;
  jornada: string;
  enlace: string;
  valor_semestre: number;
  created_at: string;
  updated_at: string;
}

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

// API Key validation middleware
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const expectedKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

  if (!expectedKey) {
    console.warn('⚠️ No API key configured');
    return true; // Allow if no key is configured
  }

  return apiKey === expectedKey;
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    // Parse filters from query parameters
    const filters: SearchFilters = {
      q: searchParams.get('q') || undefined,
      modalidad: searchParams.get('modalidad') || undefined,
      institucion: searchParams.get('institucion') || undefined,
      nivel: searchParams.get('nivel') || undefined,
      area: searchParams.get('area') || undefined,
      sortBy: searchParams.get('sortBy') || 'carrera',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(
        parseInt(searchParams.get('limit') || '10'),
        PAGINATION.MAX_LIMIT
      ),
    };

    const limit = Math.min(
      filters.limit || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const page = Math.max(filters.page || PAGINATION.DEFAULT_PAGE, 1);
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('oferta_academica')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.q?.trim()) {
      const searchTerms = normalizeSearchTerms(filters.q.trim());
      const searchConditions = searchTerms.map(
        (term) =>
          `carrera.ilike.%${term}%,institucion.ilike.%${term}%,clasificacion.ilike.%${term}%`
      );
      query = query.or(searchConditions.join(','));
    }

    if (filters.modalidad) {
      query = query.eq('modalidad', filters.modalidad);
    }

    if (filters.institucion) {
      query = query.eq('institucion', filters.institucion);
    }

    if (filters.nivel) {
      query = query.ilike('nivel_programa', `%${filters.nivel}%`);
    }

    if (filters.area) {
      query = query.ilike('clasificacion', `%${filters.area}%`);
    }

    // Apply sorting
    const sortField = mapSortField(filters.sortBy || 'carrera');
    const sortOrder = filters.sortOrder !== 'desc';
    query = query.order(sortField, { ascending: sortOrder });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const result = await query;

    if (result.error) {
      console.error('❌ Supabase query error:', result.error);
      return NextResponse.json(
        { error: 'Database error', message: result.error.message },
        { status: 500 }
      );
    }

    const { data, count } = result;
    const totalPages = Math.ceil((count || 0) / limit);

    const response = {
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Search API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function normalizeSearchTerms(searchText: string): string[] {
  const normalized = searchText
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

function mapSortField(sortBy: string): string {
  const fieldMap: Record<string, string> = {
    nombre: 'carrera',
    carrera: 'carrera',
    institucion: 'institucion',
    modalidad: 'modalidad',
    duracion: 'duracion_semestres',
    precio: 'valor_semestre',
    nivel: 'nivel_programa',
  };
  return fieldMap[sortBy] || 'carrera';
}

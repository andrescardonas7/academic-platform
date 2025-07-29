import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? 'SET'
      : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? 'SET'
      : 'NOT SET',
    API_KEY: process.env.API_KEY ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? 'SET' : 'NOT SET',
    CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    message: 'Environment variables status',
    environment: envVars,
    timestamp: new Date().toISOString(),
  });
}

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno directamente en este archivo
dotenv.config();

// Security: Removed credential logging

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error(
    '   SUPABASE_SERVICE_ROLE_KEY:',
    supabaseServiceKey ? '✅ Set' : '❌ Missing'
  );
  console.error(
    '📋 Please configure these environment variables in Railway dashboard'
  );
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;

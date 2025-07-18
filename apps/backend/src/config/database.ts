import { supabase } from './supabase';

export const connectDatabase = async () => {
  try {
    // Test Supabase connection
    const { error } = await supabase
      .from('oferta_academica')
      .select('count', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }

    console.log('✅ Connected to Supabase successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  // Supabase handles connection management automatically
  console.log('✅ Disconnected from Supabase');
};

export default supabase;

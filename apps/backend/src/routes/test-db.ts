import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Simple test endpoint to check database directly
router.get('/simple-query', async (req, res) => {
  try {
    console.log('🔍 Test: Simple database query...');
    
    // Test 1: Simple count query
    const countResult = await supabase
      .from('oferta_academica')
      .select('*', { count: 'exact', head: true });
    
    console.log('Count result:', countResult);
    
    // Test 2: Simple select query
    const selectResult = await supabase
      .from('oferta_academica')
      .select('*')
      .limit(5);
    
    console.log('Select result:', selectResult);
    
    // Test 3: Check table structure
    const structureResult = await supabase
      .from('oferta_academica')
      .select('id, carrera, institucion, modalidad')
      .limit(1);
    
    console.log('Structure result:', structureResult);
    
    res.json({
      success: true,
      tests: {
        count: {
          success: !countResult.error,
          count: countResult.count,
          error: countResult.error?.message,
        },
        select: {
          success: !selectResult.error,
          dataLength: selectResult.data?.length || 0,
          hasData: !!selectResult.data?.length,
          error: selectResult.error?.message,
          sampleData: selectResult.data?.slice(0, 2) || [],
        },
        structure: {
          success: !structureResult.error,
          dataLength: structureResult.data?.length || 0,
          error: structureResult.error?.message,
          sampleData: structureResult.data?.slice(0, 1) || [],
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
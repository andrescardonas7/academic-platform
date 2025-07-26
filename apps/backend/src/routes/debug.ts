import { Router } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Debug endpoint to check database status
router.get('/db-status', async (req, res) => {
  try {
    console.log('🔍 Debug: Checking database status...');
    
    // Check if we can connect to the database
    const { data: connectionTest, error: connectionError } = await supabase
      .from('oferta_academica')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Database connection error:', connectionError);
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message,
      });
    }

    // Get total count of records
    const { count, error: countError } = await supabase
      .from('oferta_academica')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count query error:', countError);
      return res.status(500).json({
        success: false,
        error: 'Count query failed',
        details: countError.message,
      });
    }

    // Get a sample of records
    const { data: sampleData, error: sampleError } = await supabase
      .from('oferta_academica')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('❌ Sample query error:', sampleError);
      return res.status(500).json({
        success: false,
        error: 'Sample query failed',
        details: sampleError.message,
      });
    }

    // Get table structure via RPC if available (optional)
    let tableInfo: any = null;
    let tableError: any = null;
    try {
      const rpcRes = await supabase.rpc('get_table_info', {
        table_name: 'oferta_academica',
      });
      tableInfo = rpcRes.data;
      tableError = rpcRes.error;
    } catch (err) {
      tableError = { message: 'RPC not available' } as any;
    }

    console.log('✅ Database status check completed');

    res.json({
      success: true,
      database: {
        connected: true,
        totalRecords: count || 0,
        hasData: (count || 0) > 0,
      },
      sample: {
        count: sampleData?.length || 0,
        data: sampleData || [],
      },
      tableInfo: tableInfo || 'Not available',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Debug endpoint to check environment variables
router.get('/env-status', (req, res) => {
  res.json({
    success: true,
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'not set',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set',
      API_KEY: process.env.API_KEY ? 'set' : 'not set',
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'not set',
      PORT: process.env.PORT || 'not set',
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
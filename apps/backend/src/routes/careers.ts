import { Router } from 'express';
import { supabase } from '../config/supabase';
import { rateLimit, validateApiKey } from '../middleware/auth';
import { NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Apply authentication and rate limiting to all careers routes
router.use(validateApiKey);
router.use(rateLimit);

// GET /api/careers - Get all careers with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('offerings')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/careers/:id - Get specific career by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      throw new NotFoundError('Invalid career ID');
    }

    const { data, error } = await supabase
      .from('offerings')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !data) {
      throw new NotFoundError('Career not found');
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/careers/institution/:institution - Get careers by institution
router.get('/institution/:institution', async (req, res, next) => {
  try {
    const { institution } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('offerings')
      .select('*', { count: 'exact' })
      .eq('institucion', institution)
      .range(offset, offset + limit - 1)
      .order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    next(error);
  }
});

export default router;

import { Router } from 'express';
import { supabase } from '../config/supabase';
import { rateLimit, validateApiKey } from '../middleware/auth';
import { NotFoundError } from '../middleware/errorHandler';

const router = Router();

// Apply authentication and rate limiting to all institutions routes
router.use(validateApiKey);
router.use(rateLimit);

// GET /api/institutions - Get all institutions with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = (page - 1) * limit;

    // Get distinct institutions with their offerings count
    const { data, error, count } = await supabase
      .from('offerings')
      .select('institucion', { count: 'exact' })
      .not('institucion', 'is', null)
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Get unique institutions and count their offerings
    const institutions = await Promise.all(
      Array.from(new Set(data?.map((item) => item.institucion))).map(
        async (institucion) => {
          const { count: offeringsCount } = await supabase
            .from('offerings')
            .select('*', { count: 'exact', head: true })
            .eq('institucion', institucion);

          return {
            name: institucion,
            offeringsCount: offeringsCount || 0,
          };
        }
      )
    );

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: institutions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/institutions/:name - Get specific institution by name
router.get('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!name) {
      throw new NotFoundError('Institution name is required');
    }

    const { data, error, count } = await supabase
      .from('offerings')
      .select('*', { count: 'exact' })
      .eq('institucion', name)
      .order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new NotFoundError('Institution not found');
    }

    // Get institution statistics
    const modalidades = Array.from(new Set(data.map((item) => item.modalidad)));
    const niveles = Array.from(new Set(data.map((item) => item.nivel)));
    const areas = Array.from(new Set(data.map((item) => item.area)));

    const institution = {
      name,
      offeringsCount: count || 0,
      offerings: data,
      statistics: {
        modalidades,
        niveles,
        areas,
      },
    };

    res.json({
      success: true,
      data: institution,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

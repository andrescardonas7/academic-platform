import { Router } from 'express';
import { supabase } from '../config/supabase';
import { rateLimit, validateApiKey } from '../middleware/auth';
import { NotFoundError } from '../middleware/errorHandler';
import { validateSearchQuery } from '../middleware/validation';
import { SearchService } from '../services/SearchService';

const router = Router();
const searchService = new SearchService();

// Apply authentication and rate limiting to all search routes
router.use(validateApiKey); // Reactivado para producción
router.use(rateLimit);

// GET /api/search - Search offerings with filters and pagination
router.get('/', validateSearchQuery, async (req, res, next) => {
  try {
    console.log('GET /api/search params:', req.query); // Log de depuración
    const filters = {
      q: req.query.q as string,
      modalidad: req.query.modalidad as string,
      institucion: req.query.institucion as string,
      nivel: req.query.nivel as string,
      area: req.query.area as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
      sortBy: (req.query.sortBy as string) || 'nombre',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    };

    console.log('🔍 [ROUTE] About to call searchService.searchOfferings with filters:', filters);
    const result = await searchService.searchOfferings(filters);
    console.log('🔍 [ROUTE] SearchService returned:', { 
      dataLength: result.data?.length || 0,
      total: result.pagination?.total || 0,
      hasData: !!result.data?.length 
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/search/offerings - Search offerings (alias for root search)
router.get('/offerings', validateSearchQuery, async (req, res, next) => {
  try {
    console.log('GET /api/search/offerings params:', req.query); // Log de depuración
    const filters = {
      q: req.query.q as string,
      modalidad: req.query.modalidad as string,
      institucion: req.query.institucion as string,
      nivel: req.query.nivel as string,
      area: req.query.area as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
      sortBy: (req.query.sortBy as string) || 'nombre',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    };

    console.log('🔍 [ROUTE] About to call searchService.searchOfferings with filters:', filters);
    const result = await searchService.searchOfferings(filters);
    console.log('🔍 [ROUTE] SearchService returned:', { 
      dataLength: result.data?.length || 0,
      total: result.pagination?.total || 0,
      hasData: !!result.data?.length 
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res, next) => {
  try {
    console.log('GET /api/search/filters called'); // Log de depuración
    const filterOptions = await searchService.getFilterOptions();

    res.json({
      success: true,
      data: filterOptions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/search/:id - Get specific offering by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      throw new NotFoundError('Invalid offering ID');
    }

    const offering = await searchService.getOfferingById(parseInt(id));

    res.json({
      success: true,
      data: offering,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

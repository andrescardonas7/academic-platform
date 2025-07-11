import { Router } from 'express';
import { authRoutes } from './auth';
import { careersRoutes } from './careers';
import { institutionsRoutes } from './institutions';
import { searchRoutes } from './search';

const router = Router();

// API Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    name: 'Academic Platform API',
    version: '1.0.0',
    description: 'API for academic platform - search and compare institutions and careers',
    endpoints: {
      institutions: '/api/institutions',
      careers: '/api/careers',
      search: '/api/search',
      auth: '/api/auth'
    },
    documentation: 'https://academic-platform.com/docs'
  });
});

// Mount routes
router.use('/institutions', institutionsRoutes);
router.use('/careers', careersRoutes);
router.use('/search', searchRoutes);
router.use('/auth', authRoutes);

export { router as apiRoutes };

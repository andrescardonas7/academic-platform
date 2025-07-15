import { Router } from 'express';
import careersRoutes from './careers';
import chatbotRoutes from './chatbot';
import institutionsRoutes from './institutions';
import searchRoutes from './search';

const router = Router();

// API Routes
router.use('/search', searchRoutes);
router.use('/careers', careersRoutes);
router.use('/institutions', institutionsRoutes);
router.use('/chatbot', chatbotRoutes);

// Health check endpoint (no authentication required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Academic Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Academic Platform API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      search: {
        search: 'GET /api/search',
        filters: 'GET /api/search/filters',
        byId: 'GET /api/search/:id',
      },
      careers: {
        list: 'GET /api/careers',
        byId: 'GET /api/careers/:id',
        byInstitution: 'GET /api/careers/institution/:institution',
      },
      institutions: {
        list: 'GET /api/institutions',
        byName: 'GET /api/institutions/:name',
      },
      chatbot: {
        message: 'POST /api/chatbot/message',
        health: 'GET /api/chatbot/health',
      },
    },
    authentication: {
      required: true,
      method: 'API Key',
      header: 'x-api-key',
    },
  });
});

export default router;

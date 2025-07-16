import { Router } from 'express';
import { rateLimit, validateApiKey } from '../middleware/auth';
import { ValidationError } from '../middleware/errorHandler';
import { validateChatMessage } from '../middleware/validation';
import { CerebrasService } from '../services/CerebrasService';

const router = Router();
const cerebrasService = new CerebrasService();

// Apply authentication and rate limiting to all chatbot routes
router.use(validateApiKey);
router.use(rateLimit);

// POST /api/chatbot/message - Send message to chatbot
router.post('/message', validateChatMessage, async (req, res, next) => {
  try {
    console.log('🔍 Chatbot route hit - Request body:', req.body);
    console.log('🔍 Headers:', req.headers);

    const { message, context } = req.body;

    if (!message || message.trim().length === 0) {
      throw new ValidationError('Message is required');
    }

    console.log('🔍 About to call cerebrasService.sendMessage');
    const response = await cerebrasService.sendMessage(message, context);
    console.log('🔍 Response from cerebrasService:', response);

    const result = {
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('🔍 Sending response:', result);
    res.json(result);
  } catch (error) {
    console.log('🔍 Error in chatbot route:', error);
    next(error);
  }
});

// GET /api/chatbot/health - Health check for chatbot service
router.get('/health', async (req, res, next) => {
  try {
    const isHealthy = await cerebrasService.checkHealth();

    res.json({
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

// import bcrypt from 'bcryptjs'; // TODO: Usar cuando implementemos auth con Supabase
import { Request, Response, Router } from 'express';
// import jwt from 'jsonwebtoken'; // TODO: Usar cuando implementemos auth con Supabase
import { ErrorHandler } from '../utils/ErrorHandler';

const router = Router();

// POST /api/auth/login - User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // TODO: Implementar autenticación con Supabase
    return res.status(501).json({
      success: false,
      error: 'Authentication with Supabase not implemented yet',
    });
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    ErrorHandler.logError(appError, 'auth.login');
    res.status(appError.statusCode).json({
      success: false,
      error: appError.message,
    });
  }
});

// POST /api/auth/register - User registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and password are required',
      });
    }

    // TODO: Implementar registro con Supabase
    return res.status(501).json({
      success: false,
      error: 'Registration with Supabase not implemented yet',
    });
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    ErrorHandler.logError(appError, 'auth.register');
    res.status(appError.statusCode).json({
      success: false,
      error: appError.message,
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    // TODO: Implement JWT verification middleware
    res.json({
      success: true,
      user: {
        id: 1,
        email: 'user@example.com',
        name: 'Sample User',
      },
    });
  } catch (error) {
    const appError = ErrorHandler.handle(error);
    ErrorHandler.logError(appError, 'auth.profile');
    res.status(appError.statusCode).json({
      success: false,
      error: appError.message,
    });
  }
});

export { router as authRoutes };

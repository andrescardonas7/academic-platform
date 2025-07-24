import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
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

    // Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generar JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
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

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
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

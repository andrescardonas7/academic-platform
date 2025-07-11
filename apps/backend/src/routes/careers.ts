import { Request, Response, Router } from 'express';

const router = Router();

// GET /api/careers - Get all careers with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query
    const careers = [
      {
        id: 1,
        name: 'Ingeniería de Sistemas',
        category: 'Engineering',
        duration: 10,
        description: 'Carrera enfocada en desarrollo de software y sistemas',
        requirements: ['Matemáticas', 'Física', 'Lógica'],
        institutions: [
          { id: 1, name: 'Universidad Nacional' },
          { id: 2, name: 'Pontificia Javeriana' }
        ]
      },
      {
        id: 2,
        name: 'Medicina',
        category: 'Health',
        duration: 12,
        description: 'Carrera para formar profesionales de la salud',
        requirements: ['Biología', 'Química', 'Física'],
        institutions: [
          { id: 1, name: 'Universidad Nacional' },
          { id: 3, name: 'Universidad del Rosario' }
        ]
      }
    ];

    res.json({
      success: true,
      data: careers,
      total: careers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching careers'
    });
  }
});

// GET /api/careers/:id - Get career by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Implement database query
    const career = {
      id: parseInt(id),
      name: 'Ingeniería de Sistemas',
      category: 'Engineering',
      duration: 10,
      description: 'Carrera enfocada en desarrollo de software y sistemas',
      requirements: ['Matemáticas', 'Física', 'Lógica'],
      curriculum: [
        'Programación Básica',
        'Estructuras de Datos',
        'Algoritmos',
        'Bases de Datos',
        'Ingeniería de Software'
      ],
      institutions: [
        { id: 1, name: 'Universidad Nacional', tuition: 1500000 },
        { id: 2, name: 'Pontificia Javeriana', tuition: 12000000 }
      ]
    };

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching career'
    });
  }
});

export { router as careersRoutes };

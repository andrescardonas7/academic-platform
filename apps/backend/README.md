# Academic Platform Backend

API backend for the Academic Platform - a comprehensive web application for searching and comparing academic institutions and careers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm 8+

### Installation & Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Health Check
- **GET** `/health` - Service health status

### Institutions
- **GET** `/api/institutions` - List all institutions
- **GET** `/api/institutions/:id` - Get institution details

### Careers
- **GET** `/api/careers` - List all careers
- **GET** `/api/careers/:id` - Get career details

### Search
- **POST** `/api/search` - Advanced search
- **GET** `/api/search/suggestions` - Search suggestions

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration
- **GET** `/api/auth/profile` - User profile

## 🛠️ Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage

### Database Scripts
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   ├── database.ts  # Database connection
│   └── index.ts     # App configuration
├── controllers/     # Route controllers
├── middleware/      # Express middleware
│   ├── errorHandler.ts
│   ├── notFoundHandler.ts
│   └── auth.ts
├── routes/          # API routes
│   ├── index.ts
│   ├── institutions.ts
│   ├── careers.ts
│   ├── search.ts
│   └── auth.ts
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── scripts/         # Database scripts
└── server.ts        # Main application file
```

## 🗄️ Database Schema

The backend uses PostgreSQL with Prisma ORM. Main entities:

- **Institution** - Academic institutions
- **Career** - Academic programs/careers
- **User** - Platform users
- **Review** - Institution/career reviews
- **Comparison** - Saved comparisons

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 🧪 Testing

The project uses Jest for testing. Test files are located in `__tests__` directories.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker
```bash
docker build -t academic-platform-backend .
docker run -p 3001:3001 academic-platform-backend
```

## 🔧 Development

### Adding New Routes
1. Create route file in `src/routes/`
2. Add controller logic
3. Update `src/routes/index.ts`
4. Add tests

### Database Changes
1. Update Prisma schema
2. Generate migration: `pnpm db:migrate`
3. Update seed script if needed

## 📈 Monitoring & Logging

- Request logging via Morgan
- Error tracking and reporting
- Health check endpoint at `/health`
- Database connection monitoring

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation
4. Run linting and type checking before commits

## 📄 License

MIT License - see LICENSE file for details

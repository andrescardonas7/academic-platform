# 🚀 GUÍA DE IMPLEMENTACIÓN PASO A PASO

## 📋 PREREQUISITOS

### Herramientas Necesarias
```bash
# Node.js y pnpm
node --version  # v18+
pnpm --version  # v8+

# Git
git --version

# VS Code (recomendado)
code --version
```

### Extensiones VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier

---

## 🛠️ IMPLEMENTACIÓN DÍA A DÍA

### DÍA 1: Setup Inicial Completo

#### 1. Verificar estructura actual
```bash
cd /Users/andrescardona/Documents/PROYECTOS\ DE\ PROGRAMACION/academic-platform
tree -I node_modules
```

#### 2. Instalar dependencias del workspace
```bash
pnpm install
```

#### 3. Crear estructura de Backend
```bash
# Crear directorio backend
mkdir -p apps/backend/src/{routes,controllers,services,middleware,utils,types}
mkdir -p apps/backend/tests/{unit,integration,e2e}

# Crear package.json para backend
cat > apps/backend/package.json << 'EOF'
{
  "name": "@academic/backend",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:unit": "vitest --run src/**/*.unit.test.ts",
    "test:integration": "vitest --run src/**/*.integration.test.ts",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "db:generate": "pnpm --filter @academic/database db:generate",
    "db:migrate": "pnpm --filter @academic/database db:migrate",
    "db:seed": "pnpm --filter @academic/database db:seed",
    "db:studio": "pnpm --filter @academic/database db:studio"
  },
  "dependencies": {
    "@academic/shared-types": "workspace:*",
    "@academic/database": "workspace:*",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.7.0"
  },
  "devDependencies": {
    "@academic/tsconfig": "workspace:*",
    "@academic/eslint-config": "workspace:*",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",
    "vitest": "^1.1.0",
    "nodemon": "^3.0.2"
  }
}
EOF
```

#### 4. Crear estructura de Frontend
```bash
# Crear directorio frontend
mkdir -p apps/frontend

# Crear Next.js app
cd apps/frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack

# Agregar dependencias específicas
pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand @academic/shared-types @academic/ui @academic/api-client

# Volver al root
cd ../..
```

#### 5. Configurar TypeScript configs compartidos
```bash
# Crear configuración base para Node.js
cat > packages/tsconfig/node.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Actualizar configuración React
cat > packages/tsconfig/react.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "types": ["react", "react-dom"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
```

### DÍA 2: Backend API Base

#### 1. Crear archivo principal del backend
```bash
cat > apps/backend/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'academic-platform-api'
  });
});

// API routes
app.use('/api', (req, res) => {
  res.json({ message: 'Academic Platform API v1.0.0' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
EOF
```

#### 2. Crear archivo de configuración TypeScript para backend
```bash
cat > apps/backend/tsconfig.json << 'EOF'
{
  "extends": "@academic/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

#### 3. Crear variables de entorno para backend
```bash
cat > apps/backend/.env.example << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Security
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-api-key
EOF

# Copiar a .env real
cp apps/backend/.env.example apps/backend/.env
```

### DÍA 3: Frontend Setup Avanzado

#### 1. Configurar API client en frontend
```bash
mkdir -p apps/frontend/src/lib

cat > apps/frontend/src/lib/api.ts << 'EOF'
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
);
EOF
```

#### 2. Configurar React Query en frontend
```bash
cat > apps/frontend/src/lib/query-client.ts << 'EOF'
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
EOF
```

#### 3. Actualizar layout root de frontend
```bash
cat > apps/frontend/src/app/layout.tsx << 'EOF'
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
EOF
```

#### 4. Crear variables de entorno para frontend
```bash
cat > apps/frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Academic Platform"
EOF
```

### DÍA 4: Shared Types y Database

#### 1. Crear tipos compartidos
```bash
mkdir -p packages/shared-types/src/{api,database,common}

cat > packages/shared-types/src/index.ts << 'EOF'
// Re-export all types
export * from './api';
export * from './database';
export * from './common';
EOF

cat > packages/shared-types/src/database/index.ts << 'EOF'
export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  description: string | null;
  website: string | null;
  logo: string | null;
  address: string | null;
  city: string;
  state: string;
  country: string;
  phone: string | null;
  email: string | null;
  accredited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Career {
  id: string;
  name: string;
  description: string | null;
  field: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  title: string;
  modality: Modality;
  duration: number;
  price: number | null;
  currency: string;
  schedule: string | null;
  startDate: Date | null;
  programUrl: string | null;
  isActive: boolean;
  institutionId: string;
  careerId: string;
  createdAt: Date;
  updatedAt: Date;
  institution?: Institution;
  career?: Career;
}

export enum InstitutionType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  MIXED = 'MIXED'
}

export enum Modality {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  HIBRIDA = 'HIBRIDA'
}
EOF

cat > packages/shared-types/src/api/index.ts << 'EOF'
import { Program, Modality } from '../database';

export interface SearchRequest {
  query: string;
  filters?: {
    modality?: Modality[];
    cities?: string[];
    priceRange?: [number, number];
    duration?: number;
  };
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: 'price' | 'duration' | 'relevance';
    direction: 'asc' | 'desc';
  };
}

export interface SearchResponse {
  data: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  facets: {
    cities: { name: string; count: number }[];
    modalities: { name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
  };
  meta: {
    totalResults: number;
    searchTime: number;
    query: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
EOF
```

#### 2. Crear esquema Prisma
```bash
mkdir -p packages/database/prisma

cat > packages/database/prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Institution {
  id          String          @id @default(cuid())
  name        String
  type        InstitutionType
  description String?
  website     String?
  logo        String?
  address     String?
  city        String
  state       String
  country     String          @default("Colombia")
  phone       String?
  email       String?
  accredited  Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  programs Program[]

  @@map("institutions")
}

model Career {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  field       String
  keywords    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  programs Program[]

  @@map("careers")
}

model Program {
  id           String     @id @default(cuid())
  title        String
  modality     Modality
  duration     Int
  price        Float?
  currency     String     @default("COP")
  schedule     String?
  startDate    DateTime?
  programUrl   String?
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  institution   Institution @relation(fields: [institutionId], references: [id])
  institutionId String
  career        Career      @relation(fields: [careerId], references: [id])
  careerId      String

  @@map("programs")
}

enum InstitutionType {
  PUBLIC
  PRIVATE
  MIXED
}

enum Modality {
  PRESENCIAL
  VIRTUAL
  HIBRIDA
}
EOF
```

### Comandos para verificar el setup

#### 1. Instalar todas las dependencias
```bash
pnpm install
```

#### 2. Build de todos los packages
```bash
pnpm build
```

#### 3. Ejecutar en desarrollo
```bash
# Terminal 1 - Backend
pnpm --filter @academic/backend dev

# Terminal 2 - Frontend
pnpm --filter @academic/frontend dev
```

#### 4. Verificar que funciona
```bash
# Verificar backend
curl http://localhost:3001/health

# Verificar frontend
open http://localhost:3000
```

---

## 🔍 VERIFICACIÓN DE ÉXITO

### Backend funcionando ✅
- [ ] Server corriendo en puerto 3001
- [ ] Health check responde correctamente
- [ ] No errores en consola
- [ ] CORS configurado para frontend

### Frontend funcionando ✅
- [ ] App corriendo en puerto 3000
- [ ] React Query configurado
- [ ] No errores de build
- [ ] Puede conectar con backend

### Integración funcionando ✅
- [ ] Frontend puede llamar API backend
- [ ] Shared types funcionando
- [ ] No errores de CORS
- [ ] Development tools funcionando

---

## 🐛 TROUBLESHOOTING COMÚN

### Error: "Module not found"
```bash
pnpm install
pnpm build
```

### Error: "Port already in use"
```bash
# Cambiar puerto en .env
PORT=3002
```

### Error: CORS policy
```bash
# Verificar FRONTEND_URL en backend/.env
FRONTEND_URL=http://localhost:3000
```

### Error: TypeScript types
```bash
# Reinstalar types
pnpm --filter @academic/shared-types build
```

---

**[Inferencia]** Esta guía proporciona pasos específicos y comandos verificables para implementar la arquitectura separada, minimizando errores de configuración y maximizando la productividad del desarrollo.

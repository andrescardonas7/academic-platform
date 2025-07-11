# 🏗️ ARQUITECTURA TÉCNICA SEPARADA - Frontend & Backend

## 📋 DECISIONES ARQUITECTÓNICAS

### ¿Por qué separar Frontend y Backend?

1. **Escalabilidad Independiente**: Cada servicio puede escalar según sus necesidades específicas
2. **Flexibilidad de Deployment**: Deploy independiente, rollbacks granulares
3. **Team Scaling**: Equipos especializados pueden trabajar de manera independiente
4. **Technology Flexibility**: Futuro cambio de tecnologías sin afectar el otro servicio
5. **API-First**: API reutilizable para múltiples clientes (web, mobile, terceros)

---

## 🎯 COMUNICACIÓN ENTRE SERVICIOS

### Frontend → Backend
```typescript
// API Client Configuration
// packages/api-client/src/client.ts
export const apiClient = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// React Query Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
});
```

### API Contracts (Shared Types)
```typescript
// packages/shared-types/src/api/search.ts
export interface SearchRequest {
  query: string;
  filters: {
    modality?: Modality[];
    cities?: string[];
    priceRange?: [number, number];
    duration?: number;
  };
  pagination: {
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
  pagination: PaginationMeta;
  facets: SearchFacets;
  meta: {
    totalResults: number;
    searchTime: number;
    query: string;
  };
}
```

---

## 🚀 BACKEND ARCHITECTURE

### Estructura del Backend
```
apps/backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts               # Express app setup
│   ├── config/              # Configuration
│   │   ├── database.ts      # DB config
│   │   ├── env.ts          # Environment variables
│   │   └── cors.ts         # CORS settings
│   ├── routes/              # API Routes
│   │   ├── index.ts        # Route aggregator
│   │   ├── search.ts       # Search endpoints
│   │   ├── careers.ts      # Career endpoints
│   │   ├── institutions.ts # Institution endpoints
│   │   └── health.ts       # Health check
│   ├── controllers/         # Business Logic
│   │   ├── SearchController.ts
│   │   ├── CareerController.ts
│   │   └── InstitutionController.ts
│   ├── services/           # Data Services
│   │   ├── SearchService.ts
│   │   ├── CareerService.ts
│   │   ├── InstitutionService.ts
│   │   └── CacheService.ts
│   ├── middleware/         # Express Middleware
│   │   ├── auth.ts        # Authentication
│   │   ├── validation.ts  # Request validation
│   │   ├── rateLimit.ts   # Rate limiting
│   │   └── errorHandler.ts
│   ├── utils/             # Utilities
│   │   ├── logger.ts      # Winston logger
│   │   ├── validator.ts   # Data validation
│   │   └── constants.ts   # App constants
│   └── types/             # Backend-specific types
│       ├── express.ts
│       └── services.ts
├── prisma/                # Database
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # DB migrations
│   └── seed.ts          # Seed data
├── tests/                # Backend tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Dockerfile           # Container config
├── .env.example        # Environment template
└── package.json
```

### API Endpoints Design
```typescript
// Backend API Structure
const apiRoutes = {
  // Search & Discovery
  'GET /api/search': 'Search programs with filters',
  'GET /api/search/suggestions': 'Autocomplete suggestions',
  'GET /api/search/facets': 'Available filter options',

  // Careers
  'GET /api/careers': 'List all careers',
  'GET /api/careers/:slug': 'Career details',
  'GET /api/careers/:slug/programs': 'Programs for career',

  // Institutions
  'GET /api/institutions': 'List institutions',
  'GET /api/institutions/:id': 'Institution details',
  'GET /api/institutions/:id/programs': 'Institution programs',

  // Programs
  'GET /api/programs/:id': 'Program details',
  'GET /api/programs/compare': 'Compare multiple programs',

  // Analytics (Future)
  'POST /api/analytics/search': 'Track search events',
  'POST /api/analytics/click': 'Track program clicks',

  // Health & Status
  'GET /api/health': 'Service health check',
  'GET /api/status': 'Detailed service status'
};
```

### Database Layer
```typescript
// services/SearchService.ts
export class SearchService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async searchPrograms(params: SearchRequest): Promise<SearchResponse> {
    const { query, filters, pagination, sort } = params;

    const whereClause = this.buildWhereClause(query, filters);
    const orderByClause = this.buildOrderBy(sort);

    const [programs, total] = await Promise.all([
      this.prisma.program.findMany({
        where: whereClause,
        include: {
          career: true,
          institution: true
        },
        orderBy: orderByClause,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      this.prisma.program.count({ where: whereClause })
    ]);

    const facets = await this.calculateFacets(whereClause);

    return {
      data: programs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      },
      facets,
      meta: {
        totalResults: total,
        searchTime: Date.now() - startTime,
        query
      }
    };
  }
}
```

---

## 💻 FRONTEND ARCHITECTURE

### Estructura del Frontend
```
apps/frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── search/         # Search pages
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── career/         # Career detail pages
│   │   │   └── [slug]/
│   │   ├── institution/    # Institution pages
│   │   │   └── [id]/
│   │   ├── compare/        # Comparison tool
│   │   │   └── page.tsx
│   │   ├── api/           # Client-side API utilities
│   │   └── globals.css    # Global styles
│   ├── components/         # React Components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   ├── search/        # Search-specific
│   │   ├── career/        # Career-specific
│   │   └── shared/        # Shared components
│   ├── hooks/             # Custom React Hooks
│   │   ├── useSearch.ts
│   │   ├── useFilters.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── lib/               # Utilities & Configs
│   │   ├── api.ts         # API client instance
│   │   ├── utils.ts       # Utility functions
│   │   ├── constants.ts   # App constants
│   │   └── validations.ts # Form validations
│   ├── store/             # State Management
│   │   ├── search.ts      # Search state (Zustand)
│   │   ├── filters.ts     # Filters state
│   │   └── favorites.ts   # Favorites state
│   └── types/             # Frontend-specific types
│       ├── components.ts
│       └── hooks.ts
├── public/                # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── tests/                 # Frontend tests
│   ├── __mocks__/
│   ├── components/
│   └── pages/
└── package.json
```

### State Management Strategy
```typescript
// store/search.ts - Zustand Store
interface SearchStore {
  // State
  query: string;
  results: Program[];
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  search: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  results: [],
  filters: {},
  isLoading: false,
  error: null,

  setQuery: (query) => set({ query }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  search: async () => {
    const { query, filters } = get();
    set({ isLoading: true, error: null });

    try {
      const results = await searchApi.search({ query, filters });
      set({ results, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
```

### React Query Integration
```typescript
// hooks/useSearch.ts
export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => apiClient.search(params),
    enabled: !!params.query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => ({
      ...data,
      programs: data.programs.map(transformProgram)
    })
  });
}

export function useCareerDetail(slug: string) {
  return useQuery({
    queryKey: ['career', slug],
    queryFn: () => apiClient.getCareer(slug),
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}
```

---

## 🔧 SHARED PACKAGES

### @academic/shared-types
```typescript
// Tipos compartidos entre frontend y backend
export interface Program {
  id: string;
  title: string;
  modality: Modality;
  duration: number;
  price: number | null;
  currency: string;
  programUrl: string | null;
  isActive: boolean;
  career: Career;
  institution: Institution;
  createdAt: Date;
  updatedAt: Date;
}

export enum Modality {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  HIBRIDA = 'HIBRIDA'
}
```

### @academic/api-client
```typescript
// Cliente HTTP reutilizable
export class AcademicApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  async search(params: SearchRequest): Promise<SearchResponse> {
    const response = await this.fetch('/search', {
      method: 'GET',
      params
    });
    return response.json();
  }

  async getCareer(slug: string): Promise<Career> {
    const response = await this.fetch(`/careers/${slug}`);
    return response.json();
  }
}
```

---

## 🚀 DEPLOYMENT STRATEGY

### Development Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./apps/backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:./dev.db
      - PORT=3001
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  frontend:
    build: ./apps/frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules
    depends_on:
      - backend
```

### Production Deployment
- **Frontend**: Vercel (Static + SSR)
- **Backend**: Railway / Render (Container)
- **Database**: PlanetScale / Supabase (PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry + Vercel Analytics

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  backend:
    if: contains(github.event.head_commit.modified, 'apps/backend')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          # Build and deploy backend to Railway

  frontend:
    if: contains(github.event.head_commit.modified, 'apps/frontend')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        run: |
          # Deploy frontend to Vercel
```

---

## 📊 MONITORING & OBSERVABILITY

### Backend Monitoring
- **Logs**: Winston + Structured logging
- **Metrics**: Prometheus + Custom metrics
- **APM**: Sentry performance monitoring
- **Health Checks**: `/health` endpoint

### Frontend Monitoring
- **Analytics**: Vercel Analytics
- **Performance**: Core Web Vitals
- **Errors**: Sentry error tracking
- **User Behavior**: PostHog (opcional)

### Alerting
- **Response Time**: >2s alerts
- **Error Rate**: >5% error rate alerts
- **Database**: Connection issues
- **Deployment**: Failed deployment notifications

---

**[Inferencia]** Esta arquitectura separada está basada en patrones observados en aplicaciones escalables modernas y permite mayor flexibilidad para el crecimiento futuro del producto.

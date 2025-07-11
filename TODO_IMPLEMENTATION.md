# 🚀 TO DO LIST - IMPLEMENTACIÓN ARQUITECTURA SEPARADA

## 📋 SPRINT 1: FUNDACIÓN SEPARADA (Semana 1)

### ✅ DÍA 1: Setup Inicial del Monorepo
- [ ] **PBI-001**: Configuración del monorepo separado
  - [x] ✅ Estructura de carpetas `/apps` y `/packages` creada
  - [x] ✅ Turborepo configurado para frontend/backend separados
  - [ ] Scripts de desarrollo, build y test funcionando independientemente
  - [ ] ESLint y Prettier configurados por separado
  - [ ] Husky hooks para pre-commit

### 🎯 DÍA 2: Backend API Setup
- [ ] **PBI-002**: Setup Backend API con Node.js + Express
  - [ ] Crear estructura `/apps/backend`
  - [ ] Instalar dependencias: Express, Prisma, TypeScript
  - [ ] Configurar server básico con Express
  - [ ] Setup de middleware básico (CORS, JSON parser)
  - [ ] Configurar variables de entorno
  - [ ] Health check endpoint funcional

**Comandos para ejecutar:**
```bash
cd apps/backend
npm init -y
npm install express cors helmet morgan compression
npm install -D @types/express @types/cors @types/node typescript tsx nodemon
npm install prisma @prisma/client
npm install dotenv
```

### 💻 DÍA 3: Frontend Next.js Setup
- [ ] **PBI-003**: Setup Frontend Next.js (solo cliente)
  - [ ] Crear estructura `/apps/frontend`
  - [ ] Instalar Next.js 15 con TypeScript
  - [ ] Configurar Tailwind CSS + shadcn/ui
  - [ ] Setup inicial de componentes base
  - [ ] Configurar variables de entorno para API URL
  - [ ] Página home básica funcionando

**Comandos para ejecutar:**
```bash
cd apps/frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
npm install @tanstack/react-query zustand
npx shadcn-ui@latest init
```

### 📦 DÍA 4: Shared Packages
- [ ] **PBI-004**: Configuración de shared packages
  - [x] ✅ Package `@academic/shared-types`
  - [x] ✅ Package `@academic/ui`
  - [x] ✅ Package `@academic/api-client`
  - [x] ✅ Package `@academic/database`
  - [x] ✅ Package `@academic/eslint-config`
  - [ ] Configurar builds de packages
  - [ ] Testear importación entre apps

### 🗄️ DÍA 5: Base de Datos y Integración
- [ ] **PBI-005**: Setup de base de datos y esquemas Prisma
  - [ ] Mover esquema Prisma a `/packages/database`
  - [ ] Configurar conexión desde backend
  - [ ] Crear migraciones iniciales
  - [ ] Script de seed básico
  - [ ] Testear conexión backend → database

- [ ] **PBI-006**: Configuración de CI/CD para ambos servicios
  - [ ] GitHub Actions para backend
  - [ ] GitHub Actions para frontend
  - [ ] Deploy separado (Railway + Vercel)
  - [ ] Variables de entorno en CI/CD

---

## 🔧 SPRINT 2: API Y COMUNICACIÓN (Semana 2)

### 🔍 DÍA 6-7: Backend API Development
- [ ] **PBI-007**: Modelo de datos y seed inicial (backend)
  - [ ] Definir modelos completos en Prisma
  - [ ] Crear seed data con 100+ programas reales
  - [ ] Implementar servicios de datos
  - [ ] Testing de base de datos

- [ ] **PBI-008**: API REST de búsqueda con filtros (backend)
  - [ ] Endpoint `GET /api/search`
  - [ ] Endpoint `GET /api/search/suggestions`
  - [ ] Endpoint `GET /api/careers/:slug`
  - [ ] Endpoint `GET /api/institutions/:id`
  - [ ] Implementar filtros y paginación
  - [ ] Documentar API con Swagger/OpenAPI

### 🌐 DÍA 8-9: Frontend API Integration
- [ ] **PBI-009**: API Client y React Query setup (frontend)
  - [ ] Configurar API client en `/packages/api-client`
  - [ ] Setup React Query en frontend
  - [ ] Crear hooks personalizados (useSearch, useCareer)
  - [ ] Manejo de estados de carga y error
  - [ ] Testing de integración API

- [ ] **PBI-010**: Componente de búsqueda con autocompletado (frontend)
  - [ ] Componente SearchForm principal
  - [ ] Autocompletado con debounce
  - [ ] Sugerencias dropdown
  - [ ] Navegación por teclado

### 🎨 DÍA 10: UI y Filtros
- [ ] **PBI-011**: Sistema de filtros UI (frontend)
  - [ ] Componentes de filtro (modality, price, location)
  - [ ] State management con Zustand
  - [ ] Sincronización filtros ↔ URL
  - [ ] Mobile responsive filters

---

## ⚡ SPRINT 3: VISUALIZACIÓN Y DETALLE (Semana 3)

### 📊 DÍA 11-12: Backend Extensions
- [ ] **PBI-012**: API endpoints para detalles y comparación (backend)
  - [ ] Endpoint `GET /api/programs/:id`
  - [ ] Endpoint `GET /api/programs/compare`
  - [ ] Endpoint `GET /api/search/facets`
  - [ ] Optimización de queries con includes
  - [ ] Caching con Redis (opcional)

### 🎨 DÍA 13-15: Frontend UI Development
- [ ] **PBI-013**: Página de resultados con grid responsivo (frontend)
  - [ ] Grid layout responsivo
  - [ ] Skeleton loading states
  - [ ] Paginación infinita o por páginas
  - [ ] Sort options

- [ ] **PBI-014**: Cards de instituciones (frontend)
  - [ ] Diseño de ProgramCard component
  - [ ] Información clara y completa
  - [ ] Hover effects y microinteracciones
  - [ ] Links a páginas de detalle

- [ ] **PBI-015**: Página de detalle de carrera (frontend)
  - [ ] Layout de página de detalle
  - [ ] Tabla comparativa de instituciones
  - [ ] Breadcrumbs y navegación
  - [ ] SEO optimization

- [ ] **PBI-016**: Comparador de instituciones (frontend)
  - [ ] Selección múltiple de programas
  - [ ] Vista de comparación lado a lado
  - [ ] Export a PDF/Excel (opcional)

---

## 🚀 COMANDOS RÁPIDOS PARA DESARROLLO

### Desarrollo Local
```bash
# Instalar dependencias
pnpm install

# Desarrollo (ambos servicios)
pnpm dev

# Solo backend
pnpm --filter @academic/backend dev

# Solo frontend
pnpm --filter @academic/frontend dev

# Build todo
pnpm build

# Lint todo
pnpm lint

# Tests
pnpm test
```

### Base de Datos
```bash
# Generar cliente Prisma
pnpm --filter @academic/database db:generate

# Crear migración
pnpm --filter @academic/database db:migrate

# Ejecutar seed
pnpm --filter @academic/database db:seed

# Abrir Prisma Studio
pnpm --filter @academic/database db:studio
```

### Deploy
```bash
# Deploy backend (Railway)
railway deploy

# Deploy frontend (Vercel)
vercel deploy
```

---

## 📊 DEFINITION OF DONE - ARQUITECTURA SEPARADA

### Backend Ready ✅
- [ ] API REST funcionando en puerto 3001
- [ ] Base de datos conectada y funcionando
- [ ] Al menos 3 endpoints principales implementados
- [ ] Documentación de API disponible
- [ ] Tests unitarios básicos
- [ ] Deploy exitoso en Railway/Render

### Frontend Ready ✅
- [ ] App Next.js funcionando en puerto 3000
- [ ] Comunicación exitosa con backend API
- [ ] UI básica implementada (búsqueda + resultados)
- [ ] State management configurado
- [ ] Responsive design básico
- [ ] Deploy exitoso en Vercel

### Integration Ready ✅
- [ ] Frontend consume API backend correctamente
- [ ] Shared types funcionando entre apps
- [ ] Error handling implementado
- [ ] Loading states funcionando
- [ ] CORS configurado correctamente
- [ ] Environment variables configuradas

---

## 🎯 MÉTRICAS DE ÉXITO

### Performance Targets
- **Backend API**: Response time <500ms
- **Frontend**: First Contentful Paint <2s
- **Database**: Query time <100ms
- **Build**: Total build time <5min

### Quality Targets
- **Test Coverage**: >80% en backend
- **Type Safety**: 100% TypeScript strict
- **Linting**: 0 ESLint errors
- **Accessibility**: Basic WCAG AA

---

## 🔧 ARQUITECTURA DE COMUNICACIÓN

### Frontend → Backend
```typescript
// API Client (packages/api-client)
export class AcademicApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async search(params: SearchParams): Promise<SearchResponse> {
    const response = await fetch(`${this.baseURL}/api/search`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
}
```

### Backend API Structure
```typescript
// Backend Routes (apps/backend/src/routes)
const routes = {
  'GET /api/health': 'Health check',
  'GET /api/search': 'Search programs',
  'GET /api/careers/:slug': 'Career details',
  'GET /api/institutions/:id': 'Institution details',
  'GET /api/programs/:id': 'Program details'
};
```

### Shared Types
```typescript
// Shared Types (packages/shared-types)
export interface Program {
  id: string;
  title: string;
  modality: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
  duration: number;
  price: number | null;
  institution: Institution;
  career: Career;
}
```

---

## 🐛 TROUBLESHOOTING COMÚN

### Error: "Cannot resolve module @academic/xxx"
```bash
# Rebuild packages
pnpm build
pnpm --filter @academic/shared-types build
```

### Error: "CORS policy"
```bash
# Verificar en backend .env
FRONTEND_URL=http://localhost:3000
```

### Error: "Database connection"
```bash
# Verificar Prisma
pnpm --filter @academic/database db:generate
```

### Error: "Port already in use"
```bash
# Backend
PORT=3002 pnpm --filter @academic/backend dev

# Frontend
PORT=3001 pnpm --filter @academic/frontend dev
```

---

**[Inferencia]** Esta lista está priorizada para maximizar el valor entregado desde el primer día con arquitectura separada, permitiendo iteraciones rápidas y feedback temprano del MVP.

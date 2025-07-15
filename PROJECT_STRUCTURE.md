# 🎓 Academic Platform - Estructura del Proyecto

## Visión del Proyecto

**Plataforma centralizada para búsqueda de oferta académica de Cartago, Valle** que permite a los usuarios buscar carreras y comparar instituciones en un solo lugar.

## ROL DEL DESARROLLADOR

Senior Web Developer con +15 años de experiencia aplicando metodologías modernas: PBI, To Do organizadas por prioridades, arquitectura escalable, UI/UX 2025, y estructura modular.

## OBJETIVO PRINCIPAL

Desarrollar una web app que integre toda la oferta académica de un país/región, permitiendo búsqueda por carrera y comparación de instituciones con información completa.

## INFORMACIÓN MOSTRADA POR CARRERA

- ✅ Nombre de la institución
- ✅ Modalidad (presencial, virtual, híbrida)
- ✅ Precio
- ✅ Duración
- ✅ Enlace al sitio oficial o página del programa

## PROPÓSITO

- ⚡ Acceso inmediato y comparativo
- 🔍 Eliminar fricción de búsqueda universidad por universidad
- 📊 Mejorar toma de decisiones con información centralizada
- 📱 Experiencia de usuario moderna y accesible

---

## 🏗️ ARQUITECTURA TÉCNICA SEPARADA

### Stack Seleccionado

#### Frontend

- **Framework**: Next.js 15 (App Router) - Solo Frontend
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI
- **State Management**: Zustand + TanStack Query
- **Hosting**: Vercel

#### Backend

- **Framework**: Node.js + Express.js / Fastify
- **Database**: SQLite + Prisma ORM (MVP) → PostgreSQL (Scaling)
- **API**: REST + GraphQL (opcional)
- **Authentication**: NextAuth.js / Supabase Auth
- **Hosting**: Railway / Render / DigitalOcean

#### Infraestructura

- **Monorepo**: Turborepo + pnpm
- **Container**: Docker (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Vercel Analytics

### Estructura del Monorepo Separado

```
academic-platform/
├── apps/
│   ├── frontend/               # Next.js App (Solo Frontend)
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/    # React Components
│   │   │   ├── hooks/         # Custom Hooks
│   │   │   ├── lib/          # Utilities & API Client
│   │   │   └── types/        # Frontend Types
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── backend/               # Node.js API Server
│   │   ├── src/
│   │   │   ├── routes/       # API Routes
│   │   │   ├── controllers/  # Business Logic
│   │   │   ├── services/     # Data Services
│   │   │   ├── middleware/   # Express Middleware
│   │   │   ├── utils/        # Backend Utilities
│   │   │   └── types/        # Backend Types
│   │   ├── prisma/           # Database Schema
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── admin/                 # Admin Dashboard (Future)
│   │   ├── src/
│   │   └── package.json
│   │
│   └── mobile/                # React Native App (Future)
│       ├── src/
│       └── package.json
│
├── packages/
│   ├── shared-types/          # TypeScript Definitions Compartidas
│   │   ├── src/
│   │   │   ├── api/          # API Response Types
│   │   │   ├── database/     # Database Entity Types
│   │   │   └── common/       # Common Types
│   │   └── package.json
│   │
│   ├── ui/                    # Shared UI Components
│   │   ├── src/
│   │   │   ├── components/   # Reusable Components
│   │   │   ├── hooks/        # Shared Hooks
│   │   │   └── utils/        # UI Utilities
│   │   └── package.json
│   │
│   ├── api-client/            # HTTP Client Library
│   │   ├── src/
│   │   │   ├── clients/      # API Clients
│   │   │   ├── hooks/        # React Query Hooks
│   │   │   └── types/        # Client Types
│   │   └── package.json
│   │
│   ├── database/              # Database Utilities
│   │   ├── src/
│   │   │   ├── schemas/      # Prisma Schemas
│   │   │   ├── migrations/   # Database Migrations
│   │   │   ├── seeds/        # Seed Data
│   │   │   └── utils/        # DB Utilities
│   │   └── package.json
│   │
│   ├── eslint-config/         # ESLint Configurations
│   │   ├── base.js           # Base Config
│   │   ├── react.js          # React Config
│   │   ├── node.js           # Node.js Config
│   │   └── package.json
│   │
│   └── tsconfig/              # TypeScript Configurations
│       ├── base.json         # Base Config
│       ├── react.json        # React Config
│       ├── node.json         # Node.js Config
│       └── package.json
│
├── docs/                      # Documentation
│   ├── api/                  # API Documentation
│   ├── deployment/           # Deployment Guides
│   └── development/          # Development Setup
│
├── tools/                     # Development Tools
│   ├── scripts/              # Build Scripts
│   └── docker/               # Docker Configurations
│
├── .github/                   # GitHub Workflows
│   └── workflows/
│       ├── ci.yml           # Continuous Integration
│       ├── deploy-frontend.yml
│       └── deploy-backend.yml
│
├── package.json               # Root Package
├── turbo.json                # Turborepo Config
├── pnpm-workspace.yaml       # pnpm Workspace
└── docker-compose.yml        # Local Development
```

---

## 📋 PRODUCT BACKLOG ITEMS (PBIs)

### EPIC 1: FUNDACIÓN DEL PROYECTO

**Objetivo**: Establecer la base técnica y estructura del monorepo separado

#### Sprint 1: Setup Inicial (Semana 1)

- **PBI-001**: Configuración del monorepo separado (frontend/backend)
- **PBI-002**: Setup Backend API con Node.js + Express
- **PBI-003**: Setup Frontend Next.js (solo cliente)
- **PBI-004**: Configuración de shared packages (types, ui, api-client)
- **PBI-005**: Setup de base de datos y esquemas Prisma (backend)
- **PBI-006**: Configuración de CI/CD para ambos servicios

### EPIC 2: CORE FEATURES

**Objetivo**: Implementar funcionalidades principales de búsqueda y visualización

#### Sprint 2: Búsqueda y Datos (Semana 2)

- **PBI-007**: Modelo de datos y seed inicial (backend)
- **PBI-008**: API REST de búsqueda con filtros avanzados (backend)
- **PBI-009**: API Client y React Query setup (frontend)
- **PBI-010**: Componente de búsqueda con autocompletado (frontend)
- **PBI-011**: Sistema de filtros UI (frontend)

#### Sprint 3: Visualización y Detalle (Semana 3)

- **PBI-012**: API endpoints para detalles y comparación (backend)
- **PBI-013**: Página de resultados con grid responsivo (frontend)
- **PBI-014**: Cards de instituciones con información completa (frontend)
- **PBI-015**: Página de detalle de carrera (frontend)
- **PBI-016**: Comparador de instituciones (frontend)

### EPIC 3: UX/UI MODERNO

**Objetivo**: Implementar experiencia de usuario nivel 2025

#### Sprint 4: Polish y Experiencia (Semana 4)

- **PBI-017**: Optimización mobile-first (frontend)
- **PBI-018**: Microinteracciones y animaciones (frontend)
- **PBI-019**: Estados de carga y skeleton loaders (frontend)
- **PBI-020**: Accesibilidad WCAG AA (frontend)

#### Sprint 5: SEO y Performance (Semana 5)

- **PBI-021**: SEO dinámico y meta tags (frontend)
- **PBI-022**: Optimización de performance (backend + frontend)
- **PBI-023**: Implementación de Analytics (frontend)
- **PBI-024**: Deploy y configuración de dominio

### EPIC 4: FEATURES AVANZADOS

**Objetivo**: Implementar funcionalidades que agreguen valor único

#### Sprint 6: Comparación Avanzada (Semana 6)

- **PBI-025**: Sistema de favoritos (backend + frontend)
- **PBI-026**: Comparación lado a lado (frontend)
- **PBI-027**: Exportación de resultados (PDF/Excel) (frontend)
- **PBI-028**: Filtros geográficos y mapas (frontend)

#### Sprint 7: Inteligencia Artificial (Semana 7-8)

- **PBI-029**: Integración de chatbot con RAG (backend + frontend)
- **PBI-030**: Recomendaciones personalizadas (backend)
- **PBI-031**: Análisis de tendencias de carreras (backend)
- **PBI-032**: Predicciones de empleabilidad (backend)

### EPIC 5: ADMINISTRACIÓN Y ESCALABILIDAD

**Objetivo**: Herramientas para gestión y crecimiento

#### Sprint 8: Admin Dashboard (Semana 9)

- **PBI-033**: Panel de administración (admin app)
- **PBI-034**: Gestión de instituciones y carreras (admin)
- **PBI-035**: Sistema de validación de datos (backend)
- **PBI-036**: Reportes y analytics internos (admin)

#### Sprint 9: API Pública (Semana 10)

- **PBI-037**: API REST documentada (backend)
- **PBI-038**: Sistema de autenticación (backend)
- **PBI-039**: Rate limiting y monetización (backend)
- **PBI-040**: SDK para terceros (package)

---

## ✅ TO DO LISTS POR PRIORIDAD

### 🔥 PRIORIDAD ALTA (MVP - Semanas 1-3)

1. **[PBI-001]** Setup monorepo separado (frontend/backend)
2. **[PBI-002]** Crear Backend API con Node.js + Express
3. **[PBI-003]** Crear Frontend Next.js (solo cliente)
4. **[PBI-004]** Configurar shared packages y types
5. **[PBI-005]** Setup Prisma y base de datos (backend)
6. **[PBI-007]** Crear seed data para desarrollo (backend)
7. **[PBI-008]** Implementar API de búsqueda (backend)
8. **[PBI-009]** Setup API client con React Query (frontend)
9. **[PBI-010]** Componente de búsqueda principal (frontend)
10. **[PBI-013]** Grid de resultados responsivo (frontend)
11. **[PBI-014]** Cards de instituciones (frontend)
12. **[PBI-015]** Página de detalle de carrera (frontend)

### 🚀 PRIORIDAD MEDIA (Post-MVP - Semanas 4-6)

1. **[PBI-011]** Sistema de filtros avanzados (frontend)
2. **[PBI-016]** Comparador de instituciones (frontend)
3. **[PBI-017]** Optimización mobile (frontend)
4. **[PBI-018]** Microinteracciones (frontend)
5. **[PBI-021]** SEO y meta tags (frontend)
6. **[PBI-022]** Optimización de performance (backend + frontend)
7. **[PBI-025]** Sistema de favoritos (backend + frontend)
8. **[PBI-026]** Comparación lado a lado (frontend)

### 💡 PRIORIDAD BAJA (Futuro - Semanas 7+)

1. **[PBI-029]** ✅ Chatbot con IA (backend + frontend) - COMPLETADO
2. **[PBI-030]** Recomendaciones ML (backend)
3. **[PBI-033]** Admin dashboard (admin app)
4. **[PBI-037]** API pública (backend)
5. **[PBI-027]** Exportación de reportes (frontend)
6. **[PBI-028]** Mapas geográficos (frontend)

---

## 🎯 METODOLOGÍA ÁGIL

### Framework: **Scrum adaptado**

- **Sprints**: 1 semana (iteraciones rápidas)
- **Planning**: Lunes (2h máximo)
- **Daily**: Async via GitHub Issues/Comments
- **Review/Retro**: Viernes (1h)

### Herramientas

- **Project Management**: GitHub Projects
- **Code**: VS Code + GitHub Copilot
- **Design**: Figma (wireframes rápidos)
- **Testing**: Vitest + Playwright
- **Deploy**: Vercel (frontend) + Railway (backend)

---

## 📊 MÉTRICAS DE ÉXITO

### MVP (Semana 3)

- ✅ Búsqueda funcional con >1000 programas
- ✅ Tiempo de carga <2s
- ✅ Mobile responsive 100%
- ✅ Accesibilidad básica A
- ✅ API REST funcionando

### Post-MVP (Semana 6)

- 📈 >100 usuarios únicos/día
- 📈 <1s tiempo de búsqueda
- 📈 >70% engagement en resultados
- 📈 Accesibilidad WCAG AA
- 📈 API response time <500ms

### Escalado (Semana 12)

- 🚀 >1000 usuarios únicos/día
- 🚀 API pública con >10 integraciones
- 🚀 Chatbot con >80% precisión
- 🚀 Revenue model validado

---

## 🔮 ROADMAP FUTURO (v2.0)

1. **Expansión Geográfica**: Multi-país
2. **Marketplace**: Conexión directa con instituciones
3. **Becas y Financiamiento**: Integración con entidades financieras
4. **Comunidad**: Foros y reviews de estudiantes
5. **Mobile App**: React Native/Flutter
6. **Enterprise**: Soluciones B2B para instituciones

---

## 🎨 COMUNICACIÓN FRONTEND ↔ BACKEND

### API Endpoints Principales

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

  // Health & Status
  'GET /api/health': 'Service health check',
  'GET /api/status': 'Detailed service status',
};
```

### Frontend API Client

```typescript
// Frontend API Client
export const apiClient = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,

  async search(params: SearchParams): Promise<SearchResponse> {
    return this.get('/api/search', { params });
  },

  async getCareer(slug: string): Promise<Career> {
    return this.get(`/api/careers/${slug}`);
  },
};
```

---

**[Inferencia]** Este plan está basado en patrones observados en productos similares y mejores prácticas de desarrollo de software separado. Los tiempos estimados pueden variar según la experiencia del equipo y complejidad de la integración de datos.

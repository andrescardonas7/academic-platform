# 🚀 TO DO LIST - IMPLEMENTACIÓN ARQUITECTURA SEPARADA

## 📋 SPRINT 1: FUNDACIÓN SEPARADA (Semana 1)

### ✅ DÍA 1: Setup Inicial del Monorepo

- [ ] **PBI-001 [In Progress]**: Configuración del monorepo separado
  - [x] ✅ Estructura de carpetas `/apps` y `/packages` creada
  - [x] ✅ Turborepo configurado para frontend/backend separados
  - [ ] Scripts de desarrollo, build y test funcionando independientemente
  - [ ] ESLint y Prettier configurados por separado
  - [ ] Husky hooks para pre-commit

### 🎯 DÍA 2: Backend API Setup (OBSOLETO, ver Supabase)

- [ ] **PBI-002 [Obsoleto]**: Setup Backend API con Node.js + Express (SQLite/Prisma)
  - [ ] (Preservado solo como referencia, no continuar desarrollo aquí)

- [ ] **PBI-002-SUPABASE [In Progress]**: Setup Backend API con Supabase
  - [x] Estructura `/apps/backend-supabase` creada
  - [x] Conexión Supabase configurada
  - [x] Health check endpoint funcional
  - [x] Endpoint `/api/oferta-academica` funcional
  - [x] Documentación de variables de entorno para Supabase

### 💻 DÍA 3: Frontend Next.js Setup

- [ ] **PBI-003 [Pending]**: Setup Frontend Next.js (solo cliente)
  - [ ] Crear estructura `/apps/frontend`
  - [ ] Instalar Next.js 15 con TypeScript
  - [ ] Configurar Tailwind CSS + shadcn/ui
  - [ ] Setup inicial de componentes base
  - [ ] Configurar variables de entorno para API URL
  - [ ] Página home básica funcionando

### 📦 DÍA 4: Shared Packages

- [ ] **PBI-004 [In Progress]**: Configuración de shared packages
  - [x] ✅ Package `@academic/shared-types`
  - [x] ✅ Package `@academic/ui`
  - [x] ✅ Package `@academic/api-client`
  - [x] ✅ Package `@academic/database` (obsoleto, solo referencia)
  - [x] ✅ Package `@academic/eslint-config`
  - [ ] Configurar builds de packages
  - [ ] Testear importación entre apps

### 🗄️ DÍA 5: Base de Datos y Integración (OBSOLETO, ver Supabase)

- [ ] **PBI-005 [Obsoleto]**: Setup de base de datos y esquemas Prisma
  - [ ] (Preservado solo como referencia, no continuar desarrollo aquí)

- [ ] **PBI-005-SUPABASE [In Progress]**: Migración de datos y estructura a Supabase
  - [x] Tablas y enums creados en Supabase
  - [x] Datos de ejemplo insertados (seed)
  - [x] Documentación de migración

- [ ] **PBI-006 [Pending]**: Configuración de CI/CD para ambos servicios
  - [ ] GitHub Actions para backend
  - [ ] GitHub Actions para frontend
  - [ ] Deploy separado (Railway + Vercel)
  - [ ] Variables de entorno en CI/CD

---

## 🔧 SPRINT 2: API Y COMUNICACIÓN (Semana 2)

### 🔍 DÍA 6-7: Backend API Development (OBSOLETO, ver Supabase)

- [ ] **PBI-007 [Obsoleto]**: Modelo de datos y seed inicial (backend, Prisma)
  - [ ] (Preservado solo como referencia, no continuar desarrollo aquí)

- [ ] **PBI-008-SUPABASE [Pending]**: API REST de búsqueda y filtros (Supabase)
  - [ ] Endpoint `/api/oferta-academica` con filtros (query params)
  - [ ] Documentar endpoints y ejemplos de uso

### 🌐 DÍA 8-9: Frontend API Integration

- [x] Crear un API client simple en /packages/api-client para consumir el endpoint /api/oferta-academica del backend Supabase.
- [x] Crear un hook personalizado useAcademicOfferings en el frontend que use el API client para obtener los datos de oferta académica.
- [x] Integrar el hook en la página principal del frontend y mostrar los datos en una lista o grid simple.
- [x] Agregar filtros básicos (por modalidad, institución, carrera) en el frontend para filtrar los resultados de oferta académica.
- [x] Documentar el flujo de consumo de datos y dejar claro que el frontend consume Supabase vía backend minimalista.

- [x] **PBI-010 [Done]**: Componente de búsqueda con autocompletado (frontend)
  - [x] Componente SearchForm principal
  - [x] Autocompletado con debounce
  - [x] Sugerencias dropdown
  - [x] Navegación por teclado

### 🎨 DÍA 10: UI y Filtros

- [x] **PBI-011 [Done]**: Sistema de filtros UI (frontend)
  - [x] Componentes de filtro (modalidad, precio, jornada, institución)
  - [x] State management con Zustand
  - [x] Sincronización filtros ↔ URL
  - [x] Mobile responsive filters

---

## ⚡ SPRINT 3: VISUALIZACIÓN Y DETALLE (Semana 3)

### 📊 DÍA 11-12: Backend Extensions (OBSOLETO, ver Supabase)

- [ ] **PBI-012 [Obsoleto]**: API endpoints para detalles y comparación (backend, Prisma)
  - [ ] (Preservado solo como referencia, no continuar desarrollo aquí)

### 🎨 DÍA 13-15: Frontend UI Development

- [x] **PBI-013 [Done]**: Página de resultados con grid responsivo (frontend)
  - [x] Grid layout responsivo
  - [x] Skeleton loading states
  - [x] Paginación infinita o por páginas
  - [ ] Sort options (pendiente)

- [ ] **PBI-014 [Pending]**: Cards de instituciones (frontend)
  - [ ] Diseño de ProgramCard component
  - [ ] Información clara y completa
  - [ ] Hover effects y microinteracciones
  - [ ] Links a páginas de detalle

- [x] **PBI-015 [Done]**: Página de detalle de carrera (frontend)
  - [x] Layout de página de detalle
  - [x] Tabla comparativa de instituciones
  - [x] Breadcrumbs y navegación
  - [ ] SEO optimization (pendiente)

- [ ] **PBI-016 [Pending]**: Comparador de instituciones (frontend)
  - [ ] Selección múltiple de programas
  - [ ] Vista de comparación lado a lado
  - [ ] Export a PDF/Excel (opcional)

---

## NOTA IMPORTANTE

- El backend SQLite/Prisma queda solo como referencia histórica.
- El flujo principal de desarrollo y consumo de datos es Supabase.
- Todos los endpoints y el frontend deben consumir Supabase.
- No continuar desarrollo en PBIs marcados como [Obsoleto].

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
      body: JSON.stringify(params),
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
  'GET /api/programs/:id': 'Program details',
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

## **¿Dónde obtener el Service Role Key?**

### 1. **En el Dashboard de Supabase:**

- Ve a tu proyecto: https://supabase.com/dashboard/project/vdfbwysgitaswfhxlfoz
- En el menú lateral, ve a **Settings** → **API**
- Busca la sección **Project API keys**
- Copia el **service_role** key (es diferente al anon key)

### 2. **Crear el archivo `.env` real:**

```bash
# En la carpeta apps/backend
cp env.example .env
```

### 3. **Editar `.env` y agregar el Service Role Key:**

```env
<code_block_to_apply_changes_from>
```

## **¿Por qué necesitas el Service Role Key?**

- **Anon Key**: Para operaciones públicas (lectura)
- **Service Role Key**: Para operaciones administrativas (crear, actualizar, eliminar)
- **Seguridad**: El Service Role Key tiene permisos completos, úsalo solo en el backend

¿Ya tienes el Service Role Key del dashboard? Si no, te ayudo a encontrarlo en la configuración del proyecto.

## **Ubicación exacta del Service Role Key:**

### **1. Archivo principal (el que usa el backend):**

```
academic-platform/apps/backend/.env
```

### **2. Pasos específicos:**

1. **Ve a la carpeta del backend:**

   ```bash
   cd academic-platform/apps/backend
   ```

2. **Crea el archivo `.env` (si no existe):**

   ```bash
   cp env.example .env
   ```

3. **Edita el archivo `.env` y agrega tu Service Role Key:**
   ```env
   SUPABASE_URL=https://vdfbwysgitaswfhxlfoz.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZmJ3eXNnaXRhc3dmaHhsZm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjI4NzgsImV4cCI6MjA2ODA5ODg3OH0.aSkwjdiZAspfmL3Jo5ByekyG9s9MQAn4DTCnDELBjZ0
   SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_REAL_AQUI
   ```

### **3. Estructura de archivos .env en tu proyecto:**

```
academic-platform/
├── apps/
│   ├── backend/
│   │   ├── .env                    ← AQUÍ VA TU SERVICE ROLE KEY
│   │   └── env.example             ← Archivo de ejemplo
│   └── frontend/
│       └── .env                    ← Variables del frontend (diferentes)
└── packages/
    └── database/
        └── .env                    ← Variables de Prisma (ya no se usará)
```

### **4. ¿Cuál es el archivo correcto?**

- **`apps/backend/.env`** ← **ESTE ES EL IMPORTANTE** para el Service Role Key
- Los otros `.env` son para diferentes partes del proyecto

¿Quieres que te ayude a crear el archivo `.env` en la ubicación correcta con tu Service Role Key?

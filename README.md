# 🎓 Academic Platform - Monorepo Separado

[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/andrescardonas7/academic-platform/releases/tag/v0.1.0)
[![License](https://img.shields.io/badge/license-Private-red.svg)]()
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)]()
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange.svg)]()

> **Plataforma centralizada para búsqueda de oferta académica** que permite a los usuarios buscar carreras y comparar instituciones en un solo lugar.

## 🎉 Release v0.1.0 - First Official Release

¡Estamos emocionados de anunciar el primer release oficial de Academic Platform! Esta versión incluye una arquitectura completa de monorepo con frontend y backend totalmente funcionales, listos para producción.

## 🏗️ Arquitectura

Este proyecto utiliza una **arquitectura separada** con frontend y backend independientes para mayor escalabilidad y flexibilidad.

### Stack Tecnológico

#### Frontend (`/apps/frontend`)

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI
- **State**: Zustand + TanStack Query (React Query)
- **Types**: TypeScript strict

#### Backend (`/apps/backend`)

- **Framework**: Node.js + Express.js
- **Database**: SQLite (MVP) → PostgreSQL (Production)
- **ORM**: Prisma
- **API**: REST + OpenAPI documentation

#### Shared Packages (`/packages`)

- `@academic/shared-types` - Tipos compartidos
- `@academic/ui` - Componentes de UI
- `@academic/api-client` - Cliente HTTP
- `@academic/database` - Esquemas y migraciones
- `@academic/eslint-config` - Configuraciones de linting

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+
- pnpm 8+
- Git

### Instalación

```bash
# Clonar e instalar
git clone <repo-url>
cd academic-platform
pnpm install

# Setup inicial
pnpm build
```

### Desarrollo

```bash
# Ejecutar ambos servicios
pnpm dev

# Solo backend (puerto 3001)
pnpm --filter @academic/backend dev

# Solo frontend (puerto 3000)
pnpm --filter @academic/frontend dev
```

### Base de Datos

```bash
# Generar cliente Prisma
pnpm db:generate

# Crear migración
pnpm db:migrate

# Poblar con datos
pnpm db:seed

# Abrir Prisma Studio
pnpm db:studio
```

## 📁 Estructura del Proyecto

```
academic-platform/
├── apps/
│   ├── frontend/           # Next.js App (Puerto 3000)
│   │   ├── src/app/       # App Router
│   │   ├── src/components/ # React Components
│   │   ├── src/lib/       # Utilities & API Client
│   │   └── package.json
│   │
│   ├── backend/           # Express API (Puerto 3001)
│   │   ├── src/routes/    # API Endpoints
│   │   ├── src/services/  # Business Logic
│   │   ├── src/middleware/ # Express Middleware
│   │   └── package.json
│   │
│   └── admin/             # Admin Dashboard (Future)
│
├── packages/              # Shared Packages
│   ├── shared-types/      # TypeScript Types
│   ├── ui/               # UI Components Library
│   ├── api-client/       # HTTP Client
│   ├── database/         # Prisma Schema & Utils
│   ├── eslint-config/    # Linting Rules
│   └── tsconfig/         # TypeScript Configs
│
├── docs/                 # Documentation
├── tools/                # Development Tools
└── .github/              # CI/CD Workflows
```

## 🎯 Características Principales

### ✅ Implementado (MVP)

- 🔍 **Búsqueda Avanzada**: Buscar carreras por nombre con autocompletado
- 🏫 **Información Completa**: Institución, modalidad, precio, duración, enlace oficial
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- ⚡ **Performance**: Carga rápida con Next.js y optimizaciones

### 🚧 En Desarrollo

- 🔧 **Filtros Avanzados**: Por ciudad, modalidad, rango de precio
- 📊 **Comparador**: Comparación lado a lado de programas
- ⭐ **Favoritos**: Sistema de guardado de programas
- 📈 **Analytics**: Seguimiento de búsquedas y clicks

### 🔮 Roadmap

- 🤖 **Chatbot IA**: Asistente virtual con RAG
- 📱 **App Móvil**: React Native / Flutter
- 🌎 **Multi-región**: Expansión a otros países
- 💰 **Becas**: Integración con sistemas de financiamiento

## 📚 Documentación

- 📋 [Estructura del Proyecto](./PROJECT_STRUCTURE.md)
- 🏗️ [Arquitectura Técnica](./TECHNICAL_ARCHITECTURE.md)
- 📅 [Planificación de Sprints](./SPRINT_PLANNING.md)
- ✅ [Lista de Tareas](./TODO_IMPLEMENTATION.md)
- 🛠️ [Guía de Implementación](./IMPLEMENTATION_GUIDE.md)

## 🔧 Scripts Disponibles

### Desarrollo

```bash
pnpm dev          # Ejecutar frontend + backend
pnpm build        # Build de todo el monorepo
pnpm test         # Ejecutar todos los tests
pnpm lint         # Lint de todo el código
pnpm type-check   # Verificación de tipos TypeScript
```

### Base de Datos

```bash
pnpm db:generate  # Generar cliente Prisma
pnpm db:migrate   # Aplicar migraciones
pnpm db:seed      # Poblar con datos de ejemplo
pnpm db:studio    # Abrir interfaz gráfica
pnpm db:reset     # Resetear base de datos
```

### Packages Específicos

```bash
# Solo backend
pnpm --filter @academic/backend <command>

# Solo frontend
pnpm --filter @academic/frontend <command>

# Solo shared-types
pnpm --filter @academic/shared-types <command>
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Tests por tipo
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 🚀 Deployment

### Staging

```bash
# Frontend (Vercel)
vercel --prod

# Backend (Railway)
railway deploy
```

### Production

- **Frontend**: Vercel (automático desde `main`)
- **Backend**: Railway (automático desde `main`)
- **Database**: PlanetScale / Supabase

## 🤝 Contribución

### Metodología

- **Framework**: Scrum adaptado (sprints de 1 semana)
- **Branching**: GitFlow simplificado
- **Reviews**: Pull Requests obligatorios
- **Quality**: ESLint + Prettier + TypeScript strict

### Proceso de Desarrollo

1. Crear feature branch desde `develop`
2. Implementar con tests
3. Pull Request con descripción clara
4. Code review y aprobación
5. Merge a `develop`
6. Deploy automático a staging

### Standards de Código

- TypeScript strict mode
- ESLint errors: 0
- Test coverage: >80%
- Conventional Commits
- Documentación actualizada

## 🔒 Variables de Entorno

### Backend (`.env`)

```bash
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Academic Platform"
```

## 📊 Métricas y Monitoring

### Performance Targets

- **API Response**: <500ms
- **Frontend Load**: <2s First Contentful Paint
- **Database Queries**: <100ms
- **Build Time**: <5min

### Tools

- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics
- **Performance**: Lighthouse CI
- **Logs**: Winston + Structured logging

## 🆘 Soporte y Troubleshooting

### Issues Comunes

- **Puerto ocupado**: Cambiar PORT en `.env`
- **CORS errors**: Verificar FRONTEND_URL en backend
- **Module not found**: Ejecutar `pnpm install && pnpm build`
- **Database connection**: Verificar DATABASE_URL

### Debug Mode

```bash
# Backend con debug
NODE_ENV=development DEBUG=* pnpm --filter @academic/backend dev

# Frontend con debug
NEXT_PUBLIC_DEBUG=true pnpm --filter @academic/frontend dev
```

## 📝 Changelog

### v0.1.0 (Current)

- ✅ Arquitectura separada implementada
- ✅ Setup de monorepo con Turborepo
- ✅ Backend API base con Express
- ✅ Frontend base con Next.js 15
- ✅ Shared packages configurados
- ✅ CI/CD pipeline básico

### v0.2.0 (Next Sprint)

- 🔧 API de búsqueda completa
- 🔧 UI de búsqueda y resultados
- 🔧 Base de datos con seed data
- 🔧 Filtros avanzados

---

## 📄 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

---

**Desarrollado en Cartaguito ❤️ **

# Versionado Semántico - Academic Platform

Este proyecto sigue [Semantic Versioning](https://semver.org/) (SemVer) y [CoCommits](https://www.conventionalcommits.org/).

## 📋 Formato de Versión

```
MAJOR.MINOR.PATCH[-PRERELEASE]
```

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH**: Correcciones de errores compatibles con versiones anteriores
- **PRERELEASE**: Versiones de prueba (alpha, beta, rc)

## 🏷️ Tipos de Release

### Patch (0.1.0 → 0.1.1)

Para correcciones de errores y mejoras menores:

```bash
pnpm release patch
```

### Minor (0.1.0 → 0.2.0)

Para nuevas funcionalidades compatibles:

```bash
pnpm release minor
```

### Major (0.1.0 → 1.0.0)

Para cambios incompatibles:

```bash
pnpm release major
```

### Prerelease (0.1.0 → 0.1.1-0)

Para versiones de prueba:

```bash
pnpm release prerelease
```

## 📝 Conventional Commits

### Formato

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Tipos de Commit

| Tipo       | Descripción               | Incrementa |
| ---------- | ------------------------- | ---------- |
| `feat`     | Nueva funcionalidad       | MINOR      |
| `fix`      | Corrección de error       | PATCH      |
| `docs`     | Cambios en documentación  | -          |
| `style`    | Cambios de formato        | -          |
| `refactor` | Refactorización de código | -          |
| `perf`     | Mejoras de rendimiento    | PATCH      |
| `test`     | Agregar o modificar tests | -          |
| `chore`    | Tareas de mantenimiento   | -          |
| `ci`       | Cambios en CI/CD          | -          |
| `build`    | Cambios en build system   | -          |

### Ejemplos

```bash
# Nueva funcionalidad
feat(search): add voice search functionality

# Corrección de error
fix(auth): resolve login timeout issue

# Breaking change
feat(api)!: change authentication method

# Con scope
feat(frontend): add dark mode toggle
fix(backend): resolve database connection issue

# Sin scope
docs: update deployment guide
chore: update dependencies
```

## 🚀 Proceso de Release

### 1. Desarrollo

- Crear commits siguiendo Conventional Commits
- Hacer push a rama `develop`

### 2. Release

```bash
# Ejecutar release script
pnpm release patch  # o minor/major

# El script automáticamente:
# - Ejecuta tests y checks
# - Incrementa versión en todos los workspaces
# - Genera changelog
# - Crea commit y tag
```

### 3. Deploy

```bash
# Push con tags
git push origin main --tags

# Deploy automático en Vercel
# Crear GitHub release desde el tag
```

## 📄 Changelog

El changelog se genera automáticamente basado en los commits convencionales y se actualiza en cada release.

### Estructura

- **BREAKING CHANGES**: Cambios incompatibles
- **Features**: Nuevas funcionalidades
- **Bug Fixes**: Correcciones de errores
- **Performance**: Mejoras de rendimiento
- **Documentation**: Cambios en documentación
- **Other**: Otros cambios

## 🔧 Scripts Disponibles

```bash
# Versionado manual
pnpm version:patch    # Incrementa patch
pnpm version:minor    # Incrementa minor
pnpm version:major    # Incrementa major

# Release completo (recomendado)
pnpm release patch    # Release patch completo
pnpm release minor    # Release minor completo
pnpm release major    # Release major completo

# Generar changelog
pnpm changelog        # Genera changelog desde último tag
```

## 📋 Checklist de Release

- [ ] Todos los tests pasan
- [ ] Documentación actualizada
- [ ] Commits siguen Conventional Commits
- [ ] Version bumped correctamente
- [ ] Changelog generado
- [ ] Tag creado
- [ ] Push con tags realizado
- [ ] GitHub release creado
- [ ] Deploy a producción exitoso

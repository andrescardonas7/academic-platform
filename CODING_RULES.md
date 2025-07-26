# 📋 Reglas de Codificación - Academic Platform

## 🚨 **REGLAS CRÍTICAS (NO NEGOCIABLES)**

### 1. **SonarQube Rule: Array.sort() SIEMPRE con función de comparación**

**❌ NUNCA hacer:**

```typescript
const items = [...new Set(array)].sort(); // SonarQube error!
```

**✅ SIEMPRE hacer:**

```typescript
const items = [...new Set(array)].sort((a, b) => a.localeCompare(b, 'es'));
```

**Razón:** SonarQube requiere función de comparación explícita para evitar ordenamiento alfabético inconsistente.

**Aplicar en:**

- Todos los arrays de strings
- Especialmente en español: usar `localeCompare(b, 'es')`
- Arrays de objetos: usar función de comparación apropiada

### 2. **SEGURIDAD CRÍTICA: Ejecución de Comandos del Sistema**

**❌ NUNCA hacer:**

```typescript
const { execSync } = require('child_process');
execSync(userInput); // PELIGROSO! Inyección de comandos
```

**✅ SIEMPRE hacer:**

```typescript
const { execSync } = require('child_process');
// 1. Validar y sanitizar input
// 2. Usar lista blanca de comandos permitidos
// 3. Escapar caracteres especiales
// 4. Agregar comentario de seguridad
execSync('pnpm install', { stdio: 'inherit' }); // Safe: hardcoded command
```

**Razón:** SonarQube requiere verificación de seguridad para comandos del sistema para prevenir inyección de comandos.

**Funciones peligrosas:** `execSync`, `exec`, `spawn`, `spawnSync`, `fork`, `execFile`, `execFileSync`

### 3. **Manejo de Variables de Entorno**

**❌ NUNCA hacer:**

```typescript
// En archivos .env.example
CEREBRAS_API_KEY = csk - real - api - key - here;
```

**✅ SIEMPRE hacer:**

```typescript
// En archivos .env.example
CEREBRAS_API_KEY = your - cerebras - api - key - here;
```

### 4. **Principios de Código Limpio**

**KISS (Keep It Simple, Stupid):**

- Funciones simples y directas
- Evitar complejidad innecesaria
- Código fácil de leer y mantener

**DRY (Don't Repeat Yourself):**

- Reutilizar funciones y componentes
- Evitar duplicación de lógica
- Crear utilidades compartidas

**SonarQube Compliance:**

- Siempre proporcionar funciones de comparación en sort()
- Manejar todos los casos de error
- Usar tipos TypeScript estrictos

## 🔧 **CONFIGURACIÓN AUTOMÁTICA**

### ESLint Rule para sort():

```json
{
  "rules": {
    "prefer-array-sort-compare": "error"
  }
}
```

### Pre-commit Hook:

- Verificar que no hay sort() sin función de comparación
- Verificar que .env.example no tiene APIs reales
- Ejecutar SonarQube checks

## 📝 **CHECKLIST ANTES DE COMMIT**

- [ ] ✅ Todos los `.sort()` tienen función de comparación
- [ ] ✅ Uso seguro de `execSync` y comandos del sistema
- [ ] ✅ Archivos `.env.example` solo tienen placeholders
- [ ] ✅ Código sigue principios KISS, DRY, SonarQube
- [ ] ✅ Tests pasan correctamente
- [ ] ✅ No hay console.log en producción

## 🚨 **VIOLACIONES COMUNES A EVITAR**

1. **sort() sin comparación** - Ya corregido 2 veces
2. **execSync sin validación** - Riesgo crítico de seguridad
3. **APIs reales en .env.example** - Riesgo de seguridad
4. **Código duplicado** - Viola principio DRY
5. **Funciones complejas** - Viola principio KISS

---

**Nota:** Estas reglas son obligatorias y deben seguirse en todos los commits.

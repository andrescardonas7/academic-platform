# 🚨 INCIDENTE DE SEGURIDAD - API KEYS EXPUESTAS

## Resumen del Incidente

**Fecha**: 29 de enero de 2025
**Severidad**: ALTA
**Estado**: EN PROCESO DE RESOLUCIÓN

### APIs Keys Comprometidas

Las siguientes API keys fueron expuestas en el archivo `scripts/migrate-to-vercel.js`:

1. **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (COMPROMETIDA)
2. **API Key**: `a05a30d9a9334856e510716d590db51e9b1cd9508459cc0891b162e3f6fa814d` (COMPROMETIDA)
3. **Cerebras API Key**: `csk-exh3fft5rjnc5t9wtyck9p64v6pdf2nn8h9pveh8jk6f3fte` (COMPROMETIDA)

## ✅ Acciones Tomadas Inmediatamente

### 1. Sanitización del Código

- [x] Reemplazadas las API keys reales con placeholders en `scripts/migrate-to-vercel.js`
- [x] Agregado el archivo al `.gitignore` para prevenir futuros commits
- [x] Creado template seguro `scripts/migrate-to-vercel.template.js`

### 2. Documentación

- [x] Creado este documento de respuesta al incidente
- [x] Documentadas todas las keys comprometidas

## 🚨 ACCIONES URGENTES REQUERIDAS

### 1. Revocar y Regenerar API Keys (CRÍTICO)

#### Supabase

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto `vdfbwysgitaswfhxlfoz`
3. Ve a Settings → API
4. **REGENERA** la `anon` key inmediatamente
5. Actualiza la nueva key en Vercel y archivos .env

#### Cerebras AI

1. Ve a tu dashboard de Cerebras: https://inference.cerebras.ai/
2. Ve a API Keys section
3. **REVOCA** la key `csk-exh3fft5rjnc5t9wtyck9p64v6pdf2nn8h9pveh8jk6f3fte`
4. **GENERA** una nueva API key
5. Actualiza la nueva key en Vercel y archivos .env

#### API Key Interna

1. Si es una key generada por ti, regenerala inmediatamente
2. Si es de un servicio externo, revócala y genera una nueva

### 2. Actualizar Variables de Entorno

#### En Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Actualiza todas las variables comprometidas con las nuevas keys

#### En Archivos Locales

1. Actualiza `.env` y `.env.local` con las nuevas keys
2. Actualiza `.env.production.example` si es necesario (sin valores reales)

### 3. Verificar Accesos y Logs

#### Supabase

- Revisa los logs de acceso para detectar uso no autorizado
- Verifica que no haya datos comprometidos

#### Cerebras

- Revisa el uso de la API para detectar actividad sospechosa
- Verifica los límites de rate y costos

## 📋 Checklist de Recuperación

- [ ] **CRÍTICO**: Revocar Supabase anon key
- [ ] **CRÍTICO**: Revocar Cerebras API key
- [ ] **CRÍTICO**: Revocar API key interna
- [ ] Generar nuevas API keys
- [ ] Actualizar variables en Vercel
- [ ] Actualizar archivos .env locales
- [ ] Probar que la aplicación funciona con las nuevas keys
- [ ] Verificar logs de acceso en todos los servicios
- [ ] Hacer commit de los cambios de seguridad
- [ ] Verificar que el deployment funciona correctamente

## 🛡️ Medidas Preventivas Implementadas

1. **Gitignore**: Agregado `scripts/migrate-to-vercel.js` al .gitignore
2. **Template**: Creado template seguro para futuros usos
3. **Documentación**: Este documento para referencia futura

## 🔍 Lecciones Aprendidas

1. **Nunca** hardcodear API keys en archivos de código
2. Usar siempre variables de entorno
3. Revisar commits antes de push para detectar secrets
4. Implementar pre-commit hooks para detectar secrets
5. Usar herramientas como `git-secrets` o `detect-secrets`

## 📞 Contactos de Emergencia

- **Supabase Support**: https://supabase.com/support
- **Cerebras Support**: https://cerebras.ai/contact

---

**IMPORTANTE**: Este incidente debe resolverse INMEDIATAMENTE. Las API keys expuestas representan un riesgo de seguridad crítico.

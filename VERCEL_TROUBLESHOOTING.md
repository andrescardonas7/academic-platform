# Vercel Troubleshooting Guide

## Problema: Los datos no se muestran en Vercel pero funcionan en Railway

### Síntomas
- ✅ La aplicación funciona localmente
- ✅ La aplicación funciona en Railway
- ❌ Los datos no se muestran en Vercel
- ❌ La aplicación se despliega correctamente en Vercel pero sin datos

### Causas Probables

#### 1. **Variables de Entorno Faltantes en Vercel**
El frontend necesita la API key para autenticarse con el backend.

**Solución:**
1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Agrega las siguientes variables:
   ```
   NEXT_PUBLIC_API_URL=https://academic-platform-production.up.railway.app
   NEXT_PUBLIC_API_KEY=[Tu API key real]
   ```

#### 2. **Problemas de CORS**
El backend no permite requests desde el dominio de Vercel.

**Solución:**
- ✅ Ya está solucionado en el código actualizado
- El backend ahora permite cualquier subdominio de `vercel.app`

#### 3. **Problemas de Autenticación**
La API key no está configurada correctamente.

**Verificación:**
1. Abre las herramientas de desarrollador en Vercel
2. Ve a la pestaña Console
3. Busca logs que empiecen con "🔍 Frontend API Config:"
4. Verifica que `API_KEY` no sea `undefined`

#### 4. **Problemas de Red**
El frontend no puede conectarse al backend.

**Verificación:**
1. Ve a la pestaña Network en las herramientas de desarrollador
2. Busca requests a `academic-platform-production.up.railway.app`
3. Verifica que no haya errores 401, 403, o CORS

### Pasos de Diagnóstico

#### Paso 1: Ejecutar el script de verificación
```bash
node scripts/verify-vercel-config.js
```

#### Paso 2: Verificar variables de entorno en Vercel
1. Ve a Vercel Dashboard > Tu Proyecto > Settings > Environment Variables
2. Verifica que tengas:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_API_KEY`

#### Paso 3: Verificar logs del navegador
1. Abre tu aplicación en Vercel
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña Console
4. Busca errores o logs de debug

#### Paso 4: Verificar requests de red
1. En las herramientas de desarrollador, ve a Network
2. Recarga la página
3. Busca requests a la API
4. Verifica el status code y la respuesta

### Soluciones Implementadas

#### ✅ CORS Actualizado
- Agregados dominios de Vercel a la lista de orígenes permitidos
- Incluido regex para permitir cualquier subdominio de `vercel.app`

#### ✅ Logs de Debug Mejorados
- Agregados logs detallados en el frontend
- Mejorado el manejo de errores
- Agregada información de debug en el hook de datos

#### ✅ Configuración de Vercel
- Actualizado `vercel.json` para incluir la API key
- Creado archivo de ejemplo de variables de entorno

#### ✅ Health Check Mejorado
- Agregada información adicional al endpoint `/health`
- Incluye estado de variables de entorno importantes

### Comandos Útiles

#### Verificar configuración local
```bash
# Verificar que el backend funciona
curl https://academic-platform-production.up.railway.app/health

# Verificar que la API responde
curl https://academic-platform-production.up.railway.app/api/search?limit=1
```

#### Verificar variables de entorno
```bash
# En el directorio del frontend
cd apps/frontend
echo $NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_KEY
```

### Contacto
Si el problema persiste después de seguir estos pasos, verifica:
1. Los logs del backend en Railway
2. Los logs del frontend en Vercel
3. La configuración de Supabase
4. Las variables de entorno en ambos servicios
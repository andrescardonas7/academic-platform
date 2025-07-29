# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar la Academic Platform en Vercel con frontend y backend.

## 📋 Pre-requisitos

1. **Cuenta en Vercel**: [vercel.com](https://vercel.com)
2. **Repositorio en GitHub**: Tu código debe estar en GitHub
3. **Variables de entorno**: Configuradas y listas

## 🔧 Preparación Local

### 1. Ejecutar script de preparación

```bash
pnpm run deploy:prepare
```

### 2. Verificar que todo funciona localmente

```bash
# Terminal 1 - Backend
pnpm run dev:backend

# Terminal 2 - Frontend
pnpm run dev:frontend
```

## 🌐 Configuración en Vercel

### 1. Conectar repositorio

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Selecciona "academic-platform"

### 2. Configurar Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: `pnpm run vercel-build`
- **Output Directory**: `apps/frontend/.next`
- **Install Command**: `pnpm install`

### 3. Variables de Entorno

Configura estas variables en Vercel Dashboard > Settings > Environment Variables:

#### Backend Variables

```
NODE_ENV=production
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
API_KEY=tu_api_key_segura
JWT_SECRET=tu_jwt_secret
SESSION_SECRET=tu_session_secret
CEREBRAS_API_KEY=tu_cerebras_api_key
CORS_ORIGIN=https://tu-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Variables

```
NEXT_PUBLIC_API_URL=https://tu-app.vercel.app/api
NEXT_PUBLIC_API_KEY=tu_api_key_segura
NEXT_PUBLIC_APP_NAME=Academic Platform
```

### 4. Deploy

1. Click en "Deploy"
2. Espera a que termine el build
3. ¡Tu app estará disponible en tu dominio de Vercel!

## 🔍 Verificación Post-Deploy

### 1. Health Check

Visita: `https://tu-app.vercel.app/health`
Deberías ver: `{"status":"OK",...}`

### 2. API Test

Visita: `https://tu-app.vercel.app/api/search?limit=5`
Deberías ver datos de programas académicos

### 3. Frontend Test

Visita: `https://tu-app.vercel.app`
Deberías ver la página principal funcionando

### 4. Chatbot Test

1. Ve a la página principal
2. Abre el chatbot
3. Pregunta: "¿Qué ingenierías hay en Cartago?"
4. Deberías recibir una respuesta con programas

## 🐛 Troubleshooting

### Error: "Module not found"

- Verifica que todas las dependencias estén en package.json
- Ejecuta `pnpm install` localmente

### Error: "Environment variable missing"

- Revisa que todas las variables estén configuradas en Vercel
- Verifica que los nombres coincidan exactamente

### Error: "Build timeout"

- Reduce el tamaño del build
- Optimiza las dependencias

### Error: "Function timeout"

- Verifica la configuración de `maxDuration` en vercel.json
- Optimiza las consultas a la base de datos

## 📊 Monitoreo

### Logs de Vercel

- Ve a tu proyecto en Vercel Dashboard
- Click en "Functions" para ver logs del backend
- Click en "Deployments" para ver logs de build

### Performance

- Usa Vercel Analytics para monitorear performance
- Configura alertas para errores

## 🔄 Updates

### Deploy automático

- Cada push a `main` desplegará automáticamente
- Usa branches para testing antes de merge

### Deploy manual

```bash
pnpm run deploy:vercel
```

## 🔒 Seguridad

1. **API Keys**: Nunca hardcodees API keys
2. **CORS**: Configura correctamente el origen
3. **Rate Limiting**: Mantén los límites configurados
4. **HTTPS**: Vercel provee HTTPS automáticamente

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard
2. Verifica la configuración local
3. Consulta la documentación de Vercel
4. Revisa este archivo de troubleshooting

¡Tu Academic Platform está lista para producción! 🎉

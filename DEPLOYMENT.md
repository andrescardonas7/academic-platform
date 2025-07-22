# Deployment Guide - Academic Platform

## Vercel Deployment

### Prerequisites

1. Vercel account connected to your GitHub repository
2. Sentry project configured with DSN
3. Environment variables configured

### Environment Variables Required

#### Production Environment Variables (Vercel Dashboard)

```bash
# App Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Academic Platform

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=universidad-tecnologica-de--fn
SENTRY_PROJECT=academic-platform
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Select the `develop` branch for deployment

2. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Root Directory: `apps/frontend`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all variables listed above
   - Set them for Production, Preview, and Development

4. **Deploy**
   - Push to `develop` branch triggers automatic deployment
   - Monitor deployment in Vercel dashboard

### Monorepo Configuration

- The `vercel.json` is configured to build only the frontend app
- Workspace dependencies are automatically resolved
- Build process includes Sentry source map upload

### Troubleshooting

- Check build logs in Vercel dashboard
- Verify environment variables are set correctly
- Ensure all workspace dependencies are properly linked

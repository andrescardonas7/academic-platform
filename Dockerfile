# Multi-stage build for optimized image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY apps/backend/package.railway.json ./package.json

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY apps/backend/package.railway.json ./package.json
COPY apps/backend/tsconfig.json ./tsconfig.json

# Install build dependencies
RUN npm ci

# Copy source code
COPY apps/backend/src ./src
COPY apps/backend/src/types/railway.ts ./src/types/railway.ts

# Build the application
RUN npm run build:production

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]

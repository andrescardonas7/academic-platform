# Production Dockerfile for Railway deployment
FROM node:18-alpine

# Install pnpm globally
RUN npm i -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json COMPLETE and lockfile
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Install ALL runtime dependencies (production only)
RUN pnpm install --prod --frozen-lockfile

# Copy TypeScript configuration and source code
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/src ./src

# Compile TypeScript with skipLibCheck
RUN npx tsc --project tsconfig.json --skipLibCheck

# Create non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]

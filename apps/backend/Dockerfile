# --- apps/backend/Dockerfile (nuevo) ---
FROM node:18-alpine

# 1. Gestor de paquetes
RUN npm i -g pnpm

# 2. Workspace
WORKDIR /app

# 3. Copiamos package.json COMPLETO y lockfile
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# 4. Instalamos TODAS las dependencias necesarias para runtime
RUN pnpm install --prod --frozen-lockfile

# 5. Copiamos el resto del código
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/src ./src

# 6. Compilamos
RUN npx tsc --project tsconfig.json --skipLibCheck

# 7. Usuario sin privilegios
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["node", "dist/server.js"]
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

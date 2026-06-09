FROM node:22-bullseye-slim AS builder

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Use npm install instead of npm ci
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy application source
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Build the application
RUN npm run build

# Production stage
FROM node:22-bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Regenerate Prisma client for production
RUN npx prisma generate

EXPOSE 3000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
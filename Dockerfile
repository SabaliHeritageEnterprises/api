FROM node:22-bullseye-slim AS builder

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps
RUN npx prisma generate

COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm run build

# Production stage
FROM node:22-bullseye-slim

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Debug: List dist contents
RUN ls -la dist/

EXPOSE 3000

# Run migrations and start with direct node command
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
# Multi-stage production build for Freskinto-api (NestJS + Prisma)
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma binaries on Alpine Linux
RUN apk add --no-cache openssl

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy configuration and source files
COPY tsconfig*.json nest-cli.json prisma.config.ts ./
COPY src ./src

# Generate Prisma client and build NestJS
RUN npx prisma generate
RUN npm run build

# Remove development dependencies to minimize image size (prisma stays in dependencies)
RUN npm prune --omit=dev

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl for Prisma runtime on Alpine Linux
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=10000

# Copy runtime assets from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 10000

# Automatically run pending database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

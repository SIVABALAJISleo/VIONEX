# ==============================================================================
# VIONEX Reproducible Multi-Stage Container Build (OPS-020)
# Base Image: Pinned node:20.18.0-alpine3.20 for bit-for-bit reproducibility
# Security: Enforces non-root user (nextjs:nodejs, UID/GID 1001)
# ==============================================================================

# Stage 1: Dependency Resolution
FROM node:20.18.0-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root workspace manifests
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json* ./packages/database/

RUN npm ci --include=optional

# Stage 2: Application Builder
FROM node:20.18.0-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile production bundle
RUN npm run build -w @vionex/web

# Stage 3: Production Runner (Non-Root User)
FROM node:20.18.0-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build artifacts with appropriate ownership
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules

# Switch to unprivileged non-root user
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "run", "start", "-w", "@vionex/web"]

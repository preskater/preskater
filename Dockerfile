# syntax=docker/dockerfile:1

# ============================================================
# Base: shared image metadata
# ============================================================
ARG NODE_VERSION=24-alpine

# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ============================================================
# Stage 2: Build the Next.js application (standalone output)
# ============================================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Prisma's CLI resolves the datasource eagerly from prisma.config.ts, and
# Better Auth refuses to initialize under NODE_ENV=production without a
# secret. Both are only needed to satisfy the build; real values are
# injected at runtime (see docker-compose.yml / .env.prod).
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG BETTER_AUTH_SECRET="build-time-placeholder-secret-value-32-chars"
ARG NEXT_PUBLIC_APP_URL=""

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The generated Prisma Client lives in src/generated (gitignored), so it must
# be regenerated before the Next.js build traces it into the standalone output.
RUN npx prisma generate

RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ============================================================
# Stage 3: Minimal production runtime (Next.js standalone server)
# ============================================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]

# ============================================================
# Stage 4: One-shot migration runner
# Uses the full dependency tree because it needs the Prisma CLI.
# ============================================================
FROM deps AS migrator

WORKDIR /app

COPY prisma.config.ts ./
COPY prisma ./prisma

# Force the Prisma schema engine for the target platform to be fetched during
# the image build, so migrations do not depend on network access at runtime.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx prisma generate

CMD ["npx", "prisma", "migrate", "deploy"]

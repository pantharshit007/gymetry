# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.20.4
ARG PNPM_VERSION=9.15.4

FROM node:${NODE_VERSION}-alpine AS base

RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# DEPENDENCIES STAGE
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN mkdir -p prisma
COPY prisma/schema.prisma ./prisma/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# BUILDER STAGE
FROM deps AS builder

COPY . .
# copy env file
# COPY .env.example .env
RUN pnpm run build
# RUN npm prune --omit=dev

# PRODUCTION STAGE
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER node

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

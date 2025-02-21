# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.20.4
ARG PNPM_VERSION=9.15.4

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm i -g pnpm@${PNPM_VERSION}

RUN pnpm i --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev:docker"]

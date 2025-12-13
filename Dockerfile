# syntax=docker/dockerfile:labs

# Build stage
FROM node:24-alpine AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV='production' \
    NPM_CONFIG_REGISTRY="${NPM_CONFIG_REGISTRY}"

WORKDIR /app

## Upgrade packages
RUN apk update && \
    apk upgrade

## Copy package-related files and install dependencies
COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
RUN --mount=id=pnpm-cache,target=/root/.cache/pnpm,type=cache \
    --mount=id=pnpm-store,target=/root/.local/share/pnpm/store,type=cache \
    --mount=id=vite-cache,target=/app/node_modules/.vite/cache,type=cache \
    corepack enable pnpm && \
    pnpm i --frozen-lockfile --prod=false

## Copy source files and build-related files, then build the app
COPY --exclude=./docker-entrypoint.sh ./ ./
RUN pnpm run lint && \
    pnpm run typecheck && \
    pnpm run generate

# Runtime stage
FROM busybox:latest

## Set workdir
WORKDIR /app

## Copy files and libraries
COPY --from=build-stage /app/.output ./

## Copy and set the entrypoint script
COPY --chmod=700 ./docker-entrypoint.sh ./
CMD ["./docker-entrypoint.sh"]

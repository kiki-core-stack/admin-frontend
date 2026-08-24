# syntax=docker/dockerfile:labs

# Build stage
FROM node:26-alpine AS build-stage

## Upgrade system packages and install pnpm
RUN apk update && \
    apk upgrade && \
    npm i -g pnpm@latest

## Configure build-time options and the environment
ARG PNPM_CONFIG_REGISTRY
ENV NODE_ENV='production' \
    PNPM_CONFIG_REGISTRY="${PNPM_CONFIG_REGISTRY}"

WORKDIR /app

## Copy dependency manifests and install dependencies
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN --mount=id=pnpm-cache,target=/root/.cache/pnpm,type=cache \
    --mount=id=pnpm-store,target=/root/.local/share/pnpm/store,type=cache \
    pnpm i --frozen-lockfile --prod=false

## Configure options used by the application build
## PLACEHOLDER

## Copy application sources and build the application
COPY --exclude=./docker-entrypoint.sh ./ ./
RUN pnpm run lint && \
    pnpm run typecheck && \
    pnpm run generate

# Runtime stage
FROM busybox:latest

## Configure working directory
WORKDIR /app

## Copy and configure the entrypoint
COPY --chmod=700 ./docker-entrypoint.sh ./
CMD ["./docker-entrypoint.sh"]

## Copy the application output
COPY --from=build-stage /app/.output ./

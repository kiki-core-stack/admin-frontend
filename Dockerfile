# syntax=docker/dockerfile:labs

# Build stage
FROM ghcr.io/pnpm/pnpm:12 AS build-stage

## Install Node.js for the build
RUN pnpm runtime set node 26 -g

## Configure build-time options and the environment
ARG PNPM_CONFIG_REGISTRY
ENV NODE_ENV='production' \
    PNPM_CONFIG_REGISTRY="${PNPM_CONFIG_REGISTRY}"

WORKDIR /app

## Copy dependency manifests and install dependencies
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache \
    pnpm i --frozen-lockfile --prod=false

## Configure options used by the application build
# ARG
# ENV

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

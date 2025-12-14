# syntax=docker/dockerfile:labs

# Build stage
FROM node:24-slim AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV='production' \
    NPM_CONFIG_REGISTRY="${NPM_CONFIG_REGISTRY}"

WORKDIR /app

## Upgrade packages
RUN apt-get update && \
    apt-get upgrade -y

## Copy package-related files and install dependencies
COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
RUN --mount=id=pnpm-cache,target=/root/.cache/pnpm,type=cache \
    --mount=id=pnpm-store,target=/root/.local/share/pnpm/store,type=cache \
    corepack enable pnpm && \
    pnpm i --frozen-lockfile --prod=false

## Copy source files and build-related files, then build the app
COPY --exclude=./docker-entrypoint.sh ./ ./
RUN --mount=id=vite-cache,target=/app/node_modules/.vite/cache,type=cache \
    pnpm run lint && \
    pnpm run typecheck && \
    pnpm run build

# Runtime stage
FROM node:24-slim

## Set envs and workdir
ENV NODE_ENV='production' \
    TZ='UTC'

WORKDIR /app

## Setups
RUN \
    ### Upgrade and install packages
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends tini tzdata && \
    ### Set timezone
    ln -snf "/usr/share/zoneinfo/${TZ}" /etc/localtime && \
    echo "${TZ}" >/etc/timezone && \
    ### Cleanup
    apt-get autoremove -y --purge && \
    apt-get clean && \
    rm -rf /var/cache/apt/* /var/lib/apt/lists/* && \
    ### Add user
    useradd -mr -g nogroup -s /usr/sbin/nologin -u 10001 user

## Copy files and libraries
COPY --from=build-stage /app/.output ./

## Copy and set the entrypoint script
COPY --chmod=700 ./docker-entrypoint.sh ./
RUN chown -R 10001:nogroup /app
USER 10001
ENTRYPOINT ["tini", "--"]
CMD ["./docker-entrypoint.sh"]

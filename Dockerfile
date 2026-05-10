# syntax=docker/dockerfile:labs

# Build stage
FROM node:26-slim AS build-stage

## Set args, envs and workdir
ARG PNPM_CONFIG_REGISTRY
ENV PNPM_CONFIG_REGISTRY="${PNPM_CONFIG_REGISTRY}" \
    NODE_ENV='production'

WORKDIR /app

## Upgrade packages and install pnpm
RUN apt-get update && \
    apt-get upgrade -y && \
    npm i -g pnpm@latest

## Copy package-related files and install dependencies
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN --mount=id=pnpm-cache,target=/root/.cache/pnpm,type=cache \
    --mount=id=pnpm-store,target=/root/.local/share/pnpm/store,type=cache \
    pnpm i --frozen-lockfile --prod=false

## Copy source files and build-related files, then build the app
COPY --exclude=./docker-entrypoint.sh ./ ./
RUN pnpm run lint && \
    pnpm run typecheck && \
    pnpm run build

# Runtime stage
FROM node:26-slim

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

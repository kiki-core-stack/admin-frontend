# Build stage
FROM kikikanri/node22:base-alpine AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV=production
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
WORKDIR /app

## Install dependencies
COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile --prod=false

## Copy files and generate
COPY ./ ./
RUN pnpm run lint && pnpm run generate

# Runtime stage
FROM busybox:latest

## Set envs and workdir
ENV DIST_DIR_PATH=/admin-frontend-dist
WORKDIR /app

## Copy files
COPY --from=build-stage /app/.output ./

## Make entrypoint and set cmd
RUN echo " \
    rm -rf ${DIST_DIR_PATH}/* && \
    cp -pr /app/public/* ${DIST_DIR_PATH}/ && \
    chmod 755 ${DIST_DIR_PATH} -R \
    " > ./entrypoint.sh

CMD ["sh", "./entrypoint.sh"]

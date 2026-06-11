#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# Load environments
. ./.env.production.local

# Pull images
docker pull docker/dockerfile:labs &
docker pull node:26-slim &
wait

# Build and run
DOCKER_IMAGE_REF="${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG:-latest}"
docker build \
    -t "${DOCKER_IMAGE_REF}" \
    --build-arg "PNPM_CONFIG_REGISTRY=${PNPM_CONFIG_REGISTRY}" \
    .

docker stop "${DOCKER_CONTAINER_NAME}" || true
docker rm "${DOCKER_CONTAINER_NAME}" || true
docker run \
    -d \
    -p "${DOCKER_CONTAINER_EXPOSE_HOST}:${DOCKER_CONTAINER_EXPOSE_PORT}:3000" \
    -v "${DOCKER_CONTAINER_STATIC_DIR_BIND_PATH}:/static" \
    --name "${DOCKER_CONTAINER_NAME}" \
    --restart=always \
    "${DOCKER_IMAGE_REF}"

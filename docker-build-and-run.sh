#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
cd "${SCRIPT_DIR}"

# Load environments
. ./.env.production.local

# Pull images
docker pull kikikanri/node:24-slim &
docker pull node:24-slim &
wait

# Build and run
DOCKER_IMAGE_REF="${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG:-latest}"
docker build \
    -t "${DOCKER_IMAGE_REF}" \
    --build-arg "NPM_REGISTRY=${NPM_REGISTRY}" \
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

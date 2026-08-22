#!/bin/bash

set -euo pipefail

# Copy static files and set permissions
STATIC_DIR_PATH='/static'
find "${STATIC_DIR_PATH}" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -r /app/public/. "${STATIC_DIR_PATH}"/
find "${STATIC_DIR_PATH}" -mindepth 1 -type d -exec chmod 755 {} +
find "${STATIC_DIR_PATH}" -mindepth 1 -type f -exec chmod 644 {} +

# Load secrets to environment
if [ -d /run/secrets ]; then
    for secret_file_path in /run/secrets/*; do
        [ ! -f "${secret_file_path}" ] && continue
        secret_key=$(basename "${secret_file_path}")
        secret_value=$(cat "${secret_file_path}")
        export "${secret_key}"="${secret_value}"
    done
fi

# Start server
cd /app/server
exec node ./index.mjs

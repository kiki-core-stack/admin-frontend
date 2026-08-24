#!/bin/sh

set -eu

# Copy static files and set permissions
STATIC_DIR_PATH='/static'
find "${STATIC_DIR_PATH}" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -r /app/public/. "${STATIC_DIR_PATH}"/
find "${STATIC_DIR_PATH}" -mindepth 1 -type d -exec chmod 755 {} +
find "${STATIC_DIR_PATH}" -mindepth 1 -type f -exec chmod 644 {} +

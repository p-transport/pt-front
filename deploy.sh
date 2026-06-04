#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [ -f "$(dirname "$0")/.env" ]; then
  set -a
  source "$(dirname "$0")/.env"
  set +a
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required}"
: "${DEPLOY_USER:?DEPLOY_USER is required}"
: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

echo "→ Building..."
npm run generate

echo "→ Uploading to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
if [ -n "${DEPLOY_PASSWORD:-}" ]; then
  sshpass -p "$DEPLOY_PASSWORD" scp -r -P "$DEPLOY_PORT" \
    .output/public/. \
    "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
else
  scp -r -P "$DEPLOY_PORT" \
    ${DEPLOY_KEY:+-i "$DEPLOY_KEY"} \
    .output/public/. \
    "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
fi

echo "✓ Done"

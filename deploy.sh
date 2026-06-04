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

LFTP_PASS="${DEPLOY_PASSWORD:-}"
lftp -u "${DEPLOY_USER},${LFTP_PASS}" "sftp://${DEPLOY_HOST}:${DEPLOY_PORT}" <<EOF
set sftp:auto-confirm yes
set net:max-retries 3
mirror -R --delete --verbose .output/public/ ${DEPLOY_PATH}
bye
EOF

echo "✓ Done"

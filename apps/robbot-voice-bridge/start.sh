#!/bin/bash
set -a
source "$(dirname "$0")/.env"
set +a
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm run build --prefix "$(dirname "$0")" 2>/dev/null
exec node "$(dirname "$0")/dist/index.js"

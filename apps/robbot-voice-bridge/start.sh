#!/bin/bash
set -a
source "$(dirname "$0")/.env"
set +a
export NODE_TLS_REJECT_UNAUTHORIZED=0
exec node src/index.js

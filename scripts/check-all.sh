#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
./scripts/lint.sh
./scripts/typecheck.sh
./scripts/test.sh
bun run validate
bun run build

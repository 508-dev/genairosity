#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
if [ "${1:-env}" != env ]; then
  echo 'Usage: ./scripts/worktree-ports.sh env' >&2
  exit 2
fi
exec bun run ports

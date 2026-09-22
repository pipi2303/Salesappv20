#!/bin/sh
# Runs schema migrations against the (external, Neon) database before
# starting the server on every container start -- so a deploy that
# includes a new prisma/schema.prisma migration applies it automatically
# instead of needing a manual `npx prisma migrate deploy` step on the VPS.
# `migrate deploy` (not `migrate dev`) is the non-interactive,
# production-safe command: it only applies already-committed migration
# files from prisma/migrations/, never generates new ones.
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set. Configure it as a stack environment variable in Portainer." >&2
  exit 1
fi

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec npx tsx server.ts

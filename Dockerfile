# Sales CRM Onduline — production image for VPS/Portainer deployment.
# Built by Portainer directly from this Git repo (no separate registry) --
# see docker-compose.yml.
#
# The API routes (api/*.ts) and server.ts run via `tsx` (already a
# dependency, used elsewhere in this repo for prisma/seed.ts) rather than
# a separate tsc/esbuild compile step. tsx strips TS types at runtime;
# this repo does no type-level validation at build time either way
# (Vite's own build only transpiles, it doesn't type-check), so this
# doesn't lower the bar that already exists -- it just avoids maintaining
# a second build pipeline for the ~15 api/*.ts files on top of Vite's for
# the frontend.

FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Generates node_modules/@prisma/client from prisma/schema.prisma --
# needed before the frontend build (some UI code may import enum types)
# and before the server ever runs.
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/server.ts ./server.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]

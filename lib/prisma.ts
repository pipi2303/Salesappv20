// Single PrismaClient instance, reused across serverless invocations and
// dev hot-reload — opening a fresh connection pool per request would
// exhaust Vercel Postgres/Neon's connection limit fast (Bab 15 of the
// Fase 1 plan doc). Standard pattern for Prisma on serverless platforms.
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

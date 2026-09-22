// Fase 1 item 3: "Implementasikan autentikasi nyata: password di-hash di
// server, session/token divalidasi backend." This file is the one place
// both halves happen — nothing about a session is ever trusted from what
// the client claims.
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Role } from '@prisma/client';
import { prisma } from './prisma.js';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Sessions store only the SHA-256 hash of the token (see the Session.tokenHash
// comment in prisma/schema.prisma) — an opaque, backend-revocable token
// rather than a JWT, so logout/revoke is a single row update instead of
// needing a denylist for something that's supposed to be stateless.
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });
  return { token, expiresAt };
}

export interface AuthedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// Validates a raw bearer token against the stored hash and checks
// expiry/revocation/account status — the "divalidasi backend" half of
// item 3.
export async function getUserFromToken(rawToken: string | undefined): Promise<AuthedUser | null> {
  if (!rawToken) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  if (!session.user.isActive) return null;
  const { id, email, name, role } = session.user;
  return { id, email, name, role };
}

export async function revokeSession(rawToken: string): Promise<void> {
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export function extractBearerToken(authHeader: string | string[] | undefined | null): string | undefined {
  const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!header) return undefined;
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : undefined;
}

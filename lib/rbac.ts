// Fase 1 item 4: "Terapkan role-based access control di DUA level: UI dan
// backend/API (bukan UI-only, karena mudah dilewati dari DevTools)." Every
// API handler that gates an action by role calls requireRole() instead of
// trusting a role the client sends — the UI-level check (hiding a button)
// stays useful for UX but is never the actual security boundary.
import type { Role } from '@prisma/client';
import type { AuthedUser } from './auth.js';

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export function requireRole(user: AuthedUser | null, allowed: Role[]): asserts user is AuthedUser {
  if (!user) throw new UnauthorizedError();
  if (!allowed.includes(user.role)) {
    throw new ForbiddenError(`Role ${user.role} is not permitted to perform this action`);
  }
}

export function requireAuth(user: AuthedUser | null): asserts user is AuthedUser {
  if (!user) throw new UnauthorizedError();
}

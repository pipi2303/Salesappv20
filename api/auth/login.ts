// POST /api/auth/login — { email, password } -> { token, user }
//
// This is the real counterpart to the demo-account login in
// src/app/components/Login.tsx (which still authenticates client-side
// only — that cleanup is tracked separately as Fase 0). Once the frontend
// is wired to call this endpoint, Login.tsx's checks become a UI-only
// redirect; the actual credential check happens here, server-side.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { verifyPassword, createSession } from '../../lib/auth.js';

interface ApiRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
}
interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email dan password wajib diisi' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Same response whether the email doesn't exist or the password is
  // wrong — don't tell an attacker which half failed.
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ success: false, error: 'Email atau password salah' });
    return;
  }

  const { token, expiresAt } = await createSession(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  res.status(200).json({
    success: true,
    data: {
      token,
      expiresAt,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    },
  });
}

// GET/POST /api/stores — same pattern as api/distributors/index.ts, one
// level down the Bab 5 hierarchy (a Store optionally belongs to a
// Distributor).
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';
import { requireAuth, ForbiddenError, UnauthorizedError } from '../../lib/rbac.js';

interface ApiRequest extends IncomingMessage {
  method?: string;
  headers: IncomingMessage['headers'];
  body?: unknown;
}
interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const user = await getUserFromToken(extractBearerToken(req.headers.authorization));
    requireAuth(user);

    if (req.method === 'GET') {
      const stores = await prisma.store.findMany({
        include: { distributor: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, data: stores });
      return;
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (!body.code || !body.name) {
        res.status(400).json({ success: false, error: 'code dan name wajib diisi' });
        return;
      }
      const store = await prisma.store.create({
        data: {
          code: body.code as string,
          name: body.name as string,
          distributorId: (body.distributorId as string) ?? null,
          address: (body.address as string) ?? null,
          gpsLat: (body.gpsLat as number) ?? null,
          gpsLng: (body.gpsLng as number) ?? null,
          status: 'PENDING',
          submittedById: user.id,
          submittedAt: new Date(),
        },
      });
      res.status(201).json({ success: true, data: store });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      res.status(409).json({ success: false, error: 'Kode toko sudah dipakai' });
      return;
    }
    console.error('[api/stores] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

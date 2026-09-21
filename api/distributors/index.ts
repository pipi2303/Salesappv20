// GET/POST /api/distributors — Bab 8 gap 1 ("hierarki distributor-toko
// belum ada") and Bab 9's approval workflow ("Field minimal": status,
// diajukan oleh, tanggal diajukan, disetujui/ditolak oleh, tanggal
// keputusan, catatan alasan — all already on the Distributor model).
//
// Any authenticated role can submit a new distributor for approval (the
// same "any sales role creates, manager+ decides" split used for
// api/leads); editing/deciding is restricted below in [id].ts.
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
      const distributors = await prisma.distributor.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, data: distributors });
      return;
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (!body.code || !body.name) {
        res.status(400).json({ success: false, error: 'code dan name wajib diisi' });
        return;
      }
      const distributor = await prisma.distributor.create({
        data: {
          code: body.code as string,
          name: body.name as string,
          address: (body.address as string) ?? null,
          gpsLat: (body.gpsLat as number) ?? null,
          gpsLng: (body.gpsLng as number) ?? null,
          status: 'PENDING',
          submittedById: user.id,
          submittedAt: new Date(),
        },
      });
      res.status(201).json({ success: true, data: distributor });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      res.status(409).json({ success: false, error: 'Kode distributor sudah dipakai' });
      return;
    }
    console.error('[api/distributors] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// GET/PUT/DELETE /api/stores/:id — same pattern as
// api/distributors/[id].ts.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';
import type { Role } from '@prisma/client';
import { requireAuth, requireRole, ForbiddenError, UnauthorizedError } from '../../lib/rbac.js';

interface ApiRequest extends IncomingMessage {
  method?: string;
  headers: IncomingMessage['headers'];
  body?: unknown;
  query?: Record<string, string | string[]>;
}
interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

function getId(req: ApiRequest): string | undefined {
  const raw = req.query?.id;
  return Array.isArray(raw) ? raw[0] : raw;
}

const APPROVER_ROLES: Role[] = ['SUPER_ADMIN', 'SALES_MANAGER', 'MASTER_DATA_ADMIN'];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const id = getId(req);
  if (!id) {
    res.status(400).json({ success: false, error: 'Missing store id' });
    return;
  }

  try {
    const user = await getUserFromToken(extractBearerToken(req.headers.authorization));

    if (req.method === 'GET') {
      requireAuth(user);
      const store = await prisma.store.findUnique({
        where: { id },
        include: { distributor: true, tasks: true },
      });
      if (!store) {
        res.status(404).json({ success: false, error: 'Store not found' });
        return;
      }
      res.status(200).json({ success: true, data: store });
      return;
    }

    if (req.method === 'PUT') {
      requireRole(user, APPROVER_ROLES);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const nextStatus = body.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined;

      const current = await prisma.store.findUnique({ where: { id } });
      if (!current) {
        res.status(404).json({ success: false, error: 'Store not found' });
        return;
      }
      const isDeciding = nextStatus !== undefined && nextStatus !== current.status && current.status === 'PENDING';

      const store = await prisma.store.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name as string }),
          ...(body.distributorId !== undefined && { distributorId: body.distributorId as string }),
          ...(body.address !== undefined && { address: body.address as string }),
          ...(body.gpsLat !== undefined && { gpsLat: body.gpsLat as number }),
          ...(body.gpsLng !== undefined && { gpsLng: body.gpsLng as number }),
          ...(nextStatus !== undefined && { status: nextStatus }),
          ...(isDeciding && {
            decidedById: user!.id,
            decidedAt: new Date(),
          }),
          ...(body.rejectionNote !== undefined && { rejectionNote: body.rejectionNote as string }),
        },
      });
      res.status(200).json({ success: true, data: store });
      return;
    }

    if (req.method === 'DELETE') {
      requireRole(user, ['SUPER_ADMIN', 'MASTER_DATA_ADMIN']);
      await prisma.store.delete({ where: { id } });
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2025') {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }
    console.error('[api/stores/[id]] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

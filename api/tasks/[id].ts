// GET/PUT/DELETE /api/tasks/:id, plus POST for check-in (Bab 8 gap 2:
// GPS + "foto toko bertanggal") — kept on this route rather than a
// separate file since it always acts on one task, same convention as
// api/opportunities/[id].ts's activity-log POST.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';
import { requireAuth, requireRole, ForbiddenError, UnauthorizedError } from '../../lib/rbac.js';
import { uploadCheckInPhoto, InvalidPhotoError } from '../../lib/blob.js';

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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const id = getId(req);
  if (!id) {
    res.status(400).json({ success: false, error: 'Missing task id' });
    return;
  }

  try {
    const user = await getUserFromToken(extractBearerToken(req.headers.authorization));

    if (req.method === 'GET') {
      requireAuth(user);
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.status(200).json({ success: true, data: task });
      return;
    }

    if (req.method === 'PUT') {
      requireAuth(user);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(body.title !== undefined && { title: body.title as string }),
          ...(body.description !== undefined && { description: body.description as string }),
          ...(body.status !== undefined && { status: body.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED' }),
          ...(body.priority !== undefined && { priority: body.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }),
          ...(body.type !== undefined && { type: body.type as 'VISIT' | 'CALL' | 'EMAIL' | 'OTHER' }),
          ...(body.category !== undefined && { category: body.category as string }),
          ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate as string) : null }),
          ...(body.completedDate !== undefined && {
            completedDate: body.completedDate ? new Date(body.completedDate as string) : null,
          }),
          ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo as string }),
          ...(body.opportunityId !== undefined && { opportunityId: body.opportunityId as string }),
          ...(body.storeId !== undefined && { storeId: body.storeId as string }),
          ...(body.extra !== undefined && { extra: body.extra as object }),
        },
      });
      res.status(200).json({ success: true, data: task });
      return;
    }

    if (req.method === 'POST') {
      // FR-03 check-in: GPS (always) + foto display toko bertanggal
      // (optional — a check-in without camera/location permission still
      // saves, matching the existing localStorage behavior in
      // TaskManagement.tsx's handleCheckIn).
      requireAuth(user);
      const body = (req.body ?? {}) as Record<string, unknown>;

      let checkInPhotoUrl: string | undefined;
      if (body.photoDataUrl) {
        try {
          checkInPhotoUrl = await uploadCheckInPhoto(body.photoDataUrl as string, id);
        } catch (err) {
          if (err instanceof InvalidPhotoError) {
            res.status(400).json({ success: false, error: err.message });
            return;
          }
          throw err;
        }
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          checkInAt: new Date(),
          checkInLat: (body.lat as number) ?? null,
          checkInLng: (body.lng as number) ?? null,
          checkInAccuracy: (body.accuracy as number) ?? null,
          locationValidated: (body.locationValidated as boolean) ?? (body.lat != null && body.lng != null),
          ...(checkInPhotoUrl && { checkInPhotoUrl }),
        },
      });
      res.status(200).json({ success: true, data: task });
      return;
    }

    if (req.method === 'DELETE') {
      requireRole(user, ['SUPER_ADMIN', 'SALES_MANAGER']);
      await prisma.task.delete({ where: { id } });
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
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }
    console.error('[api/tasks/[id]] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

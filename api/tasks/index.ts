// GET/POST /api/tasks — Task module, wired to a real backend for the
// first time (previously schema-only groundwork for Bab 8 gap 2's
// check-in feature; see the modeling note on the Task model in
// schema.prisma). Any authenticated role can list and create tasks,
// matching the same "any sales role creates" convention already used
// for api/leads and api/opportunities.
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
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, data: tasks });
      return;
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (!body.title) {
        res.status(400).json({ success: false, error: 'title wajib diisi' });
        return;
      }
      const task = await prisma.task.create({
        data: {
          title: body.title as string,
          description: (body.description as string) ?? null,
          status: (body.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED') ?? 'TODO',
          priority: (body.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') ?? 'MEDIUM',
          type: (body.type as 'VISIT' | 'CALL' | 'EMAIL' | 'OTHER') ?? 'OTHER',
          category: (body.category as string) ?? null,
          dueDate: body.dueDate ? new Date(body.dueDate as string) : null,
          assignedTo: (body.assignedTo as string) ?? null,
          createdBy: (body.createdBy as string) ?? user.name,
          opportunityId: (body.opportunityId as string) ?? null,
          storeId: (body.storeId as string) ?? null,
          ownerId: (body.ownerId as string) ?? user.id,
          extra: (body.extra as object) ?? undefined,
        },
      });
      res.status(201).json({ success: true, data: task });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    console.error('[api/tasks] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

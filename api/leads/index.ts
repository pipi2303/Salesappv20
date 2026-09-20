// GET/POST /api/leads — second of the three pilot modules named in Fase 1
// item 2 ("mulai dari modul yang sudah punya pola api.ts (Lead,
// Opportunity, Product)"). Unlike Product, a Lead is created and edited
// day-to-day by any sales role, not just master-data roles — so reads and
// creates only require being authenticated, and only delete is held back
// to manager+ (losing a lead record is the sensitive operation, not
// creating one).
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
      const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
      res.status(200).json({ success: true, data: leads });
      return;
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (!body.name || !body.company || !body.value) {
        res.status(400).json({ success: false, error: 'name, company, dan value wajib diisi' });
        return;
      }
      const lead = await prisma.lead.create({
        data: {
          name: body.name as string,
          company: body.company as string,
          email: (body.email as string) ?? null,
          phone: (body.phone as string) ?? null,
          status: (body.status as 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST') ?? 'NEW',
          value: body.value as number,
          source: (body.source as string) ?? null,
          assignedTo: (body.assignedTo as string) ?? user.id,
          notes: (body.notes as string) ?? null,
        },
      });
      res.status(201).json({ success: true, data: lead });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    console.error('[api/leads] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

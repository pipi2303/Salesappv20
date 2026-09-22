// GET/POST /api/opportunities — third of the three pilot modules named in
// Fase 1 item 2. Opportunity carries the ~40 UI-only "Overview/Commercial/
// Technical Detail" fields from src/types/opportunity.ts in a single
// `extra` JSON column rather than one column each (see the modeling note
// at the top of prisma/schema.prisma) — callers pass those under
// body.extra and everything else maps to real columns.
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

interface ProductItemInput {
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const user = await getUserFromToken(extractBearerToken(req.headers.authorization));
    requireAuth(user);

    if (req.method === 'GET') {
      const opportunities = await prisma.opportunity.findMany({
        include: { products: true, activities: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, data: opportunities });
      return;
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as Record<string, unknown>;
      if (!body.name || !body.clientName || !body.contactPerson || !body.closeDate) {
        res.status(400).json({
          success: false,
          error: 'name, clientName, contactPerson, dan closeDate wajib diisi',
        });
        return;
      }
      const products = (body.products as ProductItemInput[] | undefined) ?? [];

      const opportunity = await prisma.opportunity.create({
        data: {
          name: body.name as string,
          leadId: (body.leadId as string) ?? null,
          clientId: (body.clientId as string) ?? null,
          clientName: body.clientName as string,
          contactPerson: body.contactPerson as string,
          email: (body.email as string) ?? null,
          phone: (body.phone as string) ?? null,
          totalValue: (body.totalValue as number) ?? 0,
          currency: (body.currency as string) ?? 'IDR',
          probability: (body.probability as number) ?? 0,
          closeDate: new Date(body.closeDate as string),
          stage: (body.stage as 'PROSPECTING' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST') ?? 'PROSPECTING',
          status: (body.status as 'OPEN' | 'WON' | 'LOST') ?? 'OPEN',
          ownerId: (body.ownerId as string) ?? user.id,
          ownerName: (body.ownerName as string) ?? user.name,
          source: (body.source as string) ?? null,
          description: (body.description as string) ?? null,
          notes: (body.notes as string) ?? null,
          salesFlow: (body.salesFlow as 'PROJECT' | 'RETAIL') ?? null,
          extra: (body.extra as object) ?? undefined,
          createdBy: user.id,
          products: {
            create: products.map((p) => ({
              productId: p.productId ?? null,
              productName: p.productName,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
              totalPrice: p.totalPrice,
            })),
          },
        },
        include: { products: true, activities: true },
      });
      res.status(201).json({ success: true, data: opportunity });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    console.error('[api/opportunities] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

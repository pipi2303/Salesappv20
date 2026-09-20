// GET/POST /api/products — the pilot module for Fase 1 item 2
// ("Migrasikan data dari localStorage ke database terpusat, mulai dari
// modul yang sudah punya pola api.ts (Lead, Opportunity, Product)").
// Product was picked first here because src/types/product.ts is already
// the unified model (item 5) and prisma/schema.prisma's Product table is
// a direct port of the already-reviewed
// db/migrations/0001_unified_product_model.sql — the least amount of
// new modeling risk to wire up first.
//
// Response shape matches src/services/api.ts's existing
// { success, data?, error? } convention so the frontend repository layer
// (src/services/productsRepository.ts) can eventually point at this
// endpoint instead of localStorage without changing its own call sites.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';
import { requireAuth, requireRole, ForbiddenError, UnauthorizedError } from '../../lib/rbac.js';

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

    if (req.method === 'GET') {
      // Any authenticated role can read the catalog.
      requireAuth(user);
      const products = await prisma.product.findMany({
        include: { softwareAttrs: true, physicalAttrs: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json({ success: true, data: products });
      return;
    }

    if (req.method === 'POST') {
      // Creating/editing the catalog is a master-data action, not a
      // day-to-day sales action — restrict it accordingly.
      requireRole(user, ['SUPER_ADMIN', 'SALES_MANAGER', 'MASTER_DATA_ADMIN']);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const product = await prisma.product.create({
        data: {
          sku: body.sku as string,
          name: body.name as string,
          category: body.category as string,
          price: body.price as number,
          currency: (body.currency as string) ?? 'IDR',
          description: (body.description as string) ?? null,
          productType: body.productType as 'SOFTWARE' | 'PHYSICAL',
          stock: (body.stock as number) ?? 0,
          features: (body.features as string[]) ?? [],
        },
      });
      res.status(201).json({ success: true, data: product });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      res.status(err.status).json({ success: false, error: err.message });
      return;
    }
    console.error('[api/products] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

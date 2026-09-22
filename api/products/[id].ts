// GET/PUT/DELETE /api/products/:id — single-record operations for the
// same pilot module as api/products/index.ts.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { prisma } from '../../lib/prisma.js';
import { getUserFromToken, extractBearerToken } from '../../lib/auth.js';
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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const id = getId(req);
  if (!id) {
    res.status(400).json({ success: false, error: 'Missing product id' });
    return;
  }

  try {
    const user = await getUserFromToken(extractBearerToken(req.headers.authorization));

    if (req.method === 'GET') {
      requireAuth(user);
      const product = await prisma.product.findUnique({
        where: { id },
        include: { softwareAttrs: true, physicalAttrs: true },
      });
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }
      res.status(200).json({ success: true, data: product });
      return;
    }

    if (req.method === 'PUT') {
      requireRole(user, ['SUPER_ADMIN', 'SALES_MANAGER', 'MASTER_DATA_ADMIN']);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const softwareAttrs = body.softwareAttrs as Record<string, unknown> | undefined;
      const physicalAttrs = body.physicalAttrs as Record<string, unknown> | undefined;
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name as string }),
          ...(body.category !== undefined && { category: body.category as string }),
          ...(body.price !== undefined && { price: body.price as number }),
          ...(body.currency !== undefined && { currency: body.currency as string }),
          ...(body.description !== undefined && { description: body.description as string }),
          ...(body.status !== undefined && { status: body.status as 'ACTIVE' | 'DISCONTINUED' }),
          ...(body.stock !== undefined && { stock: body.stock as number }),
          ...(body.sold !== undefined && { sold: body.sold as number }),
          ...(body.features !== undefined && { features: body.features as string[] }),
          // upsert rather than update: a product created before this
          // field existed (or the exclusive-arc row was skipped for some
          // reason) may not have a subtype row yet.
          ...(softwareAttrs !== undefined && {
            softwareAttrs: {
              upsert: {
                create: {
                  licenseTier: softwareAttrs.licenseTier as string | undefined,
                  billingCycle: softwareAttrs.billingCycle as
                    | 'MONTHLY'
                    | 'YEARLY'
                    | 'ONE_TIME'
                    | undefined,
                  modules: (softwareAttrs.modules as string[]) ?? [],
                  seatLimit: softwareAttrs.seatLimit as number | undefined,
                  deploymentType: softwareAttrs.deploymentType as
                    | 'CLOUD'
                    | 'ON_PREMISE'
                    | 'HYBRID'
                    | undefined,
                },
                update: {
                  licenseTier: softwareAttrs.licenseTier as string | undefined,
                  billingCycle: softwareAttrs.billingCycle as
                    | 'MONTHLY'
                    | 'YEARLY'
                    | 'ONE_TIME'
                    | undefined,
                  modules: (softwareAttrs.modules as string[]) ?? [],
                  seatLimit: softwareAttrs.seatLimit as number | undefined,
                  deploymentType: softwareAttrs.deploymentType as
                    | 'CLOUD'
                    | 'ON_PREMISE'
                    | 'HYBRID'
                    | undefined,
                },
              },
            },
          }),
          ...(physicalAttrs !== undefined && {
            physicalAttrs: {
              upsert: {
                create: {
                  unitOfMeasure: physicalAttrs.unitOfMeasure as string,
                  color: physicalAttrs.color as string | undefined,
                  specification: physicalAttrs.specification as string | undefined,
                  weightKg: physicalAttrs.weightKg as number | undefined,
                },
                update: {
                  unitOfMeasure: physicalAttrs.unitOfMeasure as string,
                  color: physicalAttrs.color as string | undefined,
                  specification: physicalAttrs.specification as string | undefined,
                  weightKg: physicalAttrs.weightKg as number | undefined,
                },
              },
            },
          }),
        },
        include: { softwareAttrs: true, physicalAttrs: true },
      });
      res.status(200).json({ success: true, data: product });
      return;
    }

    if (req.method === 'DELETE') {
      // Deleting master data is tighter than editing it.
      requireRole(user, ['SUPER_ADMIN', 'MASTER_DATA_ADMIN']);
      await prisma.product.delete({ where: { id } });
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
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    console.error('[api/products/[id]] unexpected error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

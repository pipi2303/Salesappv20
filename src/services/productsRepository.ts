// Products repository — adapter layer over the unified Product model.
//
// Fase 1 item 2: this used to read/write localStorage directly. It now
// calls the real backend (GET/POST/PUT/DELETE /api/products, prisma/
// schema.prisma's Product + ProductSoftwareAttrs/ProductPhysicalAttrs).
// The point of having pulled this into its own repository earlier (see
// git history) was exactly so that this swap would only touch this file
// — every component that imports `productsRepository` keeps calling the
// same methods with the same Result<T> shape, unaffected by the swap.
//
// Two shape gaps between the frontend's flat Product union and the
// backend's Prisma-native shape, bridged here in both directions:
// - Prisma's Role/ProductType/ProductStatus/BillingCycle/DeploymentType
//   enums are SCREAMING_SNAKE_CASE JS-side; the frontend types use the
//   lower-case string literals ('software', 'active', 'one-time', ...).
// - price/weightKg are Prisma `Decimal` columns, which serialize to JSON
//   as strings, not numbers — every read converts them back with Number().
// softwareAttrs/physicalAttrs are separate tables server-side (the
// exclusive-arc subtype pattern) but a single flat object client-side;
// toApiPayload nests one of them on the way out, fromApiProduct flattens
// it back on the way in.

import type { Product, NewProduct, SoftwareProduct, PhysicalProduct, BillingCycle, DeploymentType } from '@/types/product';
import type { Result } from '@/types/result';

function getAuthToken(): string | undefined {
  try {
    const raw = localStorage.getItem('salesMonitorUser');
    if (!raw) return undefined;
    return JSON.parse(raw)?.accessToken;
  } catch {
    return undefined;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<Result<T>> {
  try {
    const token = getAuthToken();
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // No body to parse on a 204, and DELETE here always returns 200 with
    // a small JSON body, but guard anyway.
    const body = res.status === 204 ? { success: true } : await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, error: 'Sesi login tidak valid atau sudah berakhir. Silakan logout dan login kembali.' };
      }
      return { success: false, error: body.error ?? 'Terjadi kesalahan pada server' };
    }
    return body as Result<T>;
  } catch (error) {
    console.error(`productsRepository: request failed (${path}):`, error);
    return { success: false, error: 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.' };
  }
}

const BILLING_CYCLE_OUT: Record<BillingCycle, string> = {
  monthly: 'MONTHLY',
  yearly: 'YEARLY',
  'one-time': 'ONE_TIME',
};
const BILLING_CYCLE_IN: Record<string, BillingCycle> = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  ONE_TIME: 'one-time',
};
const DEPLOYMENT_TYPE_OUT: Record<DeploymentType, string> = {
  cloud: 'CLOUD',
  'on-premise': 'ON_PREMISE',
  hybrid: 'HYBRID',
};
const DEPLOYMENT_TYPE_IN: Record<string, DeploymentType> = {
  CLOUD: 'cloud',
  ON_PREMISE: 'on-premise',
  HYBRID: 'hybrid',
};

/** Frontend NewProduct/Product shape -> the wire shape api/products/*.ts expects. */
function toApiPayload(input: Partial<NewProduct>): Record<string, unknown> {
  const { productType, status, ...rest } = input as Record<string, unknown> & {
    productType?: 'software' | 'physical';
    status?: 'active' | 'discontinued';
  };
  const payload: Record<string, unknown> = { ...rest };
  if (productType) payload.productType = productType === 'software' ? 'SOFTWARE' : 'PHYSICAL';
  if (status) payload.status = status === 'active' ? 'ACTIVE' : 'DISCONTINUED';

  if (productType === 'software') {
    const p = input as Partial<SoftwareProduct>;
    payload.softwareAttrs = {
      licenseTier: p.licenseTier,
      billingCycle: p.billingCycle ? BILLING_CYCLE_OUT[p.billingCycle] : undefined,
      modules: p.modules ?? [],
      seatLimit: p.seatLimit,
      deploymentType: p.deploymentType ? DEPLOYMENT_TYPE_OUT[p.deploymentType] : undefined,
    };
    delete payload.licenseTier;
    delete payload.billingCycle;
    delete payload.modules;
    delete payload.seatLimit;
    delete payload.deploymentType;
  } else if (productType === 'physical') {
    const p = input as Partial<PhysicalProduct>;
    payload.physicalAttrs = {
      unitOfMeasure: p.unitOfMeasure,
      color: p.color,
      specification: p.specification,
      weightKg: p.weightKg,
    };
    delete payload.unitOfMeasure;
    delete payload.color;
    delete payload.specification;
    delete payload.weightKg;
  }
  return payload;
}

/** api/products/*.ts's Prisma-shaped row -> the frontend's flat Product union. */
function fromApiProduct(row: any): Product {
  const base = {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    currency: row.currency,
    description: row.description ?? '',
    status: row.status === 'ACTIVE' ? ('active' as const) : ('discontinued' as const),
    features: row.features ?? [],
    stock: row.stock,
    sold: row.sold,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (row.productType === 'SOFTWARE') {
    const attrs = row.softwareAttrs ?? {};
    return {
      ...base,
      productType: 'software',
      licenseTier: attrs.licenseTier ?? '',
      billingCycle: BILLING_CYCLE_IN[attrs.billingCycle] ?? 'monthly',
      modules: attrs.modules ?? [],
      seatLimit: attrs.seatLimit ?? undefined,
      deploymentType: attrs.deploymentType ? DEPLOYMENT_TYPE_IN[attrs.deploymentType] : undefined,
    } as SoftwareProduct;
  }

  const attrs = row.physicalAttrs ?? {};
  return {
    ...base,
    productType: 'physical',
    unitOfMeasure: attrs.unitOfMeasure ?? '',
    color: attrs.color ?? undefined,
    specification: attrs.specification ?? '',
    weightKg: attrs.weightKg != null ? Number(attrs.weightKg) : undefined,
  } as PhysicalProduct;
}

/** Runtime shape validation — TypeScript types disappear at runtime, and
 *  this app has no compiler type-checking in its build (see production
 *  readiness audit), so this is a first line of defense before the round
 *  trip to the server, which validates again (and is authoritative). */
function validate(input: NewProduct): string | null {
  if (!input.sku?.trim()) return 'SKU wajib diisi';
  if (!input.name?.trim()) return 'Nama produk wajib diisi';
  if (!input.category?.trim()) return 'Kategori wajib diisi';
  if (typeof input.price !== 'number' || input.price < 0) return 'Harga harus angka >= 0';
  if (!input.currency?.trim()) return 'Mata uang wajib diisi';
  if (input.status !== 'active' && input.status !== 'discontinued') return 'Status tidak valid';
  if (!Array.isArray(input.features)) return 'Features harus berupa array (boleh kosong)';
  if (typeof input.stock !== 'number' || input.stock < 0) return 'Stock harus angka >= 0';
  if (typeof input.sold !== 'number' || input.sold < 0) return 'Sold harus angka >= 0';

  if (input.productType === 'software') {
    const p = input as Omit<SoftwareProduct, 'id' | 'createdAt' | 'updatedAt'>;
    if (!p.licenseTier?.trim()) return 'License tier wajib diisi untuk produk software';
    if (!p.billingCycle) return 'Billing cycle wajib diisi untuk produk software';
    if (!Array.isArray(p.modules)) return 'Modules harus berupa array (boleh kosong)';
  } else if (input.productType === 'physical') {
    const p = input as Omit<PhysicalProduct, 'id' | 'createdAt' | 'updatedAt'>;
    if (!p.unitOfMeasure?.trim()) return 'Unit of measure wajib diisi untuk produk fisik';
    if (!p.specification?.trim()) return 'Spesifikasi wajib diisi untuk produk fisik';
  } else {
    return 'productType harus "software" atau "physical"';
  }

  return null;
}

export const productsRepository = {
  async getAll(): Promise<Result<Product[]>> {
    const res = await apiFetch<any[]>('/api/products');
    if (!res.success || !res.data) return res as Result<Product[]>;
    return { success: true, data: res.data.map(fromApiProduct) };
  },

  async getById(id: string): Promise<Result<Product>> {
    const res = await apiFetch<any>(`/api/products/${id}`);
    if (!res.success || !res.data) return res as Result<Product>;
    return { success: true, data: fromApiProduct(res.data) };
  },

  async create(input: NewProduct): Promise<Result<Product>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const res = await apiFetch<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(input)),
    });
    if (!res.success || !res.data) return res as Result<Product>;
    return { success: true, data: fromApiProduct(res.data) };
  },

  async update(id: string, updates: Partial<NewProduct>): Promise<Result<Product>> {
    const res = await apiFetch<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiPayload(updates)),
    });
    if (!res.success || !res.data) return res as Result<Product>;
    return { success: true, data: fromApiProduct(res.data) };
  },

  async remove(id: string): Promise<Result<void>> {
    return apiFetch<void>(`/api/products/${id}`, { method: 'DELETE' });
  },
};

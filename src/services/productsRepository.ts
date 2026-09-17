// Products repository — adapter layer over the unified Product model.
//
// Today this reads/writes localStorage, exactly like the rest of
// src/services/api.ts. The point of pulling it into its own repository
// (rather than adding more `any[]`-typed entries to api.ts) is so that
// when Tahap B (real Postgres/Supabase backend) happens, only THIS file
// needs to change its internals — every component that imports
// `productsRepository` keeps calling the same methods with the same
// Result<T> shape, unaffected by the swap.
//
// Validation lives here on purpose: the audit found api.ts writes
// whatever shape a component hands it straight to localStorage with no
// required-field or type checking. New code going through this
// repository does not inherit that gap.

import type { Product, NewProduct, SoftwareProduct, PhysicalProduct } from '@/types/product';

type Result<T> = { success: boolean; data?: T; error?: string };

const STORAGE_KEY = 'sales_monitoring_products_v2';
// Deliberately a NEW key, not the existing `sales_monitoring_products`.
// The old key holds free-form dummy rows (no sku/productType/status/
// timestamps) written by the legacy productsApi — reusing that key would
// mean silently reinterpreting untyped legacy rows as the new shape,
// which would crash the runtime validation below on first read. Existing
// demo data should be re-entered (or migrated with an explicit one-time
// script) under the new model rather than assumed compatible.

function readAll(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch (error) {
    console.error('productsRepository: corrupted localStorage data, resetting to empty', error);
    return [];
  }
}

function writeAll(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/** Runtime shape validation — TypeScript types disappear at runtime, and
 *  this app has no compiler type-checking in its build (see production
 *  readiness audit), so this is the only real safety net against a
 *  malformed record reaching the UI. */
function validate(input: NewProduct): string | null {
  if (!input.sku?.trim()) return 'SKU wajib diisi';
  if (!input.name?.trim()) return 'Nama produk wajib diisi';
  if (!input.category?.trim()) return 'Kategori wajib diisi';
  if (typeof input.price !== 'number' || input.price < 0) return 'Harga harus angka >= 0';
  if (!input.currency?.trim()) return 'Mata uang wajib diisi';
  if (input.status !== 'active' && input.status !== 'discontinued') return 'Status tidak valid';

  if (input.productType === 'software') {
    const p = input as Omit<SoftwareProduct, 'id' | 'createdAt' | 'updatedAt'>;
    if (!p.licenseTier?.trim()) return 'License tier wajib diisi untuk produk software';
    if (!p.billingCycle) return 'Billing cycle wajib diisi untuk produk software';
    if (!Array.isArray(p.modules)) return 'Modules harus berupa array (boleh kosong)';
  } else if (input.productType === 'physical') {
    const p = input as Omit<PhysicalProduct, 'id' | 'createdAt' | 'updatedAt'>;
    if (!p.unitOfMeasure?.trim()) return 'Unit of measure wajib diisi untuk produk fisik';
    if (!p.specification?.trim()) return 'Spesifikasi wajib diisi untuk produk fisik';
    if (typeof p.stock !== 'number' || p.stock < 0) return 'Stock harus angka >= 0';
  } else {
    return 'productType harus "software" atau "physical"';
  }

  return null;
}

export const productsRepository = {
  async getAll(): Promise<Result<Product[]>> {
    return { success: true, data: readAll() };
  },

  async getById(id: string): Promise<Result<Product>> {
    const found = readAll().find((p) => p.id === id);
    if (!found) return { success: false, error: 'Produk tidak ditemukan' };
    return { success: true, data: found };
  },

  async create(input: NewProduct): Promise<Result<Product>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const products = readAll();
    if (products.some((p) => p.sku === input.sku)) {
      return { success: false, error: `SKU "${input.sku}" sudah dipakai produk lain` };
    }

    const now = new Date().toISOString();
    const created = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now } as Product;
    products.push(created);
    writeAll(products);
    return { success: true, data: created };
  },

  async update(id: string, updates: Partial<NewProduct>): Promise<Result<Product>> {
    const products = readAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return { success: false, error: 'Produk tidak ditemukan' };

    const merged = { ...products[index], ...updates, updatedAt: new Date().toISOString() } as Product;
    const validationError = validate(merged);
    if (validationError) return { success: false, error: validationError };

    if (updates.sku && products.some((p) => p.id !== id && p.sku === updates.sku)) {
      return { success: false, error: `SKU "${updates.sku}" sudah dipakai produk lain` };
    }

    products[index] = merged;
    writeAll(products);
    return { success: true, data: merged };
  },

  async remove(id: string): Promise<Result<void>> {
    const products = readAll();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return { success: false, error: 'Produk tidak ditemukan' };
    writeAll(filtered);
    return { success: true };
  },
};

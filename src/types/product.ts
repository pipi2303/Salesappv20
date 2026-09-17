// Unified product model — single source of truth for both product lines
// Salesappv20 sells: software packages (hospital systems) and physical
// building-material goods (inherited from the original Onduline FSD).
//
// Design rationale (agreed with product owner, see chat discussion):
// - One shared identity (ProductBase fields) so Opportunity/Quotation/
//   Discount Approval/Commission modules can reference "a product"
//   generically via `id`, without caring which line of business it's from.
// - Type-specific fields live only on the matching variant, enforced by
//   TypeScript's discriminated union on `productType` — so
//   `product.productType === 'physical'` narrows the type and gives you
//   `stock`/`color` with compiler-checked safety, not `any`.
// - This mirrors the Postgres schema in
//   supabase/migrations/0001_unified_product_model.sql: ProductBase ~
//   the `products` table, SoftwareProduct/PhysicalProduct-only fields ~
//   the `product_software_attrs` / `product_physical_attrs` extension
//   tables.
//
// This file replaces the divergent local `interface Product` definitions
// previously scattered across src/app/data/dummyData.ts and individual
// components — those should import from here instead of redefining their
// own shape.

export type ProductStatus = 'active' | 'discontinued';
export type ProductType = 'software' | 'physical';

interface ProductBase {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string; // ISO 4217, e.g. 'IDR'
  description: string;
  status: ProductStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type BillingCycle = 'monthly' | 'yearly' | 'one-time';
export type DeploymentType = 'cloud' | 'on-premise' | 'hybrid';

export interface SoftwareProduct extends ProductBase {
  productType: 'software';
  licenseTier: string;
  billingCycle: BillingCycle;
  modules: string[];
  seatLimit?: number;
  deploymentType?: DeploymentType;
}

export interface PhysicalProduct extends ProductBase {
  productType: 'physical';
  unitOfMeasure: string; // e.g. 'm2', 'pcs', 'roll'
  color?: string;
  specification: string;
  stock: number;
  weightKg?: number;
}

export type Product = SoftwareProduct | PhysicalProduct;

/** Fields accepted when creating a product — id/createdAt/updatedAt are assigned by the repository. */
export type NewProduct =
  | Omit<SoftwareProduct, 'id' | 'createdAt' | 'updatedAt'>
  | Omit<PhysicalProduct, 'id' | 'createdAt' | 'updatedAt'>;

export function isSoftwareProduct(p: Product): p is SoftwareProduct {
  return p.productType === 'software';
}

export function isPhysicalProduct(p: Product): p is PhysicalProduct {
  return p.productType === 'physical';
}

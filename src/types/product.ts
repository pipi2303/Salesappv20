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
//   `color`/`weightKg` with compiler-checked safety, not `any`.
// - This mirrors the Postgres schema in
//   db/migrations/0001_unified_product_model.sql: ProductBase ~
//   the `products` table, SoftwareProduct/PhysicalProduct-only fields ~
//   the `product_software_attrs` / `product_physical_attrs` extension
//   tables.
//
// Revision note (post-review against the actual ProductCatalog.tsx /
// ConfigurePriceQuote.tsx code, not just the original discussion):
// the real UI already depends on three fields for EVERY product,
// regardless of productType — these were missing from the first draft
// of this file and have been moved here to ProductBase:
//   - `stock`      : available quota (for software: license/seat quota
//                    available to sell; for physical: warehouse stock).
//                    Confirmed with product owner — same field, same
//                    business meaning ("units still sellable"), not two
//                    different concepts that happen to share a name.
//   - `features`   : marketing/spec bullet list shown on the product
//                    card and in the quote builder (ConfigurePriceQuote
//                    reads `product.features` directly). Distinct from
//                    SoftwareProduct.modules (which is a licensing/
//                    entitlement concept, not a display list) even
//                    though the two can overlap in content.
//   - `sold`       : cumulative units/licenses sold to date, used for
//                    the "Best Seller" stat and revenue-to-date display
//                    in ProductCatalog. This is really an aggregate
//                    derived from sales/performance data, not a true
//                    product attribute — kept here for now only because
//                    that's how the current UI already models it, and
//                    replacing it with a real aggregation over
//                    performance_targets is out of scope for Tahap A.
//                    Flagged as an improvement candidate for Tahap B.
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
  /** Marketing/spec bullet points shown on the product card and in quote builders. */
  features: string[];
  /** Available quota: license/seat slots for software, warehouse units for physical. */
  stock: number;
  /** Cumulative units/licenses sold to date (aggregate display field — see revision note above). */
  sold: number;
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

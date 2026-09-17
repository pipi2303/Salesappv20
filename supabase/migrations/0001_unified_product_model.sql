-- =====================================================================
-- Migration: Unified Product Model + Performance Tracking (target/actual/forecast)
-- =====================================================================
-- Context: Salesappv20 sells TWO product lines through one sales pipeline
-- (software packages for hospital systems, and physical building-material
-- goods inherited from the original Onduline FSD). This migration gives
-- both a single shared identity (`products`) so that Opportunity/Quotation/
-- Discount Approval/Commission modules can reference "a product" generically,
-- while keeping each line's type-specific attributes in separate extension
-- tables (supertype/subtype pattern) instead of one wide nullable table or
-- a loosely-typed JSONB blob.
--
-- This file is NOT executed against any live database yet — no Postgres/
-- Supabase project is provisioned for this app as of this migration being
-- written. It is a ready-to-run artifact for when that project exists
-- (Tahap B of the roadmap discussed with the product owner).
--
-- Revision (after checking the actual ProductCatalog.tsx / ConfigurePriceQuote.tsx
-- code, not just the original discussion): `stock`, `features`, and `sold` are
-- used by the UI for EVERY product regardless of type, so they moved from
-- product_physical_attrs into the shared `products` table. See src/types/product.ts
-- for the matching TypeScript-side note.
-- =====================================================================

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ---------------------------------------------------------------------
-- 1. products — shared identity for every sellable item, regardless of
--    line of business. Opportunity/Quotation/Contract/Discount Approval/
--    Commission all reference products.id ONLY — none of them need to
--    know whether a line item is software or physical.
-- ---------------------------------------------------------------------
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  sku           text not null unique,
  name          text not null,
  category      text not null,
  price         numeric(14,2) not null check (price >= 0),
  currency      text not null default 'IDR',
  description   text,
  status        text not null default 'active' check (status in ('active','discontinued')),
  product_type  text not null check (product_type in ('software','physical')),
  -- Available quota: license/seat slots for software, warehouse units for physical.
  -- Same business meaning ("units still sellable") regardless of product_type —
  -- confirmed with product owner, not two concepts that happen to share a name.
  stock         integer not null default 0 check (stock >= 0),
  -- Marketing/spec bullet list shown on the product card and in quote builders.
  features      text[] not null default '{}',
  -- Cumulative units/licenses sold to date. Aggregate display field, not a
  -- true product attribute — kept here only because the current UI already
  -- models it this way; replacing it with a real aggregation over
  -- performance_targets is a Tahap B candidate, not done in this migration.
  sold          integer not null default 0 check (sold >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_products_category on products (category);
create index if not exists idx_products_type on products (product_type);
create index if not exists idx_products_status on products (status);

-- ---------------------------------------------------------------------
-- 2. product_software_attrs — 1:1 extension, only populated when
--    product_type = 'software'. Enforced by the trigger below, not just
--    by convention, so a software row can never end up with a physical
--    extension row and vice versa.
-- ---------------------------------------------------------------------
create table if not exists product_software_attrs (
  product_id    uuid primary key references products(id) on delete cascade,
  license_tier  text,
  billing_cycle text check (billing_cycle in ('monthly','yearly','one-time')),
  modules       text[] not null default '{}',
  seat_limit    integer check (seat_limit is null or seat_limit > 0),
  deployment_type text check (deployment_type in ('cloud','on-premise','hybrid'))
);

-- ---------------------------------------------------------------------
-- 3. product_physical_attrs — 1:1 extension, only populated when
--    product_type = 'physical'. Carries the Onduline-style attributes
--    (m2, warna, spesifikasi) without polluting the shared products table.
--    NOTE: stock moved OUT of this table into products (see above) —
--    it is not physical-only.
-- ---------------------------------------------------------------------
create table if not exists product_physical_attrs (
  product_id      uuid primary key references products(id) on delete cascade,
  unit_of_measure text not null, -- e.g. 'm2', 'pcs', 'roll'
  color           text,
  specification   text,
  weight_kg       numeric(10,3)
);

-- ---------------------------------------------------------------------
-- Trigger: keep product_type and the two extension tables consistent.
-- A 'software' product must not have a product_physical_attrs row, and
-- a 'physical' product must not have a product_software_attrs row.
-- ---------------------------------------------------------------------
create or replace function enforce_product_attrs_match_type()
returns trigger as $$
declare
  actual_type text;
begin
  select product_type into actual_type from products where id = new.product_id;

  if TG_TABLE_NAME = 'product_software_attrs' and actual_type <> 'software' then
    raise exception 'product % is type %, cannot have software attributes', new.product_id, actual_type;
  end if;

  if TG_TABLE_NAME = 'product_physical_attrs' and actual_type <> 'physical' then
    raise exception 'product % is type %, cannot have physical attributes', new.product_id, actual_type;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_software_attrs_type_check on product_software_attrs;
create trigger trg_software_attrs_type_check
  before insert or update on product_software_attrs
  for each row execute function enforce_product_attrs_match_type();

drop trigger if exists trg_physical_attrs_type_check on product_physical_attrs;
create trigger trg_physical_attrs_type_check
  before insert or update on product_physical_attrs
  for each row execute function enforce_product_attrs_match_type();

-- ---------------------------------------------------------------------
-- updated_at auto-touch, so every table below stays consistent without
-- relying on application code to remember to set it.
-- ---------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_touch on products;
create trigger trg_products_touch
  before update on products
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------
-- 4. Minimal placeholder tables for sales_reps / territories.
--
-- IMPORTANT: these are intentionally minimal — just enough for
-- performance_targets below to have real foreign keys. When Tahap B
-- (actual backend wiring) happens, reconcile these against the real
-- shape used by SalesTeam.tsx / TerritoryManagement.tsx (which today
-- only exist as ad hoc localStorage/in-memory structures with their
-- own divergent fields) rather than assuming this is the final shape.
-- ---------------------------------------------------------------------
create table if not exists sales_reps (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null unique,
  role       text not null,
  created_at timestamptz not null default now()
);

create table if not exists territories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  region     text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. performance_targets — the single generic fact table for the
--    target vs actual vs forecast pattern. Replaces three separate,
--    divergent implementations found in the current codebase:
--      - Territory Management (revenue/target/achievement per territory)
--      - Commission Calculator (tier-based achievementRate per rep)
--      - SalesRep dummy data (target/achievement fields inline)
--
-- Uses the "exclusive arc" pattern (three nullable FKs + a check that
-- exactly one is set) instead of a loose entity_type/entity_id pair,
-- so referential integrity is enforced by Postgres itself rather than
-- trusted to application code.
-- ---------------------------------------------------------------------
create table if not exists performance_targets (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid references products(id) on delete cascade,
  sales_rep_id  uuid references sales_reps(id) on delete cascade,
  territory_id  uuid references territories(id) on delete cascade,
  period        date not null, -- convention: first day of the month, e.g. 2026-09-01
  target        numeric(14,2) not null check (target >= 0),
  actual        numeric(14,2) not null default 0 check (actual >= 0),
  forecast      numeric(14,2) check (forecast is null or forecast >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint exactly_one_entity check (
    num_nonnulls(product_id, sales_rep_id, territory_id) = 1
  )
);

-- Partial unique indexes (one per entity column) rather than a single
-- composite unique constraint, because a composite unique over three
-- nullable columns does not behave the way one might expect in Postgres
-- (NULL <> NULL, so it would not actually prevent duplicate rows where
-- two of the three FKs are both null).
create unique index if not exists uq_perf_target_product
  on performance_targets (product_id, period) where product_id is not null;
create unique index if not exists uq_perf_target_rep
  on performance_targets (sales_rep_id, period) where sales_rep_id is not null;
create unique index if not exists uq_perf_target_territory
  on performance_targets (territory_id, period) where territory_id is not null;

drop trigger if exists trg_perf_targets_touch on performance_targets;
create trigger trg_perf_targets_touch
  before update on performance_targets
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------
-- 6. Convenience view: achievement % computed consistently in one place
--    instead of re-implemented per module (Territory Management currently
--    computes `revenue / target * 100` inline in TSX; Commission
--    Calculator computes its own tier-based rate separately).
-- ---------------------------------------------------------------------
create or replace view performance_targets_with_achievement as
select
  pt.*,
  case when pt.target > 0 then round((pt.actual / pt.target) * 100, 2) else null end as achievement_pct
from performance_targets pt;

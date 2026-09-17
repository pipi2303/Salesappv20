// Unified target/actual/forecast tracking — single source of truth.
//
// Replaces four independent, divergent implementations of the same
// "target vs actual" concept found in the current codebase:
//   - TerritoryManagement.tsx: Territory.revenue / target / achievement
//     (achievement computed inline as revenue/target*100 in the component)
//   - CommissionCalculator.tsx: tier-based achievementRate per sales rep
//   - src/app/data/dummyData.ts: SalesRep-like interface with its own
//     target / achievement fields
//   - src/types/kpi.ts SalesKPI: target_revenue_q / actual_revenue_q
//     (kept as-is for now — KPI's shape is richer and used by its own
//     dashboard; migrating it is a separate, larger effort than this
//     Tahap A scope covers, but it's the same underlying pattern and a
//     candidate for a later pass)
//
// Mirrors the `performance_targets` table in
// supabase/migrations/0001_unified_product_model.sql, including the
// "exclusive arc" rule: exactly one of productId / salesRepId /
// territoryId is set per record — never zero, never more than one.

export type PerformanceEntity =
  | { productId: string; salesRepId?: undefined; territoryId?: undefined }
  | { productId?: undefined; salesRepId: string; territoryId?: undefined }
  | { productId?: undefined; salesRepId?: undefined; territoryId: string };

export type PerformanceTarget = PerformanceEntity & {
  id: string;
  /** First day of the tracked month, ISO date string, e.g. '2026-09-01'. */
  period: string;
  target: number;
  actual: number;
  forecast?: number;
  createdAt: string;
  updatedAt: string;
};

export type NewPerformanceTarget = PerformanceEntity & {
  period: string;
  target: number;
  actual?: number;
  forecast?: number;
};

/** Same formula as the `performance_targets_with_achievement` DB view — kept in one place instead of re-derived per module. */
export function computeAchievementPct(pt: Pick<PerformanceTarget, 'target' | 'actual'>): number | null {
  if (pt.target <= 0) return null;
  return Math.round((pt.actual / pt.target) * 10000) / 100;
}

export function describeEntity(pt: PerformanceTarget): { type: 'product' | 'sales_rep' | 'territory'; id: string } {
  if (pt.productId) return { type: 'product', id: pt.productId };
  if (pt.salesRepId) return { type: 'sales_rep', id: pt.salesRepId };
  return { type: 'territory', id: pt.territoryId };
}

// Territory profile — the parts of a territory that are NOT target/actual/
// forecast data (those live in performance_targets / PerformanceTarget,
// keyed by territoryId). Keeping profile and performance data in separate
// stores mirrors the SQL schema (territories table vs performance_targets)
// and avoids re-introducing the "achievement computed and stored inline"
// duplication this Tahap A pass is meant to remove.
export interface TerritoryProfile {
  id: string;
  name: string;
  region: string;
  assignedTo: string;
  leads: number;
  opportunities: number;
  coverage: number;
  createdAt: string;
  updatedAt: string;
}

export type NewTerritoryProfile = Omit<TerritoryProfile, 'id' | 'createdAt' | 'updatedAt'>;

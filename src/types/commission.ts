// Commission payout ledger — status/baseCommission/bonuses/deals/paymentDate
// are genuinely different data than target/actual/forecast (they're payout
// bookkeeping, not a sales figure), so they stay in their own store rather
// than being folded into PerformanceTarget. What WAS duplicated before this
// migration is the underlying totalSales/achievementRate figures, which are
// no longer stored here — they're derived at read time from
// performanceTargetsRepository (this rep's target/actual for the period),
// via computeAchievementPct in src/types/performanceTarget.ts.
export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface CommissionRecord {
  id: string;
  salesRepId: string;
  /** First day of the month this payout covers, ISO date string. */
  period: string;
  baseCommission: number;
  bonuses: number;
  totalCommission: number;
  status: CommissionStatus;
  deals: number;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewCommissionRecord = Omit<CommissionRecord, 'id' | 'createdAt' | 'updatedAt'>;

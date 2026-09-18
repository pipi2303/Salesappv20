// Commission payout ledger repository — localStorage-backed. Deliberately
// does NOT store totalSales/achievementRate: those are the same fact as a
// sales rep's performance_targets actual/target for the period, and are
// joined in at read time by the caller (see CommissionCalculator.tsx) via
// performanceTargetsRepository + computeAchievementPct, instead of being
// duplicated here.
import type { CommissionRecord, NewCommissionRecord } from '@/types/commission';

type Result<T> = { success: boolean; data?: T; error?: string };

const STORAGE_KEY = 'sales_monitoring_commissions_v2';

function readAll(): CommissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CommissionRecord[]) : [];
  } catch (error) {
    console.error('commissionsRepository: corrupted localStorage data, resetting to empty', error);
    return [];
  }
}

function writeAll(records: CommissionRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function validate(input: NewCommissionRecord): string | null {
  if (!input.salesRepId?.trim()) return 'salesRepId wajib diisi';
  if (!input.period?.trim()) return 'Period wajib diisi';
  if (typeof input.baseCommission !== 'number' || input.baseCommission < 0) return 'Base commission harus angka >= 0';
  if (typeof input.bonuses !== 'number' || input.bonuses < 0) return 'Bonuses harus angka >= 0';
  if (typeof input.totalCommission !== 'number' || input.totalCommission < 0) return 'Total commission harus angka >= 0';
  if (!['pending', 'approved', 'paid'].includes(input.status)) return 'Status tidak valid';
  if (typeof input.deals !== 'number' || input.deals < 0) return 'Deals harus angka >= 0';
  return null;
}

export const commissionsRepository = {
  async getAll(): Promise<Result<CommissionRecord[]>> {
    return { success: true, data: readAll() };
  },

  async getForSalesRep(salesRepId: string): Promise<Result<CommissionRecord[]>> {
    return { success: true, data: readAll().filter((r) => r.salesRepId === salesRepId) };
  },

  async create(input: NewCommissionRecord): Promise<Result<CommissionRecord>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const records = readAll();
    if (records.some((r) => r.salesRepId === input.salesRepId && r.period === input.period)) {
      return { success: false, error: 'Sudah ada payout record untuk sales rep dan period yang sama' };
    }

    const now = new Date().toISOString();
    const created: CommissionRecord = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    records.push(created);
    writeAll(records);
    return { success: true, data: created };
  },

  async update(id: string, updates: Partial<NewCommissionRecord>): Promise<Result<CommissionRecord>> {
    const records = readAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return { success: false, error: 'Payout record tidak ditemukan' };

    const merged = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
    const validationError = validate(merged);
    if (validationError) return { success: false, error: validationError };

    records[index] = merged;
    writeAll(records);
    return { success: true, data: merged };
  },

  async remove(id: string): Promise<Result<void>> {
    const records = readAll();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) return { success: false, error: 'Payout record tidak ditemukan' };
    writeAll(filtered);
    return { success: true };
  },
};

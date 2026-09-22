// Performance targets repository — adapter layer over the unified
// target/actual/forecast model (see src/types/performanceTarget.ts for
// why this replaces four separate implementations across the codebase).
//
// Same localStorage-now/Postgres-later adapter shape as
// productsRepository.ts, and the same reasoning for keeping it separate
// from api.ts: validation belongs here, not scattered across whichever
// component happens to write a target/achievement number.

import type { PerformanceTarget, NewPerformanceTarget } from '@/types/performanceTarget';
import type { Result } from '@/types/result';


const STORAGE_KEY = 'sales_monitoring_performance_targets';

function readAll(): PerformanceTarget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PerformanceTarget[]) : [];
  } catch (error) {
    console.error('performanceTargetsRepository: corrupted localStorage data, resetting to empty', error);
    return [];
  }
}

function writeAll(targets: PerformanceTarget[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
}

function entityKey(input: Pick<NewPerformanceTarget, 'productId' | 'salesRepId' | 'territoryId'>): string {
  if (input.productId) return `product:${input.productId}`;
  if (input.salesRepId) return `sales_rep:${input.salesRepId}`;
  return `territory:${input.territoryId}`;
}

/** Mirrors the DB "exclusive arc" check constraint — exactly one entity reference, never zero, never more than one. */
function validate(input: NewPerformanceTarget): string | null {
  const setCount = [input.productId, input.salesRepId, input.territoryId].filter((v) => v !== undefined && v !== null).length;
  if (setCount !== 1) return 'Harus mengisi tepat satu dari productId, salesRepId, atau territoryId';
  if (!input.period?.trim()) return 'Period wajib diisi (format tanggal ISO, misal 2026-09-01)';
  if (typeof input.target !== 'number' || input.target < 0) return 'Target harus angka >= 0';
  if (input.actual !== undefined && (typeof input.actual !== 'number' || input.actual < 0)) return 'Actual harus angka >= 0';
  if (input.forecast !== undefined && (typeof input.forecast !== 'number' || input.forecast < 0)) return 'Forecast harus angka >= 0';
  return null;
}

export const performanceTargetsRepository = {
  async getAll(): Promise<Result<PerformanceTarget[]>> {
    return { success: true, data: readAll() };
  },

  /** Convenience filter — most callers want "all targets for this product/rep/territory", not the whole table. */
  async getForEntity(entity: Pick<NewPerformanceTarget, 'productId' | 'salesRepId' | 'territoryId'>): Promise<Result<PerformanceTarget[]>> {
    const key = entityKey(entity);
    const data = readAll().filter((t) => entityKey(t) === key);
    return { success: true, data };
  },

  async create(input: NewPerformanceTarget): Promise<Result<PerformanceTarget>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const targets = readAll();
    const key = entityKey(input);
    if (targets.some((t) => entityKey(t) === key && t.period === input.period)) {
      return { success: false, error: 'Sudah ada target untuk entity dan period yang sama' };
    }

    const now = new Date().toISOString();
    const created: PerformanceTarget = {
      ...input,
      actual: input.actual ?? 0,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as PerformanceTarget;
    targets.push(created);
    writeAll(targets);
    return { success: true, data: created };
  },

  async update(id: string, updates: Partial<NewPerformanceTarget>): Promise<Result<PerformanceTarget>> {
    const targets = readAll();
    const index = targets.findIndex((t) => t.id === id);
    if (index === -1) return { success: false, error: 'Target tidak ditemukan' };

    const merged = { ...targets[index], ...updates, updatedAt: new Date().toISOString() } as PerformanceTarget;
    const validationError = validate(merged);
    if (validationError) return { success: false, error: validationError };

    targets[index] = merged;
    writeAll(targets);
    return { success: true, data: merged };
  },

  async remove(id: string): Promise<Result<void>> {
    const targets = readAll();
    const filtered = targets.filter((t) => t.id !== id);
    if (filtered.length === targets.length) return { success: false, error: 'Target tidak ditemukan' };
    writeAll(filtered);
    return { success: true };
  },
};

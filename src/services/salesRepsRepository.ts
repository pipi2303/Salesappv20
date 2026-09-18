// Sales reps repository — localStorage-backed, same adapter shape as
// productsRepository.ts / performanceTargetsRepository.ts.
import type { SalesRep, NewSalesRep } from '@/types/salesRep';
import type { Result } from '@/types/result';


const STORAGE_KEY = 'sales_monitoring_sales_reps_v2';

function readAll(): SalesRep[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SalesRep[]) : [];
  } catch (error) {
    console.error('salesRepsRepository: corrupted localStorage data, resetting to empty', error);
    return [];
  }
}

function writeAll(reps: SalesRep[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reps));
}

function validate(input: NewSalesRep): string | null {
  if (!input.name?.trim()) return 'Nama sales rep wajib diisi';
  if (!input.email?.trim() || !input.email.includes('@')) return 'Email tidak valid';
  if (!input.role?.trim()) return 'Role wajib diisi';
  return null;
}

export const salesRepsRepository = {
  async getAll(): Promise<Result<SalesRep[]>> {
    return { success: true, data: readAll() };
  },

  async getById(id: string): Promise<Result<SalesRep>> {
    const found = readAll().find((r) => r.id === id);
    if (!found) return { success: false, error: 'Sales rep tidak ditemukan' };
    return { success: true, data: found };
  },

  async create(input: NewSalesRep): Promise<Result<SalesRep>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const reps = readAll();
    if (reps.some((r) => r.email === input.email)) {
      return { success: false, error: `Email "${input.email}" sudah dipakai sales rep lain` };
    }

    const created: SalesRep = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    reps.push(created);
    writeAll(reps);
    return { success: true, data: created };
  },

  async update(id: string, updates: Partial<NewSalesRep>): Promise<Result<SalesRep>> {
    const reps = readAll();
    const index = reps.findIndex((r) => r.id === id);
    if (index === -1) return { success: false, error: 'Sales rep tidak ditemukan' };

    const merged = { ...reps[index], ...updates };
    const validationError = validate(merged);
    if (validationError) return { success: false, error: validationError };

    reps[index] = merged;
    writeAll(reps);
    return { success: true, data: merged };
  },

  async remove(id: string): Promise<Result<void>> {
    const reps = readAll();
    const filtered = reps.filter((r) => r.id !== id);
    if (filtered.length === reps.length) return { success: false, error: 'Sales rep tidak ditemukan' };
    writeAll(filtered);
    return { success: true };
  },
};

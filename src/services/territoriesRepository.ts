// Territories repository — localStorage-backed profile store (name/region/
// assignedTo/leads/opportunities/coverage). Target/actual/forecast revenue
// figures are NOT stored here — see performanceTargetsRepository, keyed by
// territoryId.
import type { TerritoryProfile, NewTerritoryProfile } from '@/types/territory';

type Result<T> = { success: boolean; data?: T; error?: string };

const STORAGE_KEY = 'sales_monitoring_territories_v2';

function readAll(): TerritoryProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TerritoryProfile[]) : [];
  } catch (error) {
    console.error('territoriesRepository: corrupted localStorage data, resetting to empty', error);
    return [];
  }
}

function writeAll(territories: TerritoryProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(territories));
}

function validate(input: NewTerritoryProfile): string | null {
  if (!input.name?.trim()) return 'Nama wilayah wajib diisi';
  if (!input.region?.trim()) return 'Region wajib diisi';
  if (!input.assignedTo?.trim()) return 'Penanggung jawab wajib diisi';
  if (typeof input.coverage !== 'number' || input.coverage < 0 || input.coverage > 100) return 'Coverage harus angka 0-100';
  return null;
}

export const territoriesRepository = {
  async getAll(): Promise<Result<TerritoryProfile[]>> {
    return { success: true, data: readAll() };
  },

  async getById(id: string): Promise<Result<TerritoryProfile>> {
    const found = readAll().find((t) => t.id === id);
    if (!found) return { success: false, error: 'Wilayah tidak ditemukan' };
    return { success: true, data: found };
  },

  async create(input: NewTerritoryProfile): Promise<Result<TerritoryProfile>> {
    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const now = new Date().toISOString();
    const created: TerritoryProfile = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    const territories = readAll();
    territories.push(created);
    writeAll(territories);
    return { success: true, data: created };
  },

  async update(id: string, updates: Partial<NewTerritoryProfile>): Promise<Result<TerritoryProfile>> {
    const territories = readAll();
    const index = territories.findIndex((t) => t.id === id);
    if (index === -1) return { success: false, error: 'Wilayah tidak ditemukan' };

    const merged = { ...territories[index], ...updates, updatedAt: new Date().toISOString() };
    const validationError = validate(merged);
    if (validationError) return { success: false, error: validationError };

    territories[index] = merged;
    writeAll(territories);
    return { success: true, data: merged };
  },

  async remove(id: string): Promise<Result<void>> {
    const territories = readAll();
    const filtered = territories.filter((t) => t.id !== id);
    if (filtered.length === territories.length) return { success: false, error: 'Wilayah tidak ditemukan' };
    writeAll(filtered);
    return { success: true };
  },
};

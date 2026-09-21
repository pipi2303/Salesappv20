// Tasks repository — same adapter pattern as productsRepository.ts /
// leadsRepository.ts / opportunitiesRepository.ts.
//
// Bab 8 gap 2 ("Tidak ada verifikasi display produk di toko") — Task's
// GPS check-in flow (TaskManagement.tsx's handleCheckIn) was already
// fully built on the frontend but entirely localStorage-backed via
// tasksApi (src/services/api.ts), with no server route at all and no
// photo/camera logic anywhere. This file replaces tasksApi with real
// calls to GET/POST /api/tasks and GET/PUT/DELETE/POST /api/tasks/:id
// (prisma/schema.prisma's Task model).
//
// Shape gaps bridged here:
// - status / priority / type are SCREAMING_SNAKE_CASE Prisma enums
//   server-side, lower-case (with dashes for status) string literals
//   client-side — STATUS_OUT/STATUS_IN, PRIORITY_OUT/PRIORITY_IN,
//   TYPE_OUT/TYPE_IN.
// - dueDate/completedDate/checkInAt/createdAt/updatedAt are DateTime
//   columns; unlike Opportunity's Decimal fields these already
//   round-trip as plain ISO strings over JSON, no Number() needed.
// - tags/subtasks/relatedTo/parentTaskId have no dedicated Task
//   column — same EXTRA_KEYS approach as Lead/Opportunity's long-tail
//   fields — round-trip through Task.extra.
//
// checkIn(): the one method with no tasksApi.* equivalent at all. Hits
// the dedicated POST /api/tasks/:id sub-action (not PUT) so the server
// can decode+upload a photo data URL via lib/blob.ts before writing
// the row — see api/tasks/[id].ts's POST handler. TaskManagement.tsx's
// handleCheckIn previously did this via a plain update() against
// localStorage; it now calls this instead.

import type { Task, TaskStatus, TaskPriority, TaskType } from '@/types/task';
import type { Result } from '@/types/result';

export type { Task, SubTask, TaskStatus, TaskPriority, TaskType } from '@/types/task';

function getAuthToken(): string | undefined {
  try {
    const raw = localStorage.getItem('salesMonitorUser');
    if (!raw) return undefined;
    return JSON.parse(raw)?.accessToken;
  } catch {
    return undefined;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<Result<T>> {
  try {
    const token = getAuthToken();
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const body = res.status === 204 ? { success: true } : await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, error: 'Sesi login tidak valid atau sudah berakhir. Silakan logout dan login kembali.' };
      }
      return { success: false, error: body.error ?? 'Terjadi kesalahan pada server' };
    }
    return body as Result<T>;
  } catch (error) {
    console.error(`tasksRepository: request failed (${path}):`, error);
    return { success: false, error: 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.' };
  }
}

const STATUS_OUT: Record<TaskStatus, string> = {
  todo: 'TODO',
  'in-progress': 'IN_PROGRESS',
  completed: 'COMPLETED',
};
const STATUS_IN: Record<string, TaskStatus> = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

const PRIORITY_OUT: Record<TaskPriority, string> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'URGENT',
};
const PRIORITY_IN: Record<string, TaskPriority> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

const TYPE_OUT: Record<TaskType, string> = {
  visit: 'VISIT',
  call: 'CALL',
  email: 'EMAIL',
  other: 'OTHER',
};
const TYPE_IN: Record<string, TaskType> = {
  VISIT: 'visit',
  CALL: 'call',
  EMAIL: 'email',
  OTHER: 'other',
};

// UI fields with no dedicated Task column — see the file header. Kept
// as an explicit list (not "everything unrecognized") so a typo'd
// field name fails loudly by just not round-tripping, rather than
// silently being accepted as "extra".
const EXTRA_KEYS = ['tags', 'subtasks', 'relatedTo', 'parentTaskId'] as const;

function toApiPayload(input: Partial<Task>): Record<string, unknown> {
  const { status, priority, type, ...rest } = input as Record<string, unknown> & {
    status?: TaskStatus;
    priority?: TaskPriority;
    type?: TaskType;
  };
  const payload: Record<string, unknown> = { ...rest };
  if (status) payload.status = STATUS_OUT[status];
  if (priority) payload.priority = PRIORITY_OUT[priority];
  if (type) payload.type = TYPE_OUT[type];

  const extra: Record<string, unknown> = {};
  let hasExtra = false;
  for (const key of EXTRA_KEYS) {
    if (key in payload) {
      extra[key] = payload[key];
      delete payload[key];
      hasExtra = true;
    }
  }
  if (hasExtra) payload.extra = extra;

  return payload;
}

function fromApiTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    status: STATUS_IN[row.status] ?? 'todo',
    priority: PRIORITY_IN[row.priority] ?? 'medium',
    type: TYPE_IN[row.type] ?? 'other',
    dueDate: row.dueDate ?? '',
    assignedTo: row.assignedTo ?? '',
    createdBy: row.createdBy ?? '',
    createdDate: row.createdAt,
    category: row.category ?? '',
    completedDate: row.completedDate ?? undefined,

    checkInAt: row.checkInAt ?? undefined,
    checkInLat: row.checkInLat ?? undefined,
    checkInLng: row.checkInLng ?? undefined,
    checkInAccuracy: row.checkInAccuracy ?? undefined,
    checkInPhotoUrl: row.checkInPhotoUrl ?? undefined,
    locationValidated: row.locationValidated ?? undefined,

    tags: [],

    // tags/subtasks/relatedTo/parentTaskId — see EXTRA_KEYS / the file header.
    ...(row.extra ?? {}),
  };
}

export interface CheckInInput {
  lat?: number;
  lng?: number;
  accuracy?: number;
  locationValidated?: boolean;
  photoDataUrl?: string;
}

export const tasksRepository = {
  async getAll(): Promise<Result<Task[]>> {
    const res = await apiFetch<any[]>('/api/tasks');
    if (!res.success || !res.data) return res as Result<Task[]>;
    return { success: true, data: res.data.map(fromApiTask) };
  },

  async getById(id: string): Promise<Result<Task>> {
    const res = await apiFetch<any>(`/api/tasks/${id}`);
    if (!res.success || !res.data) return res as Result<Task>;
    return { success: true, data: fromApiTask(res.data) };
  },

  async create(input: Partial<Task>): Promise<Result<Task>> {
    const res = await apiFetch<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(input)),
    });
    if (!res.success || !res.data) return res as Result<Task>;
    return { success: true, data: fromApiTask(res.data) };
  },

  async update(id: string, updates: Partial<Task>): Promise<Result<Task>> {
    const res = await apiFetch<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiPayload(updates)),
    });
    if (!res.success || !res.data) return res as Result<Task>;
    return { success: true, data: fromApiTask(res.data) };
  },

  async remove(id: string): Promise<Result<void>> {
    return apiFetch<void>(`/api/tasks/${id}`, { method: 'DELETE' });
  },

  // FR-03 GPS check-in ("foto toko bertanggal"). Hits the dedicated POST
  // sub-action on /api/tasks/:id rather than update() — see the file
  // header for why.
  async checkIn(id: string, input: CheckInInput): Promise<Result<Task>> {
    const res = await apiFetch<any>(`/api/tasks/${id}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res.success || !res.data) return res as Result<Task>;
    return { success: true, data: fromApiTask(res.data) };
  },
};

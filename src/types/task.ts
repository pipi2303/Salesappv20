// Task type — extracted from TaskManagement.tsx (previously the only
// place this shape was declared) so tasksRepository.ts can import it
// too, same convention as src/types/lead.ts / src/types/opportunity.ts.

// FR-03/FR-07: Task type drives whether GPS Check-in is available ('visit' only).
export type TaskType = 'visit' | 'call' | 'email' | 'other';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate: string;
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  category: string;
  relatedTo?: string;
  tags: string[];
  subtasks?: SubTask[];
  completedDate?: string;
  // FR-07: link a follow-up task back to the task it was created from
  parentTaskId?: string;
  // FR-03: GPS check-in evidence for Visit-type tasks. Read-only once set
  // (no manual input field anywhere in the UI).
  checkInAt?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkInAccuracy?: number;
  // Bab 8 gap 2: "foto toko bertanggal" — set by tasksRepository.checkIn()
  // when a photo was uploaded; undefined for a check-in with no photo.
  checkInPhotoUrl?: string;
  locationValidated?: boolean;
  // Which Store this task's check-in belongs to (prisma/schema.prisma's
  // Task.storeId) — was already on the API response but never surfaced
  // client-side until DistributorStoreMap.tsx's Fase 2 visit layer needed
  // to group check-ins by store.
  storeId?: string;
}

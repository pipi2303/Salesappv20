// src/types/distributor.ts — Bab 8/9: distributor master data + approval
// workflow (prisma/schema.prisma's Distributor model). Same shape
// conventions as src/types/lead.ts / task.ts.

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Distributor {
  id: string;
  code: string;
  name: string;
  address: string;
  gpsLat: number | null;
  gpsLng: number | null;
  status: ApprovalStatus;
  submittedById: string | null;
  submittedAt: Date | null;
  decidedById: string | null;
  decidedAt: Date | null;
  rejectionNote: string;
  createdAt: Date;
  updatedAt: Date;
}

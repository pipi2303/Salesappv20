export interface Demo {
  id: string;
  title: string;
  leadName: string;
  company: string;
  date: Date;
  time: string;
  duration: number;
  presenter: string;
  product: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  meetingLink: string;
  notes: string;
  // Advanced Scheduling Features
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
    type: 'internal' | 'external';
    rsvp: 'pending' | 'accepted' | 'declined';
  }>;
  resources?: Array<{
    id: string;
    name: string;
    type: 'room' | 'equipment' | 'software';
  }>;
  rescheduleHistory?: Array<{
    previousDate: string;
    previousTime: string;
    newDate: string;
    newTime: string;
    reason: string;
    timestamp: string;
  }>;
  bufferTime?: {
    before: number; // minutes
    after: number;  // minutes
  };
  conflicts?: Array<{
    type: 'time' | 'resource' | 'presenter';
    description: string;
  }>;
  rating?: number;
  reviewerName?: string;
  reviewDate?: Date;
  reviewText?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  company: string;
  product: string;
  value: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  signedBy: string;
  salesPerson: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

export const contracts: Contract[] = [
  {
    id: 'C001',
    contractNumber: 'CTR-2026-001',
    clientName: 'PT Sukses Bersama',
    company: 'PT Sukses Bersama',
    product: 'Enterprise Plan',
    value: 350000000,
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 11, 31),
    status: 'active',
    signedBy: 'Direktur Utama',
    salesPerson: 'Budi Santoso'
  },
  {
    id: 'C002',
    contractNumber: 'CTR-2026-002',
    clientName: 'CV Mitra Sejahtera',
    company: 'CV Mitra Sejahtera',
    product: 'Professional Plan',
    value: 180000000,
    startDate: new Date(2026, 0, 15),
    endDate: new Date(2026, 11, 31),
    status: 'active',
    signedBy: 'General Manager',
    salesPerson: 'Ani Wijaya'
  },
  {
    id: 'C003',
    contractNumber: 'CTR-2026-003',
    clientName: 'PT Teknologi Canggih',
    company: 'PT Teknologi Canggih',
    product: 'Enterprise Plan',
    value: 420000000,
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2027, 0, 31),
    status: 'pending',
    signedBy: 'CEO',
    salesPerson: 'Budi Santoso'
  },
  {
    id: 'C004',
    contractNumber: 'CTR-2025-089',
    clientName: 'CV Mandiri Jaya',
    company: 'CV Mandiri Jaya',
    product: 'Starter Plan',
    value: 60000000,
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2026, 5, 30),
    status: 'active',
    signedBy: 'Owner',
    salesPerson: 'Citra Dewi'
  },
  {
    id: 'C005',
    contractNumber: 'CTR-2025-078',
    clientName: 'PT Global Prima',
    company: 'PT Global Prima',
    product: 'Professional Plan',
    value: 150000000,
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    status: 'expired',
    signedBy: 'Direktur',
    salesPerson: 'Eka Putri'
  },
  {
    id: 'C006',
    contractNumber: 'CTR-2026-004',
    clientName: 'PT Inovasi Digital',
    company: 'PT Inovasi Digital',
    product: 'Custom Development',
    value: 500000000,
    startDate: new Date(2026, 0, 10),
    endDate: new Date(2026, 5, 10),
    status: 'pending',
    signedBy: 'CTO',
    salesPerson: 'Eka Putri'
  }
];

export const salesData = [
  { month: 'Jul', value: 420 },
  { month: 'Agu', value: 580 },
  { month: 'Sep', value: 520 },
  { month: 'Okt', value: 680 },
  { month: 'Nov', value: 720 },
  { month: 'Des', value: 650 },
  { month: 'Jan', value: 845 }
];

export const leadSourceData = [
  { name: 'Website', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'Cold Call', value: 15 },
  { name: 'Social Media', value: 15 },
  { name: 'Email Campaign', value: 10 }
];

export const performanceData = [
  { name: 'Budi S.', target: 200, achievement: 185 },
  { name: 'Ani W.', target: 150, achievement: 142 },
  { name: 'Eka P.', target: 150, achievement: 156 },
  { name: 'Citra D.', target: 150, achievement: 128 },
  { name: 'Deni R.', target: 100, achievement: 87 }
];

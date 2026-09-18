import type { Lead } from '@/types/lead';

export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  target: number;
  achievement: number;
  totalDeals: number;
  avatar: string;
  joinDate: Date;
  region: string;
  performance: number;
}

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

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: Date;
  details: string;
  ipAddress: string;
}

export const leads: Lead[] = [
  {
    id: 'L001',
    name: 'Ahmad Hidayat',
    company: 'PT Maju Jaya',
    email: 'ahmad@majujaya.com',
    phone: '081234567890',
    status: 'qualified',
    value: 150000000,
    source: 'Website',
    assignedTo: 'Budi Santoso',
    createdAt: new Date(2026, 0, 15),
    lastContact: new Date(2026, 0, 20),
    notes: 'Tertarik dengan Enterprise Plan, butuh demo minggu depan'
  },
  {
    id: 'L002',
    name: 'Siti Nurhaliza',
    company: 'CV Berkah Mandiri',
    email: 'siti@berkahmandiri.com',
    phone: '081234567891',
    status: 'proposal',
    value: 85000000,
    source: 'Referral',
    assignedTo: 'Ani Wijaya',
    createdAt: new Date(2026, 0, 10),
    lastContact: new Date(2026, 0, 19),
    notes: 'Proposal sudah dikirim, menunggu feedback'
  },
  {
    id: 'L003',
    name: 'Bambang Suryono',
    company: 'PT Digital Nusantara',
    email: 'bambang@digitalnusantara.com',
    phone: '081234567892',
    status: 'negotiation',
    value: 250000000,
    source: 'Cold Call',
    assignedTo: 'Budi Santoso',
    createdAt: new Date(2026, 0, 5),
    lastContact: new Date(2026, 0, 21),
    notes: 'Negosiasi harga, kemungkinan close minggu ini'
  },
  {
    id: 'L004',
    name: 'Dewi Lestari',
    company: 'PT Teknologi Masa Depan',
    email: 'dewi@tekmasadepan.com',
    phone: '081234567893',
    status: 'new',
    value: 120000000,
    source: 'Social Media',
    assignedTo: 'Citra Dewi',
    createdAt: new Date(2026, 0, 18),
    lastContact: new Date(2026, 0, 18),
    notes: 'Lead baru, perlu follow up'
  },
  {
    id: 'L005',
    name: 'Eko Prasetyo',
    company: 'CV Karya Gemilang',
    email: 'eko@karyagemilang.com',
    phone: '081234567894',
    status: 'contacted',
    value: 95000000,
    source: 'Email Campaign',
    assignedTo: 'Deni Ramadhan',
    createdAt: new Date(2026, 0, 12),
    lastContact: new Date(2026, 0, 17),
    notes: 'Sudah dihubungi, butuh informasi lebih detail'
  }
];

export const salesTeam: SalesPerson[] = [
  {
    id: 'S001',
    name: 'Budi Santoso',
    email: 'budi.santoso@company.com',
    phone: '081234567801',
    position: 'Senior Sales Executive',
    target: 200000000,
    achievement: 185000000,
    totalDeals: 8,
    avatar: 'BS',
    joinDate: new Date(2024, 0, 15),
    region: 'Jakarta',
    performance: 92.5
  },
  {
    id: 'S002',
    name: 'Ani Wijaya',
    email: 'ani.wijaya@company.com',
    phone: '081234567802',
    position: 'Sales Executive',
    target: 150000000,
    achievement: 142000000,
    totalDeals: 6,
    avatar: 'AW',
    joinDate: new Date(2024, 2, 10),
    region: 'Bandung',
    performance: 94.7
  },
  {
    id: 'S003',
    name: 'Citra Dewi',
    email: 'citra.dewi@company.com',
    phone: '081234567803',
    position: 'Sales Executive',
    target: 150000000,
    achievement: 128000000,
    totalDeals: 5,
    avatar: 'CD',
    joinDate: new Date(2024, 5, 1),
    region: 'Surabaya',
    performance: 85.3
  },
  {
    id: 'S004',
    name: 'Deni Ramadhan',
    email: 'deni.ramadhan@company.com',
    phone: '081234567804',
    position: 'Junior Sales Executive',
    target: 100000000,
    achievement: 87000000,
    totalDeals: 4,
    avatar: 'DR',
    joinDate: new Date(2025, 0, 15),
    region: 'Jakarta',
    performance: 87.0
  },
  {
    id: 'S005',
    name: 'Eka Putri',
    email: 'eka.putri@company.com',
    phone: '081234567805',
    position: 'Sales Executive',
    target: 150000000,
    achievement: 156000000,
    totalDeals: 7,
    avatar: 'EP',
    joinDate: new Date(2024, 8, 20),
    region: 'Medan',
    performance: 104.0
  }
];

export const demos: Demo[] = [
  {
    id: 'D001',
    title: 'Demo Enterprise Plan',
    leadName: 'Ahmad Hidayat',
    company: 'PT Maju Jaya',
    date: new Date(2026, 0, 22),
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'Enterprise Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12345',
    notes: 'Fokus pada fitur analytics dan reporting',
    attendees: [
      {
        id: 'A001',
        name: 'Ahmad Hidayat',
        email: 'ahmad@majujaya.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A002',
        name: 'Siti Rahman',
        email: 'siti@majujaya.co.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A003',
        name: 'Budi Santoso',
        email: 'budi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      },
      {
        id: 'A004',
        name: 'Desi Marketing',
        email: 'desi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R001',
        name: 'Meeting Room A',
        type: 'room'
      },
      {
        id: 'R002',
        name: 'Projector 4K',
        type: 'equipment'
      },
      {
        id: 'R003',
        name: 'Zoom Premium',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 15,
      after: 15
    }
  },
  {
    id: 'D002',
    title: 'Demo Professional Plan',
    leadName: 'Siti Nurhaliza',
    company: 'CV Berkah Mandiri',
    date: new Date(2026, 0, 22),
    time: '14:00',
    duration: 45,
    presenter: 'Ani Wijaya',
    product: 'Professional Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12346',
    notes: 'Tunjukkan integrasi dengan existing system',
    attendees: [
      {
        id: 'A005',
        name: 'Siti Nurhaliza',
        email: 'siti@berkahmandiri.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A006',
        name: 'Ani Wijaya',
        email: 'ani@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R004',
        name: 'Meeting Room B',
        type: 'room'
      },
      {
        id: 'R005',
        name: 'Google Meet',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 10,
      after: 10
    }
  },
  {
    id: 'D003',
    title: 'Demo Starter Plan',
    leadName: 'Dewi Lestari',
    company: 'PT Teknologi Masa Depan',
    date: new Date(2026, 0, 23),
    time: '11:00',
    duration: 30,
    presenter: 'Citra Dewi',
    product: 'Starter Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12347',
    notes: 'Demo basic features dan onboarding process',
    attendees: [
      {
        id: 'A007',
        name: 'Dewi Lestari',
        email: 'dewi@teknomasadepan.co.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A008',
        name: 'Citra Dewi',
        email: 'citra@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R006',
        name: 'Microsoft Teams',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 5,
      after: 10
    }
  },
  {
    id: 'D004',
    title: 'Follow-up Demo Enterprise',
    leadName: 'Bambang Suryono',
    company: 'PT Digital Nusantara',
    date: new Date(2026, 0, 20),
    time: '15:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'Enterprise Plan',
    status: 'completed',
    meetingLink: 'https://meet.zoom.us/demo-12348',
    notes: 'Demo berjalan lancar, siap untuk proposal',
    attendees: [
      {
        id: 'A009',
        name: 'Bambang Suryono',
        email: 'bambang@digitalnusantara.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A010',
        name: 'Rina Finance',
        email: 'rina@digitalnusantara.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A011',
        name: 'Dedi IT Manager',
        email: 'dedi@digitalnusantara.com',
        type: 'external',
        rsvp: 'declined'
      },
      {
        id: 'A012',
        name: 'Budi Santoso',
        email: 'budi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R007',
        name: 'Conference Room Executive',
        type: 'room'
      },
      {
        id: 'R008',
        name: 'LED Display 65"',
        type: 'equipment'
      },
      {
        id: 'R009',
        name: 'Wireless Mic',
        type: 'equipment'
      },
      {
        id: 'R010',
        name: 'Zoom Enterprise',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 20,
      after: 15
    },
    rating: 5,
    reviewerName: 'Bambang Suryono',
    reviewDate: new Date(2026, 0, 20),
    reviewText: 'Excellent demo presentation! The presenter was very knowledgeable and addressed all our concerns. The Enterprise Plan features align perfectly with our business needs. Highly recommend this solution for enterprise-level implementations.'
  },
  {
    id: 'D005',
    title: 'Demo Custom Development',
    leadName: 'Rina Susanti',
    company: 'PT Solusi Digital',
    date: new Date(2026, 0, 24),
    time: '13:00',
    duration: 90,
    presenter: 'Eka Putri',
    product: 'Custom Development',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12349',
    notes: 'Demo custom solutions and integration capabilities',
    attendees: [
      {
        id: 'A013',
        name: 'Rina Susanti',
        email: 'rina@solusidigital.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A014',
        name: 'Agus CTO',
        email: 'agus@solusidigital.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A015',
        name: 'Eka Putri',
        email: 'eka@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      },
      {
        id: 'A016',
        name: 'Fajar Tech Lead',
        email: 'fajar@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R011',
        name: 'Innovation Lab',
        type: 'room'
      },
      {
        id: 'R012',
        name: 'Whiteboard Digital',
        type: 'equipment'
      },
      {
        id: 'R013',
        name: 'Development Sandbox',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 30,
      after: 20
    }
  }
];

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

export const users: User[] = [
  {
    id: 'U001',
    name: 'Admin Utama',
    email: 'admin@company.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: new Date(2026, 0, 21, 9, 30),
    createdAt: new Date(2024, 0, 1)
  },
  {
    id: 'U002',
    name: 'Budi Santoso',
    email: 'budi.santoso@company.com',
    role: 'Sales Manager',
    status: 'active',
    lastLogin: new Date(2026, 0, 21, 8, 15),
    createdAt: new Date(2024, 0, 15)
  },
  {
    id: 'U003',
    name: 'Ani Wijaya',
    email: 'ani.wijaya@company.com',
    role: 'Sales Executive',
    status: 'active',
    lastLogin: new Date(2026, 0, 21, 7, 45),
    createdAt: new Date(2024, 2, 10)
  },
  {
    id: 'U004',
    name: 'Finance Manager',
    email: 'finance@company.com',
    role: 'Finance',
    status: 'active',
    lastLogin: new Date(2026, 0, 20, 16, 20),
    createdAt: new Date(2024, 1, 1)
  },
  {
    id: 'U005',
    name: 'Marketing Head',
    email: 'marketing@company.com',
    role: 'Marketing',
    status: 'active',
    lastLogin: new Date(2026, 0, 21, 8, 0),
    createdAt: new Date(2024, 1, 15)
  }
];

export const auditLogs: AuditLog[] = [
  {
    id: 'A001',
    user: 'Budi Santoso',
    action: 'Update Lead Status',
    module: 'Lead Management',
    timestamp: new Date(2026, 0, 21, 9, 15),
    details: 'Changed lead L003 status from Proposal to Negotiation',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'A002',
    user: 'Ani Wijaya',
    action: 'Create Demo',
    module: 'Demo Scheduler',
    timestamp: new Date(2026, 0, 21, 8, 45),
    details: 'Scheduled new demo D002 for CV Berkah Mandiri',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'A003',
    user: 'Admin Utama',
    action: 'Add User',
    module: 'User Management',
    timestamp: new Date(2026, 0, 21, 7, 30),
    details: 'Created new user account for Marketing Head',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'A004',
    user: 'Budi Santoso',
    action: 'Update Contract',
    module: 'Contract Management',
    timestamp: new Date(2026, 0, 20, 16, 20),
    details: 'Updated contract C003 status to Pending',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'A005',
    user: 'Citra Dewi',
    action: 'Add Lead',
    module: 'Lead Management',
    timestamp: new Date(2026, 0, 20, 14, 10),
    details: 'Added new lead L004 - Dewi Lestari',
    ipAddress: '192.168.1.102'
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

// ===== OPPORTUNITIES DATA =====
export const opportunities = [
  {
    id: 'OPP-1737550001',
    name: '50 Unit Laptop ThinkPad untuk PT ABC Indonesia',
    leadId: undefined,
    clientName: 'PT ABC Indonesia',
    contactPerson: 'Budi Santoso',
    email: 'budi.santoso@abcindonesia.com',
    phone: '+62 812 3456 7890',
    products: [
      {
        productId: 'PRD-001',
        productName: 'Laptop ThinkPad X1 Carbon',
        quantity: 50,
        unitPrice: 25000000,
        totalPrice: 1250000000,
      },
    ],
    totalValue: 1250000000,
    currency: 'IDR',
    probability: 70,
    createdDate: new Date('2025-01-15').toISOString(),
    closeDate: new Date('2025-02-28').toISOString(),
    stage: 'negotiation',
    status: 'open',
    source: 'referral',
    description: 'PT ABC Indonesia membutuhkan laptop untuk tim development mereka. Budget sudah disetujui dan mereka siap untuk closing bulan depan.',
    notes: 'Client sangat tertarik dengan fitur keamanan ThinkPad. Sudah mengatur meeting dengan CTO minggu depan.',
    ownerName: 'Ahmad Rizki',
    reminderSent: false,
    activities: [
      {
        id: 'ACT-001',
        type: 'created',
        description: 'Opportunity created from initial meeting',
        createdAt: new Date('2025-01-15').toISOString(),
      },
      {
        id: 'ACT-002',
        type: 'stage-change',
        description: 'Stage changed to negotiation',
        createdAt: new Date('2025-01-20').toISOString(),
      },
    ],
    createdBy: 'Ahmad Rizki',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
  {
    id: 'OPP-1737550002',
    name: 'Implementasi CRM System - PT Digital Solutions',
    clientName: 'PT Digital Solutions',
    contactPerson: 'Siti Nurhaliza',
    email: 'siti@digitalsolutions.id',
    phone: '+62 821 9876 5432',
    products: [
      {
        productId: 'PRD-005',
        productName: 'CRM System Enterprise',
        quantity: 1,
        unitPrice: 500000000,
        totalPrice: 500000000,
      },
    ],
    totalValue: 500000000,
    currency: 'IDR',
    probability: 50,
    closeDate: new Date('2025-03-15').toISOString(),
    stage: 'proposal',
    status: 'open',
    source: 'website',
    description: 'Implementasi CRM System untuk mengelola 100+ sales team mereka.',
    notes: 'Proposal sudah dikirim. Menunggu feedback dari tim IT mereka.',
    ownerName: 'Dewi Lestari',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-18').toISOString(),
  },
  {
    id: 'OPP-1737550003',
    name: '20 Server Dell PowerEdge - PT Cloud Hosting',
    clientName: 'PT Cloud Hosting Indonesia',
    contactPerson: 'Eko Prasetyo',
    email: 'eko@cloudhosting.id',
    phone: '+62 813 5555 6789',
    products: [
      {
        productId: 'PRD-002',
        productName: 'Server Dell PowerEdge R740',
        quantity: 20,
        unitPrice: 75000000,
        totalPrice: 1500000000,
      },
    ],
    totalValue: 1500000000,
    currency: 'IDR',
    probability: 30,
    closeDate: new Date('2025-04-30').toISOString(),
    stage: 'prospecting',
    status: 'open',
    source: 'cold-call',
    description: 'Ekspansi data center mereka membutuhkan 20 unit server.',
    notes: 'Baru first meeting. Mereka masih comparing dengan vendor lain.',
    ownerName: 'Rudi Hartono',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2025-01-18').toISOString(),
    updatedAt: new Date('2025-01-18').toISOString(),
  },
  {
    id: 'OPP-1737550004',
    name: 'Microsoft 365 Licenses - PT Retail Nasional',
    clientName: 'PT Retail Nasional',
    contactPerson: 'Linda Wijaya',
    email: 'linda@retailnasional.com',
    phone: '+62 822 4444 3333',
    products: [
      {
        productId: 'PRD-004',
        productName: 'Microsoft 365 Business Premium',
        quantity: 200,
        unitPrice: 2500000,
        totalPrice: 500000000,
      },
    ],
    totalValue: 500000000,
    currency: 'IDR',
    probability: 100,
    closeDate: new Date('2025-01-25').toISOString(),
    actualCloseDate: new Date('2025-01-22').toISOString(),
    stage: 'closed-won',
    status: 'won',
    source: 'email',
    description: 'Renewal lisensi Microsoft 365 untuk 200 karyawan.',
    notes: 'Deal closed! Contract sudah ditandatangani.',
    ownerName: 'Ahmad Rizki',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2025-01-22').toISOString(),
  },
  {
    id: 'OPP-1737550005',
    name: 'Network Infrastructure Upgrade - PT Bank Digital',
    clientName: 'PT Bank Digital Indonesia',
    contactPerson: 'Agus Salim',
    email: 'agus@bankdigital.id',
    phone: '+62 815 7777 8888',
    products: [
      {
        productId: 'PRD-003',
        productName: 'Cisco Network Switch',
        quantity: 15,
        unitPrice: 45000000,
        totalPrice: 675000000,
      },
    ],
    totalValue: 675000000,
    currency: 'IDR',
    probability: 0,
    closeDate: new Date('2025-01-20').toISOString(),
    actualCloseDate: new Date('2025-01-20').toISOString(),
    stage: 'closed-lost',
    status: 'lost',
    lossReason: 'Budget constraints - decided to postpone to Q3',
    source: 'referral',
    description: 'Upgrade network infrastructure untuk 3 kantor cabang.',
    notes: 'Lost to competitor with lower price. Ada kemungkinan untuk re-engage di Q3.',
    ownerName: 'Dewi Lestari',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2024-12-01').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
  {
    id: 'OPP-1737550006',
    name: 'Digital Transformation Consulting - PT Manufacturing',
    clientName: 'PT Manufacturing Excellence',
    contactPerson: 'Bambang Suryadi',
    email: 'bambang@manufacturing.id',
    phone: '+62 818 9999 0000',
    products: [
      {
        productId: 'PRD-005',
        productName: 'Digital Transformation Package',
        quantity: 1,
        unitPrice: 800000000,
        totalPrice: 800000000,
      },
    ],
    totalValue: 800000000,
    currency: 'IDR',
    probability: 70,
    closeDate: new Date('2025-02-15').toISOString(),
    stage: 'negotiation',
    status: 'open',
    source: 'event',
    description: 'Comprehensive digital transformation for manufacturing operations.',
    notes: 'In final negotiation stage. CEO akan review proposal minggu depan.',
    ownerName: 'Rudi Hartono',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-01-21').toISOString(),
  },
  {
    id: 'OPP-1737550007',
    name: '100 HP Printer LaserJet - PT Government Office',
    clientName: 'PT Government Office Solutions',
    contactPerson: 'Sri Mulyani',
    email: 'sri@govoffice.go.id',
    phone: '+62 811 2222 3333',
    products: [
      {
        productId: 'PRD-006',
        productName: 'HP LaserJet Enterprise',
        quantity: 100,
        unitPrice: 8000000,
        totalPrice: 800000000,
      },
    ],
    totalValue: 800000000,
    currency: 'IDR',
    probability: 50,
    closeDate: new Date('2025-03-31').toISOString(),
    stage: 'proposal',
    status: 'open',
    source: 'website',
    description: 'Pengadaan printer untuk kantor pemerintah.',
    notes: 'Menunggu proses tender. Proposal sudah disubmit.',
    ownerName: 'Ahmad Rizki',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2025-01-12').toISOString(),
    updatedAt: new Date('2025-01-19').toISOString(),
  },
  {
    id: 'OPP-1737550008',
    name: 'Cloud Migration Services - PT E-Commerce',
    clientName: 'PT E-Commerce Indonesia',
    contactPerson: 'Rina Kartika',
    email: 'rina@ecommerce.id',
    phone: '+62 819 5555 4444',
    products: [
      {
        productId: 'PRD-007',
        productName: 'AWS Cloud Migration Package',
        quantity: 1,
        unitPrice: 350000000,
        totalPrice: 350000000,
      },
    ],
    totalValue: 350000000,
    currency: 'IDR',
    probability: 30,
    closeDate: new Date('2025-04-15').toISOString(),
    stage: 'prospecting',
    status: 'open',
    source: 'social-media',
    description: 'Migrate on-premise infrastructure to AWS cloud.',
    notes: 'Initial discovery meeting completed. Preparing technical assessment.',
    ownerName: 'Dewi Lestari',
    reminderSent: false,
    activities: [],
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
];
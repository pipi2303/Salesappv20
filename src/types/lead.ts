// Lead model -- moved out of dummyData.ts (Fase 1 item 5: one consistent
// definition in src/types instead of scattered across data/component
// files). No field changes, straight move. The dummy `leads` array stays
// in dummyData.ts; only the type definition moves.

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  source: string;
  assignedTo: string;
  createdAt: Date;
  lastContact: Date;
  notes: string;
}

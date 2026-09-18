// Sales rep profile — identity only (name/email/role). Deliberately minimal,
// same spirit as the `sales_reps` placeholder table in
// supabase/migrations/0001_unified_product_model.sql: just enough for
// performance_targets / commissions to have a real entity to reference,
// not a full HR record. src/app/components/SalesTeam.tsx already has its
// own separate `Karyawan` (employee) model for HR purposes — reconciling
// the two is explicitly deferred to Tahap B, not attempted here.
export interface SalesRep {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export type NewSalesRep = Omit<SalesRep, 'id' | 'createdAt'>;

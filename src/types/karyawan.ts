// Employee (karyawan) record shape, sourced from employeesApi (src/services/
// api.ts, localStorage-backed, returns `any[]` at the API layer) and typed
// by the consuming components. SalesTeam.tsx and SalesRepresentative.tsx
// both fetch and pass these records into EmployeeDetailDialog.tsx as the
// `employee` prop; all three previously declared this same 25-field shape
// independently with no shared import.
export interface Karyawan {
  id: string;
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  nomor_wa: string;
  email_pribadi: string;
  divisi: string;
  jabatan: string;
  level_jabatan: string;
  status_karyawan: string;
  tanggal_bergabung: string;
  nama_atasan: string;
  npwp: string;
  nomor_rekening: string;
  nama_bank: string;
  bpjs_ketenagakerjaan: string;
  bpjs_kesehatan: string;
  email_kantor: string;
  nda_signed: boolean;
  tanggal_nda: string;
  level_akses: string;
  aset_perusahaan: string;
}

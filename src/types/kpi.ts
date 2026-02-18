// KPI Sales Type Definitions
export interface SalesKPI {
  // Primary
  kpi_id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_avatar?: string;
  periode_bulan: string; // Format: "Januari 2026"
  
  // 1. Indikator Aktivitas (Input Metrics)
  total_kunjungan_faskes: number; // Kunjungan fisik via Geo-tagging
  total_sesi_demo: number; // Presentasi fitur RME/LIS/BPJS
  jumlah_leads_baru: number; // Prospek baru di pipeline
  
  // 2. Indikator Hasil (Output Metrics)
  target_revenue_q: number; // Target nominal kuartal
  actual_revenue_q: number; // Realisasi penjualan
  jumlah_closing_simrs: number; // Total unit RS kontrak
  jumlah_closing_klinik: number; // Total unit Klinik kontrak
  jumlah_closing_dokter: number; // Total unit Praktek Mandiri kontrak
  conversion_rate: number; // % demo → closing (auto calculated)
  
  // 3. Indikator Strategis (Product Push)
  persentase_upsell_bpjs: number; // Rasio klien ambil modul BPJS
  unit_lis_sold: number; // Modul LIS terjual
  adopsi_esign_klien: number; // Klien aktifkan E-Sign
  
  // 4. Indikator Kualitas & Retensi
  customer_satisfaction_score: number; // CSAT (1-5)
  churn_rate_client: number; // % klien berhenti
  average_closing_time: number; // Rata-rata hari lead → closing
  
  // 5. Kalkulasi Bonus & Insentif
  pencapaian_target_persen: number; // (Actual / Target * 100)
  status_elite_circle: boolean; // True jika >100%
  estimasi_komisi_bulanan: number; // Total komisi
  accumulated_annual_bonus: number; // Bonus tahunan
  
  // Metadata
  last_updated: Date;
  created_at: Date;
}

export interface LeaderboardEntry {
  rank: number;
  employee_id: string;
  employee_name: string;
  employee_avatar?: string;
  actual_revenue: number;
  target_achieved_percent: number;
  total_closings: number;
  top_module?: string; // "BPJS" | "LIS" | "E-Sign"
  badges: string[];
  is_elite: boolean;
}

export interface KPISummary {
  total_sales_team: number;
  total_revenue_achieved: number;
  total_revenue_target: number;
  average_achievement: number;
  elite_circle_members: number;
  top_performer: LeaderboardEntry | null;
}

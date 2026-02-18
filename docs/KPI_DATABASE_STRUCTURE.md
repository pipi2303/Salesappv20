# 📊 Database KPI Sales - IntraMedika

## ⚠️ CATATAN PENTING: Database Implementation

Aplikasi Sales Monitoring Pro menggunakan **KV Store (Key-Value Store)** yang sudah tersedia di Supabase untuk menyimpan data KPI. Sistem ini tidak memerlukan pembuatan tabel SQL baru.

### Mengapa Menggunakan KV Store?

1. **Fleksibel** - Tidak perlu schema migration
2. **Cepat diimplementasikan** - Tidak perlu setup DDL
3. **Cocok untuk prototyping** - Perfect untuk demo dan development
4. **Scalable** - Bisa handle banyak data dengan struktur JSON

---

## 📋 Struktur Data KPI Sales

### **1. Indikator Aktivitas (Input Metrics)**

Field yang mengukur kerja keras harian tim sales di lapangan menggunakan aplikasi sales.

```typescript
{
  kpi_id: string;                    // Primary Key (contoh: "KPI001")
  employee_id: string;               // Relasi ke tabel Karyawan
  employee_name: string;             // Nama karyawan
  employee_email: string;            // Email karyawan
  periode_bulan: string;             // Contoh: "Januari 2026"
  
  // Activity Metrics
  total_kunjungan_faskes: number;    // Kunjungan fisik via Geo-tagging
  total_sesi_demo: number;           // Presentasi fitur RME/LIS/BPJS
  jumlah_leads_baru: number;         // Prospek baru masuk pipeline
}
```

**Cara Tracking:**
- `total_kunjungan_faskes`: Auto-increment saat GPS berada dalam radius 100m dari koordinat klien
- `total_sesi_demo`: Increment saat sales menekan tombol "Start Demo"
- `jumlah_leads_baru`: Auto-increment saat lead baru dibuat

---

### **2. Indikator Hasil (Output Metrics)**

Field yang mengukur efektivitas sales dalam menghasilkan pendapatan (Revenue).

```typescript
{
  // Output Metrics
  target_revenue_q: number;          // Target nominal kuartal (IDR)
  actual_revenue_q: number;          // Realisasi penjualan (IDR)
  jumlah_closing_simrs: number;      // Total unit Rumah Sakit kontrak
  jumlah_closing_klinik: number;     // Total unit Klinik kontrak
  jumlah_closing_dokter: number;     // Total unit Praktek Mandiri kontrak
  conversion_rate: number;           // % dari demo → closing (auto calculated)
}
```

**Formula:**
```javascript
conversion_rate = (total_closings / total_sesi_demo) * 100
total_closings = jumlah_closing_simrs + jumlah_closing_klinik + jumlah_closing_dokter
```

**Auto-Update Logic:**
- Saat status Client berubah dari "Negotiation" → "Closed Won"
- Auto-increment `actual_revenue_q` sesuai nilai kontrak
- Auto-increment counter closing berdasarkan tipe faskes

---

### **3. Indikator Strategis (Product Push)**

Field yang memantau penjualan modul spesifik (LIS, BPJS, E-Sign).

```typescript
{
  // Strategic Metrics
  persentase_upsell_bpjs: number;    // Rasio klien ambil modul BPJS (%)
  unit_lis_sold: number;             // Jumlah modul LIS terjual
  adopsi_esign_klien: number;        // Jumlah klien aktifkan E-Sign
}
```

**Update Trigger:**
- Auto-update saat invoice produk strategis diterbitkan
- Track per-modul untuk bonus incentive

---

### **4. Indikator Kualitas & Retensi**

```typescript
{
  // Quality Metrics
  customer_satisfaction_score: number;  // CSAT (1-5) - Average dari feedback
  churn_rate_client: number;            // % klien berhenti berlangganan
  average_closing_time: number;         // Rata-rata hari (lead → closing)
}
```

**Validation:**
- `customer_satisfaction_score`: Butuh approval Direktur/Manager
- `churn_rate_client`: Auto-calculate dari jumlah klien hilang
- `average_closing_time`: Auto-calculate dari timestamp lead dan closing

---

### **5. Kalkulasi Bonus & Insentif (Financial Output)**

```typescript
{
  // Financial Metrics
  pencapaian_target_persen: number;     // (Actual / Target * 100)
  status_elite_circle: boolean;         // True jika pencapaian >= 100%
  estimasi_komisi_bulanan: number;      // 5% dari actual_revenue_q
  accumulated_annual_bonus: number;     // Tabungan bonus tahunan
}
```

**Auto-Calculation:**
```javascript
pencapaian_target_persen = (actual_revenue_q / target_revenue_q) * 100
status_elite_circle = pencapaian_target_persen >= 100
estimasi_komisi_bulanan = actual_revenue_q * 0.05

// Elite bonus
if (status_elite_circle) {
  estimasi_komisi_bulanan *= 1.10  // +10% bonus
}
```

---

## 🎯 Fitur yang Sudah Diimplementasikan

### ✅ **Performance Hub (KPI Tracker)**
- **My Progress Gauge**: Real-time progress circle dengan persentase achievement
- **Incentive Calculator**: Kalkulasi komisi bulanan dan bonus tahunan otomatis
- **Elite Circle Status**: Notifikasi dan UI badge khusus untuk achiever >100%
- **4 Tabs Metrics**:
  1. Activity Metrics (Kunjungan, Demo, Leads)
  2. Output Results (Closings & Conversion Rate)
  3. Product Push (BPJS, LIS, E-Sign)
  4. Quality & Retention (CSAT, Churn, Closing Time)

### ✅ **Sales Leaderboard**
- **Premium Dark Theme**: Desain eksklusif dengan warna biru tua profesional
- **Podium Top 3**: Avatar melingkar dengan badge emas/perak/perunggu
- **Full Rankings Table**: 
  - Nama + Avatar
  - Target Achieved (% + progress bar)
  - Total Revenue
  - Top Module Seller badge (LIS/BPJS/E-Sign)
  - Achievement badges (Elite Circle, Customer Champion, dll)
- **Font Poppins**: Typography profesional dan clean
- **Summary Stats**: Total team, Total revenue, Average achievement, Elite members

---

## 🔄 Data Flow & Integration

### **Real-time Sync Logic**

```
1. Field Activity → Auto Update KPI
   - Sales klik "Start Demo" → total_sesi_demo++
   - GPS dalam radius 100m klien → total_kunjungan_faskes++
   - Lead baru dibuat → jumlah_leads_baru++

2. CRM Pipeline → Auto Update Output
   - Status → "Closed Won" → actual_revenue_q += contract_value
   - Tipe faskes (RS/Klinik/Dokter) → increment counter closing

3. Product Invoice → Auto Update Strategic
   - Invoice BPJS issued → persentase_upsell_bpjs update
   - Invoice LIS issued → unit_lis_sold++
   - E-Sign activated → adopsi_esign_klien++

4. Customer Feedback → Manual Validation
   - CSAT score input → Pending approval
   - Manager approve → customer_satisfaction_score update
```

---

## 🔐 Security & Anti-Manipulation

### **Data Validation Rules**

1. **Geo-tagging Verification**
   ```javascript
   // Only increment if GPS accurate
   if (distance(salesGPS, clientGPS) <= 100) {
     total_kunjungan_faskes++
   }
   ```

2. **Demo Session Tracking**
   ```javascript
   // Prevent spam clicking
   demoSession = {
     start_time: timestamp,
     min_duration: 15, // minutes
     end_time: timestamp + min_duration
   }
   ```

3. **Revenue Validation**
   ```javascript
   // Only count Closed Won with verified contract
   if (status === "Closed Won" && contract_signed === true) {
     actual_revenue_q += contract_value
   }
   ```

---

## 📊 KPI Dashboard Access

### **Menu Structure:**
1. **KPI Tracker** (sidebar menu #8)
   - Personal performance tracking
   - Real-time metrics update
   - Incentive calculator

2. **Leaderboard** (sidebar menu #9)
   - Team competition view
   - Rankings & achievements
   - Top performers showcase

---

## 💾 Data Storage Implementation

### **Using KV Store**

```javascript
// Save KPI data
await kv.set(`kpi:${employee_id}:${periode}`, kpiData);

// Get KPI data
const kpiData = await kv.get(`kpi:${employee_id}:${periode}`);

// Get all KPI for periode
const allKPI = await kv.getByPrefix(`kpi:`);

// Update specific field
const currentKPI = await kv.get(`kpi:${employee_id}:${periode}`);
currentKPI.total_sesi_demo++;
await kv.set(`kpi:${employee_id}:${periode}`, currentKPI);
```

### **Dummy Data Location**
- Type definitions: `/src/types/kpi.ts`
- Data generator: `/src/app/data/kpiData.ts`
- Components: 
  - `/src/app/components/PerformanceHub.tsx`
  - `/src/app/components/SalesLeaderboard.tsx`

---

## 🎨 UI Design Specification

### **Leaderboard Theme**
- **Background**: Dark gradient (slate-900 → blue-900 → slate-900)
- **Primary Color**: Blue (#3b82f6)
- **Accent Color**: Gold (#fbbf24) for rank #1
- **Typography**: Poppins font family
- **Cards**: Semi-transparent with backdrop blur
- **Animations**: Smooth transitions, pulse effects for elite members

### **KPI Tracker Theme**
- **Progress Circle**: SVG-based with gradient stroke
- **Metric Cards**: Color-coded by category
  - Activity: Blue
  - Output: Green
  - Strategic: Purple
  - Quality: Orange
- **Elite Circle UI**: Gold/Platinum theme when active

---

## 📈 Sample Data

Lihat file `/src/app/data/kpiData.ts` untuk 6 sales dengan data lengkap:
- Budi Santoso (115% - Elite Circle)
- Siti Nurhaliza (110% - Elite Circle)
- Ahmad Rizki (105% - Elite Circle)
- Dewi Lestari (95%)
- Eko Prasetyo (90%)
- Rina Wijaya (80%)

---

## 🚀 Future Enhancements

1. **WebSocket Integration** - Real-time leaderboard updates
2. **Anomaly Alerts** - Auto-notify jika closing time > threshold
3. **Director's Dashboard** - Approval workflow untuk CSAT
4. **Export Reports** - KPI data export ke Excel/PDF
5. **Historical Trends** - Chart performa bulanan
6. **Team Comparison** - Head-to-head comparison antar sales

---

## 📞 Support

Untuk pertanyaan tentang struktur database KPI atau implementasi fitur baru, hubungi tim development.

**Last Updated:** January 2026
**Version:** 1.0.0

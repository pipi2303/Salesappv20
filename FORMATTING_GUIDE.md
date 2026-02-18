# 📊 Format Penulisan Angka - Standar Aplikasi Sales Monitoring

## 🎯 Tujuan
Dokumen ini menjelaskan standar penulisan angka di seluruh aplikasi Sales Monitoring untuk memastikan konsistensi UI/UX.

## 📍 Lokasi Utility
File: `/src/utils/formatters.ts`

## 🔧 Fungsi-Fungsi yang Tersedia

### 1. `formatCurrency(value: number)` - REKOMENDASI UTAMA ⭐
Format currency dengan notasi K/M/B untuk menghemat space dan meningkatkan readability.

**Kapan digunakan:**
- KPI cards
- Dashboard metrics
- Ringkasan finansial
- Grafik dan chart labels
- List view dengan space terbatas

**Contoh:**
```typescript
import { formatCurrency } from '@/utils/formatters';

formatCurrency(500)           // "Rp 500"
formatCurrency(1500)          // "Rp 1,5K"
formatCurrency(1500000)       // "Rp 1,5M"
formatCurrency(1500000000)    // "Rp 1,5B"
```

**Implementasi:**
```tsx
<p className="text-2xl font-bold">
  {formatCurrency(stats.totalRevenue)}
</p>
```

---

### 2. `formatCurrencyFull(value: number)`
Format currency dengan pemisah titik lengkap (format Indonesia standar).

**Kapan digunakan:**
- Detail view/popup
- Form input display
- Invoice/kontrak
- Laporan lengkap
- Ketika detail angka penting

**Contoh:**
```typescript
import { formatCurrencyFull } from '@/utils/formatters';

formatCurrencyFull(1500)      // "Rp 1.500"
formatCurrencyFull(1500000)   // "Rp 1.500.000"
```

**Implementasi:**
```tsx
<p className="text-lg">
  Total: {formatCurrencyFull(contract.value)}
</p>
```

---

### 3. `formatNumber(value: number)`
Format number biasa dengan pemisah titik (tanpa "Rp").

**Kapan digunakan:**
- Jumlah item/quantity
- Statistik non-currency
- Persentase basis
- Counter

**Contoh:**
```typescript
import { formatNumber } from '@/utils/formatters';

formatNumber(1500)      // "1.500"
formatNumber(1500000)   // "1.500.000"
```

**Implementasi:**
```tsx
<p>Total Leads: {formatNumber(totalLeads)}</p>
```

---

### 4. `formatPercentage(value: number, decimals?: number)`
Format percentage dengan koma desimal.

**Kapan digunakan:**
- Conversion rate
- Growth metrics
- Performance indicators
- Completion status

**Contoh:**
```typescript
import { formatPercentage } from '@/utils/formatters';

formatPercentage(23.5)      // "23,5%"
formatPercentage(100)       // "100,0%"
formatPercentage(23.567, 2) // "23,57%"
```

**Implementasi:**
```tsx
<p className="text-green-600">
  {formatPercentage(stats.conversionRate)}
</p>
```

---

### 5. `formatCompactNumber(value: number)`
Format number kompak K/M/B (tanpa "Rp").

**Kapan digunakan:**
- Chart tooltips
- Compact displays
- Badge numbers
- Notifikasi

**Contoh:**
```typescript
import { formatCompactNumber } from '@/utils/formatters';

formatCompactNumber(1500)      // "1,5K"
formatCompactNumber(1500000)   // "1,5M"
```

**Implementasi:**
```tsx
<Badge>{formatCompactNumber(notification.count)}</Badge>
```

---

## ✅ Best Practices

### DO ✅
```typescript
// Import di bagian atas file
import { formatCurrency, formatPercentage } from '@/utils/formatters';

// Gunakan langsung di JSX
<p>{formatCurrency(value)}</p>

// Gunakan di computed values
const displayValue = formatCurrency(revenue);
```

### DON'T ❌
```typescript
// ❌ Jangan buat custom formatter sendiri
const customFormat = (val) => `Rp ${val / 1000}K`;

// ❌ Jangan hardcode format
<p>Rp {(value / 1000).toFixed(0)}K</p>

// ❌ Jangan mix format
<p>Rp {value.toLocaleString('id-ID')}</p>  // gunakan formatCurrencyFull
```

---

## 🎨 Panduan Penggunaan by Context

| Konteks | Fungsi yang Digunakan | Alasan |
|---------|----------------------|--------|
| KPI Cards | `formatCurrency` | Space terbatas, butuh kompak |
| Detail Dialog | `formatCurrencyFull` | Butuh angka lengkap |
| Sales Reports | `formatCurrency` | Readability & konsistensi |
| Contract Value | `formatCurrencyFull` | Dokumen legal, butuh detail |
| Growth Metrics | `formatPercentage` | Standard percentage format |
| Lead Count | `formatNumber` | Bukan currency |
| Chart Labels | `formatCompactNumber` | Space sangat terbatas |

---

## 🔄 Migration Checklist

Jika menemukan format lama, ganti dengan:

### Pattern Lama → Pattern Baru

```typescript
// ❌ LAMA
Rp ${(value / 1000).toFixed(0)}K
// ✅ BARU
formatCurrency(value)

// ❌ LAMA
Rp ${value.toLocaleString('id-ID')}
// ✅ BARU
formatCurrencyFull(value)

// ❌ LAMA
${(value / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}K
// ✅ BARU
formatCurrency(value)

// ❌ LAMA
${percentage.toFixed(1)}%
// ✅ BARU
formatPercentage(percentage)
```

---

## 📝 File yang Sudah Menggunakan Standar Baru

✅ `/src/app/components/SalesKPICards.tsx`
✅ `/src/app/components/SalesReports.tsx`
✅ `/src/app/components/Home.tsx`
✅ `/src/app/components/LeadManagement.tsx`
✅ `/src/app/components/ProductCatalog.tsx`
✅ `/src/app/components/Contract.tsx`
✅ `/src/app/components/LeadManagementSupabase.tsx`

---

## 🚀 Quick Start

```typescript
// 1. Import fungsi yang dibutuhkan
import { formatCurrency, formatCurrencyFull, formatPercentage } from '@/utils/formatters';

// 2. Gunakan di component
export function MyComponent() {
  const revenue = 1500000;
  const growthRate = 23.5;

  return (
    <div>
      <h2>Revenue: {formatCurrency(revenue)}</h2>
      <p>Growth: {formatPercentage(growthRate)}</p>
    </div>
  );
}
```

---

## 📞 Support

Jika ada pertanyaan atau menemukan inkonsistensi format, silakan:
1. Check dokumentasi ini terlebih dahulu
2. Lihat implementasi di file yang sudah menggunakan standar
3. Update file `/src/utils/formatters.ts` jika ada kebutuhan format baru

---

**Terakhir diupdate:** 27 Januari 2026
**Versi:** 1.0.0

# Number Format Standardization - Format xxx.xxx.xxx

## 📋 Overview

Aplikasi Sales Monitoring menggunakan **format penulisan angka dengan pemisah titik** setiap 3 digit (xxx.xxx.xxx) sesuai dengan standar format Indonesia (id-ID).

## ✅ Format yang Digunakan

### Standard Format:
```
1234      → 1.234
12345     → 12.345
123456    → 123.456
1234567   → 1.234.567
12345678  → 12.345.678
123456789 → 123.456.789
```

### Format untuk Currency:
```
1500000   → Rp 1.500.000
2350000   → Rp 2.350.000
15000000  → Rp 15.000.000
```

## 🔧 Formatter Functions

### File: `/src/utils/formatters.ts`

Aplikasi menyediakan 5 fungsi formatter standar:

### 1. **formatCurrency(value: number)**
Format currency dengan notasi K/M/B untuk tampilan compact.

```typescript
formatCurrency(500)          // → Rp 500
formatCurrency(1500)         // → Rp 1,5K
formatCurrency(1500000)      // → Rp 1,5M
formatCurrency(1500000000)   // → Rp 1,5B
```

**Penggunaan**: KPI cards, summary cards, compact displays

### 2. **formatCurrencyFull(value: number)**
Format currency lengkap dengan pemisah titik.

```typescript
formatCurrencyFull(1500)      // → Rp 1.500
formatCurrencyFull(1500000)   // → Rp 1.500.000
formatCurrencyFull(2350000)   // → Rp 2.350.000
```

**Penggunaan**: Detail dialogs, full displays, invoices

### 3. **formatNumber(value: number)**
Format angka dengan pemisah titik (tanpa Rp).

```typescript
formatNumber(156)       // → 156
formatNumber(1234)      // → 1.234
formatNumber(123456)    // → 123.456
formatNumber(1234567)   // → 1.234.567
```

**Penggunaan**: Total Leads, Active Contracts, quantities

### 4. **formatPercentage(value: number, decimals?: number)**
Format percentage dengan koma sebagai desimal.

```typescript
formatPercentage(23.5)      // → 23,5%
formatPercentage(100)       // → 100,0%
formatPercentage(45.67, 2)  // → 45,67%
```

**Penggunaan**: Growth rates, conversion rates, percentages

### 5. **formatCompactNumber(value: number)**
Format angka compact (tanpa Rp) dengan notasi K/M/B.

```typescript
formatCompactNumber(1500)         // → 1,5K
formatCompactNumber(1500000)      // → 1,5M
formatCompactNumber(1500000000)   // → 1,5B
```

**Penggunaan**: Charts, graphs, compact statistics

## 📊 Implementation Details

### Locale Configuration:

Semua formatter menggunakan `toLocaleString('id-ID')` yang secara otomatis:

1. ✅ Menggunakan **titik (.)** sebagai pemisah ribuan
2. ✅ Menggunakan **koma (,)** sebagai pemisah desimal
3. ✅ Sesuai dengan standar format Indonesia

### Technical Implementation:

```typescript
// Internal implementation
export const formatNumber = (value: number): string => {
  return value.toLocaleString('id-ID');
};

export const formatCurrencyFull = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID')}`;
};
```

## 🎯 Updated Components

### ✅ KPI Cards - `/src/app/components/SalesKPICards.tsx`

**Import:**
```typescript
import { formatCurrency, formatNumber } from '@/utils/formatters';
```

**Usage:**
```typescript
// Currency values (dengan notasi K/M/B)
<p>{formatCurrency(stats.totalRevenue * 1000000)}</p>     // Rp 2,35M
<p>{formatCurrency(stats.pipelineValue)}</p>              // Rp 1,8M
<p>{formatCurrency(stats.upside)}</p>                     // Rp 950M
<p>{formatCurrency(stats.strongUpside)}</p>               // Rp 650M
<p>{formatCurrency(stats.forecast)}</p>                   // Rp 3,2M
<p>{formatCurrency(stats.avgDealSize)}</p>                // Rp 450M

// Number values (dengan pemisah titik)
<p>{formatNumber(stats.totalLeads)}</p>                   // 156 (jika > 999: 1.234)
<p>{formatNumber(stats.totalContracts)}</p>               // 89 (jika > 999: 1.234)
```

### ✅ Contract Detail Dialog - `/src/app/components/ContractDetailDialog.tsx`

```typescript
// Already using toLocaleString('id-ID')
<p>Rp {contract.value.toLocaleString('id-ID')}</p>
```

### ✅ Revenue Detail Dialog - `/src/app/components/RevenueDetailDialog.tsx`

```typescript
// Already using toLocaleString('id-ID')
const formatNumber = (num: number) => {
  return parseInt(num.toFixed(0)).toLocaleString('id-ID');
};
```

### ✅ Retail Monthly Breakdown - `/src/app/components/RetailMonthlyBreakdown.tsx`

```typescript
// Already using toLocaleString('id-ID')
const formatNumber = (num: number) => {
  return parseInt(num.toFixed(0)).toLocaleString('id-ID');
};
```

## 📁 Components Using Number Format

### Components with Correct Format:

| Component | File | Format Used | Status |
|-----------|------|-------------|--------|
| KPI Cards | `SalesKPICards.tsx` | `formatCurrency`, `formatNumber` | ✅ Updated |
| Contract Detail | `ContractDetailDialog.tsx` | `toLocaleString('id-ID')` | ✅ Correct |
| Revenue Detail | `RevenueDetailDialog.tsx` | `toLocaleString('id-ID')` | ✅ Correct |
| Retail Breakdown | `RetailMonthlyBreakdown.tsx` | `toLocaleString('id-ID')` | ✅ Correct |
| Chart Tooltips | `ui/chart.tsx` | `toLocaleString()` | ✅ Correct |

## 🎨 Visual Examples

### Before & After Comparison:

**Before (No Formatting):**
```
Total Leads: 1234          ❌ Hard to read
Active Contracts: 5678     ❌ Hard to read
Revenue: 12345678          ❌ Very hard to read
```

**After (With Formatting):**
```
Total Leads: 1.234         ✅ Easy to read
Active Contracts: 5.678    ✅ Easy to read
Revenue: Rp 12.345.678     ✅ Very easy to read
```

### Real Data Examples:

**KPI Card Examples:**
```typescript
// Total Revenue
formatCurrency(2350000000)     // → Rp 2,35M

// Pipeline Value
formatCurrency(1800000000)     // → Rp 1,8M

// Total Leads
formatNumber(156)              // → 156 (no separator needed)
formatNumber(1234)             // → 1.234 (with separator)

// Active Contracts
formatNumber(89)               // → 89 (no separator needed)
formatNumber(1567)             // → 1.567 (with separator)
```

**Detail Display Examples:**
```typescript
// Contract Value (Full Format)
formatCurrencyFull(15000000)   // → Rp 15.000.000

// Deal Size (Full Format)
formatCurrencyFull(450000000)  // → Rp 450.000.000

// Large Numbers
formatNumber(12345678)         // → 12.345.678
```

## 📱 Responsive Behavior

Format tetap konsisten di semua screen sizes:

### Desktop:
```
Total Leads: 1.234
Active Contracts: 5.678
Revenue: Rp 12.345.678
```

### Tablet:
```
Total Leads: 1.234
Active Contracts: 5.678
Revenue: Rp 12.345.678
```

### Mobile:
```
Total Leads: 1.234
Active Contracts: 5.678
Revenue: Rp 12.345.678
```

## ✨ Benefits

### 1. **Readability** ✅
```
Before: 1234567      ← Hard to parse
After:  1.234.567    ← Easy to read at a glance
```

### 2. **Consistency** ✅
- Same format across entire application
- Standard Indonesian format (id-ID)
- Professional appearance

### 3. **User Experience** ✅
- Easier to scan large numbers
- Reduces cognitive load
- International standard compliance

### 4. **Maintainability** ✅
- Centralized formatter functions
- Easy to update globally
- Consistent codebase

## 🔍 Testing Examples

### formatNumber() Test Cases:

```typescript
formatNumber(0)            // → 0
formatNumber(100)          // → 100
formatNumber(999)          // → 999
formatNumber(1000)         // → 1.000
formatNumber(1234)         // → 1.234
formatNumber(12345)        // → 12.345
formatNumber(123456)       // → 123.456
formatNumber(1234567)      // → 1.234.567
formatNumber(12345678)     // → 12.345.678
formatNumber(123456789)    // → 123.456.789
```

### formatCurrencyFull() Test Cases:

```typescript
formatCurrencyFull(0)           // → Rp 0
formatCurrencyFull(500)         // → Rp 500
formatCurrencyFull(1500)        // → Rp 1.500
formatCurrencyFull(15000)       // → Rp 15.000
formatCurrencyFull(150000)      // → Rp 150.000
formatCurrencyFull(1500000)     // → Rp 1.500.000
formatCurrencyFull(15000000)    // → Rp 15.000.000
formatCurrencyFull(150000000)   // → Rp 150.000.000
```

## 📋 Implementation Checklist

### ✅ Completed:

- [x] Created centralized formatter functions in `/src/utils/formatters.ts`
- [x] Updated KPI Cards to use `formatNumber()` for Total Leads
- [x] Updated KPI Cards to use `formatNumber()` for Active Contracts
- [x] Verified Contract Detail Dialog uses correct format
- [x] Verified Revenue Detail Dialog uses correct format
- [x] Verified Retail Monthly Breakdown uses correct format
- [x] All formatters use `toLocaleString('id-ID')`
- [x] Consistent across all components

### 📝 Best Practices:

1. **Always use formatter functions** - Don't format manually
2. **Import from utils** - `import { formatNumber } from '@/utils/formatters'`
3. **Choose appropriate formatter**:
   - `formatCurrency()` - For compact currency (K/M/B)
   - `formatCurrencyFull()` - For full currency display
   - `formatNumber()` - For non-currency numbers
   - `formatPercentage()` - For percentages
   - `formatCompactNumber()` - For compact numbers without Rp

4. **Consistency is key** - Use same formatter for same data type across app

## 🎯 Summary

### Current Implementation:

**Format Standard:**
- ✅ Pemisah ribuan: **Titik (.)**
- ✅ Pemisah desimal: **Koma (,)**
- ✅ Locale: **id-ID** (Indonesia)
- ✅ Format: **xxx.xxx.xxx**

**Formatter Functions:**
- ✅ `formatCurrency()` - Compact currency (K/M/B)
- ✅ `formatCurrencyFull()` - Full currency (Rp xxx.xxx.xxx)
- ✅ `formatNumber()` - Number only (xxx.xxx.xxx)
- ✅ `formatPercentage()` - Percentage (xx,x%)
- ✅ `formatCompactNumber()` - Compact number (K/M/B)

**Components Updated:**
- ✅ SalesKPICards.tsx - All 8 cards
- ✅ ContractDetailDialog.tsx - Already correct
- ✅ RevenueDetailDialog.tsx - Already correct
- ✅ RetailMonthlyBreakdown.tsx - Already correct

### Result:

**Seluruh aplikasi sekarang menggunakan format penulisan angka yang konsisten:**

```
Format: xxx.xxx.xxx
Locale: id-ID (Indonesia)
Separator: Titik (.) untuk ribuan, Koma (,) untuk desimal
```

**Contoh:**
- Numbers: 1.234.567
- Currency: Rp 1.234.567
- Compact: 1,2M
- Percentage: 23,5%

---

**Summary**: Format penulisan angka di seluruh aplikasi sudah menggunakan **pemisah titik (xxx.xxx.xxx)** sesuai standar Indonesia (id-ID) dengan formatter functions yang centralized dan konsisten! 🎯✨

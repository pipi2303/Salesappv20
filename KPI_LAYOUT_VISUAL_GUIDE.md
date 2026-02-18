# KPI Cards Layout - Visual Guide

## 📐 Layout Structure

### Desktop View (≥1024px) - 4 Columns, 2 Rows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SALES REPORTS HEADER                                │
│  [Monthly ▼] [Jan 2026 ▼] [Export PDF]                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                               BARIS 1 - REVENUE METRICS                       │
├────────────────────┬────────────────────┬────────────────────┬───────────────┤
│                    │                    │                    │               │
│  💰 Total Revenue  │  💰 Pipeline Value │  📈 Upside         │ 📈 Strong     │
│  ═══════════════   │  ═══════════════   │  ═══════════════   │   Upside      │
│  Rp 2.350.000.000  │  Rp 1.800.000.000  │  Rp 950.000.000    │ Rp 650.000.000│
│  +23.5% vs last    │  Strong pipeline   │  Potential growth  │ High confidence│
│     month          │                    │                    │               │
│                    │                    │                    │               │
└────────────────────┴────────────────────┴────────────────────┴───────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         BARIS 2 - ACTIVITY METRICS                            │
├────────────────────┬────────────────────┬────────────────────┬───────────────┤
│                    │                    │                    │               │
│  📈 Forecast       │  👥 Total Leads    │  📊 Active         │ 🎯 Avg Deal   │
│  ═══════════════   │  ═══════════════   │     Contracts      │    Size       │
│  Rp 3.200.000.000  │       156          │       89           │ Rp 450.000.000│
│  Predicted revenue │  +12 new this week │  68% conversion    │ +15% vs last  │
│                    │                    │     rate           │    month      │
│                    │                    │                    │               │
└────────────────────┴────────────────────┴────────────────────┴───────────────┘
```

## 📱 Responsive Layouts

### Tablet (768px - 1023px) - 2 Columns, 4 Rows

```
┌───────────────────────────────────────────────────┐
│           BARIS 1 - Row 1                          │
├─────────────────────────┬─────────────────────────┤
│  💰 Total Revenue       │  💰 Pipeline Value      │
│  Rp 2.350.000.000       │  Rp 1.800.000.000       │
└─────────────────────────┴─────────────────────────┘

┌───────────────────────────────────────────────────┐
│           BARIS 2 - Row 2                          │
├─────────────────────────┬─────────────────────────┤
│  📈 Upside              │  📈 Strong Upside       │
│  Rp 950.000.000         │  Rp 650.000.000         │
└─────────────────────────┴─────────────────────────┘

┌───────────────────────────────────────────────────┐
│           BARIS 3 - Row 3                          │
├─────────────────────────┬─────────────────────────┤
│  📈 Forecast            │  👥 Total Leads         │
│  Rp 3.200.000.000       │       156               │
└─────────────────────────┴─────────────────────────┘

┌───────────────────────────────────────────────────┐
│           BARIS 4 - Row 4                          │
├─────────────────────────┬─────────────────────────┤
│  📊 Active Contracts    │  🎯 Avg Deal Size       │
│       89                │  Rp 450.000.000         │
└─────────────────────────┴─────────────────────────┘
```

### Mobile (<768px) - 1 Column, 8 Rows

```
┌─────────────────────────┐
│  💰 Total Revenue       │
│  Rp 2.350.000.000       │
│  +23.5% vs last month   │
└─────────────────────────┘

┌─────────────────────────┐
│  💰 Pipeline Value      │
│  Rp 1.800.000.000       │
│  Strong pipeline        │
└─────────────────────────┘

┌─────────────────────────┐
│  📈 Upside              │
│  Rp 950.000.000         │
│  Potential growth       │
└─────────────────────────┘

┌─────────────────────────┐
│  📈 Strong Upside       │
│  Rp 650.000.000         │
│  High confidence        │
└─────────────────────────┘

┌─────────────────────────┐
│  📈 Forecast            │
│  Rp 3.200.000.000       │
│  Predicted revenue      │
└─────────────────────────┘

┌─────────────────────────┐
│  👥 Total Leads         │
│       156               │
│  +12 new this week      │
└─────────────────────────┘

┌─────────────────────────┐
│  📊 Active Contracts    │
│       89                │
│  68% conversion rate    │
└─────────────────────────┘

┌─────────────────────────┐
│  🎯 Avg Deal Size       │
│  Rp 450.000.000         │
│  +15% vs last month     │
└─────────────────────────┘
```

## 🎨 Card Anatomy

### Individual Card Structure:

```
┌──────────────────────────────────────┐
│  ┌────┐                              │
│  │ 💰 │  Total Revenue               │ ← Title (text-sm text-gray-600)
│  │    │                              │
│  └────┘  Rp 2.350.000.000            │ ← Value (text-2xl font-bold)
│     ↑                                │
│  Icon    +23.5% vs last month        │ ← Subtitle (text-xs color-600)
│  Circle                              │
│  Gradient                            │
└──────────────────────────────────────┘
   ↑
Hover: shadow-lg transition
```

### Icon Circle Specifications:
- Size: `h-12 w-12` (48px × 48px)
- Shape: `rounded-full`
- Background: Gradient (`bg-gradient-to-br`)
- Icon size: `h-6 w-6` (24px × 24px)
- Icon color: `text-white`

## 📊 Grid Breakdown

### CSS Grid Classes:

```css
/* Container */
.grid                    → Display as grid
.gap-4                   → 16px gap between cards

/* Responsive Columns */
.grid-cols-1            → 1 column on mobile (<768px)
.md:grid-cols-2         → 2 columns on tablet (≥768px)
.lg:grid-cols-4         → 4 columns on desktop (≥1024px)
```

### Calculation Example (Desktop):

```
Container width: 1200px (example)
Gap: 16px × 3 = 48px (3 gaps between 4 cards)
Available: 1200px - 48px = 1152px
Per card: 1152px ÷ 4 = 288px each
```

## 🎯 Visual Hierarchy

### Priority Levels:

**Level 1 - Primary Metrics (Baris 1):**
```
1. Total Revenue     → Most important (actual money earned)
2. Pipeline Value    → Second most important (potential money)
3. Upside           → Growth opportunity
4. Strong Upside    → High-confidence growth
```

**Level 2 - Secondary Metrics (Baris 2):**
```
5. Forecast         → Predicted performance
6. Total Leads      → Lead generation activity
7. Active Contracts → Conversion success
8. Avg Deal Size    → Deal quality
```

## 🌈 Color Scheme Guide

### Baris 1 (Revenue Focus):

| Card | From | To | Meaning |
|------|------|----|----|
| Total Revenue | 🟢 Green | 🟢 Emerald | Success, Money |
| Pipeline Value | 🟣 Purple | 🟣 Violet | Potential, Value |
| Upside | 🔵 Cyan | 🔵 Blue | Growth, Opportunity |
| Strong Upside | 🟣 Indigo | 🟣 Pink | Confidence, High |

### Baris 2 (Activity Focus):

| Card | From | To | Meaning |
|------|------|----|----|
| Forecast | 🟢 Teal | 🟢 Emerald | Prediction, Future |
| Total Leads | 🔵 Blue | 🔵 Cyan | People, Leads |
| Active Contracts | 🟣 Purple | 🟣 Pink | Performance, Rate |
| Avg Deal Size | 🟠 Orange | 🔴 Red | Value, Target |

## 📐 Spacing & Alignment

### Card Internal Spacing:
```
┌────────────────────────┐
│  pt-6 (24px padding)   │ ← Top padding
│  ┌──────────────────┐  │
│  │  flex gap-3      │  │ ← 12px gap between icon & text
│  │  ┌───┐  ┌─────┐ │  │
│  │  │   │  │     │ │  │
│  │  └───┘  └─────┘ │  │
│  └──────────────────┘  │
└────────────────────────┘
```

### Gap Between Cards:
```
[Card] 16px [Card] 16px [Card] 16px [Card]
       gap-4      gap-4      gap-4
```

## 🔄 Interaction States

### Hover Effect:
```
Normal:     shadow-md (or no shadow)
Hover:      shadow-lg (larger shadow)
Transition: transition-shadow (smooth)
```

### Click/Active:
- Cards are not clickable by default
- Could add onClick handlers if needed
- Maintain visual feedback on hover

## 📏 Measurement Reference

### Desktop (1920px screen):
```
Total Width: ~1920px
Container: ~1400px (with padding)
Card Width: ~320px each
Card Height: ~110px (auto-fit content)
```

### Tablet (768px screen):
```
Total Width: 768px
Container: ~720px (with padding)
Card Width: ~345px each (2 columns)
Card Height: ~110px
```

### Mobile (375px screen):
```
Total Width: 375px
Container: ~343px (with padding)
Card Width: ~343px (full width)
Card Height: ~110px
```

## ✨ Animation Effects

### Transitions:
```css
.transition-shadow  → Smooth shadow change on hover
.hover:shadow-lg   → Larger shadow on hover
```

### Performance:
- GPU-accelerated (transform, opacity)
- No layout shifts
- Smooth at 60fps

## 🎯 Usage Example

```typescript
<SalesKPICards 
  stats={{
    totalRevenue: 2.3,        // in millions
    pipelineValue: 1800000000, // in rupiah
    upside: 950000000,
    strongUpside: 650000000,
    forecast: 3200000000,
    totalLeads: 156,
    totalContracts: 89,
    avgDealSize: 450000000
  }} 
/>
```

## 📝 Best Practices

1. **Keep values updated** in real-time
2. **Use formatCurrency** for consistency
3. **Show trends** (↑ +23.5% etc.)
4. **Maintain color coding** for quick scanning
5. **Ensure responsive** behavior
6. **Test on all screen sizes**
7. **Keep subtitles informative**
8. **Use appropriate icons**

---

**Result**: Clean, organized 2-row layout that displays all 8 KPI cards with perfect balance and no horizontal scrolling! 🎨

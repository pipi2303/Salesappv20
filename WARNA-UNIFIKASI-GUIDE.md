# 🎨 PANDUAN UNIFIKASI WARNA KE #01544e

## ✅ SUDAH SELESAI

### 1. **Theme CSS** (`/src/styles/theme.css`)
- ✅ Primary color: `#01544e`
- ✅ Scrollbar colors: `#01544e` (normal), `#023d39` (hover), `#012b27` (active)
- ✅ Base theme updated

---

## 📋 YANG PERLU DIGANTI DI SEMUA FILE

### **Pattern Replacements:**

#### **1. Background Gradients → Solid Color**
```
SEBELUM: bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-gradient-to-r from-purple-600 to-pink-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-gradient-to-r from-indigo-600 to-purple-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-gradient-to-r from-blue-600 to-cyan-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-gradient-to-br from-purple-600 to-pink-600
SESUDAH:  bg-[#01544e]
```

#### **2. Background Light/Soft → Soft Teal**
```
SEBELUM: bg-gradient-to-r from-purple-50 to-pink-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: bg-gradient-to-r from-blue-50 to-cyan-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: bg-gradient-to-r from-indigo-50 to-purple-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: from-purple-50 to-blue-50
SESUDAH:  bg-[#e6f2f1]
```

#### **3. Text Colors**
```
SEBELUM: text-purple-600
SESUDAH:  text-[#01544e]

SEBELUM: text-blue-600
SESUDAH:  text-[#01544e]

SEBELUM: text-indigo-600
SESUDAH:  text-[#01544e]

SEBELUM: text-pink-600
SESUDAH:  text-[#01544e]
```

#### **4. Background Solid**
```
SEBELUM: bg-purple-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-blue-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-indigo-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-pink-600
SESUDAH:  bg-[#01544e]

SEBELUM: bg-green-600
SESUDAH:  bg-[#01544e]
```

#### **5. Hover States**
```
SEBELUM: hover:from-purple-700 hover:to-pink-700
SESUDAH:  hover:bg-[#023d39]

SEBELUM: hover:bg-purple-700
SESUDAH:  hover:bg-[#023d39]

SEBELUM: hover:bg-blue-700
SESUDAH:  hover:bg-[#023d39]
```

#### **6. Borders**
```
SEBELUM: border-purple-200
SESUDAH:  border-[#01544e]/20

SEBELUM: border-purple-300
SESUDAH:  border-[#01544e]/30

SEBELUM: border-blue-200
SESUDAH:  border-[#01544e]/20

SEBELUM: border-blue-300
SESUDAH:  border-[#01544e]/30

SEBELUM: border-indigo-200
SESUDAH:  border-[#01544e]/20
```

#### **7. Border Hover**
```
SEBELUM: hover:border-purple-400
SESUDAH:  hover:border-[#01544e]

SEBELUM: hover:border-blue-400
SESUDAH:  hover:border-[#01544e]
```

#### **8. Text with bg-clip**
```
SEBELUM: bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent
SESUDAH:  text-[#01544e]

SEBELUM: bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent
SESUDAH:  text-[#01544e]
```

#### **9. Border Bottom/Top dengan Gradient**
```
SEBELUM: border-b-2 border-purple-600
SESUDAH:  border-b-2 border-[#01544e]

SEBELUM: border-t border-purple-200
SESUDAH:  border-t border-[#01544e]/20
```

#### **10. Soft Backgrounds**
```
SEBELUM: bg-purple-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: bg-blue-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: bg-indigo-50
SESUDAH:  bg-[#e6f2f1]

SEBELUM: bg-cyan-50
SESUDAH:  bg-[#e6f2f1]
```

---

## 📁 FILE-FILE YANG PERLU DIUPDATE

### **Priority 1 - Main App Files:**
1. ✅ `/src/styles/theme.css` - DONE
2. `/src/app/App.tsx`
3. `/src/app/components/KPIAIEnhanced.tsx`
4. `/src/app/components/AIAssistant.tsx`

### **Priority 2 - Component Files:**
5. `/src/app/components/Home.tsx`
6. `/src/app/components/LeadManagement.tsx`
7. `/src/app/components/SalesTeam.tsx`
8. `/src/app/components/ProductCatalog.tsx`
9. `/src/app/components/DemoScheduler.tsx`

### **Priority 3 - UI Components:**
10. `/src/app/components/ui/switch.tsx`

---

## 🎨 COLOR PALETTE

### **Main Color:**
- Primary: `#01544e` (Dark Teal)
- Hover: `#023d39` (Darker Teal)
- Active: `#012b27` (Darkest Teal)

### **Light Backgrounds:**
- Soft BG: `#e6f2f1` (Very Light Teal)
- White: `#ffffff`

### **Opacity Variants:**
- 10%: `#01544e/10` atau `rgba(1, 84, 78, 0.1)`
- 20%: `#01544e/20` atau `rgba(1, 84, 78, 0.2)`
- 30%: `#01544e/30` atau `rgba(1, 84, 78, 0.3)`
- 50%: `#01544e/50` atau `rgba(1, 84, 78, 0.5)`

---

## 🔧 CARA MENGGUNAKAN

### **Option 1: Manual Find & Replace (Recommended)**

1. Buka file di code editor
2. Use Find & Replace (Ctrl+H atau Cmd+H)
3. Replace pattern sesuai tabel di atas
4. Save file

### **Option 2: Regex Find & Replace**

**Pattern untuk gradient backgrounds:**
```regex
Find: bg-gradient-to-r from-(purple|blue|indigo|pink)-\d+ (via-\w+-\d+ )?to-(purple|blue|indigo|pink|cyan)-\d+
Replace: bg-[#01544e]
```

**Pattern untuk text colors:**
```regex
Find: text-(purple|blue|indigo|pink)-600
Replace: text-[#01544e]
```

**Pattern untuk bg colors:**
```regex
Find: bg-(purple|blue|indigo|pink|green)-600
Replace: bg-[#01544e]
```

---

## ✨ CONTOH SEBELUM & SESUDAH

### **Example 1: Header dengan Gradient**
```tsx
// SEBELUM
<div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
  <h1 className="text-3xl font-bold">Sales Monitoring</h1>
</div>

// SESUDAH
<div className="bg-[#01544e] text-white">
  <h1 className="text-3xl font-bold">Sales Monitoring</h1>
</div>
```

### **Example 2: Card dengan Soft Background**
```tsx
// SEBELUM
<Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
  <CardContent className="p-4">
    <Users className="w-5 h-5 text-purple-600" />
  </CardContent>
</Card>

// SESUDAH
<Card className="border-2 border-[#01544e]/20 bg-[#e6f2f1]">
  <CardContent className="p-4">
    <Users className="w-5 h-5 text-[#01544e]" />
  </CardContent>
</Card>
```

### **Example 3: Button**
```tsx
// SEBELUM
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
  Save
</Button>

// SESUDAH
<Button className="bg-[#01544e] hover:bg-[#023d39]">
  Save
</Button>
```

### **Example 4: Avatar/Icon dengan Gradient**
```tsx
// SEBELUM
<div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
  A
</div>

// SESUDAH
<div className="h-12 w-12 rounded-full bg-[#01544e] flex items-center justify-center text-white font-bold">
  A
</div>
```

### **Example 5: Text dengan bg-clip (Gradient Text)**
```tsx
// SEBELUM
<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
  AI-Powered KPI Management
</h1>

// SESUDAH
<h1 className="text-3xl font-bold text-[#01544e]">
  AI-Powered KPI Management
</h1>
```

---

## 🚀 AUTOMATED SCRIPT (Optional)

Jika ingin automasi, gunakan script Node.js atau Python:

### **Node.js Script:**
```javascript
const fs = require('fs');
const path = require('path');

const replacements = [
  [/bg-gradient-to-r from-purple-\d+ (?:via-\w+-\d+ )?to-(?:pink|blue|indigo)-\d+/g, 'bg-[#01544e]'],
  [/text-(?:purple|blue|indigo|pink)-600/g, 'text-[#01544e]'],
  [/bg-(?:purple|blue|indigo|pink|green)-600/g, 'bg-[#01544e]'],
  [/border-(?:purple|blue)-200/g, 'border-[#01544e]/20'],
  [/from-(?:purple|blue)-50 to-(?:pink|cyan)-50/g, 'bg-[#e6f2f1]'],
];

// Apply replacements to all .tsx files
// ... implement file walking and replacement logic
```

---

## ⚠️ CATATAN PENTING

1. **Backup dulu!** Sebelum melakukan mass replacement
2. **Test per file** - jangan replace sekaligus semua file
3. **Check visual** - pastikan tampilan masih OK setelah perubahan
4. **Green/Red colors** - JANGAN diganti (untuk success/error states)
5. **Gray colors** - JANGAN diganti (untuk neutral elements)

---

## 📊 PROGRESS TRACKING

- [x] Theme CSS updated
- [ ] App.tsx
- [ ] KPIAIEnhanced.tsx
- [ ] AIAssistant.tsx
- [ ] Home.tsx
- [ ] LeadManagement.tsx
- [ ] SalesTeam.tsx
- [ ] ProductCatalog.tsx
- [ ] DemoScheduler.tsx
- [ ] UI Components

---

**Target:** Semua warna purple, pink, blue, indigo, cyan → **#01544e** (solid, tanpa gradasi)

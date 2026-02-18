# Demo Scheduler - Data Dummy Integration

## 📊 Data Dummy yang Tersedia

Menu **Demo Scheduler** sekarang memiliki **8 demo** lengkap dengan data dummy:

### Demo List:
1. **D001** - Demo Enterprise Plan (RS Harapan Sehat) - Scheduled ✅
2. **D002** - Demo Professional Plan (Klinik Sehat Bersama) - Scheduled ✅
3. **D003** - Demo EMR Standalone (Puskesmas Cibinong) - Scheduled ✅
4. **D004** - Follow-up Demo Enterprise (RS Premier Bintaro) - Completed ⭐⭐⭐⭐⭐
5. **D005** - Demo Telemedicine Module (Klinik Kimia Farma) - Scheduled ✅
6. **D006** - Demo HMS Professional (RS Hermina Depok) - Completed ⭐⭐⭐⭐
7. **D007** - Demo Billing System (Praktek Dokter Keluarga) - Scheduled ✅
8. **D008** - Demo Laboratory LIS (RS Mitra Keluarga) - Scheduled ✅

### Fitur Data Dummy:
- ✅ **Attendees** (Peserta): Internal & External dengan RSVP status
- ✅ **Resources** (Sumber Daya): Room, Equipment, Software
- ✅ **Buffer Time**: Pre & Post meeting buffer
- ✅ **Rating & Review**: Untuk completed demos
- ✅ **Meeting Links**: Zoom, Google Meet, Teams
- ✅ **Notes**: Lengkap dengan detail demo

## 🚀 Cara Menggunakan

### Automatic Initialization
Data dummy akan otomatis ter-load saat:
1. Aplikasi pertama kali dibuka
2. Menu Demo Scheduler dibuka
3. Dashboard Home dibuka

### Manual Reset
Klik tombol **"Reset Data"** di halaman Demo Scheduler untuk:
- Clear semua demo yang ada
- Re-load 8 demo dummy lengkap
- Reset ke kondisi awal

## 🔧 Debug Console Commands

Buka **Browser Console** (F12) dan gunakan:

```javascript
// View all demos in table format
demoDebug.view()

// Get statistics
demoDebug.stats()

// Reset to dummy data
demoDebug.reset()

// Clear all demos
demoDebug.clear()

// Re-initialize demos
demoDebug.init()
```

## 📁 File Structure

```
/src/utils/
├── initializeDemos.ts      # Demo data & initialization functions
├── initializeAllData.ts    # Centralized data initialization
└── demoDebug.ts           # Debug utilities for console

/src/app/components/
└── DemoScheduler.tsx      # Main component with integration
```

## 🔄 Integration Flow

```
App.tsx (Load)
    ↓
initializeAllData()
    ↓
initializeDemosData()
    ↓
localStorage: 'sales_monitoring_demos'
    ↓
DemoScheduler.tsx
    ↓
demosApi.getAll() → Fetch from localStorage
    ↓
Display 8 Demos
```

## 💾 LocalStorage Key

```javascript
'sales_monitoring_demos'
```

## 📊 Statistics Available

```javascript
{
  total: 8,
  scheduled: 6,
  completed: 2,
  cancelled: 0
}
```

## 🎯 Next Steps

1. ✅ Data dummy terintegrasi penuh
2. ✅ Auto-initialization on app load
3. ✅ Reset functionality
4. ✅ Debug console utilities
5. 🔄 Ready for Supabase migration (USE_LOCAL_STORAGE = false)

## 🔗 Related Files

- Database Schema: `/database-schema.sql`
- Populate CRM Data: `/src/utils/populateCRMData.ts`
- API Service: `/src/services/api.ts`

// Bab 12: "Data Contoh: 30 Titik Distributor & Toko (untuk Demo Peta)"
// — 11 Distributor + 19 Toko spread across Indonesia's 7 major regions,
// explicitly NOT real distributor/store data ("bukan data toko/distributor
// nyata"), transcribed verbatim from the plan doc's table so the map demo
// (Bab 11) has something real to render before actual approved records
// exist.

export interface DummyLocation {
  code: string;
  name: string;
  address: string;
  gpsLat: number;
  gpsLng: number;
}

export const distributorSeeds: DummyLocation[] = [
  { code: 'DIST-ACH01', name: 'Distributor Aceh', address: 'Banda Aceh, Aceh', gpsLat: 5.5483, gpsLng: 95.3238 },
  { code: 'DIST-SUT01', name: 'Distributor Sumatera Utara', address: 'Medan, Sumatera Utara', gpsLat: 3.5952, gpsLng: 98.6722 },
  { code: 'DIST-JKT01', name: 'Distributor DKI Jakarta', address: 'Jakarta, DKI Jakarta', gpsLat: -6.2088, gpsLng: 106.8456 },
  { code: 'DIST-JBR01', name: 'Distributor Jawa Barat', address: 'Bandung, Jawa Barat', gpsLat: -6.9175, gpsLng: 107.6191 },
  { code: 'DIST-JTM01', name: 'Distributor Jawa Timur', address: 'Surabaya, Jawa Timur', gpsLat: -7.2575, gpsLng: 112.7521 },
  { code: 'DIST-KLB01', name: 'Distributor Kalimantan Barat', address: 'Pontianak, Kalimantan Barat', gpsLat: -0.0263, gpsLng: 109.3425 },
  { code: 'DIST-KLT01', name: 'Distributor Kalimantan Timur', address: 'Samarinda, Kalimantan Timur', gpsLat: -0.5022, gpsLng: 117.1536 },
  { code: 'DIST-SLS01', name: 'Distributor Sulawesi Selatan', address: 'Makassar, Sulawesi Selatan', gpsLat: -5.1477, gpsLng: 119.4327 },
  { code: 'DIST-BAL01', name: 'Distributor Bali', address: 'Denpasar, Bali', gpsLat: -8.6705, gpsLng: 115.2126 },
  { code: 'DIST-MAL01', name: 'Distributor Maluku', address: 'Ambon, Maluku', gpsLat: -3.6954, gpsLng: 128.1814 },
  { code: 'DIST-PAP01', name: 'Distributor Papua', address: 'Jayapura, Papua', gpsLat: -2.5337, gpsLng: 140.7181 },
];

export const storeSeeds: DummyLocation[] = [
  { code: 'TOKO-SUB01', name: 'Toko Bangunan Padang Jaya', address: 'Padang, Sumatera Barat', gpsLat: -0.9471, gpsLng: 100.4172 },
  { code: 'TOKO-RIA01', name: 'Toko Bangunan Riau Sentosa', address: 'Pekanbaru, Riau', gpsLat: 0.5071, gpsLng: 101.4478 },
  { code: 'TOKO-SUS01', name: 'Toko Bangunan Palembang Makmur', address: 'Palembang, Sumatera Selatan', gpsLat: -2.9761, gpsLng: 104.7754 },
  { code: 'TOKO-LPG01', name: 'Toko Bangunan Lampung Jaya', address: 'Bandar Lampung, Lampung', gpsLat: -5.4292, gpsLng: 105.2610 },
  { code: 'TOKO-JBR02', name: 'Toko Bangunan Bogor Sejahtera', address: 'Bogor, Jawa Barat', gpsLat: -6.5950, gpsLng: 106.8166 },
  { code: 'TOKO-JTG01', name: 'Toko Bangunan Semarang Jaya', address: 'Semarang, Jawa Tengah', gpsLat: -6.9932, gpsLng: 110.4203 },
  { code: 'TOKO-DIY01', name: 'Toko Bangunan Yogyakarta Makmur', address: 'Yogyakarta, DI Yogyakarta', gpsLat: -7.7956, gpsLng: 110.3695 },
  { code: 'TOKO-KLS01', name: 'Toko Bangunan Banjarmasin Jaya', address: 'Banjarmasin, Kalimantan Selatan', gpsLat: -3.3186, gpsLng: 114.5944 },
  { code: 'TOKO-KLG01', name: 'Toko Bangunan Palangkaraya Sentosa', address: 'Palangkaraya, Kalimantan Tengah', gpsLat: -2.2090, gpsLng: 113.9213 },
  { code: 'TOKO-KLU01', name: 'Toko Bangunan Tarakan Jaya', address: 'Tarakan, Kalimantan Utara', gpsLat: 3.3020, gpsLng: 117.6339 },
  { code: 'TOKO-SLU01', name: 'Toko Bangunan Manado Jaya', address: 'Manado, Sulawesi Utara', gpsLat: 1.4748, gpsLng: 124.8421 },
  { code: 'TOKO-SLT01', name: 'Toko Bangunan Palu Makmur', address: 'Palu, Sulawesi Tengah', gpsLat: -0.8917, gpsLng: 119.8707 },
  { code: 'TOKO-SLR01', name: 'Toko Bangunan Kendari Jaya', address: 'Kendari, Sulawesi Tenggara', gpsLat: -3.9450, gpsLng: 122.4989 },
  { code: 'TOKO-GTL01', name: 'Toko Bangunan Gorontalo Sentosa', address: 'Gorontalo, Gorontalo', gpsLat: 0.5387, gpsLng: 123.0568 },
  { code: 'TOKO-BAL02', name: 'Toko Bangunan Singaraja Jaya', address: 'Singaraja, Bali', gpsLat: -8.1120, gpsLng: 115.0882 },
  { code: 'TOKO-NTB01', name: 'Toko Bangunan Mataram Makmur', address: 'Mataram, Nusa Tenggara Barat', gpsLat: -8.5833, gpsLng: 116.1167 },
  { code: 'TOKO-NTT01', name: 'Toko Bangunan Kupang Jaya', address: 'Kupang, Nusa Tenggara Timur', gpsLat: -10.1772, gpsLng: 123.6070 },
  { code: 'TOKO-MLU01', name: 'Toko Bangunan Ternate Jaya', address: 'Ternate, Maluku Utara', gpsLat: 0.7833, gpsLng: 127.3667 },
  { code: 'TOKO-PBD01', name: 'Toko Bangunan Sorong Makmur', address: 'Sorong, Papua Barat Daya', gpsLat: -0.8762, gpsLng: 131.2558 },
];

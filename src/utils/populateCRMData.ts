/**
 * Populate CRM Dummy Data to LocalStorage
 * This creates realistic dummy data for Sales Representative, Clients, Partners, Products, and Contracts
 */

// LocalStorage Keys
const LS_KEYS = {
  EMPLOYEES: 'sales_monitoring_employees',
  CLIENTS: 'sales_monitoring_clients',
  PARTNERS: 'sales_monitoring_partners',
  PRODUCTS: 'sales_monitoring_products',
  CONTRACTS: 'sales_monitoring_contracts',
  DEMOS: 'sales_monitoring_demos',
};

// Helper function to generate ID
const generateId = () => crypto.randomUUID();

// Helper function to generate ID Customer (format: CUS-YYYYMMDD-XXX)
const generateCustomerId = (index: number) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `CUS-${date}-${String(index).padStart(3, '0')}`;
};

// Helper function to generate Contract Number (format: CTR-YYYY-MMDD-XXX)
const generateContractNumber = (index: number) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `CTR-${year}-${month}${day}-${String(index).padStart(3, '0')}`;
};

// ===== SALES REPRESENTATIVE DUMMY DATA =====
const salesRepresentativeDummyData = [
  {
    id: generateId(),
    nama_lengkap: 'Budi Santoso',
    nik: '3201012345678901',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '1990-05-15',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
    nomor_wa: '081234567890',
    email_pribadi: 'budi.santoso@gmail.com',
    divisi: 'Sales & Marketing',
    jabatan: 'Senior Sales Executive',
    level_jabatan: 'Senior',
    status_karyawan: 'Tetap',
    tanggal_bergabung: '2020-01-15',
    nama_atasan: 'Andi Wijaya',
    npwp: '12.345.678.9-012.000',
    nomor_rekening: '1234567890',
    nama_bank: 'BCA',
    bpjs_ketenagakerjaan: '12345678901',
    bpjs_kesehatan: '0001234567890',
    email_kantor: 'budi.santoso@intramedika.com',
    nda_signed: true,
    tanggal_nda: '2020-01-10',
    level_akses: 'Sales Executive',
    aset_perusahaan: 'Laptop Dell XPS 15',
  },
  {
    id: generateId(),
    nama_lengkap: 'Siti Nurhaliza',
    nik: '3201012345678902',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '1992-08-22',
    jenis_kelamin: 'Perempuan',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    nomor_wa: '081234567891',
    email_pribadi: 'siti.nurhaliza@gmail.com',
    divisi: 'Sales & Marketing',
    jabatan: 'Sales Executive',
    level_jabatan: 'Mid',
    status_karyawan: 'Tetap',
    tanggal_bergabung: '2021-03-10',
    nama_atasan: 'Budi Santoso',
    npwp: '12.345.678.9-012.001',
    nomor_rekening: '1234567891',
    nama_bank: 'Mandiri',
    bpjs_ketenagakerjaan: '12345678902',
    bpjs_kesehatan: '0001234567891',
    email_kantor: 'siti.nurhaliza@intramedika.com',
    nda_signed: true,
    tanggal_nda: '2021-03-05',
    level_akses: 'Sales Executive',
    aset_perusahaan: 'Laptop Lenovo ThinkPad',
  },
  {
    id: generateId(),
    nama_lengkap: 'Andi Wijaya',
    nik: '3201012345678903',
    tempat_lahir: 'Surabaya',
    tanggal_lahir: '1985-12-10',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. Gatot Subroto No. 88, Jakarta Pusat',
    nomor_wa: '081234567892',
    email_pribadi: 'andi.wijaya@gmail.com',
    divisi: 'Sales & Marketing',
    jabatan: 'Sales Manager',
    level_jabatan: 'Manager',
    status_karyawan: 'Tetap',
    tanggal_bergabung: '2018-06-01',
    nama_atasan: 'Direktur Sales',
    npwp: '12.345.678.9-012.002',
    nomor_rekening: '1234567892',
    nama_bank: 'BCA',
    bpjs_ketenagakerjaan: '12345678903',
    bpjs_kesehatan: '0001234567892',
    email_kantor: 'andi.wijaya@intramedika.com',
    nda_signed: true,
    tanggal_nda: '2018-05-25',
    level_akses: 'Manager',
    aset_perusahaan: 'Laptop MacBook Pro, iPhone 14',
  },
  {
    id: generateId(),
    nama_lengkap: 'Dewi Lestari',
    nik: '3201012345678904',
    tempat_lahir: 'Yogyakarta',
    tanggal_lahir: '1995-03-18',
    jenis_kelamin: 'Perempuan',
    alamat: 'Jl. Thamrin No. 67, Jakarta Pusat',
    nomor_wa: '081234567893',
    email_pribadi: 'dewi.lestari@gmail.com',
    divisi: 'Sales & Marketing',
    jabatan: 'Junior Sales Executive',
    level_jabatan: 'Junior',
    status_karyawan: 'Kontrak',
    tanggal_bergabung: '2024-01-15',
    nama_atasan: 'Budi Santoso',
    npwp: '12.345.678.9-012.003',
    nomor_rekening: '1234567893',
    nama_bank: 'BNI',
    bpjs_ketenagakerjaan: '12345678904',
    bpjs_kesehatan: '0001234567893',
    email_kantor: 'dewi.lestari@intramedika.com',
    nda_signed: true,
    tanggal_nda: '2024-01-10',
    level_akses: 'Sales Executive',
    aset_perusahaan: 'Laptop Asus VivoBook',
  },
  {
    id: generateId(),
    nama_lengkap: 'Rudi Hartono',
    nik: '3201012345678905',
    tempat_lahir: 'Semarang',
    tanggal_lahir: '1988-07-25',
    jenis_kelamin: 'Laki-laki',
    alamat: 'Jl. HR Rasuna Said No. 12, Jakarta Selatan',
    nomor_wa: '081234567894',
    email_pribadi: 'rudi.hartono@gmail.com',
    divisi: 'Sales & Marketing',
    jabatan: 'Account Manager',
    level_jabatan: 'Senior',
    status_karyawan: 'Tetap',
    tanggal_bergabung: '2019-09-01',
    nama_atasan: 'Andi Wijaya',
    npwp: '12.345.678.9-012.004',
    nomor_rekening: '1234567894',
    nama_bank: 'BCA',
    bpjs_ketenagakerjaan: '12345678905',
    bpjs_kesehatan: '0001234567894',
    email_kantor: 'rudi.hartono@intramedika.com',
    nda_signed: true,
    tanggal_nda: '2019-08-25',
    level_akses: 'Sales Executive',
    aset_perusahaan: 'Laptop Dell Latitude, iPad Pro',
  },
];

// ===== CLIENTS DUMMY DATA =====
const clientsDummyData = [
  {
    id: generateId(),
    id_customer: generateCustomerId(1),
    nama_entitas: 'RS Harapan Sehat Jakarta',
    kategori_client: 'Rumah Sakit',
    alamat_lengkap: 'Jl. Gatot Subroto No. 45, Jakarta Selatan, DKI Jakarta 12950',
    koordinat_gps: '-6.2297, 106.8261',
    nomor_telepon: '021-5551234',
    email_resmi: 'info@rsharapansehat.co.id',
    id_satusehat: 'SS-1234567890',
    id_faskes_bpjs: 'BPJS-RS-001234',
    status_akreditasi: 'Paripurna',
    sistem_lama: 'Custom In-House System',
    volume_pasien: '500-1000 pasien/bulan',
    jumlah_tempat_tidur: '250 bed',
    nama_pic: 'Dr. Ahmad Fauzi',
    jabatan_pic: 'Direktur RS',
    whatsapp_pic: '081234567800',
    status_hubungan: 'Active Client',
    paket_aktif: 'HMS Enterprise + Intradoc Pro',
    modul_tambahan: 'Telemedicine, EMR, Radiologi, Lab',
    status_kontrak: 'Active',
    tanggal_mulai_langganan: '2023-01-15',
    tanggal_habis_kontrak: '2026-01-14',
    total_nilai_kontrak: 'Rp 2.500.000.000',
    file_kontrak_digital: 'kontrak_rs_harapan_sehat_2023.pdf',
    status_esign: 'Signed',
    npwp_faskes: '01.234.567.8-901.000',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(2),
    nama_entitas: 'Klinik Sehat Bersama',
    kategori_client: 'Klinik',
    alamat_lengkap: 'Jl. Sudirman No. 123, Bandung, Jawa Barat 40123',
    koordinat_gps: '-6.9175, 107.6191',
    nomor_telepon: '022-5551234',
    email_resmi: 'info@kliniksehatbersama.co.id',
    id_satusehat: 'SS-2345678901',
    id_faskes_bpjs: 'BPJS-KL-002345',
    status_akreditasi: 'Dasar',
    sistem_lama: 'Manual (Spreadsheet)',
    volume_pasien: '100-200 pasien/bulan',
    jumlah_tempat_tidur: 'N/A',
    nama_pic: 'dr. Siti Rahmawati',
    jabatan_pic: 'Kepala Klinik',
    whatsapp_pic: '081234567801',
    status_hubungan: 'Hot',
    paket_aktif: '-',
    modul_tambahan: '-',
    status_kontrak: 'Proposal Sent',
    tanggal_mulai_langganan: '-',
    tanggal_habis_kontrak: '-',
    total_nilai_kontrak: 'Rp 150.000.000 (Proposal)',
    file_kontrak_digital: '-',
    status_esign: 'Pending',
    npwp_faskes: '02.345.678.9-012.000',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(3),
    nama_entitas: 'RS Mitra Keluarga Surabaya',
    kategori_client: 'Rumah Sakit',
    alamat_lengkap: 'Jl. Ahmad Yani No. 88, Surabaya, Jawa Timur 60234',
    koordinat_gps: '-7.2575, 112.7521',
    nomor_telepon: '031-5551234',
    email_resmi: 'info@rsmitrakeluarga-sby.co.id',
    id_satusehat: 'SS-3456789012',
    id_faskes_bpjs: 'BPJS-RS-003456',
    status_akreditasi: 'Paripurna',
    sistem_lama: 'Competitor A (SIM RS XYZ)',
    volume_pasien: '800-1200 pasien/bulan',
    jumlah_tempat_tidur: '350 bed',
    nama_pic: 'Dr. Bambang Sutrisno, Sp.PD',
    jabatan_pic: 'Wakil Direktur Medis',
    whatsapp_pic: '081234567802',
    status_hubungan: 'Active Client',
    paket_aktif: 'HMS Professional',
    modul_tambahan: 'EMR, PACS, LIS',
    status_kontrak: 'Active',
    tanggal_mulai_langganan: '2022-06-01',
    tanggal_habis_kontrak: '2025-05-31',
    total_nilai_kontrak: 'Rp 3.200.000.000',
    file_kontrak_digital: 'kontrak_rs_mitra_keluarga_2022.pdf',
    status_esign: 'Signed',
    npwp_faskes: '03.456.789.0-123.000',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(4),
    nama_entitas: 'Puskesmas Cibinong',
    kategori_client: 'Puskesmas',
    alamat_lengkap: 'Jl. Raya Cibinong No. 1, Bogor, Jawa Barat 16914',
    koordinat_gps: '-6.4817, 106.8542',
    nomor_telepon: '021-5559876',
    email_resmi: 'puskesmas.cibinong@kemkes.go.id',
    id_satusehat: 'SS-4567890123',
    id_faskes_bpjs: 'BPJS-PK-004567',
    status_akreditasi: 'Madya',
    sistem_lama: 'P-CARE BPJS + Excel',
    volume_pasien: '300-500 pasien/bulan',
    jumlah_tempat_tidur: '10 bed',
    nama_pic: 'dr. Hendra Gunawan',
    jabatan_pic: 'Kepala Puskesmas',
    whatsapp_pic: '081234567803',
    status_hubungan: 'Warm',
    paket_aktif: '-',
    modul_tambahan: '-',
    status_kontrak: 'Demo Scheduled',
    tanggal_mulai_langganan: '-',
    tanggal_habis_kontrak: '-',
    total_nilai_kontrak: 'Rp 85.000.000 (Estimate)',
    file_kontrak_digital: '-',
    status_esign: 'Pending',
    npwp_faskes: '04.567.890.1-234.000',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(5),
    nama_entitas: 'Praktek Bersama Dokter Keluarga',
    kategori_client: 'Praktek Dokter Pribadi',
    alamat_lengkap: 'Jl. Kebon Jeruk Raya No. 27, Jakarta Barat, DKI Jakarta 11530',
    koordinat_gps: '-6.1895, 106.7826',
    nomor_telepon: '021-5554321',
    email_resmi: 'info@dokterpraktek.com',
    id_satusehat: 'SS-5678901234',
    id_faskes_bpjs: 'BPJS-PP-005678',
    status_akreditasi: 'N/A',
    sistem_lama: 'Manual',
    volume_pasien: '50-100 pasien/bulan',
    jumlah_tempat_tidur: 'N/A',
    nama_pic: 'dr. Lisa Permata Sari',
    jabatan_pic: 'Dokter Pemilik',
    whatsapp_pic: '081234567804',
    status_hubungan: 'Cold',
    paket_aktif: '-',
    modul_tambahan: '-',
    status_kontrak: 'Initial Contact',
    tanggal_mulai_langganan: '-',
    tanggal_habis_kontrak: '-',
    total_nilai_kontrak: 'Rp 35.000.000 (Estimate)',
    file_kontrak_digital: '-',
    status_esign: 'Pending',
    npwp_faskes: '05.678.901.2-345.000',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(6),
    nama_entitas: 'RS Premier Bintaro',
    kategori_client: 'Rumah Sakit',
    alamat_lengkap: 'Jl. Bintaro Utama No. 1, Tangerang Selatan, Banten 15224',
    koordinat_gps: '-6.2684, 106.7376',
    nomor_telepon: '021-7456789',
    email_resmi: 'info@premierbintaro.co.id',
    id_satusehat: 'SS-6789012345',
    id_faskes_bpjs: 'BPJS-RS-006789',
    status_akreditasi: 'Paripurna',
    sistem_lama: 'Competitor B (HMS ABC)',
    volume_pasien: '1000-1500 pasien/bulan',
    jumlah_tempat_tidur: '400 bed',
    nama_pic: 'Dr. Ir. Johanes Surya',
    jabatan_pic: 'CEO',
    whatsapp_pic: '081234567805',
    status_hubungan: 'Hot',
    paket_aktif: '-',
    modul_tambahan: '-',
    status_kontrak: 'Negotiation',
    tanggal_mulai_langganan: '-',
    tanggal_habis_kontrak: '-',
    total_nilai_kontrak: 'Rp 5.800.000.000 (Proposal)',
    file_kontrak_digital: '-',
    status_esign: 'Pending',
    npwp_faskes: '06.789.012.3-456.000',
  },
];

// ===== PARTNERS DUMMY DATA =====
const partnersDummyData = [
  {
    id: generateId(),
    id_customer: generateCustomerId(101),
    nama_perusahaan: 'PT Solusi Digital Nusantara',
    tipe_partner: 'Reseller',
    spesialisasi: 'Healthcare IT Solutions',
    account_manager_internal: 'Rudi Hartono',
    pic_partner: 'Hendra Kusuma',
    kontak_darurat: '081234567900',
    alamat_kantor: 'Jl. TB Simatupang No. 88, Jakarta Selatan, DKI Jakarta 12430',
    status_kemitraan: 'Active',
    masa_berlaku_mou_start: '2023-01-01',
    masa_berlaku_mou_end: '2026-12-31',
    file_mou_nda: 'mou_pt_solusi_digital_2023.pdf',
    tingkat_kemitraan: 'Platinum',
    api_endpoint: 'https://api.solusidigitnusantara.com/v1',
    api_key_reference: 'SDK-API-2023-XXXXX',
    sla_requirement: '99.5% uptime, Response < 2 hours',
    status_integrasi: 'Integrated',
    skema_komisi: '15% per deal closed',
    total_leads_generated: '45',
    total_revenue_contribution: 'Rp 1.250.000.000',
    rekening_pembayaran: 'BCA 1234567890 a/n PT Solusi Digital Nusantara',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(102),
    nama_perusahaan: 'CV Teknologi Medis Indonesia',
    tipe_partner: 'Integrator',
    spesialisasi: 'Medical Equipment Integration',
    account_manager_internal: 'Budi Santoso',
    pic_partner: 'Ir. Suryanto, M.T.',
    kontak_darurat: '081234567901',
    alamat_kantor: 'Jl. Sudirman No. 234, Bandung, Jawa Barat 40123',
    status_kemitraan: 'Active',
    masa_berlaku_mou_start: '2022-06-01',
    masa_berlaku_mou_end: '2025-05-31',
    file_mou_nda: 'mou_cv_teknologi_medis_2022.pdf',
    tingkat_kemitraan: 'Gold',
    api_endpoint: 'https://api.teknomedis.id/integration',
    api_key_reference: 'TMI-API-2022-XXXXX',
    sla_requirement: '98% uptime, Response < 4 hours',
    status_integrasi: 'Integrated',
    skema_komisi: '10% per integration project',
    total_leads_generated: '28',
    total_revenue_contribution: 'Rp 850.000.000',
    rekening_pembayaran: 'Mandiri 9876543210 a/n CV Teknologi Medis Indonesia',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(103),
    nama_perusahaan: 'PT Konsultan Kesehatan Prima',
    tipe_partner: 'Consultant',
    spesialisasi: 'Hospital Management Consulting',
    account_manager_internal: 'Andi Wijaya',
    pic_partner: 'Dr. Maria Susanti, MARS',
    kontak_darurat: '081234567902',
    alamat_kantor: 'Jl. Thamrin No. 56, Jakarta Pusat, DKI Jakarta 10350',
    status_kemitraan: 'Active',
    masa_berlaku_mou_start: '2023-03-01',
    masa_berlaku_mou_end: '2026-02-28',
    file_mou_nda: 'mou_pt_konsultan_kesehatan_2023.pdf',
    tingkat_kemitraan: 'Gold',
    api_endpoint: '-',
    api_key_reference: '-',
    sla_requirement: 'Project-based SLA',
    status_integrasi: 'N/A',
    skema_komisi: '12% per consulting project',
    total_leads_generated: '18',
    total_revenue_contribution: 'Rp 620.000.000',
    rekening_pembayaran: 'BNI 5432109876 a/n PT Konsultan Kesehatan Prima',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(104),
    nama_perusahaan: 'PT Hardware Medical Supplies',
    tipe_partner: 'Vendor',
    spesialisasi: 'Medical Hardware & Server Solutions',
    account_manager_internal: 'Siti Nurhaliza',
    pic_partner: 'Bambang Prasetyo',
    kontak_darurat: '081234567903',
    alamat_kantor: 'Jl. Gatot Subroto No. 120, Surabaya, Jawa Timur 60285',
    status_kemitraan: 'Active',
    masa_berlaku_mou_start: '2021-09-01',
    masa_berlaku_mou_end: '2024-08-31',
    file_mou_nda: 'mou_pt_hardware_medical_2021.pdf',
    tingkat_kemitraan: 'Silver',
    api_endpoint: 'https://api.hwmedical.co.id/catalog',
    api_key_reference: 'HMS-API-2021-XXXXX',
    sla_requirement: 'Delivery < 14 days, Warranty 2 years',
    status_integrasi: 'Pending',
    skema_komisi: '8% per hardware sale',
    total_leads_generated: '12',
    total_revenue_contribution: 'Rp 450.000.000',
    rekening_pembayaran: 'BCA 7890123456 a/n PT Hardware Medical Supplies',
  },
  {
    id: generateId(),
    id_customer: generateCustomerId(105),
    nama_perusahaan: 'CV Pelatihan Kesehatan Profesional',
    tipe_partner: 'Consultant',
    spesialisasi: 'Healthcare Staff Training & Development',
    account_manager_internal: 'Dewi Lestari',
    pic_partner: 'Prof. Dr. Ahmad Rizki, Sp.KJ',
    kontak_darurat: '081234567904',
    alamat_kantor: 'Jl. Diponegoro No. 78, Yogyakarta, DIY 55221',
    status_kemitraan: 'Pending',
    masa_berlaku_mou_start: '2024-01-01',
    masa_berlaku_mou_end: '2027-12-31',
    file_mou_nda: 'draft_mou_cv_pelatihan_kesehatan_2024.pdf',
    tingkat_kemitraan: 'Bronze',
    api_endpoint: '-',
    api_key_reference: '-',
    sla_requirement: 'Training delivery < 30 days notice',
    status_integrasi: 'N/A',
    skema_komisi: '10% per training package',
    total_leads_generated: '5',
    total_revenue_contribution: 'Rp 180.000.000',
    rekening_pembayaran: 'Mandiri 3456789012 a/n CV Pelatihan Kesehatan Profesional',
  },
];

// ===== PRODUCTS DUMMY DATA =====
const productsDummyData = [
  {
    id: generateId(),
    name: 'HMS Enterprise',
    category: 'Hospital Management System',
    description: 'Sistem manajemen rumah sakit komprehensif dengan fitur telemedicine, EMR, radiologi, dan laboratorium.',
    price: 500000000,
    stock: 100,
    sold: 15,
    features: ['Telemedicine', 'EMR', 'Radiologi', 'Laboratorium', 'PACS', 'LIS', 'Billing System', 'Pharmacy System'],
  },
  {
    id: generateId(),
    name: 'HMS Professional',
    category: 'Hospital Management System',
    description: 'Sistem manajemen rumah sakit profesional dengan fitur EMR, PACS, dan LIS untuk RS tipe B dan C.',
    price: 300000000,
    stock: 150,
    sold: 23,
    features: ['EMR', 'PACS', 'LIS', 'Billing System', 'Inventory Management', 'Reporting Dashboard'],
  },
  {
    id: generateId(),
    name: 'Intradoc Pro',
    category: 'Document Management',
    description: 'Sistem manajemen dokumen profesional untuk manajemen dokumen medis dan administrasi rumah sakit.',
    price: 100000000,
    stock: 200,
    sold: 34,
    features: ['Manajemen Dokumen Medis', 'Manajemen Dokumen Administrasi', 'E-Signature', 'Audit Trail', 'Version Control'],
  },
  {
    id: generateId(),
    name: 'Telemedicine Module',
    category: 'Telemedicine',
    description: 'Sistem telemedicine untuk konsultasi jarak jauh antara dokter dan pasien dengan video call HD.',
    price: 50000000,
    stock: 250,
    sold: 42,
    features: ['Video Call HD', 'Chat Dokter-Pasien', 'Resep Digital', 'Monitoring Pasien', 'Payment Gateway'],
  },
  {
    id: generateId(),
    name: 'EMR Standalone',
    category: 'Electronic Medical Record',
    description: 'Sistem catatan medis elektronik standalone untuk manajemen data pasien dan rekam medis.',
    price: 150000000,
    stock: 180,
    sold: 28,
    features: ['Manajemen Data Pasien', 'Rekam Medis Digital', 'SOAP Notes', 'ICD-10 Integration', 'CPPT'],
  },
  {
    id: generateId(),
    name: 'Radiologi PACS',
    category: 'Radiology',
    description: 'Sistem PACS untuk manajemen dan analisis gambar radiologi dengan DICOM viewer.',
    price: 200000000,
    stock: 120,
    sold: 18,
    features: ['DICOM Viewer', 'Image Storage', 'Worklist Management', '3D Reconstruction', 'Teleradiology'],
  },
  {
    id: generateId(),
    name: 'Laboratory LIS',
    category: 'Laboratory',
    description: 'Sistem informasi laboratorium untuk manajemen pemeriksaan dan hasil lab dengan auto-interface.',
    price: 100000000,
    stock: 160,
    sold: 31,
    features: ['Order Management', 'Result Entry', 'Auto-Interface', 'Quality Control', 'Report Generation'],
  },
  {
    id: generateId(),
    name: 'Pharmacy Module',
    category: 'Pharmacy Management',
    description: 'Sistem manajemen farmasi untuk inventory obat, dispensing, dan interaksi obat.',
    price: 80000000,
    stock: 190,
    sold: 26,
    features: ['Inventory Management', 'Dispensing', 'Drug Interaction Check', 'Expired Date Alert', 'Stock Opname'],
  },
  {
    id: generateId(),
    name: 'Billing System',
    category: 'Finance & Billing',
    description: 'Sistem billing komprehensif dengan integrasi BPJS, asuransi, dan payment gateway.',
    price: 120000000,
    stock: 140,
    sold: 37,
    features: ['BPJS Integration', 'Insurance Claims', 'Payment Gateway', 'Invoice Generation', 'Financial Reports'],
  },
  {
    id: generateId(),
    name: 'Mobile App HMS',
    category: 'Mobile Application',
    description: 'Aplikasi mobile untuk pasien: jadwal dokter, booking appointment, dan telemedicine.',
    price: 75000000,
    stock: 220,
    sold: 45,
    features: ['Jadwal Dokter', 'Online Booking', 'Telemedicine', 'Medical Records', 'Push Notifications'],
  },
  {
    id: generateId(),
    name: 'Nurse Station Module',
    category: 'Nursing Management',
    description: 'Sistem untuk nurse station: vital signs monitoring, medication administration, dan care plan.',
    price: 90000000,
    stock: 170,
    sold: 22,
    features: ['Vital Signs Entry', 'Medication Administration', 'Care Plan', 'Nursing Notes', 'Handover Report'],
  },
  {
    id: generateId(),
    name: 'Inventory Management',
    category: 'Inventory & Supply Chain',
    description: 'Sistem manajemen inventory untuk medical supplies, alkes, dan asset management.',
    price: 85000000,
    stock: 130,
    sold: 19,
    features: ['Stock Management', 'Purchase Order', 'Vendor Management', 'Asset Tracking', 'Reorder Point Alert'],
  },
];

// ===== CONTRACTS DUMMY DATA =====
const contractsDummyData = [
  {
    id: generateId(),
    contractNumber: generateContractNumber(1),
    clientName: 'RS Harapan Sehat Jakarta',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Enterprise + Intradoc Pro',
    value: 2500000000,
    startDate: new Date('2023-01-15'),
    endDate: new Date('2026-01-14'),
    status: 'active' as const,
    signedBy: 'Dr. Ahmad Fauzi',
    salesPerson: 'Budi Santoso',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(2),
    clientName: 'RS Mitra Keluarga Surabaya',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Professional',
    value: 3200000000,
    startDate: new Date('2022-06-01'),
    endDate: new Date('2025-05-31'),
    status: 'active' as const,
    signedBy: 'Dr. Bambang Sutrisno, Sp.PD',
    salesPerson: 'Rudi Hartono',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(3),
    clientName: 'Klinik Sehat Bersama',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Professional + Telemedicine Module',
    value: 150000000,
    startDate: new Date('2026-03-01'),
    endDate: new Date('2029-02-28'),
    status: 'pending' as const,
    signedBy: 'dr. Siti Rahmawati',
    salesPerson: 'Siti Nurhaliza',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(4),
    clientName: 'RS Premier Bintaro',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Enterprise + EMR Standalone + Radiologi PACS',
    value: 5800000000,
    startDate: new Date('2026-02-15'),
    endDate: new Date('2029-02-14'),
    status: 'pending' as const,
    signedBy: 'Dr. Ir. Johanes Surya',
    salesPerson: 'Andi Wijaya',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(5),
    clientName: 'Puskesmas Cibinong',
    company: 'PT Intramedika Solusindo',
    product: 'EMR Standalone + Billing System',
    value: 85000000,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2028-08-31'),
    status: 'draft' as const,
    signedBy: 'dr. Hendra Gunawan',
    salesPerson: 'Dewi Lestari',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(6),
    clientName: 'RS Siloam Hospitals Jakarta',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Enterprise + Laboratory LIS + Pharmacy Module',
    value: 4200000000,
    startDate: new Date('2021-03-01'),
    endDate: new Date('2024-02-29'),
    status: 'expired' as const,
    signedBy: 'Dr. Caroline Riady',
    salesPerson: 'Budi Santoso',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(7),
    clientName: 'Klinik Kimia Farma Jakarta Pusat',
    company: 'PT Intramedika Solusindo',
    product: 'Telemedicine Module + Mobile App HMS',
    value: 95000000,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2026-05-31'),
    status: 'active' as const,
    signedBy: 'dr. Rina Wijayanti',
    salesPerson: 'Siti Nurhaliza',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(8),
    clientName: 'RS Hermina Depok',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Professional + Nurse Station Module',
    value: 1800000000,
    startDate: new Date('2023-10-01'),
    endDate: new Date('2026-09-30'),
    status: 'active' as const,
    signedBy: 'Dr. Hadi Sutrisno',
    salesPerson: 'Rudi Hartono',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(9),
    clientName: 'RS Pondok Indah',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Enterprise Full Suite',
    value: 7500000000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2027-12-31'),
    status: 'active' as const,
    signedBy: 'Dr. Adib Khumaidi',
    salesPerson: 'Andi Wijaya',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(10),
    clientName: 'Klinik Pratama Medika',
    company: 'PT Intramedika Solusindo',
    product: 'EMR Standalone',
    value: 55000000,
    startDate: new Date('2022-04-15'),
    endDate: new Date('2025-04-14'),
    status: 'active' as const,
    signedBy: 'dr. Rini Handayani',
    salesPerson: 'Dewi Lestari',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(11),
    clientName: 'RS Mayapada Hospital',
    company: 'PT Intramedika Solusindo',
    product: 'HMS Professional + Radiologi PACS + Laboratory LIS',
    value: 3800000000,
    startDate: new Date('2020-08-01'),
    endDate: new Date('2023-07-31'),
    status: 'terminated' as const,
    signedBy: 'Dr. Jonathan Tahir',
    salesPerson: 'Budi Santoso',
  },
  {
    id: generateId(),
    contractNumber: generateContractNumber(12),
    clientName: 'Praktek Bersama Dokter Keluarga',
    company: 'PT Intramedika Solusindo',
    product: 'Telemedicine Module + EMR Standalone',
    value: 35000000,
    startDate: new Date('2025-12-01'),
    endDate: new Date('2028-11-30'),
    status: 'draft' as const,
    signedBy: 'dr. Lisa Permata Sari',
    salesPerson: 'Siti Nurhaliza',
  },
];

// ===== DEMOS DUMMY DATA =====
const demosDummyData = [
  {
    id: 'D001',
    title: 'Demo Enterprise Plan - RS Harapan Sehat',
    leadName: 'Dr. Ahmad Fauzi',
    company: 'RS Harapan Sehat Jakarta',
    date: new Date(2026, 1, 10, 10, 0), // Feb 10, 2026, 10:00 AM
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'HMS Enterprise',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-e001',
    notes: 'Fokus pada fitur analytics dan reporting untuk manajemen rumah sakit',
    attendees: [
      {
        id: 'A001',
        name: 'Dr. Ahmad Fauzi',
        email: 'ahmad.fauzi@rsharapansehat.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A002',
        name: 'dr. Siti Rahman',
        email: 'siti.rahman@rsharapansehat.co.id',
        type: 'external' as const,
        rsvp: 'pending' as const
      },
      {
        id: 'A003',
        name: 'Budi Santoso',
        email: 'budi.santoso@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R001',
        name: 'Meeting Room A',
        type: 'room' as const
      },
      {
        id: 'R002',
        name: 'Projector 4K',
        type: 'equipment' as const
      },
      {
        id: 'R003',
        name: 'Zoom Premium',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 15,
      after: 15
    }
  },
  {
    id: 'D002',
    title: 'Demo Professional Plan - Klinik Sehat Bersama',
    leadName: 'dr. Siti Rahmawati',
    company: 'Klinik Sehat Bersama',
    date: new Date(2026, 1, 12, 14, 0), // Feb 12, 2026, 2:00 PM
    time: '14:00',
    duration: 45,
    presenter: 'Siti Nurhaliza',
    product: 'HMS Professional',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-p001',
    notes: 'Tunjukkan integrasi dengan existing system dan kemudahan onboarding',
    attendees: [
      {
        id: 'A004',
        name: 'dr. Siti Rahmawati',
        email: 'siti@kliniksehatbersama.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A005',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R004',
        name: 'Meeting Room B',
        type: 'room' as const
      },
      {
        id: 'R005',
        name: 'Google Meet',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 10,
      after: 10
    }
  },
  {
    id: 'D003',
    title: 'Demo EMR Standalone - Puskesmas Cibinong',
    leadName: 'dr. Hendra Gunawan',
    company: 'Puskesmas Cibinong',
    date: new Date(2026, 1, 15, 11, 0), // Feb 15, 2026, 11:00 AM
    time: '11:00',
    duration: 30,
    presenter: 'Dewi Lestari',
    product: 'EMR Standalone',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-emr001',
    notes: 'Demo basic features dan onboarding process untuk Puskesmas',
    attendees: [
      {
        id: 'A006',
        name: 'dr. Hendra Gunawan',
        email: 'hendra@puskesmascibinong.go.id',
        type: 'external' as const,
        rsvp: 'pending' as const
      },
      {
        id: 'A007',
        name: 'Dewi Lestari',
        email: 'dewi.lestari@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R006',
        name: 'Microsoft Teams',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 5,
      after: 10
    }
  },
  {
    id: 'D004',
    title: 'Follow-up Demo Enterprise - RS Premier Bintaro',
    leadName: 'Dr. Ir. Johanes Surya',
    company: 'RS Premier Bintaro',
    date: new Date(2026, 1, 5, 15, 0), // Feb 5, 2026, 3:00 PM (Past - Completed)
    time: '15:00',
    duration: 60,
    presenter: 'Andi Wijaya',
    product: 'HMS Enterprise',
    status: 'completed' as const,
    meetingLink: 'https://meet.zoom.us/demo-fb001',
    notes: 'Demo berjalan lancar, siap untuk proposal. Client sangat tertarik dengan fitur PACS dan LIS.',
    attendees: [
      {
        id: 'A008',
        name: 'Dr. Ir. Johanes Surya',
        email: 'johanes@premierbintaro.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A009',
        name: 'Rina Finance Director',
        email: 'rina@premierbintaro.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A010',
        name: 'Andi Wijaya',
        email: 'andi.wijaya@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R007',
        name: 'Conference Room Executive',
        type: 'room' as const
      },
      {
        id: 'R008',
        name: 'LED Display 65"',
        type: 'equipment' as const
      },
      {
        id: 'R009',
        name: 'Zoom Enterprise',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 20,
      after: 15
    },
    rating: 5,
    reviewerName: 'Dr. Ir. Johanes Surya',
    reviewDate: new Date(2026, 1, 5, 16, 30),
    reviewText: 'Excellent demo presentation! The presenter was very knowledgeable and addressed all our concerns. The Enterprise Plan features, especially PACS and LIS integration, align perfectly with our hospital needs. The technical team was impressed with the system architecture. Highly recommend for enterprise-level hospital implementations.'
  },
  {
    id: 'D005',
    title: 'Demo Telemedicine Module - Klinik Kimia Farma',
    leadName: 'dr. Rina Wijayanti',
    company: 'Klinik Kimia Farma Jakarta Pusat',
    date: new Date(2026, 1, 18, 13, 0), // Feb 18, 2026, 1:00 PM
    time: '13:00',
    duration: 45,
    presenter: 'Rudi Hartono',
    product: 'Telemedicine Module',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-tele001',
    notes: 'Demo fokus pada fitur telemedicine dan mobile app untuk pasien',
    attendees: [
      {
        id: 'A011',
        name: 'dr. Rina Wijayanti',
        email: 'rina@kimiafarma.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A012',
        name: 'IT Manager',
        email: 'it@kimiafarma.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A013',
        name: 'Rudi Hartono',
        email: 'rudi.hartono@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R010',
        name: 'Meeting Room C',
        type: 'room' as const
      },
      {
        id: 'R011',
        name: 'Tablet Demo Device',
        type: 'equipment' as const
      },
      {
        id: 'R012',
        name: 'Google Meet',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 15,
      after: 10
    }
  },
  {
    id: 'D006',
    title: 'Demo HMS Professional - RS Hermina Depok',
    leadName: 'Dr. Hadi Sutrisno',
    company: 'RS Hermina Depok',
    date: new Date(2026, 1, 3, 10, 0), // Feb 3, 2026 (Past - Completed)
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'HMS Professional',
    status: 'completed' as const,
    meetingLink: 'https://meet.zoom.us/demo-her001',
    notes: 'Demo sukses, client tertarik dengan Nurse Station Module. Follow-up untuk proposal.',
    attendees: [
      {
        id: 'A014',
        name: 'Dr. Hadi Sutrisno',
        email: 'hadi@hermina.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A015',
        name: 'Head of IT',
        email: 'it.head@hermina.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A016',
        name: 'Budi Santoso',
        email: 'budi.santoso@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R013',
        name: 'Conference Room 1',
        type: 'room' as const
      },
      {
        id: 'R014',
        name: 'Projector HD',
        type: 'equipment' as const
      },
      {
        id: 'R015',
        name: 'Zoom Business',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 15,
      after: 15
    },
    rating: 4,
    reviewerName: 'Dr. Hadi Sutrisno',
    reviewDate: new Date(2026, 1, 3, 11, 30),
    reviewText: 'Good demo session. The Nurse Station Module features are impressive and will improve our nursing workflow significantly. The presenter explained the integration process clearly. We need more information about data migration from our current system, but overall we are very interested.'
  },
  {
    id: 'D007',
    title: 'Demo Billing System - Praktek Dokter Keluarga',
    leadName: 'dr. Lisa Permata Sari',
    company: 'Praktek Bersama Dokter Keluarga',
    date: new Date(2026, 1, 20, 16, 0), // Feb 20, 2026, 4:00 PM
    time: '16:00',
    duration: 30,
    presenter: 'Dewi Lestari',
    product: 'Billing System + EMR Standalone',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-bil001',
    notes: 'Demo untuk praktek dokter, fokus pada billing dan BPJS integration',
    attendees: [
      {
        id: 'A017',
        name: 'dr. Lisa Permata Sari',
        email: 'lisa@dokterpraktek.com',
        type: 'external' as const,
        rsvp: 'pending' as const
      },
      {
        id: 'A018',
        name: 'Dewi Lestari',
        email: 'dewi.lestari@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R016',
        name: 'Google Meet',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 5,
      after: 10
    }
  },
  {
    id: 'D008',
    title: 'Demo Laboratory LIS - RS Mitra Keluarga',
    leadName: 'Dr. Bambang Sutrisno',
    company: 'RS Mitra Keluarga Surabaya',
    date: new Date(2026, 1, 8, 9, 0), // Feb 8, 2026, 9:00 AM
    time: '09:00',
    duration: 90,
    presenter: 'Andi Wijaya',
    product: 'Laboratory LIS',
    status: 'scheduled' as const,
    meetingLink: 'https://meet.zoom.us/demo-lis001',
    notes: 'Demo upgrade module LIS dengan auto-interface ke alat lab',
    attendees: [
      {
        id: 'A019',
        name: 'Dr. Bambang Sutrisno, Sp.PD',
        email: 'bambang@rsmitrakeluarga-sby.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A020',
        name: 'Lab Manager',
        email: 'lab@rsmitrakeluarga-sby.co.id',
        type: 'external' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A021',
        name: 'Andi Wijaya',
        email: 'andi.wijaya@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      },
      {
        id: 'A022',
        name: 'Technical Support',
        email: 'tech@intramedika.com',
        type: 'internal' as const,
        rsvp: 'accepted' as const
      }
    ],
    resources: [
      {
        id: 'R017',
        name: 'Innovation Lab',
        type: 'room' as const
      },
      {
        id: 'R018',
        name: 'Lab Equipment Demo',
        type: 'equipment' as const
      },
      {
        id: 'R019',
        name: 'LIS Sandbox Environment',
        type: 'software' as const
      }
    ],
    bufferTime: {
      before: 30,
      after: 20
    }
  }
];

/**
 * Populate CRM data to localStorage
 */
export function populateCRMToLocalStorage(): {
  success: boolean;
  message: string;
  data: {
    employees: number;
    clients: number;
    partners: number;
    products: number;
    contracts: number;
  };
} {
  try {
    // Save to localStorage
    localStorage.setItem(LS_KEYS.EMPLOYEES, JSON.stringify(salesRepresentativeDummyData));
    localStorage.setItem(LS_KEYS.CLIENTS, JSON.stringify(clientsDummyData));
    localStorage.setItem(LS_KEYS.PARTNERS, JSON.stringify(partnersDummyData));
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(productsDummyData));
    localStorage.setItem(LS_KEYS.CONTRACTS, JSON.stringify(contractsDummyData));
    localStorage.setItem(LS_KEYS.DEMOS, JSON.stringify(demosDummyData));

    console.log('✅ CRM Dummy Data populated successfully to localStorage');
    console.log(`📊 Employees: ${salesRepresentativeDummyData.length}`);

    return {
      success: true,
      message: 'CRM data (including Contracts) populated successfully!',
      data: {
        employees: salesRepresentativeDummyData.length,
        clients: clientsDummyData.length,
        partners: partnersDummyData.length,
        products: productsDummyData.length,
        contracts: contractsDummyData.length,
      },
    };
  } catch (error) {
    console.error('❌ Error populating CRM data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to populate CRM data',
      data: {
        employees: 0,
        clients: 0,
        partners: 0,
        products: 0,
        contracts: 0,
      },
    };
  }
}

/**
 * Clear CRM data from localStorage
 */
export function clearCRMFromLocalStorage(): {
  success: boolean;
  message: string;
} {
  try {
    localStorage.removeItem(LS_KEYS.EMPLOYEES);
    localStorage.removeItem(LS_KEYS.CLIENTS);
    localStorage.removeItem(LS_KEYS.PARTNERS);
    localStorage.removeItem(LS_KEYS.PRODUCTS);
    localStorage.removeItem(LS_KEYS.CONTRACTS);
    localStorage.removeItem(LS_KEYS.DEMOS);

    console.log('🗑️ CRM data (including Contracts) cleared from localStorage');

    return {
      success: true,
      message: 'CRM data cleared successfully!',
    };
  } catch (error) {
    console.error('❌ Error clearing CRM data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear CRM data',
    };
  }
}

/**
 * Get CRM data statistics from localStorage
 */
export function getCRMStatistics(): {
  employees: number;
  clients: number;
  partners: number;
  products: number;
  contracts: number;
} {
  try {
    const employees = JSON.parse(localStorage.getItem(LS_KEYS.EMPLOYEES) || '[]');
    const clients = JSON.parse(localStorage.getItem(LS_KEYS.CLIENTS) || '[]');
    const partners = JSON.parse(localStorage.getItem(LS_KEYS.PARTNERS) || '[]');
    const products = JSON.parse(localStorage.getItem(LS_KEYS.PRODUCTS) || '[]');
    const contracts = JSON.parse(localStorage.getItem(LS_KEYS.CONTRACTS) || '[]');

    return {
      employees: employees.length,
      clients: clients.length,
      partners: partners.length,
      products: products.length,
      contracts: contracts.length,
    };
  } catch (error) {
    console.error('❌ Error getting CRM statistics:', error);
    return {
      employees: 0,
      clients: 0,
      partners: 0,
      products: 0,
      contracts: 0,
    };
  }
}
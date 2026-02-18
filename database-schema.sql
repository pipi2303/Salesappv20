-- =====================================================
-- SALES MONITORING DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- Version: 1.0
-- Created: February 2, 2026
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users (Authentication & Authorization)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'director', 'manager', 'sales_executive', 'viewer')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  phone VARCHAR(20),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: employees (Sales Representative / Karyawan)
-- =====================================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Data Pribadi
  nama_lengkap VARCHAR(255) NOT NULL,
  nik VARCHAR(20) UNIQUE NOT NULL,
  tempat_lahir VARCHAR(100),
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(20) CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  alamat TEXT,
  nomor_wa VARCHAR(20),
  email_pribadi VARCHAR(255),
  
  -- Data Pekerjaan
  divisi VARCHAR(100),
  jabatan VARCHAR(100),
  level_jabatan VARCHAR(50) CHECK (level_jabatan IN ('Junior', 'Mid', 'Senior', 'Manager', 'Director')),
  status_karyawan VARCHAR(50) CHECK (status_karyawan IN ('Tetap', 'Kontrak', 'Probation')),
  tanggal_bergabung DATE,
  tanggal_resign DATE,
  nama_atasan VARCHAR(255),
  
  -- Data Administrasi
  npwp VARCHAR(30),
  nomor_rekening VARCHAR(50),
  nama_bank VARCHAR(100),
  bpjs_ketenagakerjaan VARCHAR(20),
  bpjs_kesehatan VARCHAR(20),
  email_kantor VARCHAR(255),
  
  -- NDA & Access
  nda_signed BOOLEAN DEFAULT false,
  tanggal_nda DATE,
  level_akses VARCHAR(100),
  aset_perusahaan TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: clients (Klien / Faskes)
-- =====================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_customer VARCHAR(50) UNIQUE NOT NULL,
  
  -- Informasi Entitas
  nama_entitas VARCHAR(255) NOT NULL,
  kategori_client VARCHAR(100) CHECK (kategori_client IN ('Rumah Sakit', 'Klinik', 'Puskesmas', 'Praktek Dokter Pribadi', 'Lab Klinik', 'Apotek')),
  alamat_lengkap TEXT,
  koordinat_gps VARCHAR(100),
  nomor_telepon VARCHAR(20),
  email_resmi VARCHAR(255),
  
  -- ID & Akreditasi
  id_satusehat VARCHAR(50),
  id_faskes_bpjs VARCHAR(50),
  status_akreditasi VARCHAR(50),
  npwp_faskes VARCHAR(30),
  
  -- Sistem & Volume
  sistem_lama VARCHAR(255),
  volume_pasien VARCHAR(100),
  jumlah_tempat_tidur VARCHAR(50),
  
  -- PIC (Person In Charge)
  nama_pic VARCHAR(255),
  jabatan_pic VARCHAR(100),
  whatsapp_pic VARCHAR(20),
  
  -- Status Hubungan
  status_hubungan VARCHAR(50) CHECK (status_hubungan IN ('Active Client', 'Hot', 'Warm', 'Cold', 'Lost')),
  
  -- Paket & Kontrak
  paket_aktif TEXT,
  modul_tambahan TEXT,
  status_kontrak VARCHAR(50) CHECK (status_kontrak IN ('Active', 'Proposal Sent', 'Demo Scheduled', 'Negotiation', 'Initial Contact', 'Expired', 'Terminated')),
  tanggal_mulai_langganan DATE,
  tanggal_habis_kontrak DATE,
  total_nilai_kontrak VARCHAR(100),
  file_kontrak_digital VARCHAR(255),
  status_esign VARCHAR(50) CHECK (status_esign IN ('Signed', 'Pending', 'Rejected')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: partners (Mitra / Partner)
-- =====================================================
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_customer VARCHAR(50) UNIQUE NOT NULL,
  
  -- Informasi Partner
  nama_perusahaan VARCHAR(255) NOT NULL,
  tipe_partner VARCHAR(100) CHECK (tipe_partner IN ('Reseller', 'Integrator', 'Consultant', 'Vendor', 'Technology Partner')),
  spesialisasi TEXT,
  alamat_kantor TEXT,
  
  -- Contact Information
  pic_partner VARCHAR(255),
  kontak_darurat VARCHAR(20),
  account_manager_internal VARCHAR(255),
  
  -- Kemitraan
  status_kemitraan VARCHAR(50) CHECK (status_kemitraan IN ('Active', 'Pending', 'Inactive', 'Terminated')),
  tingkat_kemitraan VARCHAR(50) CHECK (tingkat_kemitraan IN ('Platinum', 'Gold', 'Silver', 'Bronze')),
  masa_berlaku_mou_start DATE,
  masa_berlaku_mou_end DATE,
  file_mou_nda VARCHAR(255),
  
  -- Integrasi & API
  api_endpoint TEXT,
  api_key_reference VARCHAR(255),
  status_integrasi VARCHAR(50) CHECK (status_integrasi IN ('Integrated', 'Pending', 'Failed', 'N/A')),
  sla_requirement TEXT,
  
  -- Revenue & Performance
  skema_komisi VARCHAR(255),
  total_leads_generated INTEGER DEFAULT 0,
  total_revenue_contribution VARCHAR(100),
  rekening_pembayaran TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: products (Katalog Produk)
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  features JSONB,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: contracts (Kontrak)
-- =====================================================
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Parties
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  signed_by VARCHAR(255),
  
  -- Product & Value
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product VARCHAR(255) NOT NULL,
  value BIGINT NOT NULL,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  signed_date DATE,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'expired', 'terminated', 'renewed')),
  
  -- Sales Person
  sales_person_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  sales_person VARCHAR(255) NOT NULL,
  
  -- Documents
  contract_file_url TEXT,
  esign_status VARCHAR(50) DEFAULT 'pending' CHECK (esign_status IN ('signed', 'pending', 'rejected')),
  
  -- Additional Info
  notes TEXT,
  terms_and_conditions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: leads (Lead Management)
-- =====================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Contact Information
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Lead Details
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost')),
  source VARCHAR(100) CHECK (source IN ('Website', 'Referral', 'Cold Call', 'Event', 'Social Media', 'Email Campaign', 'Partner')),
  value BIGINT,
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  
  -- Assignment
  assigned_to_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  assigned_to VARCHAR(255),
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: opportunities (Peluang Bisnis)
-- =====================================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Basic Information
  title VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  
  -- Opportunity Details
  stage VARCHAR(100) NOT NULL CHECK (stage IN ('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  value BIGINT NOT NULL,
  expected_close_date DATE,
  
  -- Product & Solution
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  solution_type VARCHAR(100),
  
  -- Assignment
  owner_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  owner_name VARCHAR(255) NOT NULL,
  
  -- AI Insights
  ai_lead_score INTEGER CHECK (ai_lead_score >= 0 AND ai_lead_score <= 100),
  ai_win_probability INTEGER CHECK (ai_win_probability >= 0 AND ai_win_probability <= 100),
  ai_risk_level VARCHAR(50) CHECK (ai_risk_level IN ('Low', 'Medium', 'High')),
  ai_recommendations TEXT,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  description TEXT,
  notes TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: demos (Demo Scheduler)
-- =====================================================
CREATE TABLE demos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Client Information
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  -- Demo Details
  demo_date TIMESTAMP WITH TIME ZONE NOT NULL,
  demo_time VARCHAR(20),
  duration INTEGER DEFAULT 60, -- in minutes
  demo_type VARCHAR(50) CHECK (demo_type IN ('Online', 'Onsite', 'Hybrid')),
  location TEXT,
  meeting_link TEXT,
  
  -- Product & Solution
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  demo_scope TEXT,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  
  -- Assignment
  presenter_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  presenter_name VARCHAR(255),
  technical_support VARCHAR(255),
  
  -- Rating & Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  next_action TEXT,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: communications (CRM Communications)
-- =====================================================
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Related Entity
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('client', 'partner', 'lead', 'opportunity')),
  entity_id UUID NOT NULL,
  
  -- Communication Details
  communication_type VARCHAR(100) NOT NULL CHECK (communication_type IN ('Email', 'Phone Call', 'Meeting', 'WhatsApp', 'Video Call', 'Site Visit', 'Follow-up')),
  subject VARCHAR(255),
  description TEXT,
  outcome VARCHAR(100) CHECK (outcome IN ('Positive', 'Neutral', 'Negative', 'No Answer', 'Follow-up Required')),
  
  -- Participants
  conducted_by_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  conducted_by VARCHAR(255) NOT NULL,
  attendees TEXT,
  
  -- Timing
  communication_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  next_follow_up TIMESTAMP WITH TIME ZONE,
  
  -- Attachments
  attachments JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: sales_team (Struktur Tim Sales)
-- =====================================================
CREATE TABLE sales_team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  
  -- Hierarchy
  level VARCHAR(50) NOT NULL CHECK (level IN ('Director', 'Area Manager', 'Sales Manager', 'Sales Executive')),
  parent_id UUID REFERENCES sales_team(id) ON DELETE SET NULL,
  
  -- Territory
  territory VARCHAR(255),
  region VARCHAR(100),
  
  -- Targets (Monthly)
  monthly_target BIGINT DEFAULT 0,
  quarterly_target BIGINT DEFAULT 0,
  yearly_target BIGINT DEFAULT 0,
  
  -- Performance
  current_achievement BIGINT DEFAULT 0,
  performance_percentage DECIMAL(5,2) DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: kpi_data (KPI & Performance Metrics)
-- =====================================================
CREATE TABLE kpi_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- KPI Identification
  kpi_name VARCHAR(255) NOT NULL,
  kpi_category VARCHAR(100) CHECK (kpi_category IN ('Revenue', 'Sales', 'Customer', 'Operations', 'Team')),
  
  -- Employee/Team
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  team_id UUID REFERENCES sales_team(id) ON DELETE CASCADE,
  
  -- Period
  period_type VARCHAR(50) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  target_value BIGINT,
  actual_value BIGINT,
  achievement_percentage DECIMAL(5,2),
  
  -- Additional Metrics
  pipeline_value BIGINT DEFAULT 0,
  upside_value BIGINT DEFAULT 0,
  strong_upside_value BIGINT DEFAULT 0,
  forecast_value BIGINT DEFAULT 0,
  
  -- AI Insights
  ai_prediction BIGINT,
  ai_confidence_level INTEGER CHECK (ai_confidence_level >= 0 AND ai_confidence_level <= 100),
  ai_insights TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: audit_logs (Audit Trail)
-- =====================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User & Action
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  
  -- Action Details
  action VARCHAR(100) NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT')),
  module VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Details
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('success', 'failed', 'pending')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: notifications (Notifikasi)
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Recipient
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
  type VARCHAR(100) NOT NULL CHECK (type IN ('contract_expiry', 'demo_reminder', 'target_alert', 'opportunity_update', 'system_alert')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Related Entity
  entity_type VARCHAR(50),
  entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Action
  action_url TEXT,
  action_label VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: proposals (Proposal Builder)
-- =====================================================
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Client Information
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  
  -- Proposal Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_value BIGINT NOT NULL,
  validity_period INTEGER DEFAULT 30, -- days
  
  -- Products & Services
  items JSONB NOT NULL, -- Array of products/services with quantities and prices
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  
  -- Assignment
  created_by_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_by VARCHAR(255) NOT NULL,
  
  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Documents
  proposal_file_url TEXT,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: forecasts (Sales Forecast)
-- =====================================================
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Period
  forecast_period VARCHAR(50) NOT NULL CHECK (forecast_period IN ('monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Employee/Team
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  team_id UUID REFERENCES sales_team(id) ON DELETE CASCADE,
  
  -- Forecast Values
  best_case BIGINT NOT NULL,
  most_likely BIGINT NOT NULL,
  worst_case BIGINT NOT NULL,
  committed BIGINT NOT NULL,
  
  -- AI Prediction
  ai_forecast BIGINT,
  ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  
  -- Actual vs Forecast
  actual_value BIGINT,
  variance BIGINT,
  variance_percentage DECIMAL(5,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'completed')),
  
  -- Notes
  notes TEXT,
  assumptions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance Optimization
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Employees
CREATE INDEX idx_employees_nama ON employees(nama_lengkap);
CREATE INDEX idx_employees_nik ON employees(nik);
CREATE INDEX idx_employees_jabatan ON employees(jabatan);
CREATE INDEX idx_employees_user_id ON employees(user_id);

-- Clients
CREATE INDEX idx_clients_nama ON clients(nama_entitas);
CREATE INDEX idx_clients_customer_id ON clients(id_customer);
CREATE INDEX idx_clients_kategori ON clients(kategori_client);
CREATE INDEX idx_clients_status ON clients(status_hubungan);

-- Partners
CREATE INDEX idx_partners_nama ON partners(nama_perusahaan);
CREATE INDEX idx_partners_customer_id ON partners(id_customer);
CREATE INDEX idx_partners_tipe ON partners(tipe_partner);
CREATE INDEX idx_partners_status ON partners(status_kemitraan);

-- Products
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);

-- Contracts
CREATE INDEX idx_contracts_number ON contracts(contract_number);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_sales_person ON contracts(sales_person_id);

-- Leads
CREATE INDEX idx_leads_number ON leads(lead_number);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- Opportunities
CREATE INDEX idx_opportunities_number ON opportunities(opportunity_number);
CREATE INDEX idx_opportunities_client_id ON opportunities(client_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_owner ON opportunities(owner_id);
CREATE INDEX idx_opportunities_close_date ON opportunities(expected_close_date);

-- Demos
CREATE INDEX idx_demos_number ON demos(demo_number);
CREATE INDEX idx_demos_client_id ON demos(client_id);
CREATE INDEX idx_demos_status ON demos(status);
CREATE INDEX idx_demos_date ON demos(demo_date);
CREATE INDEX idx_demos_presenter ON demos(presenter_id);

-- Communications
CREATE INDEX idx_communications_entity ON communications(entity_type, entity_id);
CREATE INDEX idx_communications_date ON communications(communication_date);
CREATE INDEX idx_communications_conducted_by ON communications(conducted_by_id);

-- Sales Team
CREATE INDEX idx_sales_team_employee ON sales_team(employee_id);
CREATE INDEX idx_sales_team_level ON sales_team(level);
CREATE INDEX idx_sales_team_parent ON sales_team(parent_id);

-- KPI Data
CREATE INDEX idx_kpi_employee ON kpi_data(employee_id);
CREATE INDEX idx_kpi_team ON kpi_data(team_id);
CREATE INDEX idx_kpi_period ON kpi_data(period_start, period_end);
CREATE INDEX idx_kpi_category ON kpi_data(kpi_category);

-- Audit Logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_module ON audit_logs(module);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Proposals
CREATE INDEX idx_proposals_number ON proposals(proposal_number);
CREATE INDEX idx_proposals_client_id ON proposals(client_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_by ON proposals(created_by_id);

-- Forecasts
CREATE INDEX idx_forecasts_employee ON forecasts(employee_id);
CREATE INDEX idx_forecasts_team ON forecasts(team_id);
CREATE INDEX idx_forecasts_period ON forecasts(period_start, period_end);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demos_updated_at BEFORE UPDATE ON demos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_team_updated_at BEFORE UPDATE ON sales_team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kpi_data_updated_at BEFORE UPDATE ON kpi_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forecasts_updated_at BEFORE UPDATE ON forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- =====================================================

-- Enable RLS on sensitive tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Example RLS Policies
-- CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- VIEWS for Common Queries
-- =====================================================

-- Active Contracts with Client Info
CREATE OR REPLACE VIEW v_active_contracts AS
SELECT 
  c.id,
  c.contract_number,
  c.client_name,
  cl.kategori_client,
  cl.email_resmi AS client_email,
  c.product,
  c.value,
  c.start_date,
  c.end_date,
  c.sales_person,
  e.email_kantor AS sales_email,
  DATE_PART('day', c.end_date - CURRENT_DATE) AS days_until_expiry
FROM contracts c
LEFT JOIN clients cl ON c.client_id = cl.id
LEFT JOIN employees e ON c.sales_person_id = e.id
WHERE c.status = 'active' AND c.deleted_at IS NULL;

-- Sales Performance Summary
CREATE OR REPLACE VIEW v_sales_performance AS
SELECT 
  e.id,
  e.nama_lengkap,
  e.jabatan,
  st.level,
  st.monthly_target,
  st.current_achievement,
  st.performance_percentage,
  st.total_deals,
  COUNT(DISTINCT c.id) AS active_contracts,
  SUM(c.value) AS total_contract_value
FROM employees e
LEFT JOIN sales_team st ON e.id = st.employee_id
LEFT JOIN contracts c ON e.id = c.sales_person_id AND c.status = 'active'
WHERE st.is_active = true AND e.deleted_at IS NULL
GROUP BY e.id, e.nama_lengkap, e.jabatan, st.level, st.monthly_target, st.current_achievement, st.performance_percentage, st.total_deals;

-- Upcoming Demos
CREATE OR REPLACE VIEW v_upcoming_demos AS
SELECT 
  d.id,
  d.demo_number,
  d.client_name,
  d.contact_person,
  d.contact_phone,
  d.demo_date,
  d.demo_type,
  d.status,
  d.presenter_name,
  e.email_kantor AS presenter_email
FROM demos d
LEFT JOIN employees e ON d.presenter_id = e.id
WHERE d.demo_date >= CURRENT_DATE 
  AND d.status IN ('scheduled', 'confirmed')
  AND d.deleted_at IS NULL
ORDER BY d.demo_date ASC;

-- Contract Expiry Alerts (60 days)
CREATE OR REPLACE VIEW v_contract_expiry_alerts AS
SELECT 
  c.id,
  c.contract_number,
  c.client_name,
  cl.email_resmi AS client_email,
  cl.whatsapp_pic AS client_whatsapp,
  c.value,
  c.end_date,
  DATE_PART('day', c.end_date - CURRENT_DATE) AS days_remaining,
  c.sales_person,
  e.email_kantor AS sales_email,
  e.nomor_wa AS sales_whatsapp
FROM contracts c
LEFT JOIN clients cl ON c.client_id = cl.id
LEFT JOIN employees e ON c.sales_person_id = e.id
WHERE c.status = 'active' 
  AND c.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
  AND c.deleted_at IS NULL
ORDER BY c.end_date ASC;

-- =====================================================
-- INITIAL DATA SETUP (Optional)
-- =====================================================

-- Insert default admin user (password should be hashed in production)
-- INSERT INTO users (email, password_hash, full_name, role, status) 
-- VALUES ('admin@intramedika.com', 'hashed_password_here', 'System Administrator', 'admin', 'active');

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================

COMMENT ON TABLE users IS 'User authentication and authorization';
COMMENT ON TABLE employees IS 'Sales representative and employee master data';
COMMENT ON TABLE clients IS 'Client/Faskes master data with comprehensive information';
COMMENT ON TABLE partners IS 'Business partners including resellers, integrators, and consultants';
COMMENT ON TABLE products IS 'Product catalog with pricing and features';
COMMENT ON TABLE contracts IS 'Contract management with full lifecycle tracking';
COMMENT ON TABLE leads IS 'Lead management and tracking';
COMMENT ON TABLE opportunities IS 'Sales opportunities pipeline with AI insights';
COMMENT ON TABLE demos IS 'Demo scheduling and management';
COMMENT ON TABLE communications IS 'CRM communications and activity tracking';
COMMENT ON TABLE sales_team IS 'Sales team hierarchy and structure';
COMMENT ON TABLE kpi_data IS 'KPI and performance metrics';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all actions';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE proposals IS 'Proposal builder and tracking';
COMMENT ON TABLE forecasts IS 'Sales forecast with AI predictions';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

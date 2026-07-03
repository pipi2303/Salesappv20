import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  X, Handshake, TrendingUp, Award, DollarSign, Building2, 
  ChevronUp, ChevronDown, Clipboard, Users, Shield, Zap, Save 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { publicAnonKey } from '/utils/supabase/info';

// Mock API URL - using localStorage only
const API_URL = 'https://mock-project-id.supabase.co/functions/v1/make-server-67367fc1';

interface PartnerFormProps {
  partner: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function PartnerFormModal({ partner, onClose, onSuccess }: PartnerFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  
  // State for collapsible sections - default: only profil is open
  const [expandedSections, setExpandedSections] = React.useState({
    profil: true,
    kontak: false,
    legal: false,
    teknis: false,
    finansial: false,
  });

  const [formData, setFormData] = React.useState({
    // Profil Identitas
    id_customer: '', // NEW FIELD - ID Customer
    nama_perusahaan: '',
    tipe_partner: '',
    spesialisasi: '',
    // Kontak & Relasi Bisnis
    account_manager_internal: '',
    pic_partner: '',
    kontak_darurat: '',
    alamat_kantor: '',
    // Legal & Kemitraan
    status_kemitraan: '',
    masa_berlaku_mou_start: '',
    masa_berlaku_mou_end: '',
    file_mou_nda: '',
    tingkat_kemitraan: '',
    // Integrasi Teknis
    api_endpoint: '',
    api_key_reference: '',
    sla_requirement: '',
    status_integrasi: '',
    // Komisi & Finansial
    skema_komisi: '',
    total_leads_generated: '',
    total_deals_closed: '',
    rating_partner: '',
    rekening_pembayaran: '',
    total_revenue_contribution: '',
  });

  React.useEffect(() => {
    if (partner) {
      setFormData({
        // Profil Identitas
        id_customer: partner.id_customer || '', // NEW FIELD - ID Customer
        nama_perusahaan: partner.nama_perusahaan || '',
        tipe_partner: partner.tipe_partner || '',
        spesialisasi: partner.spesialisasi || '',
        // Kontak & Relasi Bisnis
        account_manager_internal: partner.account_manager_internal || '',
        pic_partner: partner.pic_partner || '',
        kontak_darurat: partner.kontak_darurat || '',
        alamat_kantor: partner.alamat_kantor || '',
        // Legal & Kemitraan
        status_kemitraan: partner.status_kemitraan || '',
        masa_berlaku_mou_start: partner.masa_berlaku_mou_start || '',
        masa_berlaku_mou_end: partner.masa_berlaku_mou_end || '',
        file_mou_nda: partner.file_mou_nda || '',
        tingkat_kemitraan: partner.tingkat_kemitraan || '',
        // Integrasi Teknis
        api_endpoint: partner.api_endpoint || '',
        api_key_reference: partner.api_key_reference || '',
        sla_requirement: partner.sla_requirement || '',
        status_integrasi: partner.status_integrasi || '',
        // Komisi & Finansial
        skema_komisi: partner.skema_komisi || '',
        total_leads_generated: partner.total_leads_generated || '',
        total_deals_closed: partner.total_deals_closed || '',
        rating_partner: partner.rating_partner || '',
        rekening_pembayaran: partner.rekening_pembayaran || '',
        total_revenue_contribution: partner.total_revenue_contribution || '',
      });
    }
  }, [partner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_perusahaan || !formData.tipe_partner) {
      toast.error('Harap isi semua field yang wajib!');
      return;
    }

    try {
      setLoading(true);
      
      const url = partner 
        ? `${API_URL}/partners/${partner.id}`
        : `${API_URL}/partners`;
      
      const method = partner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
          'apikey': publicAnonKey,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(partner ? 'Data partner berhasil diupdate!' : 'Data partner berhasil ditambahkan!');
        onSuccess();
      } else {
        toast.error(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-[950px] w-[90vw] max-h-[90vh] overflow-hidden p-0 gap-0 bg-white [&>button]:hidden flex flex-col">
        {/* HEADER */}
        <DialogHeader className="relative bg-[#013E37] text-white px-6 py-5 space-y-0 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="space-y-3">
            {/* Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold leading-tight text-white">
                  {formData.nama_perusahaan || (partner ? 'Edit Data Partner' : 'Tambah Partner Baru')}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1 leading-tight">
                  {formData.tipe_partner || 'Strategic Business Partner'}
                </DialogDescription>
              </div>
            </div>

            {/* Status Badges */}
            {partner && (
              <div className="flex gap-2 flex-wrap">
                {formData.tingkat_kemitraan && (
                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                    {formData.tingkat_kemitraan}
                  </Badge>
                )}
                {formData.status_kemitraan && (
                  <Badge className={
                    formData.status_kemitraan === 'Active' 
                      ? 'bg-emerald-500 text-emerald-900 hover:bg-emerald-600' 
                      : 'bg-amber-500 text-amber-900 hover:bg-amber-600'
                  }>
                    {formData.status_kemitraan}
                  </Badge>
                )}
                {formData.status_integrasi && (
                  <Badge className="bg-blue-500 text-blue-900 hover:bg-blue-600">
                    {formData.status_integrasi}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {/* QUICK INFO CARDS */}
        {partner && (
          <div className="bg-gradient-to-br from-[#EEF7F5] to-[#EEF7F5] px-6 py-4 grid grid-cols-3 gap-4 border-b border-[#013E37]/10">
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#EEF7F5] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#013E37]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Leads Generated</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.total_leads_generated || '0'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rating Partner</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.rating_partner || '-'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue Contribution</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.total_revenue_contribution || '-'}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* CONTENT - Scrollable area */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 text-gray-900">
            
            {/* SECTION 1: Profil Identitas Partner */}
            <div className="bg-gradient-to-br from-[#EEF7F5] to-[#EEF7F5] rounded-xl border border-[#013E37]/10 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('profil')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-[#EEF7F5]/50 hover:bg-[#EEF7F5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#013E37] flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-[#012D29] leading-none">Profil Identitas Partner</h3>
                    <p className="text-[10px] text-[#025C52] mt-1 uppercase tracking-wider font-semibold opacity-70">DATA LEGAL & IDENTITAS PERUSAHAAN</p>
                  </div>
                </div>
                {expandedSections.profil ? (
                  <ChevronUp className="w-5 h-5 text-[#013E37]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#013E37]" />
                )}
              </button>
              
              {expandedSections.profil && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-[#013E37]" />
                      ID Customer
                    </Label>
                    <Input
                      name="id_customer"
                      value={formData.id_customer}
                      onChange={handleChange}
                      placeholder="CUST-2025-001"
                      className="bg-white border-gray-300 focus:border-[#013E37] focus:ring-[#013E37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Tipe Partner <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.tipe_partner}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tipe_partner: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#013E37] focus:ring-[#013E37]">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology Partner (OCI/SatuSehat)">Technology Partner (OCI/SatuSehat)</SelectItem>
                        <SelectItem value="Reseller/Distributor">Reseller/Distributor</SelectItem>
                        <SelectItem value="Implementation Consultant">Implementation Consultant</SelectItem>
                        <SelectItem value="Training & Support Provider">Training & Support Provider</SelectItem>
                        <SelectItem value="Referral Partner">Referral Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Nama Perusahaan Partner <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="nama_perusahaan"
                      value={formData.nama_perusahaan}
                      onChange={handleChange}
                      required
                      placeholder="PT Partner Technology Indonesia"
                      className="bg-white border-gray-300 focus:border-[#013E37] focus:ring-[#013E37]"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">Spesialisasi</Label>
                    <Input
                      name="spesialisasi"
                      value={formData.spesialisasi}
                      onChange={handleChange}
                      placeholder="Cloud Infrastructure, SaaS Healthcare"
                      className="bg-white border-gray-300 focus:border-[#013E37] focus:ring-[#013E37]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Kontak & Relasi Bisnis */}
            <div className="bg-gradient-to-br bg-[#EEF7F5] rounded-xl border border-blue-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('kontak')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-100/50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-blue-900 leading-none">Kontak & Relasi Bisnis</h3>
                    <p className="text-[10px] text-blue-700 mt-1 uppercase tracking-wider font-semibold opacity-70">DATA PIC & ALAMAT KORESPONDENSI</p>
                  </div>
                </div>
                {expandedSections.kontak ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </button>
              
              {expandedSections.kontak && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Account Manager Internal</Label>
                    <Input
                      name="account_manager_internal"
                      value={formData.account_manager_internal}
                      onChange={handleChange}
                      placeholder="Nama account manager dari tim kita"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">PIC Partner</Label>
                    <Input
                      name="pic_partner"
                      value={formData.pic_partner}
                      onChange={handleChange}
                      placeholder="Nama PIC dari partner"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Kontak Darurat</Label>
                    <Input
                      name="kontak_darurat"
                      value={formData.kontak_darurat}
                      onChange={handleChange}
                      placeholder="+62 812-3456-7890"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Alamat Kantor</Label>
                    <Input
                      name="alamat_kantor"
                      value={formData.alamat_kantor}
                      onChange={handleChange}
                      placeholder="Jl. Sudirman No. 123, Jakarta"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Legal & Kemitraan */}
            <div className="bg-gradient-to-br from-[#EEF7F5] to-pink-50 rounded-xl border border-[#DFF0EC] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('legal')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-[#DFF0EC]/50 hover:bg-[#DFF0EC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#013E37] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-[#012D29] leading-none">Legal & Kemitraan</h3>
                    <p className="text-[10px] text-[#013E37] mt-1 uppercase tracking-wider font-semibold opacity-70">STATUS MOU & LEVEL PARTNERSHIP</p>
                  </div>
                </div>
                {expandedSections.legal ? (
                  <ChevronUp className="w-5 h-5 text-[#013E37]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#013E37]" />
                )}
              </button>
              
              {expandedSections.legal && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status Kemitraan</Label>
                    <Select
                      value={formData.status_kemitraan}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_kemitraan: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#EEF7F5]0 focus:ring-[#EEF7F5]0">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Tingkat Kemitraan</Label>
                    <Select
                      value={formData.tingkat_kemitraan}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tingkat_kemitraan: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#EEF7F5]0 focus:ring-[#EEF7F5]0">
                        <SelectValue placeholder="Pilih tingkat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Bronze">Bronze</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Masa Berlaku MOU (Mulai)</Label>
                    <Input
                      type="date"
                      name="masa_berlaku_mou_start"
                      value={formData.masa_berlaku_mou_start}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-[#EEF7F5]0 focus:ring-[#EEF7F5]0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Masa Berlaku MOU (Berakhir)</Label>
                    <Input
                      type="date"
                      name="masa_berlaku_mou_end"
                      value={formData.masa_berlaku_mou_end}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-[#EEF7F5]0 focus:ring-[#EEF7F5]0"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">File MOU/NDA</Label>
                    <Input
                      name="file_mou_nda"
                      value={formData.file_mou_nda}
                      onChange={handleChange}
                      placeholder="Link/Path ke dokumen MOU/NDA"
                      className="bg-white border-gray-300 focus:border-[#EEF7F5]0 focus:ring-[#EEF7F5]0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Integrasi Teknis */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('teknis')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-orange-100/50 hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-orange-900 leading-none">Integrasi Teknis</h3>
                    <p className="text-[10px] text-orange-700 mt-1 uppercase tracking-wider font-semibold opacity-70">API ENDPOINT & SLA REQUIREMENTS</p>
                  </div>
                </div>
                {expandedSections.teknis ? (
                  <ChevronUp className="w-5 h-5 text-orange-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-600" />
                )}
              </button>
              
              {expandedSections.teknis && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">API Endpoint</Label>
                    <Input
                      name="api_endpoint"
                      value={formData.api_endpoint}
                      onChange={handleChange}
                      placeholder="https://api.partner.com/v1"
                      className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">API Key Reference</Label>
                    <Input
                      name="api_key_reference"
                      value={formData.api_key_reference}
                      onChange={handleChange}
                      placeholder="Reference/ID untuk API key"
                      className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">SLA Requirement</Label>
                    <Input
                      name="sla_requirement"
                      value={formData.sla_requirement}
                      onChange={handleChange}
                      placeholder="99.9% uptime, <2s response time"
                      className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status Integrasi</Label>
                    <Select
                      value={formData.status_integrasi}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_integrasi: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully Integrated">Fully Integrated</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Not Integrated">Not Integrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: Komisi & Finansial */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('finansial')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-green-100/50 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-green-900 leading-none">Komisi & Finansial</h3>
                    <p className="text-[10px] text-green-700 mt-1 uppercase tracking-wider font-semibold opacity-70">REVENUE SHARE & PAYMENT DATA</p>
                  </div>
                </div>
                {expandedSections.finansial ? (
                  <ChevronUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-green-600" />
                )}
              </button>
              
              {expandedSections.finansial && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Skema Komisi</Label>
                    <Input
                      name="skema_komisi"
                      value={formData.skema_komisi}
                      onChange={handleChange}
                      placeholder="Contoh: 10% per Deal"
                      className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Rating Partner</Label>
                    <Select
                      value={formData.rating_partner}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, rating_partner: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Pilih rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A (Excellent)">A (Excellent)</SelectItem>
                        <SelectItem value="B (Good)">B (Good)</SelectItem>
                        <SelectItem value="C (Fair)">C (Fair)</SelectItem>
                        <SelectItem value="D (Poor)">D (Poor)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Total Leads Generated</Label>
                    <Input
                      type="number"
                      name="total_leads_generated"
                      value={formData.total_leads_generated}
                      onChange={handleChange}
                      placeholder="0"
                      className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Total Deals Closed</Label>
                    <Input
                      type="number"
                      name="total_deals_closed"
                      value={formData.total_deals_closed}
                      onChange={handleChange}
                      placeholder="0"
                      className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Total Revenue Contribution</Label>
                    <Input
                      name="total_revenue_contribution"
                      value={formData.total_revenue_contribution}
                      onChange={handleChange}
                      placeholder="Rp 500.000.000"
                      className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Rekening Pembayaran</Label>
                    <Input
                      name="rekening_pembayaran"
                      value={formData.rekening_pembayaran}
                      onChange={handleChange}
                      placeholder="Bank BCA - 1234567890"
                      className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="text-xs text-gray-500 italic">
              * Pastikan data partner telah divalidasi oleh tim legal.
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#013E37] hover:bg-[#01443e] text-white px-8 font-bold shadow-lg shadow-emerald-900/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Simpan Data Partner
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

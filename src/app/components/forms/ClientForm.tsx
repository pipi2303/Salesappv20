import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  X, Hospital, FileText, Shield, User, Building2, 
  ChevronUp, ChevronDown, Clipboard, CreditCard, Info, Save 
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
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from '@/app/components/ui/tooltip';
import { Button } from '@/app/components/ui/button';
import { publicAnonKey } from '/utils/supabase/info';

// Mock API URL - using localStorage only
const API_URL = 'https://mock-project-id.supabase.co/functions/v1/make-server-67367fc1';

interface ClientFormProps {
  client: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientFormModal({ client, onClose, onSuccess }: ClientFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  
  // State for collapsible sections - default: only dasar is open
  const [expandedSections, setExpandedSections] = React.useState({
    dasar: true,
    teknis: false,
    pic: false,
    subscription: false,
    legal: false,
  });

  const [formData, setFormData] = React.useState({
    // Informasi Dasar
    id_customer: '', // NEW FIELD - ID Customer
    nama_entitas: '',
    kategori_client: '',
    owner: '',
    alamat_lengkap: '',
    koordinat_gps: '',
    nomor_telepon: '',
    email_resmi: '',
    website: '', // NEW FIELD
    // Profiling Teknis & Regulasi
    id_satusehat: '',
    id_faskes_bpjs: '',
    status_akreditasi: '',
    sistem_lama: '',
    volume_pasien: '',
    jumlah_tempat_tidur: '',
    // Decision Maker
    nama_pic: '',
    jabatan_pic: '',
    whatsapp_pic: '',
    status_hubungan: '',
    // Subscription Data
    paket_aktif: '',
    modul_tambahan: '',
    status_kontrak: '',
    tanggal_mulai_langganan: '',
    tanggal_habis_kontrak: '',
    total_nilai_kontrak: '',
    // Legal
    file_kontrak_digital: '',
    status_esign: '',
    npwp_faskes: '',
  });

  React.useEffect(() => {
    if (client) {
      setFormData({
        // Informasi Dasar
        id_customer: client.id_customer || '', // NEW FIELD - ID Customer
        nama_entitas: client.nama_entitas || '',
        kategori_client: client.kategori_client || '',
        owner: client.owner || '',
        alamat_lengkap: client.alamat_lengkap || '',
        koordinat_gps: client.koordinat_gps || '',
        nomor_telepon: client.nomor_telepon || '',
        email_resmi: client.email_resmi || '',
        website: client.website || '', // NEW FIELD
        // Profiling Teknis & Regulasi
        id_satusehat: client.id_satusehat || '',
        id_faskes_bpjs: client.id_faskes_bpjs || '',
        status_akreditasi: client.status_akreditasi || '',
        sistem_lama: client.sistem_lama || '',
        volume_pasien: client.volume_pasien || '',
        jumlah_tempat_tidur: client.jumlah_tempat_tidur || '',
        // Decision Maker
        nama_pic: client.nama_pic || '',
        jabatan_pic: client.jabatan_pic || '',
        whatsapp_pic: client.whatsapp_pic || '',
        status_hubungan: client.status_hubungan || '',
        // Subscription Data
        paket_aktif: client.paket_aktif || '',
        modul_tambahan: client.modul_tambahan || '',
        status_kontrak: client.status_kontrak || '',
        tanggal_mulai_langganan: client.tanggal_mulai_langganan || '',
        tanggal_habis_kontrak: client.tanggal_habis_kontrak || '',
        total_nilai_kontrak: client.total_nilai_kontrak || '',
        // Legal
        file_kontrak_digital: client.file_kontrak_digital || '',
        status_esign: client.status_esign || '',
        npwp_faskes: client.npwp_faskes || '',
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_entitas || !formData.kategori_client) {
      toast.error('Harap isi semua field yang wajib!');
      return;
    }

    try {
      setLoading(true);
      
      const url = client 
        ? `${API_URL}/clients/${client.id}`
        : `${API_URL}/clients`;
      
      const method = client ? 'PUT' : 'POST';
      
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
        toast.success(client ? 'Data client berhasil diupdate!' : 'Data client berhasil ditambahkan!');
        onSuccess();
      } else {
        toast.error(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving client:', error);
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
        <DialogHeader className="relative bg-[#01544e] text-white px-6 py-5 space-y-0 flex-shrink-0">
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
                <Hospital className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold leading-tight">
                  {formData.nama_entitas || (client ? 'Edit Data Client' : 'Tambah Client Baru')}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1 leading-tight">
                  {formData.kategori_client || 'Rumah Sakit'}
                </DialogDescription>
              </div>
            </div>

            {/* Status Badges */}
            {client && (
              <div className="flex gap-2 flex-wrap">
                {formData.paket_aktif && (
                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                    {formData.paket_aktif}
                  </Badge>
                )}
                {formData.status_kontrak && (
                  <Badge className="bg-amber-500 text-amber-900 hover:bg-amber-600">
                    {formData.status_kontrak}
                  </Badge>
                )}
                {formData.status_hubungan && (
                  <Badge className={
                    formData.status_hubungan === 'Active Client' 
                      ? 'bg-emerald-500 text-emerald-900 hover:bg-emerald-600' 
                      : 'bg-blue-500 text-blue-900 hover:bg-blue-600'
                  }>
                    {formData.status_hubungan}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {/* QUICK INFO CARDS */}
        {client && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 grid grid-cols-3 gap-4 border-b border-blue-100">
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ID SatuSehat</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.id_satusehat || '-'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Akreditasi</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.status_akreditasi || '-'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Volume Pasien</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.volume_pasien || '-'}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* CONTENT - Scrollable area */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 text-gray-900">
            
            {/* SECTION 1: Informasi Dasar */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('dasar')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-emerald-100/50 hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-900">Informasi Dasar</h3>
                </div>
                {expandedSections.dasar ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                )}
              </button>
              
              {expandedSections.dasar && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-emerald-600" />
                      ID Client
                    </Label>
                    <Input
                      name="id_customer"
                      value={formData.id_customer}
                      onChange={handleChange}
                      placeholder="CUST-2025-001"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Nama Entitas <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="nama_entitas"
                      value={formData.nama_entitas}
                      onChange={handleChange}
                      required
                      placeholder="RS Harapan Sehat"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Kategori Client <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.kategori_client}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, kategori_client: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rumah Sakit">Rumah Sakit</SelectItem>
                        <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                        <SelectItem value="Klinik">Klinik</SelectItem>
                        <SelectItem value="Praktek Dokter Pribadi">Praktek Dokter Pribadi</SelectItem>
                        <SelectItem value="Faskes Lainnya">Faskes Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Pemilik</Label>
                    <Input
                      name="owner"
                      value={formData.owner}
                      onChange={handleChange}
                      placeholder="Nama pemilik/yayasan"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Email Resmi</Label>
                    <Input
                      type="email"
                      name="email_resmi"
                      value={formData.email_resmi}
                      onChange={handleChange}
                      placeholder="info@rsharapansehat.com"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">Alamat Lengkap</Label>
                    <textarea
                      name="alamat_lengkap"
                      value={formData.alamat_lengkap}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                      placeholder="Jl. Sudirman Kav. 52, Jakarta Pusat 10210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Koordinat GPS</Label>
                    <Input
                      name="koordinat_gps"
                      value={formData.koordinat_gps}
                      onChange={handleChange}
                      placeholder="-6.2088, 106.8456"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Nomor Telepon</Label>
                    <Input
                      type="tel"
                      name="nomor_telepon"
                      value={formData.nomor_telepon}
                      onChange={handleChange}
                      placeholder="021-5551234"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Website</Label>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.rsharapansehat.com"
                      className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Profiling Teknis & Regulasi */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('teknis')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-100/50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-blue-900">Profiling Teknis & Regulasi</h3>
                </div>
                {expandedSections.teknis ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </button>
              
              {expandedSections.teknis && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">ID SatuSehat</Label>
                    <Input
                      name="id_satusehat"
                      value={formData.id_satusehat}
                      onChange={handleChange}
                      placeholder="RSU-DKI-001-2023"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">ID Faskes BPJS</Label>
                    <Input
                      name="id_faskes_bpjs"
                      value={formData.id_faskes_bpjs}
                      onChange={handleChange}
                      placeholder="0112R001"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status Akreditasi</Label>
                    <Select
                      value={formData.status_akreditasi}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_akreditasi: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Pilih akreditasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paripurna">Paripurna</SelectItem>
                        <SelectItem value="Utama">Utama</SelectItem>
                        <SelectItem value="Madya">Madya</SelectItem>
                        <SelectItem value="Dasar">Dasar</SelectItem>
                        <SelectItem value="Belum Terakreditasi">Belum Terakreditasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Sistem Lama</Label>
                    <Input
                      name="sistem_lama"
                      value={formData.sistem_lama}
                      onChange={handleChange}
                      placeholder="SIMRS Legacy/Manual"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Volume Pasien</Label>
                    <Input
                      name="volume_pasien"
                      value={formData.volume_pasien}
                      onChange={handleChange}
                      placeholder="1500 pasien/bulan"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Jumlah Tempat Tidur</Label>
                    <Input
                      type="number"
                      name="jumlah_tempat_tidur"
                      value={formData.jumlah_tempat_tidur}
                      onChange={handleChange}
                      placeholder="200"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Data Pengambil Keputusan (Decision Maker) */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('pic')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-purple-100/50 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-purple-900">Data Pengambil Keputusan</h3>
                </div>
                {expandedSections.pic ? (
                  <ChevronUp className="w-5 h-5 text-purple-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-600" />
                )}
              </button>
              
              {expandedSections.pic && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Nama PIC</Label>
                    <Input
                      name="nama_pic"
                      value={formData.nama_pic}
                      onChange={handleChange}
                      placeholder="dr. Ahmad Direktur"
                      className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Jabatan PIC</Label>
                    <Input
                      name="jabatan_pic"
                      value={formData.jabatan_pic}
                      onChange={handleChange}
                      placeholder="Direktur Utama"
                      className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">WhatsApp PIC</Label>
                    <Input
                      type="tel"
                      name="whatsapp_pic"
                      value={formData.whatsapp_pic}
                      onChange={handleChange}
                      placeholder="+62 812-3456-7890"
                      className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-sm font-semibold text-gray-700">Status Hubungan</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex items-center justify-center">
                              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="max-w-[280px] text-xs bg-gray-900 text-white px-3 py-2 rounded-md shadow-lg"
                          >
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold">Active Client:</span>
                                <p className="text-gray-300">Has On-Going Contract with INTRAMEDIKA</p>
                              </div>
                              <div>
                                <span className="font-semibold">Hot:</span>
                                <p className="text-gray-300">Strong Opportunity : Upside & Forecast</p>
                              </div>
                              <div>
                                <span className="font-semibold">Warm:</span>
                                <p className="text-gray-300">Active Pipeline</p>
                              </div>
                              <div>
                                <span className="font-semibold">Cold:</span>
                                <p className="text-gray-300">No Recent Opportunity or ever had Project with INTRAMEDIKA</p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      value={formData.status_hubungan}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_hubungan: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active Client">Active Client</SelectItem>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Warm">Warm</SelectItem>
                        <SelectItem value="Cold">Cold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Status Subscription */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('subscription')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-amber-100/50 hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-amber-900">Status Subscription</h3>
                </div>
                {expandedSections.subscription ? (
                  <ChevronUp className="w-5 h-5 text-amber-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-amber-600" />
                )}
              </button>
              
              {expandedSections.subscription && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Paket Aktif</Label>
                    <Select
                      value={formData.paket_aktif}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paket_aktif: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                        <SelectValue placeholder="Pilih paket" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lite">Lite</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status Kontrak</Label>
                    <Select
                      value={formData.status_kontrak}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_kontrak: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Grace Period">Grace Period</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Tanggal Mulai</Label>
                    <Input
                      type="date"
                      name="tanggal_mulai_langganan"
                      value={formData.tanggal_mulai_langganan}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Habis Kontrak</Label>
                    <Input
                      type="date"
                      name="tanggal_habis_kontrak"
                      value={formData.tanggal_habis_kontrak}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Total Nilai Kontrak (Rp)</Label>
                    <Input
                      type="number"
                      name="total_nilai_kontrak"
                      value={formData.total_nilai_kontrak}
                      onChange={handleChange}
                      placeholder="150000000"
                      className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Modul Tambahan</Label>
                    <Input
                      name="modul_tambahan"
                      value={formData.modul_tambahan}
                      onChange={handleChange}
                      placeholder="LIS, RIS, PACS"
                      className="bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: Dokumen & Legal */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('legal')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-100/50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Dokumen & Legal</h3>
                </div>
                {expandedSections.legal ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              {expandedSections.legal && (
                <div className="p-5 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">NPWP Faskes</Label>
                    <Input
                      name="npwp_faskes"
                      value={formData.npwp_faskes}
                      onChange={handleChange}
                      placeholder="01.234.567.8-012.000"
                      className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Status E-Sign</Label>
                    <Select
                      value={formData.status_esign}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status_esign: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sudah Aktif">Sudah Aktif</SelectItem>
                        <SelectItem value="Proses Registrasi">Proses Registrasi</SelectItem>
                        <SelectItem value="Belum Ada">Belum Ada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-semibold text-gray-700">Link File Kontrak (Digital)</Label>
                    <Input
                      name="file_kontrak_digital"
                      value={formData.file_kontrak_digital}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/..."
                      className="bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="text-xs text-gray-500 italic">
              * Pastikan data yang diinput sudah sesuai dengan dokumen resmi faskes.
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
                className="bg-[#01544e] hover:bg-[#01443e] text-white px-8 font-bold shadow-lg shadow-emerald-900/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Simpan Data Client
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

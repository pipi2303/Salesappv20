import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  X, Check, Mail, Phone, MapPin, Calendar, Briefcase, 
  Shield, Building2, FileText, Hospital, Users, Package, Stethoscope,
  Sparkles, Target, Lightbulb, Clipboard, MessageSquare, Send, ChevronDown, ChevronUp
} from 'lucide-react';
import { AIEmailGenerator } from '@/app/components/ai/AIEmailGenerator';
import { AILeadScoring } from '@/app/components/ai/AILeadScoring';
import { AISmartRecommendations } from '@/app/components/ai/AISmartRecommendations';
import { AddCommunicationDialog } from '@/app/components/AddCommunicationDialog';

interface Client {
  id: string;
  id_customer: string; // NEW FIELD - ID Customer
  nama_entitas: string;
  kategori_client: string;
  owner: string;
  alamat_lengkap: string;
  koordinat_gps: string;
  nomor_telepon: string;
  email_resmi: string;
  id_satusehat: string;
  id_faskes_bpjs: string;
  status_akreditasi: string;
  sistem_lama: string;
  volume_pasien: string;
  jumlah_tempat_tidur: string;
  nama_pic: string;
  jabatan_pic: string;
  whatsapp_pic: string;
  status_hubungan: string;
  paket_aktif: string;
  modul_tambahan: string;
  status_kontrak: string;
  tanggal_mulai_langganan: string;
  tanggal_habis_kontrak: string;
  total_nilai_kontrak: string;
  file_kontrak_digital: string;
  status_esign: string;
  npwp_faskes: string;
}

interface Communication {
  id: string;
  type: 'Telepon' | 'Email' | 'Meeting' | 'WhatsApp' | 'Visit';
  title: string;
  description: string;
  timestamp: string;
  categories: string[];
}

interface ClientDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEdit: () => void;
}

export function ClientDetailDialog({ open, onOpenChange, client, onEdit }: ClientDetailDialogProps) {
  const [showEmailGenerator, setShowEmailGenerator] = useState(false);
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    informasiDasar: true,  // Default open
    profilingTeknis: false,
    pengambilKeputusan: false,
    produkLangganan: false,
    dokumentasiLegal: false,
    komunikasi: false,
    aiTools: false
  });
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: '1',
      type: 'Telepon',
      title: 'Follow-up Call - Contract Discussion',
      description: 'Discussed contract renewal terms and additional module requirements. Client requested demo for new telemedicine feature.',
      timestamp: '27 Jan 2026, 14:30',
      categories: ['Telepon', 'Hot Lead']
    },
    {
      id: '2',
      type: 'Email',
      title: 'Email - Monthly Report Sent',
      description: 'Sent monthly performance report and usage analytics. Highlighted 15% increase in system efficiency.',
      timestamp: '25 Jan 2026, 09:15',
      categories: ['Email', 'Report']
    },
    {
      id: '3',
      type: 'Meeting',
      title: 'Meeting - Technical Review',
      description: 'Conducted technical review session with IT team. Discussed integration with existing BPJS system and data migration timeline.',
      timestamp: '20 Jan 2026, 13:00',
      categories: ['Meeting', 'Technical']
    },
    {
      id: '4',
      type: 'WhatsApp',
      title: 'WhatsApp - Quick Support Response',
      description: 'Resolved technical issue regarding user authentication. Provided step-by-step guide for password reset procedure.',
      timestamp: '18 Jan 2026, 16:45',
      categories: ['WhatsApp', 'Support']
    },
    {
      id: '5',
      type: 'Visit',
      title: 'Visit - On-site Training',
      description: 'Conducted on-site training for 25 hospital staff members. Covered new features and best practices for optimal system usage.',
      timestamp: '15 Jan 2026, 10:00',
      categories: ['Visit', 'Training']
    }
  ]);

  const handleAddCommunication = (newCommunication: Communication) => {
    setCommunications(prev => [newCommunication, ...prev]);
    setShowAddCommunication(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Telepon': return <Phone className="h-4 w-4 text-green-600" />;
      case 'Email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'Meeting': return <Users className="h-4 w-4 text-purple-600" />;
      case 'WhatsApp': return <MessageSquare className="h-4 w-4 text-emerald-600" />;
      case 'Visit': return <Calendar className="h-4 w-4 text-amber-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBgColorForType = (type: string) => {
    switch (type) {
      case 'Telepon': return 'bg-green-100';
      case 'Email': return 'bg-blue-100';
      case 'Meeting': return 'bg-purple-100';
      case 'WhatsApp': return 'bg-emerald-100';
      case 'Visit': return 'bg-amber-100';
      default: return 'bg-gray-100';
    }
  };

  const getBadgeColorForCategory = (category: string) => {
    const colorMap: Record<string, string> = {
      'Telepon': 'bg-green-50 text-green-700 border-green-200',
      'Email': 'bg-blue-50 text-blue-700 border-blue-200',
      'Meeting': 'bg-purple-50 text-purple-700 border-purple-200',
      'WhatsApp': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Visit': 'bg-amber-50 text-amber-700 border-amber-200',
      'Hot Lead': 'bg-blue-50 text-blue-700 border-blue-200',
      'Report': 'bg-purple-50 text-purple-700 border-purple-200',
      'Technical': 'bg-orange-50 text-orange-700 border-orange-200',
      'Support': 'bg-red-50 text-red-700 border-red-200',
      'Training': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colorMap[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };
  
  if (!client) return null;

  const leadData = {
    name: client.nama_pic || 'Contact Person',
    organization: client.nama_entitas,
    kategoriClient: client.kategori_client,
    bedCount: parseInt(client.jumlah_tempat_tidur) || undefined,
    budgetStatus: client.status_kontrak,
    lastContactDate: client.tanggal_mulai_langganan,
    interactionCount: 3,
    hasMetDecisionMaker: !!client.nama_pic,
    statusHubungan: client.status_hubungan,
    paketAktif: client.paket_aktif
  };

  return (
    <>
      <AIEmailGenerator 
        open={showEmailGenerator}
        onClose={() => setShowEmailGenerator(false)}
        recipientName={client.nama_pic}
        recipientOrg={client.nama_entitas}
        context={`Client type: ${client.kategori_client}, Package: ${client.paket_aktif}, Status: ${client.status_hubungan}`}
      />

      <AddCommunicationDialog
        open={showAddCommunication}
        onClose={() => setShowAddCommunication(false)}
        onAdd={handleAddCommunication}
      />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[1100px] w-[90vw] max-h-[90vh] overflow-hidden p-0 flex flex-col [&>button]:hidden">
          {/* Hidden Accessibility Headers */}
          <DialogHeader className="sr-only">
            <DialogTitle>{client.nama_entitas} - Detail Client</DialogTitle>
            <DialogDescription>
              Informasi lengkap client termasuk data entitas, profiling teknis, decision maker, subscription, dan legal
            </DialogDescription>
          </DialogHeader>

          {/* Gradient Header */}
          <div className="relative bg-[#01544e] px-5 py-3 text-white flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-xl bg-white shadow-lg flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-to-br from-[#01544e] to-[#023d39] bg-clip-text text-transparent">
                      {client.nama_entitas?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold mb-0.5">{client.nama_entitas}</h2>
                  <p className="text-white/70 text-sm mb-2">{client.kategori_client}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                      {client.paket_aktif || 'No Package'}
                    </Badge>
                    <Badge className={`${client.status_kontrak === 'Active' ? 'bg-green-500/90' : client.status_kontrak === 'Expired' ? 'bg-red-500/90' : 'bg-yellow-500/90'} text-white border-0 text-xs`}>
                      {client.status_kontrak || 'No Status'}
                    </Badge>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                      {client.status_hubungan || 'No Relation'}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-5 overflow-y-auto flex-1">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Clipboard className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">ID Client</p>
                    <p className="font-bold text-gray-900 truncate">{client.id_customer || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Akreditasi</p>
                    <p className="font-bold text-gray-900 truncate">{client.status_akreditasi || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Volume Pasien</p>
                    <p className="font-bold text-gray-900 truncate">{client.volume_pasien || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Dasar */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Informasi Dasar</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clipboard className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ID Client</p>
                      <p className="font-semibold text-gray-900">{client.id_customer || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Hospital className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Kategori Client</p>
                      <p className="font-semibold text-gray-900">{client.kategori_client}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nama Entitas</p>
                      <p className="font-semibold text-gray-900">{client.nama_entitas}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pemilik</p>
                      <p className="font-semibold text-gray-900">{client.owner || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email Resmi</p>
                      <p className="font-semibold text-gray-900 break-all">{client.email_resmi || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Alamat Lengkap</p>
                      <p className="font-semibold text-gray-900">{client.alamat_lengkap || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Koordinat GPS</p>
                      <p className="font-semibold text-gray-900">{client.koordinat_gps || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                      <p className="font-semibold text-gray-900">{client.nomor_telepon || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profiling Teknis & Regulasi */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSections(prev => ({ ...prev, profilingTeknis: !prev.profilingTeknis }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-blue-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Profiling Teknis & Regulasi</h3>
                </div>
                {expandedSections.profilingTeknis ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                )}
              </button>
              
              {expandedSections.profilingTeknis && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Hospital className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ID SatuSehat</p>
                          <p className="font-semibold text-gray-900">{client.id_satusehat || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ID Faskes BPJS</p>
                          <p className="font-semibold text-gray-900">{client.id_faskes_bpjs || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status Akreditasi</p>
                          <Badge variant="outline" className="mt-1">{client.status_akreditasi || '-'}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Sistem Lama</p>
                          <p className="font-semibold text-gray-900">{client.sistem_lama || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Volume Pasien</p>
                          <p className="font-semibold text-gray-900">{client.volume_pasien || '/bulan'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Hospital className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Jumlah Tempat Tidur</p>
                          <p className="font-semibold text-gray-900">{client.jumlah_tempat_tidur || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Pengambil Keputusan */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSections(prev => ({ ...prev, pengambilKeputusan: !prev.pengambilKeputusan }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-purple-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Data Pengambil Keputusan</h3>
                </div>
                {expandedSections.pengambilKeputusan ? (
                  <ChevronUp className="h-5 w-5 text-purple-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-600" />
                )}
              </button>
              
              {expandedSections.pengambilKeputusan && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Nama PIC</p>
                          <p className="font-semibold text-gray-900">{client.nama_pic || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Jabatan PIC</p>
                          <p className="font-semibold text-gray-900">{client.jabatan_pic || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">WhatsApp PIC</p>
                          <p className="font-semibold text-gray-900">{client.whatsapp_pic || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status Hubungan</p>
                          <Badge variant={client.status_hubungan === 'Hot' ? 'default' : 'secondary'} className="mt-1">
                            {client.status_hubungan || '-'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Produk & Langganan */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSections(prev => ({ ...prev, produkLangganan: !prev.produkLangganan }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-orange-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Status Produk & Langganan</h3>
                </div>
                {expandedSections.produkLangganan ? (
                  <ChevronUp className="h-5 w-5 text-orange-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-orange-600" />
                )}
              </button>
              
              {expandedSections.produkLangganan && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Paket Aktif</p>
                          <p className="font-semibold text-gray-900">{client.paket_aktif || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Modul Tambahan</p>
                          <p className="font-semibold text-gray-900">{client.modul_tambahan || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status Kontrak</p>
                          <Badge variant={client.status_kontrak === 'Active' ? 'default' : 'secondary'} className="mt-1">
                            {client.status_kontrak || '-'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Nilai Kontrak (ACV)</p>
                          <p className="font-semibold text-gray-900">{client.total_nilai_kontrak || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tanggal Mulai Langganan</p>
                          <p className="font-semibold text-gray-900">{client.tanggal_mulai_langganan || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tanggal Habis Kontrak</p>
                          <p className="font-semibold text-gray-900">{client.tanggal_habis_kontrak || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dokumentasi Legal & Compliance */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSections(prev => ({ ...prev, dokumentasiLegal: !prev.dokumentasiLegal }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Dokumentasi Legal & Compliance</h3>
                </div>
                {expandedSections.dokumentasiLegal ? (
                  <ChevronUp className="h-5 w-5 text-red-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-red-600" />
                )}
              </button>
              
              {expandedSections.dokumentasiLegal && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">File Kontrak Digital</p>
                          <p className="font-semibold text-gray-900 break-all">{client.file_kontrak_digital || '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status E-Sign</p>
                          <Badge variant={client.status_esign === 'Verified' ? 'default' : 'secondary'} className="mt-1">
                            {client.status_esign || '-'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">NPWP Faskes</p>
                          <p className="font-semibold text-gray-900">{client.npwp_faskes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Komunikasi */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 overflow-hidden">
              <div className="w-full flex items-center justify-between px-6 py-4 bg-white/50">
                <button
                  type="button"
                  onClick={() => setExpandedSections(prev => ({ ...prev, komunikasi: !prev.komunikasi }))}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Komunikasi</h3>
                </button>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => setShowAddCommunication(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Tambah Komunikasi
                  </Button>
                  <button
                    type="button"
                    onClick={() => setExpandedSections(prev => ({ ...prev, komunikasi: !prev.komunikasi }))}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {expandedSections.komunikasi ? (
                      <ChevronUp className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-indigo-600" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedSections.komunikasi && (
                <div className="px-6 pb-6 pt-2">
                  {/* Communication Timeline */}
                  <div className="space-y-3">
                    {/* Sample Communication Items */}
                    {communications.map(comm => (
                      <div key={comm.id} className="bg-white rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-full ${getBgColorForType(comm.type)} flex items-center justify-center flex-shrink-0`}>
                            {getIconForType(comm.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{comm.title}</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{comm.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {comm.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {comm.categories.map(cat => (
                                <Badge key={cat} variant="outline" className={`text-xs ${getBadgeColorForCategory(cat)}`}>
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Tools */}
            <div className="bg-gradient-to-br from-[#e6f2f1] to-[#e6f2f1] rounded-xl border-2 border-[#01544e] overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedSections(prev => ({ ...prev, aiTools: !prev.aiTools }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#d1e7e5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#01544e] flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-gray-900">AI Sales Assistant</h3>
                    <p className="text-sm text-gray-600 mt-0.5">Powered by Machine Learning & Predictive Analytics</p>
                  </div>
                </div>
                {expandedSections.aiTools ? (
                  <ChevronUp className="h-5 w-5 text-[#01544e]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#01544e]" />
                )}
              </button>
              
              {expandedSections.aiTools && (
                <div className="px-6 pb-6 pt-2">
                  <Tabs defaultValue="lead-scoring" className="space-y-4">
                    <TabsList className="grid grid-cols-3 h-11">
                      <TabsTrigger value="lead-scoring" className="text-sm">
                        <Target className="h-4 w-4 mr-2" />
                        Lead Scoring
                      </TabsTrigger>
                      <TabsTrigger value="recommendations" className="text-sm">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Recommendations
                      </TabsTrigger>
                      <TabsTrigger value="actions" className="text-sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Quick Actions
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="lead-scoring" className="space-y-4">
                      <AILeadScoring leadData={leadData} />
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="space-y-4">
                      <AISmartRecommendations leadData={leadData} />
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => setShowEmailGenerator(true)}
                          className="bg-[#01544e] hover:bg-[#023d39] h-auto py-4 flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="h-5 w-5" />
                            <span className="font-bold">AI Email Generator</span>
                          </div>
                          <span className="text-xs text-white/80">Generate personalized emails in seconds</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-[#01544e] text-[#01544e] hover:bg-[#e6f2f1] h-auto py-4 flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="h-5 w-5" />
                            <span className="font-bold">Schedule Follow-up</span>
                          </div>
                          <span className="text-xs text-gray-600">Set reminder for next contact</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-[#01544e] text-[#01544e] hover:bg-[#e6f2f1] h-auto py-4 flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-5 w-5" />
                            <span className="font-bold">Book Demo</span>
                          </div>
                          <span className="text-xs text-gray-600">Schedule product demonstration</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-[#01544e] text-[#01544e] hover:bg-[#e6f2f1] h-auto py-4 flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-5 w-5" />
                            <span className="font-bold">Generate Proposal</span>
                          </div>
                          <span className="text-xs text-gray-600">Create customized proposal</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="border-[#01544e] text-[#01544e] hover:bg-[#e6f2f1] h-auto py-4 flex-col items-start text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Clipboard className="h-5 w-5" />
                            <span className="font-bold">Copy Data</span>
                          </div>
                          <span className="text-xs text-gray-600">Copy client data to clipboard</span>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 px-6 py-3 border-t bg-white flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-20 h-8 text-sm font-medium border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onEdit}
              className="min-w-28 h-8 text-sm font-semibold bg-[#01544e] hover:bg-[#023d39] text-white shadow-md transition-colors"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Edit Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
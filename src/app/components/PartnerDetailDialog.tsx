import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  X, Check, Mail, Phone, MapPin, Calendar, Briefcase, 
  Shield, Building2, FileText, Handshake, Users, Code, DollarSign, Star, Clipboard
} from 'lucide-react';

interface Partner {
  id: string;
  id_customer: string; // NEW FIELD - ID Customer
  nama_perusahaan: string;
  tipe_partner: string;
  spesialisasi: string;
  account_manager_internal: string;
  pic_partner: string;
  kontak_darurat: string;
  alamat_kantor: string;
  status_kemitraan: string;
  masa_berlaku_mou_start: string;
  masa_berlaku_mou_end: string;
  file_mou_nda: string;
  tingkat_kemitraan: string;
  api_endpoint: string;
  api_key_reference: string;
  sla_requirement: string;
  status_integrasi: string;
  skema_komisi: string;
  total_leads_generated: string;
  total_deals_closed: string;
  rating_partner: string;
  rekening_pembayaran: string;
}

interface PartnerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
  onEdit: () => void;
}

export function PartnerDetailDialog({ open, onOpenChange, partner, onEdit }: PartnerDetailDialogProps) {
  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-[90vw] max-h-[90vh] overflow-hidden p-0 flex flex-col [&>button]:hidden">
        {/* Hidden Accessibility Headers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{partner.nama_perusahaan} - Detail Partner</DialogTitle>
          <DialogDescription>
            Informasi lengkap partner termasuk profil identitas, kontak relasi, legal kemitraan, integrasi teknis, dan komisi finansial
          </DialogDescription>
        </DialogHeader>

        {/* Gradient Header */}
        <div className="relative bg-[#01544e] px-5 py-3 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-br from-[#01544e] to-[#023d39] bg-clip-text text-transparent">
                    {partner.nama_perusahaan?.charAt(0) || 'P'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold mb-0.5">{partner.nama_perusahaan}</h2>
                <p className="text-white/70 text-sm mb-2">{partner.tipe_partner}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                    {partner.tingkat_kemitraan || 'No Tier'}
                  </Badge>
                  <Badge className={`${partner.status_kemitraan === 'Active' ? 'bg-green-500/90' : partner.status_kemitraan === 'Terminated' ? 'bg-red-500/90' : 'bg-yellow-500/90'} text-white border-0 text-xs`}>
                    {partner.status_kemitraan || 'No Status'}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                    {partner.status_integrasi || 'No Integration'}
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
                  <p className="text-xs text-gray-500">ID Customer</p>
                  <p className="font-bold text-gray-900 truncate">{partner.id_customer || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Handshake className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Tingkat Kemitraan</p>
                  <p className="font-bold text-gray-900 truncate">{partner.tingkat_kemitraan || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="font-bold text-gray-900 truncate">{partner.rating_partner ? '⭐'.repeat(parseInt(partner.rating_partner)) : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Identitas Partner */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Profil Identitas Partner</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clipboard className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Customer</p>
                    <p className="font-semibold text-gray-900">{partner.id_customer || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Perusahaan</p>
                    <p className="font-semibold text-gray-900">{partner.nama_perusahaan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Handshake className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tipe Partner</p>
                    <p className="font-semibold text-gray-900">{partner.tipe_partner}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 col-span-2">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Spesialisasi</p>
                    <p className="font-semibold text-gray-900">{partner.spesialisasi || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak & Relasi Bisnis */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Kontak & Relasi Bisnis</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Manager Internal</p>
                    <p className="font-semibold text-gray-900">{partner.account_manager_internal || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PIC Partner</p>
                    <p className="font-semibold text-gray-900">{partner.pic_partner || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Kontak Darurat</p>
                    <p className="font-semibold text-gray-900">{partner.kontak_darurat || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Alamat Kantor</p>
                    <p className="font-semibold text-gray-900">{partner.alamat_kantor || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aspek Legal & Kemitraan */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-amber-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Aspek Legal & Kemitraan</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status Kemitraan</p>
                    <Badge variant={partner.status_kemitraan === 'Active' ? 'default' : 'secondary'} className="mt-1">
                      {partner.status_kemitraan || '-'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Handshake className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tingkat Kemitraan</p>
                    <Badge variant="outline" className="mt-1">{partner.tingkat_kemitraan || '-'}</Badge>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal Mulai MOU</p>
                    <p className="font-semibold text-gray-900">{partner.masa_berlaku_mou_start || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal Berakhir MOU</p>
                    <p className="font-semibold text-gray-900">{partner.masa_berlaku_mou_end || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 col-span-2">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">File MOU/NDA</p>
                    <p className="font-semibold text-gray-900 break-all">{partner.file_mou_nda || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrasi Teknis & API */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Integrasi Teknis & API</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">API Endpoint</p>
                    <p className="font-semibold text-gray-900 break-all text-xs">{partner.api_endpoint || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">API Key Reference</p>
                    <p className="font-semibold text-gray-900">{partner.api_key_reference || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">SLA Requirement</p>
                    <p className="font-semibold text-gray-900">{partner.sla_requirement || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status Integrasi</p>
                    <Badge variant={partner.status_integrasi === 'Production' ? 'default' : 'secondary'} className="mt-1">
                      {partner.status_integrasi || '-'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skema Komisi & Finansial */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-pink-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skema Komisi & Finansial</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Skema Komisi</p>
                    <p className="font-semibold text-gray-900">{partner.skema_komisi || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rating Partner</p>
                    <div className="flex items-center gap-1 mt-1">
                      {partner.rating_partner ? (
                        <span className="text-lg">{'⭐'.repeat(parseInt(partner.rating_partner))}</span>
                      ) : (
                        <span className="text-gray-400">No rating</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Leads Generated</p>
                    <p className="font-semibold text-gray-900">{partner.total_leads_generated || '0'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Handshake className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Deals Closed</p>
                    <p className="font-semibold text-gray-900">{partner.total_deals_closed || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
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
            <Handshake className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
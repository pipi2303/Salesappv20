import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import type { Karyawan } from '@/types/karyawan';
import {
  X, Check, Mail, Phone, MapPin, Calendar, Briefcase, 
  Shield, CreditCard, Award, User, Building2, FileText
} from 'lucide-react';

interface EmployeeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Karyawan | null;
  onEdit: () => void;
}

export function EmployeeDetailDialog({ open, onOpenChange, employee, onEdit }: EmployeeDetailDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 flex flex-col [&>button]:hidden">
        {/* Hidden Accessibility Headers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{employee.nama_lengkap} - Detail Karyawan</DialogTitle>
          <DialogDescription>
            Informasi lengkap karyawan termasuk data pribadi, kontak, kepegawaian, keuangan, dan informasi tambahan
          </DialogDescription>
        </DialogHeader>

        {/* Gradient Header */}
        <div className="relative bg-[#013E37] px-5 py-3 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#013E37]">
                    {employee.nama_lengkap?.charAt(0) || 'K'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-xl font-bold mb-0.5">{employee.nama_lengkap}</h2>
                <p className="text-white/80 text-sm mb-2">{employee.jabatan}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                    {employee.divisi}
                  </Badge>
                  <Badge className={`${employee.status_karyawan === 'Tetap' ? 'bg-green-500/90' : 'bg-yellow-500/90'} text-white border-0 text-xs`}>
                    {employee.status_karyawan}
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs">
                    {employee.level_jabatan}
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
            <div className="bg-gradient-to-br from-[#EEF7F5] to-[#EEF7F5] rounded-lg p-4 border border-[#013E37]/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#013E37] flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="font-bold text-gray-900 truncate">{employee.nik}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-[#EEF7F5] rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Bergabung</p>
                  <p className="font-bold text-gray-900 truncate">{employee.tanggal_bergabung}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EEF7F5] to-pink-50 rounded-lg p-4 border border-[#DFF0EC]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#013E37] flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Level Akses</p>
                  <p className="font-bold text-gray-900 truncate">{employee.level_akses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Pribadi */}
          <div className="bg-gradient-to-br from-[#EEF7F5] to-[#EEF7F5] rounded-xl p-6 border border-[#013E37]/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-[#013E37] flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Informasi Pribadi</h3>
                <p className="text-[10px] text-[#025C52] mt-1 uppercase tracking-wider font-semibold opacity-70">IDENTITAS & DATA KONTAK PERSONAL</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tempat, Tanggal Lahir</p>
                    <p className="font-semibold text-gray-900">{employee.tempat_lahir}, {employee.tanggal_lahir}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jenis Kelamin</p>
                    <p className="font-semibold text-gray-900">{employee.jenis_kelamin}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 col-span-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Alamat</p>
                    <p className="font-semibold text-gray-900">{employee.alamat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="bg-gradient-to-br from-emerald-50 to-[#EEF7F5] rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Kontak</h3>
                <p className="text-[10px] text-emerald-700 mt-1 uppercase tracking-wider font-semibold opacity-70">SALES REPRESENTATIVE REACHABILITY</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Kantor</p>
                    <p className="font-semibold text-gray-900 break-all">{employee.email_kantor}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Pribadi</p>
                    <p className="font-semibold text-gray-900 break-all">{employee.email_pribadi}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nomor WhatsApp</p>
                    <p className="font-semibold text-gray-900">{employee.nomor_wa}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Kepegawaian */}
          <div className="bg-gradient-to-br from-blue-50 to-[#EEF7F5] rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Informasi Kepegawaian</h3>
                <p className="text-[10px] text-blue-700 mt-1 uppercase tracking-wider font-semibold opacity-70">STRUKTUR ORGANISASI & JABATAN</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Divisi</p>
                    <p className="font-semibold text-gray-900">{employee.divisi}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jabatan</p>
                    <p className="font-semibold text-gray-900">{employee.jabatan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Level Jabatan</p>
                    <Badge variant="outline" className="mt-1">{employee.level_jabatan}</Badge>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Atasan</p>
                    <p className="font-semibold text-gray-900">{employee.nama_atasan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal Bergabung</p>
                    <p className="font-semibold text-gray-900">{employee.tanggal_bergabung}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Level Akses</p>
                    <p className="font-semibold text-gray-900">{employee.level_akses}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Keuangan & BPJS */}
          <div className="bg-gradient-to-br from-[#EEF7F5] to-pink-50 rounded-xl p-6 border border-[#DFF0EC]">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-[#013E37] flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Informasi Keuangan & BPJS</h3>
                <p className="text-[10px] text-[#013E37] mt-1 uppercase tracking-wider font-semibold opacity-70">PAYROLL & COMPLIANCE DATA</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">NPWP</p>
                    <p className="font-semibold text-gray-900">{employee.npwp}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nomor Rekening</p>
                    <p className="font-semibold text-gray-900">{employee.nomor_rekening}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Bank</p>
                    <p className="font-semibold text-gray-900">{employee.nama_bank}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">BPJS Ketenagakerjaan</p>
                    <p className="font-semibold text-gray-900">{employee.bpjs_ketenagakerjaan}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#013E37] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">BPJS Kesehatan</p>
                    <p className="font-semibold text-gray-900">{employee.bpjs_kesehatan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-none">Informasi Tambahan</h3>
                <p className="text-[10px] text-orange-700 mt-1 uppercase tracking-wider font-semibold opacity-70">NDA & CREDENTIAL ACCESS</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">NDA Signed</p>
                    <Badge variant={employee.nda_signed ? 'default' : 'secondary'} className="mt-1">
                      {employee.nda_signed ? 'Sudah' : 'Belum'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal NDA</p>
                    <p className="font-semibold text-gray-900">{employee.tanggal_nda || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 col-span-2">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Aset Perusahaan</p>
                    <p className="font-semibold text-gray-900">{employee.aset_perusahaan}</p>
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
            className="min-w-28 h-8 text-sm font-semibold bg-[#013E37] hover:bg-[#025C52] text-white shadow-md"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
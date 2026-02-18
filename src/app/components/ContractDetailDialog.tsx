import React from 'react';
import { X, Edit2, FileText, User, Building2, Calendar, DollarSign, CheckCircle, Clock, Download, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Contract as ContractType } from '@/app/data/dummyData';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ContractDetailDialogProps {
  contract: ContractType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function ContractDetailDialog({ contract, isOpen, onClose, onEdit }: ContractDetailDialogProps) {
  if (!contract) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 text-white';
      case 'pending':
        return 'bg-amber-500 text-white';
      case 'draft':
        return 'bg-gray-500 text-white';
      case 'expired':
        return 'bg-red-500 text-white';
      case 'terminated':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getDaysDifference = (start: Date, end: Date) => {
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysRemaining = (end: Date) => {
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining(contract.endDate);
  const totalDays = getDaysDifference(contract.startDate, contract.endDate);
  const progressPercentage = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[900px] w-[90vw] max-h-[90vh] overflow-hidden p-0 gap-0 bg-white [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Detail Kontrak {contract.contractNumber}</DialogTitle>
          <DialogDescription>
            Informasi lengkap kontrak {contract.contractNumber} untuk {contract.clientName} dari {contract.company}
          </DialogDescription>
        </VisuallyHidden>
        
        {/* HEADER - REDUCED 50% */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-3">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">{contract.contractNumber}</h2>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(contract.status)}>
                  <span className="flex items-center gap-1 text-xs">
                    {getStatusIcon(contract.status)}
                    {contract.status.toUpperCase()}
                  </span>
                </Badge>
                {contract.product && (
                  <Badge className="bg-blue-500 text-white text-xs">
                    {contract.product}
                  </Badge>
                )}
              </div>
              <p className="text-purple-100 text-xs">
                {contract.company} • {contract.clientName}
              </p>
            </div>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 grid grid-cols-3 gap-4 border-b border-indigo-100">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nilai Kontrak</p>
                <p className="text-lg font-bold text-gray-900">
                  Rp {(contract.value / 1000000).toFixed(0)} Jt
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Durasi Kontrak</p>
                <p className="text-lg font-bold text-gray-900">{totalDays} hari</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                daysRemaining > 30 ? 'bg-emerald-100' : daysRemaining > 0 ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                <Clock className={`w-6 h-6 ${
                  daysRemaining > 30 ? 'text-emerald-600' : daysRemaining > 0 ? 'text-amber-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sisa Waktu</p>
                <p className="text-lg font-bold text-gray-900">
                  {daysRemaining > 0 ? `${daysRemaining} hari` : 'Expired'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        {contract.status === 'active' && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress Kontrak</span>
              <span className="text-sm font-bold text-purple-600">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>{contract.startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>{contract.endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="px-6 py-6 overflow-y-auto max-h-[400px] space-y-6">
          {/* Client Information */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Informasi Client</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Client</p>
                <p className="font-semibold text-gray-900">{contract.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Perusahaan</p>
                <p className="font-semibold text-gray-900">{contract.company}</p>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900">Detail Kontrak</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nomor Kontrak</p>
                <p className="font-semibold text-gray-900">{contract.contractNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Produk/Layanan</p>
                <p className="font-semibold text-gray-900">{contract.product || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nilai Kontrak</p>
                <p className="font-semibold text-green-600 text-lg">
                  Rp {contract.value.toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900">Timeline & Periode</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal Mulai</p>
                <p className="font-semibold text-gray-900">
                  {contract.startDate.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal Berakhir</p>
                <p className="font-semibold text-gray-900">
                  {contract.endDate.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-orange-900">Informasi Tambahan</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Sales Person</p>
                <p className="font-semibold text-gray-900">{contract.salesPerson || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Ditandatangani Oleh</p>
                <p className="font-semibold text-gray-900">{contract.signedBy || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button 
              onClick={onEdit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Kontrak
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
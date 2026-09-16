import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useConfirm } from '@/app/components/ui/confirm-dialog';
import { Card, CardContent } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { KaryawanFormModal } from '@/app/components/forms/KaryawanForm';
import { EmployeeDetailDialog } from '@/app/components/EmployeeDetailDialog';
import { ExportButton } from '@/app/components/ExportButton';
import { employeesApi } from '@/services/api';
import { populateCRMToLocalStorage } from '@/utils/initializeAllData';

interface Karyawan {
  id: string;
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  nomor_wa: string;
  email_pribadi: string;
  divisi: string;
  jabatan: string;
  level_jabatan: string;
  status_karyawan: string;
  tanggal_bergabung: string;
  nama_atasan: string;
  npwp: string;
  nomor_rekening: string;
  nama_bank: string;
  bpjs_ketenagakerjaan: string;
  bpjs_kesehatan: string;
  email_kantor: string;
  nda_signed: boolean;
  tanggal_nda: string;
  level_akses: string;
  aset_perusahaan: string;
}

export function SalesRepresentative() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Karyawan state
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [showKaryawanForm, setShowKaryawanForm] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk mengakses Sales Representative');
    }
  }, [user]);

  useEffect(() => {
    fetchKaryawan();
  }, []);

  // Filtered data
  const filteredKaryawan = karyawan.filter((k) => {
    const matchSearch = searchQuery === '' || 
      k.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.nik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.email_kantor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchDivisi = filterDivisi === '' || k.divisi === filterDivisi;
    const matchStatus = filterStatus === '' || k.status_karyawan === filterStatus;
    
    return matchSearch && matchDivisi && matchStatus;
  });

  // API CALLS
  const fetchKaryawan = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching karyawan from API...');
      
      const result = await employeesApi.getAll();
      
      if (result.success) {
        setKaryawan(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} karyawan`);
      } else {
        console.error('❌ API Error:', result.error);
        toast.error(result.error || 'Failed to load karyawan');
      }
    } catch (error: any) {
      console.error('❌ Error fetching karyawan:', error);
      toast.error(`Error loading karyawan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKaryawan = async (id: string) => {
    if (!(await confirm('Apakah Anda yakin ingin menghapus data karyawan ini?', { variant: 'destructive', confirmText: 'Hapus' }))) return;
    
    try {
      const result = await employeesApi.delete(id);
      
      if (result.success) {
        toast.success('Karyawan berhasil dihapus');
        fetchKaryawan();
      } else {
        toast.error(result.error || 'Failed to delete karyawan');
      }
    } catch (error) {
      toast.error('Error deleting karyawan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#013E37]">Sales Representative</h1>
          <p className="text-gray-500 mt-1">Kelola data tim sales internal</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const result = populateCRMToLocalStorage();
              if (result.success) {
                toast.success(`✅ ${result.message}\n📊 ${result.data.employees} Sales Rep loaded`);
                fetchKaryawan();
              } else {
                toast.error(`❌ ${result.message}`);
              }
            }}
            variant="outline"
            size="sm"
            className="gap-2 border-[#013E37] text-[#013E37] hover:bg-[#013E37] hover:text-white"
          >
            <Database className="h-4 w-4" />
            Load Dummy Data
          </Button>
          <Button
            onClick={fetchKaryawan}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari nama, NIK, atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EEF7F5]0 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EEF7F5]0 focus:border-transparent"
              >
                <option value="">Semua Divisi</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="IT Developer">IT Developer</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EEF7F5]0 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="Tetap">Tetap</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Probation">Probation</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Data Sales Representative ({filteredKaryawan.length})
        </h2>
        <div className="flex gap-2">
          <ExportButton
            data={filteredKaryawan}
            filename="Data_Karyawan"
            title="Daftar Karyawan"
            disabled={filteredKaryawan.length === 0}
          />
          <Button
            onClick={() => {
              setSelectedKaryawan(null);
              setShowKaryawanForm(true);
            }}
            className="gap-2 bg-[#013E37] hover:bg-[#025C52]"
          >
            <Plus className="h-4 w-4" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013E37]"></div>
        </div>
      ) : filteredKaryawan.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada data Sales Representative</p>
            <Button
              onClick={() => setShowKaryawanForm(true)}
              className="mt-4 gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Tambah Tim Sales Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredKaryawan.map((k) => (
            <Card 
              key={k.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-[#013E37]/30"
              onClick={(e) => {
                // Prevent if clicking on a button or interactive element
                const target = e.target as HTMLElement;
                if (target.closest('button')) return;
                
                setSelectedKaryawan(k);
                setShowDetailDialog(true);
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#013E37] flex items-center justify-center text-white font-semibold text-lg">
                        {k.nama_lengkap?.charAt(0) || 'K'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{k.nama_lengkap}</h3>
                        <p className="text-sm text-gray-500">{k.jabatan} - {k.divisi}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">NIK</p>
                        <p className="font-medium text-gray-900">{k.nik}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{k.email_kantor}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">No. WhatsApp</p>
                        <p className="font-medium text-gray-900">{k.nomor_wa}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          k.status_karyawan === 'Tetap' ? 'bg-green-100 text-green-800' :
                          k.status_karyawan === 'Kontrak' ? 'bg-blue-100 text-blue-800' :
                          k.status_karyawan === 'Probation' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {k.status_karyawan}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showKaryawanForm && (
        <KaryawanFormModal
          karyawan={editingKaryawan}
          onClose={() => {
            setShowKaryawanForm(false);
            setEditingKaryawan(null);
          }}
          onSuccess={() => {
            setShowKaryawanForm(false);
            setEditingKaryawan(null);
            fetchKaryawan();
          }}
        />
      )}

      {showDetailDialog && selectedKaryawan && (
        <EmployeeDetailDialog
          open={showDetailDialog}
          onOpenChange={(open) => {
            setShowDetailDialog(open);
            if (!open) setSelectedKaryawan(null);
          }}
          employee={selectedKaryawan}
          onEdit={() => {
            setShowDetailDialog(false);
            setEditingKaryawan(selectedKaryawan);
            setShowKaryawanForm(true);
          }}
        />
      )}
    </div>
  );
}

export default SalesRepresentative;
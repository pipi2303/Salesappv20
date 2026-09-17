import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, DollarSign, Edit, Trash2, Star, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useConfirm } from '@/app/components/ui/confirm-dialog';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import { productsRepository } from '@/services/productsRepository';
import type { Product, NewProduct } from '@/types/product';
import { ProductFormModal } from '@/app/components/forms/ProductForm';
import { ProposalBuilder, ProposalFloatingButton } from '@/app/components/ProposalBuilder';

// Data source: productsRepository (localStorage-backed, unified Product model).
// Migrated from the legacy productsApi/`sales_monitoring_products` key — see
// src/services/productsRepository.ts for why this uses a different storage key.

interface ProposalItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  features: string[];
  proposalType?: 'teknis'; // Add proposal type for technical proposals
}

export function ProductCatalog() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Proposal state
  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching products from productsRepository...');
      
      const result = await productsRepository.getAll();
      
      if (result.success && result.data) {
        console.log(`✅ Loaded ${result.data.length} products`);
        setProducts(result.data);
      } else {
        console.error('❌ Error:', result.error);
        toast.error(result.error || 'Failed to load products');
      }
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      console.error('Error details:', error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateData = async () => {
    try {
      setLoading(true);
      toast.info('Memuat data dummy...');

      // Dummy catalog data — all software products (Hospital Management System
      // and related modules), matching what this catalog has always shipped
      // with as sample/demo data. Now goes through productsRepository so each
      // row is validated and given a real productType/sku instead of a loose
      // untyped object written straight to localStorage.
      const dummyProducts: NewProduct[] = [
        {
          sku: 'HMS-ENT-001', name: 'HMS Enterprise', category: 'Hospital Management System',
          description: 'Sistem manajemen rumah sakit komprehensif dengan fitur telemedicine, EMR, radiologi, dan laboratorium.',
          price: 500000000, currency: 'IDR', status: 'active',
          stock: 100, sold: 15,
          features: ['Telemedicine', 'EMR', 'Radiologi', 'Laboratorium', 'PACS', 'LIS', 'Billing System', 'Pharmacy System'],
          productType: 'software', licenseTier: 'Enterprise', billingCycle: 'yearly',
          modules: ['Telemedicine', 'EMR', 'Radiologi', 'Laboratorium', 'PACS', 'LIS', 'Billing System', 'Pharmacy System'],
        },
        {
          sku: 'HMS-PRO-002', name: 'HMS Professional', category: 'Hospital Management System',
          description: 'Sistem manajemen rumah sakit profesional dengan fitur EMR, PACS, dan LIS untuk RS tipe B dan C.',
          price: 300000000, currency: 'IDR', status: 'active',
          stock: 150, sold: 23,
          features: ['EMR', 'PACS', 'LIS', 'Billing System', 'Inventory Management', 'Reporting Dashboard'],
          productType: 'software', licenseTier: 'Professional', billingCycle: 'yearly',
          modules: ['EMR', 'PACS', 'LIS', 'Billing System', 'Inventory Management', 'Reporting Dashboard'],
        },
        {
          sku: 'DOC-PRO-003', name: 'Intradoc Pro', category: 'Document Management',
          description: 'Sistem manajemen dokumen profesional untuk manajemen dokumen medis dan administrasi rumah sakit.',
          price: 100000000, currency: 'IDR', status: 'active',
          stock: 200, sold: 34,
          features: ['Manajemen Dokumen Medis', 'Manajemen Dokumen Administrasi', 'E-Signature', 'Audit Trail', 'Version Control'],
          productType: 'software', licenseTier: 'Professional', billingCycle: 'yearly',
          modules: ['Manajemen Dokumen Medis', 'Manajemen Dokumen Administrasi', 'E-Signature', 'Audit Trail', 'Version Control'],
        },
        {
          sku: 'TLM-MOD-004', name: 'Telemedicine Module', category: 'Telemedicine',
          description: 'Sistem telemedicine untuk konsultasi jarak jauh antara dokter dan pasien dengan video call HD.',
          price: 50000000, currency: 'IDR', status: 'active',
          stock: 250, sold: 42,
          features: ['Video Call HD', 'Chat Dokter-Pasien', 'Resep Digital', 'Monitoring Pasien', 'Payment Gateway'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'monthly',
          modules: ['Video Call HD', 'Chat Dokter-Pasien', 'Resep Digital', 'Monitoring Pasien', 'Payment Gateway'],
        },
        {
          sku: 'EMR-STD-005', name: 'EMR Standalone', category: 'Electronic Medical Record',
          description: 'Sistem catatan medis elektronik standalone untuk manajemen data pasien dan rekam medis.',
          price: 150000000, currency: 'IDR', status: 'active',
          stock: 180, sold: 28,
          features: ['Manajemen Data Pasien', 'Rekam Medis Digital', 'SOAP Notes', 'ICD-10 Integration', 'CPPT'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Manajemen Data Pasien', 'Rekam Medis Digital', 'SOAP Notes', 'ICD-10 Integration', 'CPPT'],
        },
        {
          sku: 'RAD-PACS-006', name: 'Radiologi PACS', category: 'Radiology',
          description: 'Sistem PACS untuk manajemen dan analisis gambar radiologi dengan DICOM viewer.',
          price: 200000000, currency: 'IDR', status: 'active',
          stock: 120, sold: 18,
          features: ['DICOM Viewer', 'Image Storage', 'Worklist Management', '3D Reconstruction', 'Teleradiology'],
          productType: 'software', licenseTier: 'Professional', billingCycle: 'yearly',
          modules: ['DICOM Viewer', 'Image Storage', 'Worklist Management', '3D Reconstruction', 'Teleradiology'],
        },
        {
          sku: 'LAB-LIS-007', name: 'Laboratory LIS', category: 'Laboratory',
          description: 'Sistem informasi laboratorium untuk manajemen pemeriksaan dan hasil lab dengan auto-interface.',
          price: 100000000, currency: 'IDR', status: 'active',
          stock: 160, sold: 31,
          features: ['Order Management', 'Result Entry', 'Auto-Interface', 'Quality Control', 'Report Generation'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Order Management', 'Result Entry', 'Auto-Interface', 'Quality Control', 'Report Generation'],
        },
        {
          sku: 'PHM-MOD-008', name: 'Pharmacy Module', category: 'Pharmacy Management',
          description: 'Sistem manajemen farmasi untuk inventory obat, dispensing, dan interaksi obat.',
          price: 80000000, currency: 'IDR', status: 'active',
          stock: 190, sold: 26,
          features: ['Inventory Management', 'Dispensing', 'Drug Interaction Check', 'Expired Date Alert', 'Stock Opname'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Inventory Management', 'Dispensing', 'Drug Interaction Check', 'Expired Date Alert', 'Stock Opname'],
        },
        {
          sku: 'BIL-SYS-009', name: 'Billing System', category: 'Finance & Billing',
          description: 'Sistem billing komprehensif dengan integrasi BPJS, asuransi, dan payment gateway.',
          price: 120000000, currency: 'IDR', status: 'active',
          stock: 140, sold: 37,
          features: ['BPJS Integration', 'Insurance Claims', 'Payment Gateway', 'Invoice Generation', 'Financial Reports'],
          productType: 'software', licenseTier: 'Professional', billingCycle: 'yearly',
          modules: ['BPJS Integration', 'Insurance Claims', 'Payment Gateway', 'Invoice Generation', 'Financial Reports'],
        },
        {
          sku: 'MOB-HMS-010', name: 'Mobile App HMS', category: 'Mobile Application',
          description: 'Aplikasi mobile untuk pasien: jadwal dokter, booking appointment, dan telemedicine.',
          price: 75000000, currency: 'IDR', status: 'active',
          stock: 220, sold: 45,
          features: ['Jadwal Dokter', 'Online Booking', 'Telemedicine', 'Medical Records', 'Push Notifications'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Jadwal Dokter', 'Online Booking', 'Telemedicine', 'Medical Records', 'Push Notifications'],
        },
        {
          sku: 'NUR-STA-011', name: 'Nurse Station Module', category: 'Nursing Management',
          description: 'Sistem untuk nurse station: vital signs monitoring, medication administration, dan care plan.',
          price: 90000000, currency: 'IDR', status: 'active',
          stock: 170, sold: 22,
          features: ['Vital Signs Entry', 'Medication Administration', 'Care Plan', 'Nursing Notes', 'Handover Report'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Vital Signs Entry', 'Medication Administration', 'Care Plan', 'Nursing Notes', 'Handover Report'],
        },
        {
          sku: 'INV-MGT-012', name: 'Inventory Management', category: 'Inventory & Supply Chain',
          description: 'Sistem manajemen inventory untuk medical supplies, alkes, dan asset management.',
          price: 85000000, currency: 'IDR', status: 'active',
          stock: 130, sold: 19,
          features: ['Stock Management', 'Purchase Order', 'Vendor Management', 'Asset Tracking', 'Reorder Point Alert'],
          productType: 'software', licenseTier: 'Standard', billingCycle: 'yearly',
          modules: ['Stock Management', 'Purchase Order', 'Vendor Management', 'Asset Tracking', 'Reorder Point Alert'],
        },
      ];

      let createdCount = 0;
      for (const p of dummyProducts) {
        const result = await productsRepository.create(p);
        if (result.success) {
          createdCount++;
        } else {
          console.error(`❌ Gagal membuat produk ${p.name}:`, result.error);
        }
      }

      console.log(`✅ Populated ${createdCount}/${dummyProducts.length} products via productsRepository`);
      if (createdCount > 0) {
        toast.success(`Berhasil populate ${createdCount} produk healthcare!`);
      } else {
        toast.error('Gagal populate data (mungkin SKU sudah ada). Cek console untuk detail.');
      }

      // Refresh products list
      await fetchProducts();
    } catch (error: any) {
      console.error('❌ Error populating data:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (!(await confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`, { variant: 'destructive', confirmText: 'Hapus' }))) {
      return;
    }

    try {
      setDeleteLoading(product.id);
      
      const result = await productsRepository.remove(product.id);
      
      if (result.success) {
        toast.success('Product berhasil dihapus!');
        fetchProducts();
      } else {
        toast.error(result.error || 'Gagal menghapus product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Terjadi kesalahan saat menghapus product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013E37]"></div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: products.length,
    totalSold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.price * (p.sold || 0)), 0),
    bestSeller: products.length > 0 
      ? products.reduce((prev, current) => ((current.sold || 0) > (prev.sold || 0)) ? current : prev)
      : { name: '-', description: '-', sold: 0, price: 0, features: [] as string[] }
  };

  // Format revenue menggunakan utility function standar
  const formatRevenue = (amount: number) => {
    return formatCurrency(amount);
  };

  const getCategorySubtext = (category: string) => {
    const mapping: Record<string, string> = {
      'all': 'SEMUA PRODUK',
      'Hospital Management System': 'SISTEM ENTERPRISE',
      'Document Management': 'ARSIP DIGITAL',
      'Telemedicine': 'LAYANAN JARAK JAUH',
      'Electronic Medical Record': 'REKAM MEDIS DIGITAL',
      'Radiology': 'PENCITRAAN MEDIS',
      'Laboratory': 'SISTEM INFORMASI LAB',
      'Pharmacy Management': 'STOK & DISPENSING',
      'Finance & Billing': 'TRANSAKSI & KLAIM',
      'Mobile Application': 'PASIEN & DOKTER APP',
      'Nursing Management': 'ASUHAN KEPERAWATAN',
      'Inventory & Supply Chain': 'LOGISTIK MEDIS'
    };
    return mapping[category] || 'KATALOG PRODUK';
  };

  const handleAddToProposal = (product: Product) => {
    const existingItem = proposalItems.find(item => item.id === product.id);
    if (existingItem) {
      setProposalItems(proposalItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      toast.success(`Quantity ${product.name} ditambah menjadi ${existingItem.quantity + 1}`);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        description: product.description,
        features: product.features || [],
      };
      setProposalItems([...proposalItems, newItem]);
      toast.success(`${product.name} ditambahkan ke proposal`);
    }
    console.log('Proposal items updated:', proposalItems.length + 1);
  };

  const handleAddToProposalTeknis = (product: Product) => {
    const existingItem = proposalItems.find(item => item.id === product.id);
    if (existingItem) {
      setProposalItems(proposalItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      toast.success(`Quantity ${product.name} ditambah ke Proposal Teknis menjadi ${existingItem.quantity + 1}`);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        description: product.description,
        features: product.features || [],
        proposalType: 'teknis' as const, // Mark as technical proposal
      };
      setProposalItems([...proposalItems, newItem]);
      toast.success(`${product.name} ditambahkan ke Proposal Teknis`);
    }
    console.log('Technical proposal items updated:', proposalItems.length + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#013E37]">
            Katalog Produk
          </h1>
          <p className="text-gray-600 mt-1">Jelajahi dan kelola semua produk & layanan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handlePopulateData}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Load 12 Data Baru
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-[#013E37] hover:bg-[#025C52] text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#013E37] flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Terjual</p>
                  <p className="text-2xl font-bold">{stats.totalSold}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#013E37] flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold">{formatRevenue(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Best Seller</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm font-bold line-clamp-2 cursor-help">{stats.bestSeller.name}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{stats.bestSeller.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk atau layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={fetchProducts}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {products.length === 0 ? (
        <Card className="py-12">
          <CardContent>
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Produk</h3>
              <p className="text-gray-600 mb-6">Mulai tambahkan produk pertama Anda</p>
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-[#013E37] to-[#013E37] hover:from-[#013E37] hover:to-[#013E37] text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="w-full h-auto p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="data-[state=active]:bg-white data-[state=active]:text-[#013E37] data-[state=active]:shadow-sm rounded-lg py-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[72px]"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="font-bold text-[10px] sm:text-[11px] uppercase tracking-tight leading-[1.1] mb-1 max-w-[110px] whitespace-normal">
                    {category === 'all' ? 'Semua Produk' : category}
                  </div>
                  <div className="text-[9px] text-gray-400 font-medium uppercase tracking-widest leading-none opacity-80">
                    {getCategorySubtext(category)}
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-6">
            {filteredProducts.length === 0 ? (
              <Card className="py-12">
                <CardContent>
                  <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Hasil</h3>
                    <p className="text-gray-600">Tidak ada produk yang cocok dengan pencarian Anda</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                    {/* Product Image/Icon */}
                    <div className="h-48 bg-[#013E37] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                      <Package className="h-24 w-24 text-white/80 group-hover:scale-110 transition-transform" />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-[#013E37]">
                        {product.sold || 0} Terjual
                      </Badge>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="mb-2 bg-[#EEF7F5] text-[#013E37]">{product.category}</Badge>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="space-y-2 mb-4">
                        {(product.features || []).slice(0, 3).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                        {(product.features || []).length > 3 && (
                          <p className="text-xs text-gray-500 ml-6">+{product.features.length - 3} fitur lainnya</p>
                        )}
                      </div>

                      {/* Spacer untuk mendorong tombol ke bawah */}
                      <div className="flex-1"></div>

                      <div className="pt-4 border-t mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Harga Mulai</p>
                            <p className="text-2xl font-bold text-[#013E37]">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Stock</p>
                            <p className="text-lg font-semibold text-green-600">{product.stock || 0}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {/* Primary Actions - 2 tombol proposal */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              className={`text-white text-xs ${
                                proposalItems.some(item => item.id === product.id && item.proposalType === 'teknis')
                                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                  : 'bg-[#013E37] hover:bg-[#025C52]'
                              }`}
                              onClick={() => handleAddToProposalTeknis(product)}
                              disabled={proposalItems.some(item => item.id === product.id && item.proposalType === 'teknis')}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Proposal Teknis
                            </Button>
                            <Button 
                              className={`text-white text-xs ${
                                proposalItems.some(item => item.id === product.id && !item.proposalType)
                                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                                  : 'bg-[#013E37] hover:bg-[#025C52]'
                              }`}
                              onClick={() => handleAddToProposal(product)}
                              disabled={proposalItems.some(item => item.id === product.id && !item.proposalType)}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Proposal
                            </Button>
                          </div>
                          
                          {/* Secondary Actions - Edit & Delete */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              disabled={deleteLoading === product.id}
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deleteLoading === product.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Best Seller Highlight */}
      {products.length > 0 && stats.bestSeller.sold > 0 && (
        <Card className="bg-[#013E37] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              Produk Terlaris Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{stats.bestSeller.name}</h3>
                <p className="text-white/80 mb-4">{stats.bestSeller.description}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-white/80">Total Terjual</p>
                    <p className="text-3xl font-bold">{stats.bestSeller.sold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Revenue</p>
                    <p className="text-2xl font-bold">Rp {((stats.bestSeller.price * stats.bestSeller.sold) / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/80 mb-2">Fitur Unggulan:</p>
                {(stats.bestSeller.features || []).slice(0, 6).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Proposal Builder */}
      <ProposalBuilder
        isOpen={showProposal}
        items={proposalItems}
        onClose={() => setShowProposal(false)}
        onUpdateQuantity={(id, quantity) => {
          setProposalItems(proposalItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          ));
        }}
        onRemoveItem={(id) => {
          setProposalItems(proposalItems.filter(item => item.id !== id));
        }}
        onClearAll={async () => {
          if (await confirm('Hapus semua item dari proposal?', { variant: 'destructive', confirmText: 'Hapus' })) {
            setProposalItems([]);
            setShowProposal(false);
          }
        }}
      />
      
      {/* Floating Button */}
      <ProposalFloatingButton
        itemCount={proposalItems.length}
        onClick={() => setShowProposal(true)}
      />
    </div>
  );
}

export default ProductCatalog;

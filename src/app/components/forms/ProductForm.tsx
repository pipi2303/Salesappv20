import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { X, Package, DollarSign, Box, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';

// Mock API URL - using localStorage only
const API_URL = 'https://mock-project-id.supabase.co/functions/v1/make-server-67367fc1';
const publicAnonKey = 'mock-anon-key';

interface ProductFormProps {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductFormModal({ product, onClose, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    features: '',
    sold: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        features: Array.isArray(product.features) ? product.features.join('\n') : '',
        sold: product.sold?.toString() || '0',
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Harap isi semua field yang wajib!');
      return;
    }

    try {
      setLoading(true);
      
      // Convert features from string to array
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock) || 0,
        features: featuresArray,
        sold: parseInt(formData.sold) || 0,
      };
      
      const url = product 
        ? `${API_URL}/products/${product.id}`
        : `${API_URL}/products`;
      
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken || publicAnonKey}`,
          'apikey': publicAnonKey,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(product ? 'Product berhasil diupdate!' : 'Product berhasil ditambahkan!');
        onSuccess();
      } else {
        toast.error(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="!max-w-[700px] w-[90vw] max-h-[90vh] overflow-hidden p-0 gap-0 bg-white [&>button]:hidden flex flex-col">
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
                <Package className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold leading-tight text-white">
                  {formData.name || (product ? 'Edit Product' : 'Tambah Product Baru')}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1 leading-tight">
                  {formData.category || 'Healthcare Solution'}
                </DialogDescription>
              </div>
            </div>

            {/* Status Badges */}
            {product && (
              <div className="flex gap-2 flex-wrap">
                {formData.category && (
                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600 border-none">
                    {formData.category}
                  </Badge>
                )}
                {formData.stock && parseInt(formData.stock) > 0 && (
                  <Badge className="bg-emerald-500 text-emerald-900 hover:bg-emerald-600 border-none">
                    Stock: {formData.stock}
                  </Badge>
                )}
                {formData.sold && parseInt(formData.sold) > 0 && (
                  <Badge className="bg-blue-500 text-blue-900 hover:bg-blue-600 border-none">
                    Sold: {formData.sold}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {/* QUICK INFO CARDS - Only in Edit Mode */}
        {product && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 grid grid-cols-3 gap-4 border-b border-indigo-100 flex-shrink-0">
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Harga</p>
                <p className="font-semibold text-gray-900 text-sm">
                  Rp {formData.price ? (parseInt(formData.price) / 1000000).toFixed(1) : '0'} Jt
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Box className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.stock || '0'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Terjual</p>
                <p className="font-semibold text-gray-900 text-sm">{formData.sold || '0'}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* CONTENT - Scrollable area */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
            
            {/* Product Information */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-indigo-900">Informasi Produk</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Nama Produk <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="HMS Enterprise Edition"
                    className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital Management System">Hospital Management System</SelectItem>
                      <SelectItem value="Laboratory">Laboratory</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Pharmacy Management">Pharmacy Management</SelectItem>
                      <SelectItem value="Telemedicine">Telemedicine</SelectItem>
                      <SelectItem value="Document Management">Document Management</SelectItem>
                      <SelectItem value="Electronic Medical Record">Electronic Medical Record</SelectItem>
                      <SelectItem value="Finance & Billing">Finance & Billing</SelectItem>
                      <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                      <SelectItem value="Nursing Management">Nursing Management</SelectItem>
                      <SelectItem value="Inventory & Supply Chain">Inventory & Supply Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="50000000"
                    className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Stock</Label>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="100"
                    className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Terjual</Label>
                  <Input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleChange}
                    placeholder="0"
                    className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-semibold text-gray-700">Deskripsi</Label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                    placeholder="Deskripsi lengkap tentang produk..."
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Fitur-fitur <span className="text-gray-500 text-xs">(satu baris per fitur)</span>
                  </Label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white font-mono"
                    placeholder="Integrasi SatuSehat&#10;EMR Lengkap&#10;Rekam Medis Elektronik&#10;Billing & Klaim BPJS&#10;Laporan Real-time"
                  />
                  <p className="text-xs text-gray-500">
                    Masukkan setiap fitur di baris baru. Contoh di atas akan menjadi 5 fitur terpisah.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER - Action Buttons */}
          <div className="border-t bg-gray-50 px-6 py-5 flex justify-end gap-3 flex-shrink-0">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="outline"
              disabled={loading}
              className="px-6"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-[#01544e] hover:bg-[#023d39] text-white px-6 gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

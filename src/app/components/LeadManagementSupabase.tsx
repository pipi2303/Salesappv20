import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Phone, Mail, Building2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { VoiceInput } from '@/app/components/VoiceInput';
import { Lead } from '@/app/data/dummyData';
import { toast } from 'sonner';
import { leadsApi } from '@/services/api';
import { formatCurrencyFull } from '@/utils/formatters';

export function LeadManagementSupabase() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    proposal: 'bg-indigo-100 text-indigo-800',
    negotiation: 'bg-orange-100 text-orange-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  };

  // Fetch leads from Supabase
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const result = await leadsApi.getAll();
      
      if (result.success && result.data) {
        setLeads(result.data);
        toast.success('Leads loaded successfully');
      } else {
        toast.error(result.error || 'Failed to load leads');
      }
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = () => {
    setFormData({});
    setSelectedLead(null);
    setIsDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setFormData(lead);
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleSaveLead = async () => {
    if (!formData.name || !formData.email || !formData.company) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedLead) {
        // Update existing lead
        const result = await leadsApi.update(selectedLead.id, formData);
        
        if (result.success && result.data) {
          setLeads(leads.map(l => l.id === selectedLead.id ? result.data : l));
          toast.success('Lead berhasil diupdate!');
        } else {
          toast.error(result.error || 'Gagal mengupdate lead');
        }
      } else {
        // Create new lead
        const result = await leadsApi.create(formData);
        
        if (result.success && result.data) {
          setLeads([...leads, result.data]);
          toast.success('Lead berhasil ditambahkan!');
        } else {
          toast.error(result.error || 'Gagal menambahkan lead');
        }
      }

      setIsDialogOpen(false);
      setFormData({});
      setSelectedLead(null);
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Terjadi kesalahan saat menyimpan lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lead ini?')) {
      return;
    }

    try {
      const result = await leadsApi.delete(leadId);
      
      if (result.success) {
        setLeads(leads.filter(l => l.id !== leadId));
        toast.success('Lead berhasil dihapus!');
      } else {
        toast.error(result.error || 'Gagal menghapus lead');
      }
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error('Terjadi kesalahan saat menghapus lead');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Lead Management (Supabase)
          </h1>
          <p className="text-gray-600 mt-1">Kelola leads dengan integrasi Supabase real-time</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchLeads}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={handleAddLead} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Lead
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari lead (nama, company, email)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    {lead.company}
                  </p>
                </div>
                <Badge className={statusColors[lead.status] || 'bg-gray-100 text-gray-800'}>
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {lead.email}
                </p>
                <p className="text-sm flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {lead.phone}
                </p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-500">Nilai Lead</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrencyFull(lead.value || 0)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditLead(lead)}>
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteLead(lead.id)}>
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Tidak ada lead ditemukan</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLead ? 'Edit Lead' : 'Tambah Lead Baru'}
            </DialogTitle>
            <DialogDescription>
              {selectedLead ? 'Perbarui informasi lead Anda' : 'Masukkan detail lead baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <VoiceInput
                value={formData.name || ''}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <VoiceInput
                value={formData.email || ''}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <VoiceInput
                value={formData.phone || ''}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="+62..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Perusahaan *</Label>
              <VoiceInput
                value={formData.company || ''}
                onChange={(value) => setFormData({ ...formData, company: value })}
                placeholder="Nama perusahaan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posisi</Label>
              <VoiceInput
                value={formData.position || ''}
                onChange={(value) => setFormData({ ...formData, position: value })}
                placeholder="Posisi di perusahaan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Sumber</Label>
              <Select 
                value={formData.source || ''} 
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="cold-call">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'new'} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Nilai Lead (Rp)</Label>
              <Input
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan tambahan..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button 
              onClick={handleSaveLead} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
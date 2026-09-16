import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  GitBranch, FileSignature, Shield, Calculator, CheckCircle, 
  XCircle, AlertTriangle, Clock, User, DollarSign, Calendar,
  Send, Edit2, Download, Eye, ArrowRight, Package, TrendingUp,
  FileText, Zap, Award, Target, Hash, Percent
} from 'lucide-react';
import { Contract as ContractType } from '@/app/data/dummyData';
import { toast } from 'sonner';

interface AdvancedFeaturesProps {
  contracts: ContractType[];
  selectedContract?: ContractType | null;
}

// Amendment Management
export function ContractAmendments({ contracts, selectedContract }: AdvancedFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amendmentType, setAmendmentType] = useState('');
  const [description, setDescription] = useState('');

  const amendmentTypes = [
    { value: 'pricing', label: 'Pricing Adjustment', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { value: 'scope', label: 'Scope Change', icon: Package, color: 'from-[#013E37] to-[#025C52]' },
    { value: 'term', label: 'Term Extension', icon: Calendar, color: 'from-[#EEF7F5]0 to-pink-600' },
    { value: 'service', label: 'Service Level Change', icon: Target, color: 'from-orange-500 to-red-600' }
  ];

  const mockAmendments = [
    {
      id: '1',
      contractNumber: 'CNT-2024-001',
      type: 'pricing',
      description: 'Annual price increase by 10%',
      status: 'approved',
      requestedBy: 'John Doe',
      requestedDate: new Date('2024-01-15'),
      approvedDate: new Date('2024-01-18')
    },
    {
      id: '2',
      contractNumber: 'CNT-2024-003',
      type: 'term',
      description: 'Extension for 12 months',
      status: 'pending',
      requestedBy: 'Jane Smith',
      requestedDate: new Date('2024-01-20')
    }
  ];

  const handleSubmitAmendment = () => {
    if (!amendmentType || !description) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Amendment request submitted successfully!');
    setIsOpen(false);
    setAmendmentType('');
    setDescription('');
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-[#EEF7F5]0 text-[#013E37] hover:bg-[#EEF7F5]"
      >
        <GitBranch className="h-4 w-4 mr-2" />
        Amendments
        <Badge className="ml-2 bg-yellow-500 text-yellow-900">{mockAmendments.filter(a => a.status === 'pending').length}</Badge>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Amendment Management</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  Track and manage contract modifications
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Create New Amendment */}
            <Card className="border-2 border-[#C3DDD9]">
              <CardHeader>
                <CardTitle className="text-lg">Create New Amendment Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contract</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract" />
                    </SelectTrigger>
                    <SelectContent>
                      {contracts.slice(0, 5).map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.contractNumber} - {c.company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Amendment Type</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {amendmentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Card 
                          key={type.value}
                          className={`cursor-pointer transition-all ${amendmentType === type.value ? 'border-2 border-[#EEF7F5]0 shadow-md' : 'hover:shadow-md'}`}
                          onClick={() => setAmendmentType(type.value)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <span className="font-medium text-sm">{type.label}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe the amendment details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] mt-2"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-[#013E37] to-[#025C52] hover:from-[#013E37] hover:to-[#013E37]"
                  onClick={handleSubmitAmendment}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Amendment Request
                </Button>
              </CardContent>
            </Card>

            {/* Amendment History */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Amendment History</h3>
              <div className="space-y-3">
                {mockAmendments.map((amendment) => {
                  const statusColors = {
                    approved: 'bg-green-100 text-green-800',
                    pending: 'bg-yellow-100 text-yellow-800',
                    rejected: 'bg-red-100 text-red-800'
                  };

                  return (
                    <Card key={amendment.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{amendment.contractNumber}</h4>
                              <Badge className={statusColors[amendment.status as keyof typeof statusColors]}>
                                {amendment.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{amendment.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>Type: <span className="font-medium capitalize">{amendment.type}</span></span>
                              <span>By: {amendment.requestedBy}</span>
                              <span>Date: {amendment.requestedDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          {amendment.status === 'pending' && (
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Compliance Checker
export function ContractCompliance({ contracts }: AdvancedFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const complianceChecks = [
    { name: 'Payment Terms', required: true, description: 'Clear payment schedule defined' },
    { name: 'Liability Limits', required: true, description: 'Liability caps specified' },
    { name: 'Termination Clause', required: true, description: 'Exit terms included' },
    { name: 'Data Privacy (GDPR)', required: true, description: 'Privacy compliance addressed' },
    { name: 'Insurance Requirements', required: false, description: 'Insurance coverage specified' },
    { name: 'Dispute Resolution', required: true, description: 'Arbitration process defined' }
  ];

  const getComplianceScore = (contract: ContractType): number => {
    // Mock compliance scoring logic
    let score = 70;
    if (contract.status === 'active') score += 10;
    if (contract.signedBy) score += 10;
    if (contract.value > 500000000) score += 10;
    return Math.min(score, 100);
  };

  const contractsWithCompliance = contracts.map(c => ({
    ...c,
    complianceScore: getComplianceScore(c)
  })).sort((a, b) => a.complianceScore - b.complianceScore);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50"
      >
        <Shield className="h-4 w-4 mr-2" />
        Compliance Checker
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Compliance Checker</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  Automated validation & regulatory compliance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            {/* Compliance Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Standard Compliance Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceChecks.map((check, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{check.name}</span>
                          {check.required && (
                            <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contract Compliance Scores */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Contract Compliance Scores</h3>
              <div className="space-y-3">
                {contractsWithCompliance.slice(0, 5).map((contract) => {
                  const getScoreColor = (score: number) => {
                    if (score >= 90) return 'from-green-500 to-emerald-600';
                    if (score >= 70) return 'from-yellow-500 to-orange-600';
                    return 'from-red-500 to-red-600';
                  };

                  const getScoreBadge = (score: number) => {
                    if (score >= 90) return { text: 'Compliant', color: 'bg-green-100 text-green-800' };
                    if (score >= 70) return { text: 'Review Required', color: 'bg-yellow-100 text-yellow-800' };
                    return { text: 'Non-Compliant', color: 'bg-red-100 text-red-800' };
                  };

                  const badge = getScoreBadge(contract.complianceScore);

                  return (
                    <Card key={contract.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getScoreColor(contract.complianceScore)} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white font-bold text-xl">{contract.complianceScore}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{contract.contractNumber}</h4>
                              <p className="text-sm text-gray-600">{contract.company}</p>
                              <Badge className={`${badge.color} mt-1`}>{badge.text}</Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Compliance report generated')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// E-Signature Integration
export function ContractESignature({ contracts }: AdvancedFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pendingSignatures = contracts.filter(c => c.status === 'pending');

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-pink-500 text-pink-600 hover:bg-pink-50"
      >
        <FileSignature className="h-4 w-4 mr-2" />
        E-Signature
        {pendingSignatures.length > 0 && (
          <Badge className="ml-2 bg-pink-500 text-white">{pendingSignatures.length}</Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <FileSignature className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">E-Signature Management</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  Digital signing workflow & tracking
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                <CardContent className="p-5">
                  <Clock className="h-8 w-8 text-yellow-200 mb-2" />
                  <p className="text-yellow-100 text-sm">Pending Signatures</p>
                  <p className="text-2xl font-bold mt-1">{pendingSignatures.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardContent className="p-5">
                  <CheckCircle className="h-8 w-8 text-green-200 mb-2" />
                  <p className="text-green-100 text-sm">Signed Today</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#013E37] to-[#025C52] text-white">
                <CardContent className="p-5">
                  <Zap className="h-8 w-8 text-blue-200 mb-2" />
                  <p className="text-blue-100 text-sm">Avg Signature Time</p>
                  <p className="text-2xl font-bold mt-1">2.5 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Signatures */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Contracts Pending Signature</h3>
              <div className="space-y-3">
                {pendingSignatures.map((contract) => (
                  <Card key={contract.id} className="border-2 border-orange-200 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg text-gray-900">{contract.contractNumber}</h4>
                            <Badge className="bg-yellow-100 text-yellow-800">Awaiting Signature</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            <span className="font-medium">{contract.clientName}</span> - {contract.company}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span>Rp {(contract.value / 1000000).toFixed(0)} Jt</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{contract.salesPerson}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                            onClick={() => toast.success('Signature request sent to client')}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send to Client
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success('Reminder sent')}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Signature Workflow */}
            <Card className="bg-gradient-to-r bg-[#EEF7F5] border-blue-200">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Signature Workflow Process</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                      <span className="text-sm">Legal Review</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#013E37] text-white flex items-center justify-center text-sm font-bold">2</div>
                      <span className="text-sm">Client Signature</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                      <span className="text-sm">Activation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Revenue Recognition
export function ContractRevenue({ contracts }: AdvancedFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalRevenue = contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0);
  const monthlyRecurring = totalRevenue / 12;
  const deferredRevenue = contracts.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.value, 0);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Revenue Recognition
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Revenue Recognition & Billing</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  Financial tracking and revenue analytics
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardContent className="p-5">
                  <DollarSign className="h-8 w-8 text-green-200 mb-2" />
                  <p className="text-green-100 text-sm">Total ARR</p>
                  <p className="text-2xl font-bold mt-1">Rp {(totalRevenue / 1000000000).toFixed(2)} M</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#013E37] to-[#025C52] text-white">
                <CardContent className="p-5">
                  <TrendingUp className="h-8 w-8 text-blue-200 mb-2" />
                  <p className="text-blue-100 text-sm">Monthly Recurring (MRR)</p>
                  <p className="text-2xl font-bold mt-1">Rp {(monthlyRecurring / 1000000).toFixed(0)} Jt</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#EEF7F5]0 to-pink-600 text-white">
                <CardContent className="p-5">
                  <Clock className="h-8 w-8 text-[#C3DDD9] mb-2" />
                  <p className="text-[#DFF0EC] text-sm">Deferred Revenue</p>
                  <p className="text-2xl font-bold mt-1">Rp {(deferredRevenue / 1000000).toFixed(0)} Jt</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by Contract */}
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts - Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contracts.filter(c => c.status === 'active').slice(0, 5).map((contract) => {
                    const monthlyValue = contract.value / 12;
                    return (
                      <div key={contract.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{contract.contractNumber}</p>
                          <p className="text-sm text-gray-600">{contract.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">Rp {(contract.value / 1000000).toFixed(0)} Jt</p>
                          <p className="text-xs text-gray-600">Monthly: Rp {(monthlyValue / 1000000).toFixed(1)} Jt</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="bg-gradient-to-r bg-[#EEF7F5] border-[#C3DDD9]">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Export Financial Reports</h4>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => toast.success('Revenue report exported to Excel')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.success('Syncing with accounting system...')}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Sync to Accounting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

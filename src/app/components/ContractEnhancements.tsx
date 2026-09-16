import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  Bell, FileText, FileSignature, TrendingUp, Shield, GitBranch, 
  Calculator, Package, Calendar, Clock, AlertTriangle, CheckCircle, 
  XCircle, Building2, User, DollarSign, Zap, Star, Award, Target,
  BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
  Percent, Hash, Download, Send, Eye, RefreshCw
} from 'lucide-react';
import { Contract as ContractType } from '@/app/data/dummyData';
import { toast } from 'sonner';

// Helper function to calculate days until expiry
export const getDaysUntilExpiry = (endDate: Date): number => {
  const today = new Date();
  const expiry = new Date(endDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get renewal urgency level
export const getRenewalUrgency = (days: number): 'critical' | 'urgent' | 'warning' | 'normal' => {
  if (days < 0) return 'critical';
  if (days <= 7) return 'critical';
  if (days <= 30) return 'urgent';
  if (days <= 60) return 'warning';
  return 'normal';
};

// Calculate contract risk score
export const calculateRiskScore = (contract: ContractType): number => {
  let score = 0;
  const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
  
  // Payment risk factors
  if (contract.value > 1000000000) score += 15; // High value = higher risk
  if (contract.status === 'pending') score += 25;
  
  // Renewal risk factors
  if (daysUntilExpiry < 30 && contract.status === 'active') score += 30;
  if (daysUntilExpiry < 0) score += 40;
  
  // Compliance risk
  if (!contract.signedBy) score += 20;
  
  return Math.min(score, 100);
};

// Get risk level color
export const getRiskLevelColor = (score: number): string => {
  if (score >= 61) return 'from-red-500 to-red-600';
  if (score >= 31) return 'from-orange-500 to-yellow-600';
  return 'from-green-500 to-emerald-600';
};

// Get risk level badge
export const getRiskLevelBadge = (score: number): { text: string; color: string } => {
  if (score >= 61) return { text: 'High Risk', color: 'bg-red-100 text-red-800' };
  if (score >= 31) return { text: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Low Risk', color: 'bg-green-100 text-green-800' };
};

interface ContractEnhancementsProps {
  contracts: ContractType[];
}

export function ContractRenewalReminders({ contracts }: ContractEnhancementsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get contracts expiring soon
  const upcomingRenewals = contracts
    .filter(c => c.status === 'active')
    .map(c => ({
      ...c,
      daysUntil: getDaysUntilExpiry(c.endDate),
      urgency: getRenewalUrgency(getDaysUntilExpiry(c.endDate))
    }))
    .filter(c => c.daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const urgencyColors = {
    critical: 'from-red-500 to-red-600',
    urgent: 'from-orange-500 to-orange-600',
    warning: 'from-yellow-500 to-yellow-600',
    normal: 'from-[#013E37] to-[#025C52]'
  };

  const urgencyLabels = {
    critical: 'CRITICAL',
    urgent: 'URGENT',
    warning: 'WARNING',
    normal: 'NORMAL'
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-orange-500 text-orange-600 hover:bg-orange-50"
      >
        <Bell className="h-4 w-4 mr-2" />
        Renewal Reminders
        {upcomingRenewals.length > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">{upcomingRenewals.length}</Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Contract Renewal Reminders</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  {upcomingRenewals.length} contracts require attention
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            {upcomingRenewals.length === 0 ? (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">No contracts expiring in the next 90 days</p>
                </CardContent>
              </Card>
            ) : (
              upcomingRenewals.map((contract) => (
                <Card key={contract.id} className={`border-2 hover:shadow-lg transition-all ${contract.urgency === 'critical' ? 'border-red-300' : contract.urgency === 'urgent' ? 'border-orange-300' : 'border-yellow-300'}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${urgencyColors[contract.urgency]} flex items-center justify-center flex-shrink-0`}>
                            {contract.daysUntil < 0 ? (
                              <XCircle className="h-7 w-7 text-white" />
                            ) : contract.urgency === 'critical' ? (
                              <AlertTriangle className="h-7 w-7 text-white" />
                            ) : (
                              <Clock className="h-7 w-7 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{contract.contractNumber}</h3>
                            <Badge className={`${urgencyColors[contract.urgency]} text-white`}>
                              {urgencyLabels[contract.urgency]}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Client & Company</p>
                            <p className="font-medium text-gray-900">{contract.clientName}</p>
                            <p className="text-sm text-gray-600">{contract.company}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Contract Value</p>
                            <p className="font-semibold text-green-600 text-lg">
                              Rp {(contract.value / 1000000).toFixed(0)} Jt
                            </p>
                            <p className="text-sm text-gray-600">Ends: {contract.endDate.toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg ${contract.daysUntil < 0 ? 'bg-red-50' : contract.urgency === 'critical' ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {contract.daysUntil < 0 
                                  ? `EXPIRED ${Math.abs(contract.daysUntil)} days ago!` 
                                  : `${contract.daysUntil} days until expiry`}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {contract.urgency === 'critical' && 'Action required immediately'}
                                {contract.urgency === 'urgent' && 'Start renewal process now'}
                                {contract.urgency === 'warning' && 'Begin renewal discussions'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          onClick={() => {
                            toast.success(`Renewal proposal generated for ${contract.contractNumber}`);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Renewal
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success(`Email sent to ${contract.clientName}`);
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Email Client
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success(`Meeting scheduled with ${contract.clientName}`);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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

export function ContractTemplates() {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: 'enterprise-saas',
      name: 'Enterprise SaaS Agreement',
      icon: Building2,
      color: 'from-[#013E37] to-[#025C52]',
      duration: '1-3 years',
      description: 'Comprehensive SaaS subscription for large organizations',
      features: ['Volume licensing', 'Custom SLA', 'Dedicated support', 'Security addendum']
    },
    {
      id: 'partnership',
      name: 'Partnership Agreement',
      icon: Award,
      color: 'from-[#EEF7F5]0 to-pink-600',
      duration: '2-5 years',
      description: 'Strategic partnership and collaboration agreement',
      features: ['Revenue sharing', 'Joint ventures', 'IP rights', 'Exit clauses']
    },
    {
      id: 'sla',
      name: 'Service Level Agreement (SLA)',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      duration: '1 year',
      description: 'Define service standards and performance metrics',
      features: ['Uptime guarantees', 'Response times', 'Penalties', 'Escalation procedures']
    },
    {
      id: 'subscription',
      name: 'Subscription Contract',
      icon: RefreshCw,
      color: 'from-orange-500 to-red-600',
      duration: '1 year (auto-renew)',
      description: 'Recurring subscription with auto-renewal',
      features: ['Monthly/Annual billing', 'Usage tiers', 'Auto-renewal', 'Cancellation terms']
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement (NDA)',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      duration: '2-5 years',
      description: 'Protect confidential information',
      features: ['Mutual/One-way', 'Confidentiality terms', 'Exclusions', 'Return of materials']
    },
    {
      id: 'msa',
      name: 'Master Service Agreement (MSA)',
      icon: FileText,
      color: 'from-[#013E37] to-blue-600',
      duration: '3-5 years',
      description: 'Framework for ongoing services',
      features: ['Statement of Work', 'Payment terms', 'Liability limits', 'Termination rights']
    }
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-[#EEF7F5]0 text-[#013E37] hover:bg-[#EEF7F5]"
      >
        <Package className="h-4 w-4 mr-2" />
        Templates
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[1100px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Contract Template Library</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  Choose a template for 70% faster contract creation
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card 
                    key={template.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#C3DDD9]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Duration: {template.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-gray-700 uppercase">Key Features:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {template.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90`}
                        onClick={() => {
                          toast.success(`Template "${template.name}" applied!`);
                          setIsOpen(false);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
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

export function ContractRiskScoring({ contracts }: ContractEnhancementsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const contractsWithRisk = contracts
    .map(c => ({
      ...c,
      riskScore: calculateRiskScore(c),
      riskLevel: getRiskLevelBadge(calculateRiskScore(c))
    }))
    .sort((a, b) => b.riskScore - a.riskScore);

  const highRiskCount = contractsWithRisk.filter(c => c.riskScore >= 61).length;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-red-500 text-red-600 hover:bg-red-50"
      >
        <Shield className="h-4 w-4 mr-2" />
        Risk Scoring
        {highRiskCount > 0 && (
          <Badge className="ml-2 bg-red-500 text-white">{highRiskCount}</Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[900px] w-full max-h-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
          <DialogHeader className="bg-[#013E37] text-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Contract Risk Scoring</DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-1">
                  AI-powered risk analysis for all contracts
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            {contractsWithRisk.map((contract) => (
              <Card key={contract.id} className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRiskLevelColor(contract.riskScore)} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-xl">{contract.riskScore}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{contract.contractNumber}</h3>
                          <Badge className={contract.riskLevel.color}>
                            {contract.riskLevel.text}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Client</p>
                          <p className="font-medium text-gray-900">{contract.clientName}</p>
                          <p className="text-sm text-gray-600">{contract.company}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Value & Status</p>
                          <p className="font-semibold text-green-600">
                            Rp {(contract.value / 1000000).toFixed(0)} Jt
                          </p>
                          <Badge className="mt-1">{contract.status}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                          <p className="text-sm text-gray-900">{contract.endDate.toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-gray-600">{getDaysUntilExpiry(contract.endDate)} days left</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700">Risk Factors:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {contract.riskScore >= 61 && (
                            <>
                              <div className="flex items-center gap-1.5 text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>High value exposure</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Near expiry or expired</span>
                              </div>
                            </>
                          )}
                          {contract.status === 'pending' && (
                            <div className="flex items-center gap-1.5 text-orange-600">
                              <Clock className="h-3 w-3" />
                              <span>Pending signature</span>
                            </div>
                          )}
                          {contract.riskScore < 31 && (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Low risk profile</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success('Risk mitigation plan generated')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
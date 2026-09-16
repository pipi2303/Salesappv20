import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, DollarSign, Award, Users, Calendar, Clock, Trash2, Mail, Phone, MapPin, Briefcase, BarChart3, Brain, Lightbulb, TrendingDown, AlertCircle, CheckCircle, Zap, Star } from 'lucide-react';
import { TeamMember, Note, calculateGap, formatGap, formatTimestamp } from './sales-dialog-types';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Textarea } from '@/app/components/ui/textarea';

interface AccountManagerDetailDialogProps {
  selectedAccountManager: TeamMember | null;
  onClose: () => void;
  periodFilter: string;
  selectedPeriod: string;
  onPeriodFilterChange: (filter: string, period: string) => void;
  notes: Note[];
  newNote: string;
  onNewNoteChange: (value: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  aiTab: string;
  onAiTabChange: (tab: string) => void;
}

export function AccountManagerDetailDialog({
  selectedAccountManager,
  onClose,
  periodFilter,
  selectedPeriod,
  onPeriodFilterChange,
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onDeleteNote,
  aiTab,
  onAiTabChange
}: AccountManagerDetailDialogProps) {
  if (!selectedAccountManager) return null;

  const gap = calculateGap(selectedAccountManager.achievement, selectedAccountManager.target);
  const gapInfo = formatGap(gap);

  const performanceTrend = [
    { month: 'Jan', achievement: 650, target: 700, performance: 92.9 },
    { month: 'Feb', achievement: 720, target: 750, performance: 96.0 },
    { month: 'Mar', achievement: 680, target: 750, performance: 90.7 },
    { month: 'Apr', achievement: 780, target: 800, performance: 97.5 },
    { month: 'May', achievement: 740, target: 800, performance: 92.5 },
    { month: 'Jun', achievement: selectedAccountManager.achievement / 1000000, target: selectedAccountManager.target / 1000000, performance: selectedAccountManager.performance }
  ];

  const dealBreakdown = [
    { type: 'Closed Won', count: selectedAccountManager.totalDeals, value: selectedAccountManager.achievement, color: '#10b981' },
    { type: 'In Progress', count: 8, value: 450000000, color: '#f59e0b' },
    { type: 'Proposal Sent', count: 5, value: 280000000, color: '#6366f1' }
  ];

  const clientSegments = [
    { segment: 'Enterprise', deals: 8, revenue: 540000000, avgDeal: 67500000 },
    { segment: 'Mid-Market', deals: 12, revenue: 320000000, avgDeal: 26666667 },
    { segment: 'SMB', deals: 15, revenue: selectedAccountManager.achievement - 860000000, avgDeal: (selectedAccountManager.achievement - 860000000) / 15 }
  ];

  const keyAccounts = [
    { name: 'PT Telkom Indonesia', status: 'Active', revenue: 180000000, lastContact: '2 days ago', health: 'Excellent' },
    { name: 'Bank Mandiri', status: 'Active', revenue: 150000000, lastContact: '1 week ago', health: 'Good' },
    { name: 'Pertamina', status: 'Active', revenue: 120000000, lastContact: '3 days ago', health: 'Excellent' },
    { name: 'BCA', status: 'Negotiation', revenue: 95000000, lastContact: '1 day ago', health: 'Good' }
  ];

  return (
    <Dialog open={!!selectedAccountManager} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[calc(100%-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#013E37] to-[#025C52] flex items-center justify-center text-white font-bold text-xl">
              {selectedAccountManager.avatar}
            </div>
            <div>
              <div className="text-xl font-bold text-[#013E37]">{selectedAccountManager.name}</div>
              <div className="text-sm text-gray-600 font-normal">{selectedAccountManager.position}</div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed performance and insights for {selectedAccountManager.name}.
          </DialogDescription>
        </DialogHeader>

        {/* Contact Info */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-[#EEF7F5] to-white rounded-lg border border-[#013E37]/20">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-[#013E37]" />
            <span className="text-gray-700">{selectedAccountManager.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-[#013E37]" />
            <span className="text-gray-700">+62 812-3456-{selectedAccountManager.id.slice(-4)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-[#013E37]" />
            <span className="text-gray-700">{selectedAccountManager.totalDeals} Active Accounts</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Achievement</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedAccountManager.achievement)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Target</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedAccountManager.target)}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#EEF7F5]0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Performance</p>
                  <p className="text-xl font-bold text-[#013E37]">{selectedAccountManager.performance.toFixed(1)}%</p>
                </div>
                <Award className="h-8 w-8 text-[#EEF7F5]0" />
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${gapInfo.isPositive ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">{gapInfo.label}</p>
                  <p className={`text-xl font-bold ${gapInfo.isPositive ? 'text-green-600' : 'text-red-600'}`}>{gapInfo.value}</p>
                </div>
                {gapInfo.isPositive ? <TrendingUp className="h-8 w-8 text-green-500" /> : <TrendingDown className="h-8 w-8 text-red-500" />}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Filter */}
        <div className="flex gap-3 mb-6">
          <Select value={periodFilter} onValueChange={(value) => onPeriodFilterChange(value, selectedPeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={(value) => onPeriodFilterChange(periodFilter, value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jan - 26">Jan - 26</SelectItem>
              <SelectItem value="Feb - 26">Feb - 26</SelectItem>
              <SelectItem value="Mar - 26">Mar - 26</SelectItem>
              <SelectItem value="Apr - 26">Apr - 26</SelectItem>
              <SelectItem value="May - 26">May - 26</SelectItem>
              <SelectItem value="Jun - 26">Jun - 26</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="accounts">Key Accounts</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Trend (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="achievement" stroke="#10b981" strokeWidth={2} name="Achievement (M)" />
                    <Line yAxisId="left" type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Target (M)" />
                    <Line yAxisId="right" type="monotone" dataKey="performance" stroke="#f59e0b" strokeWidth={2} name="Performance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Deal Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dealBreakdown.map((deal) => (
                    <div key={deal.type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{deal.type}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(deal.value)}</div>
                          <div className="text-xs text-gray-500">{deal.count} deals</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${(deal.count / 20) * 100}%`, backgroundColor: deal.color }}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Segments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {clientSegments.map((segment) => (
                    <div key={segment.segment} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-[#013E37]">{segment.segment}</div>
                        <div className="text-xs text-gray-600">{segment.deals} deals • Avg: {formatCurrency(segment.avgDeal)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(segment.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Key Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#013E37]" />
                  Strategic Accounts Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {keyAccounts.map((account) => (
                  <div key={account.name} className="p-4 border border-gray-200 rounded-lg hover:border-[#013E37] transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#013E37] to-[#02796f] flex items-center justify-center text-white font-bold">
                          {account.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#013E37]">{account.name}</div>
                          <div className="text-xs text-gray-500">Last contact: {account.lastContact}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatCurrency(account.revenue)}</div>
                        <Badge variant={account.health === 'Excellent' ? 'default' : 'secondary'} className="mt-1">
                          {account.health}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {account.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Tabs value={aiTab} onValueChange={onAiTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4 mt-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Performance Analysis</h4>
                        <p className="text-sm text-gray-700">{selectedAccountManager.name} consistently maintains {selectedAccountManager.performance.toFixed(1)}% achievement rate with strong focus on {selectedAccountManager.position.includes('Enterprise') ? 'enterprise clients' : 'commercial accounts'}. Current portfolio shows {selectedAccountManager.totalDeals} active strategic accounts.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Key Strengths</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>High client retention rate (95%+)</li>
                          <li>Strong relationship with C-level executives</li>
                          <li>Excellent upselling and cross-selling capabilities</li>
                          <li>Consistent quarterly performance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Areas to Watch</h4>
                        <p className="text-sm text-gray-700">Monitor deal velocity in Q3 pipeline. Consider expanding into new industry verticals to diversify revenue streams and reduce concentration risk.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 mt-4">
                <Card className="border-l-4 border-l-[#EEF7F5]0">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-[#013E37] mt-1" />
                      <div>
                        <h4 className="font-semibold text-[#012D29] mb-2">Account Expansion Strategy</h4>
                        <p className="text-sm text-gray-700 mb-3">Focus on expanding wallet share with existing enterprise accounts. Identified 4 accounts with 40%+ expansion potential.</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>PT Telkom Indonesia - Additional modules opportunity (~Rp 80M)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Bank Mandiri - Enterprise upgrade path (~Rp 60M)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Quick Wins</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>Schedule QBR with top 3 accounts this month</li>
                          <li>Introduce new product features to existing clients</li>
                          <li>Coordinate with marketing for case study development</li>
                          <li>Identify referral opportunities from satisfied clients</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4 mt-4">
                <Card className="border-l-4 border-l-[#EEF7F5]0">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-[#013E37] mt-1" />
                      <div>
                        <h4 className="font-semibold text-[#012D29] mb-2">Q3 2026 Forecast</h4>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Predicted Achievement</p>
                            <p className="text-lg font-bold text-green-600">Rp 980M - 1.1B</p>
                            <p className="text-xs text-gray-500">Confidence: 87%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Expected Deals</p>
                            <p className="text-lg font-bold text-blue-600">14-16 accounts</p>
                            <p className="text-xs text-gray-500">Based on pipeline</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-pink-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-pink-900 mb-2">Growth Trajectory</h4>
                        <p className="text-sm text-gray-700">Based on historical performance and current pipeline health, projected to reach 105% of annual target. Key driver: strong enterprise account retention and expansion.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note about this account manager..."
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button onClick={onAddNote} className="bg-[#013E37] hover:bg-[#025C52]">
                    Add Note
                  </Button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {notes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No notes yet. Add your first note above.</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-500">{formatTimestamp(note.timestamp)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteNote(note.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
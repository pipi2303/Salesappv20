import React from 'react';
import { X, BarChart3, DollarSign, Building2, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { RetailMonthlyBreakdown } from '@/app/components/RetailMonthlyBreakdown';
import { formatCurrency } from '@/utils/formatters';
import { TeamMember } from './sales-dialog-types';

interface RevenueBreakdownDialogProps {
  selectedMember: TeamMember | null;
  onClose: () => void;
  tab: 'hospital' | 'retail' | 'intradoc';
  onTabChange: (tab: 'hospital' | 'retail' | 'intradoc') => void;
}

export function RevenueBreakdownDialog({
  selectedMember,
  onClose,
  tab,
  onTabChange
}: RevenueBreakdownDialogProps) {
  if (!selectedMember) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div 
          className="sticky top-0 px-6 py-5 flex items-center justify-between z-10 shadow-lg"
          style={{
            background: 'linear-gradient(to right, #01544e, #02665c, #01544e)',
            borderTopLeftRadius: '0.75rem',
            borderTopRightRadius: '0.75rem'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <BarChart3 className="h-6 w-6" style={{ color: 'white' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'white' }}>
                Revenue Breakdown - {selectedMember.name}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#e9d5ff' }}>
                Year to Date (YTD) 2025 - Target vs Actual Performance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-all duration-200"
            style={{ color: 'white' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Total Revenue YTD</h3>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(selectedMember.achievement)}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Additional cards could be here */}
          </div>

          <Tabs value={tab} onValueChange={(v: any) => onTabChange(v)} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full h-12 p-1 bg-gray-100 rounded-xl">
              <TabsTrigger value="hospital" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Hospital</TabsTrigger>
              <TabsTrigger value="retail" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm">Retail</TabsTrigger>
              <TabsTrigger value="intradoc" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">IntraDoc</TabsTrigger>
            </TabsList>

            <TabsContent value="hospital">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-blue-600">
                     <Building2 className="h-5 w-5" />
                     Rumah Sakit Breakdown
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-gray-600">Hospital segment performance details...</p>
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="retail">
              <RetailMonthlyBreakdown 
                achievement={selectedMember.achievement}
                target={selectedMember.target}
              />
            </TabsContent>

            <TabsContent value="intradoc">
              <RetailMonthlyBreakdown 
                achievement={selectedMember.achievement}
                target={selectedMember.target}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

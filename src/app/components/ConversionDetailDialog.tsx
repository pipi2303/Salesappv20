import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  Zap,
  X,
  Building2,
  Stethoscope,
  Package,
  TrendingUp,
  TrendingDown,
  Users,
  Target
} from 'lucide-react';

interface MonthlyConversionData {
  month: string;
  target: number;
  actual: number;
  leads: number;
  qualified: number;
  closed: number;
  progress: number;
}

interface ConversionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  year?: number;
}

export function ConversionDetailDialog({ 
  open, 
  onOpenChange, 
  employeeName,
  year = 2025 
}: ConversionDetailDialogProps) {
  
  // Mock Data - Hospital Segment (Monthly)
  const hospitalConversion: MonthlyConversionData[] = [
    { month: 'Jan', target: 25, actual: 26.5, leads: 12, qualified: 6, closed: 3, progress: 106 },
    { month: 'Feb', target: 25, actual: 22.2, leads: 9, qualified: 4, closed: 2, progress: 89 },
    { month: 'Mar', target: 26, actual: 26.7, leads: 15, qualified: 7, closed: 4, progress: 103 },
    { month: 'Apr', target: 27, actual: 29.4, leads: 17, qualified: 9, closed: 5, progress: 109 },
    { month: 'May', target: 26, actual: 25.0, leads: 12, qualified: 6, closed: 3, progress: 96 },
    { month: 'Jun', target: 27, actual: 23.1, leads: 13, qualified: 5, closed: 3, progress: 86 },
    { month: 'Jul', target: 26, actual: 20.0, leads: 10, qualified: 4, closed: 2, progress: 77 },
    { month: 'Aug', target: 27, actual: 21.4, leads: 14, qualified: 5, closed: 3, progress: 79 },
    { month: 'Sep', target: 26, actual: 20.0, leads: 10, qualified: 4, closed: 2, progress: 77 },
    { month: 'Oct', target: 28, actual: 16.7, leads: 12, qualified: 3, closed: 2, progress: 60 },
    { month: 'Nov', target: 27, actual: 12.5, leads: 8, qualified: 2, closed: 1, progress: 46 },
    { month: 'Dec', target: 28, actual: 10.0, leads: 10, qualified: 2, closed: 1, progress: 36 }
  ];

  // Mock Data - Retail Segment (Monthly)
  const retailConversion: MonthlyConversionData[] = [
    { month: 'Jan', target: 30, actual: 31.6, leads: 19, qualified: 10, closed: 6, progress: 105 },
    { month: 'Feb', target: 29, actual: 28.6, leads: 14, qualified: 7, closed: 4, progress: 99 },
    { month: 'Mar', target: 30, actual: 29.4, leads: 17, qualified: 9, closed: 5, progress: 98 },
    { month: 'Apr', target: 32, actual: 33.3, leads: 21, qualified: 12, closed: 7, progress: 104 },
    { month: 'May', target: 30, actual: 29.4, leads: 17, qualified: 9, closed: 5, progress: 98 },
    { month: 'Jun', target: 32, actual: 27.8, leads: 18, qualified: 8, closed: 5, progress: 87 },
    { month: 'Jul', target: 30, actual: 25.0, leads: 16, qualified: 7, closed: 4, progress: 83 },
    { month: 'Aug', target: 32, actual: 26.3, leads: 19, qualified: 8, closed: 5, progress: 82 },
    { month: 'Sep', target: 30, actual: 25.0, leads: 16, qualified: 7, closed: 4, progress: 83 },
    { month: 'Oct', target: 33, actual: 20.0, leads: 15, qualified: 5, closed: 3, progress: 61 },
    { month: 'Nov', target: 31, actual: 16.7, leads: 12, qualified: 3, closed: 2, progress: 54 },
    { month: 'Dec', target: 33, actual: 13.3, leads: 15, qualified: 3, closed: 2, progress: 40 }
  ];

  // Mock Data - IntraDoc Segment (Monthly)
  const intradocConversion: MonthlyConversionData[] = [
    { month: 'Jan', target: 28, actual: 31.3, leads: 16, qualified: 9, closed: 5, progress: 112 },
    { month: 'Feb', target: 27, actual: 27.3, leads: 11, qualified: 5, closed: 3, progress: 101 },
    { month: 'Mar', target: 28, actual: 28.6, leads: 14, qualified: 7, closed: 4, progress: 102 },
    { month: 'Apr', target: 30, actual: 31.6, leads: 19, qualified: 11, closed: 6, progress: 105 },
    { month: 'May', target: 28, actual: 28.6, leads: 14, qualified: 7, closed: 4, progress: 102 },
    { month: 'Jun', target: 30, actual: 26.7, leads: 15, qualified: 7, closed: 4, progress: 89 },
    { month: 'Jul', target: 28, actual: 23.1, leads: 13, qualified: 5, closed: 3, progress: 83 },
    { month: 'Aug', target: 30, actual: 25.0, leads: 16, qualified: 7, closed: 4, progress: 83 },
    { month: 'Sep', target: 28, actual: 23.1, leads: 13, qualified: 5, closed: 3, progress: 83 },
    { month: 'Oct', target: 31, actual: 18.2, leads: 11, qualified: 3, closed: 2, progress: 59 },
    { month: 'Nov', target: 29, actual: 16.7, leads: 12, qualified: 3, closed: 2, progress: 58 },
    { month: 'Dec', target: 31, actual: 11.1, leads: 9, qualified: 2, closed: 1, progress: 36 }
  ];

  // Calculate averages
  const hospitalAvg = {
    target: hospitalConversion.reduce((sum, m) => sum + m.target, 0) / hospitalConversion.length,
    actual: hospitalConversion.reduce((sum, m) => sum + m.actual, 0) / hospitalConversion.length
  };
  hospitalAvg.progress = (hospitalAvg.actual / hospitalAvg.target) * 100;

  const retailAvg = {
    target: retailConversion.reduce((sum, m) => sum + m.target, 0) / retailConversion.length,
    actual: retailConversion.reduce((sum, m) => sum + m.actual, 0) / retailConversion.length
  };
  retailAvg.progress = (retailAvg.actual / retailAvg.target) * 100;

  const intradocAvg = {
    target: intradocConversion.reduce((sum, m) => sum + m.target, 0) / intradocConversion.length,
    actual: intradocConversion.reduce((sum, m) => sum + m.actual, 0) / intradocConversion.length
  };
  intradocAvg.progress = (intradocAvg.actual / intradocAvg.target) * 100;

  const overallAvg = {
    target: (hospitalAvg.target + retailAvg.target + intradocAvg.target) / 3,
    actual: (hospitalAvg.actual + retailAvg.actual + intradocAvg.actual) / 3
  };
  overallAvg.progress = (overallAvg.actual / overallAvg.target) * 100;

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'border-green-500 bg-green-50';
    if (progress >= 90) return 'border-blue-500 bg-blue-50';
    if (progress >= 70) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 100) return <Badge className="bg-green-600 text-white">Excellent</Badge>;
    if (progress >= 90) return <Badge className="bg-blue-600 text-white">Good</Badge>;
    if (progress >= 70) return <Badge className="bg-yellow-600 text-white">Fair</Badge>;
    return <Badge variant="destructive">Needs Work</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[900px] max-h-[85vh] overflow-y-auto p-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Conversion Rate Breakdown - {employeeName}</DialogTitle>
          <DialogDescription>
            Year to Date (YTD) {year} - Conversion funnel performance by segment for {employeeName}
          </DialogDescription>
        </VisuallyHidden>

        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 pt-6 px-6 border-b border-gray-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Zap className="w-6 h-6 text-green-600" />
                Conversion Rate Breakdown - {employeeName}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Year to Date (YTD) {year} - Conversion funnel performance by segment
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="ml-4 rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Grand Total Summary - Compact 3 cards */}
          <div className="grid grid-cols-3 gap-3 mb-4 mt-4">
            {/* Overall Average */}
            <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="text-xs font-semibold text-gray-600 mb-1">Overall Average YTD</div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {overallAvg.actual.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {overallAvg.target.toFixed(1)}%</div>
                  <div className={`font-semibold ${overallAvg.actual >= overallAvg.target ? 'text-green-600' : 'text-red-600'}`}>
                    Gap: {(overallAvg.actual - overallAvg.target).toFixed(1)}%
                  </div>
                </div>
                <Progress value={overallAvg.progress} className="h-1.5 mb-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{overallAvg.progress.toFixed(1)}%</span>
                  {getProgressBadge(overallAvg.progress)}
                </div>
              </CardContent>
            </Card>

            {/* Hospital Segment */}
            <Card className="border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <div className="text-xs font-semibold text-gray-600">Hospital Average</div>
                </div>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  {hospitalAvg.actual.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {hospitalAvg.target.toFixed(1)}%</div>
                  <div className={`font-semibold ${hospitalAvg.actual >= hospitalAvg.target ? 'text-green-600' : 'text-red-600'}`}>
                    Gap: {(hospitalAvg.actual - hospitalAvg.target).toFixed(1)}%
                  </div>
                </div>
                <Progress value={hospitalAvg.progress} className="h-1.5 mb-1" />
                <div className="text-xs font-semibold">{hospitalAvg.progress.toFixed(1)}%</div>
              </CardContent>
            </Card>

            {/* Retail Segment */}
            <Card className="border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  <div className="text-xs font-semibold text-gray-600">Retail Average</div>
                </div>
                <div className="text-xl font-bold text-emerald-600 mb-1">
                  {retailAvg.actual.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {retailAvg.target.toFixed(1)}%</div>
                  <div className={`font-semibold ${retailAvg.actual >= retailAvg.target ? 'text-green-600' : 'text-red-600'}`}>
                    Gap: {(retailAvg.actual - retailAvg.target).toFixed(1)}%
                  </div>
                </div>
                <Progress value={retailAvg.progress} className="h-1.5 mb-1" />
                <div className="text-xs font-semibold">{retailAvg.progress.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Breakdown Tabs */}
          <Tabs defaultValue="hospital" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl mb-4">
              <TabsTrigger value="hospital" className="gap-2 text-sm">
                <Building2 className="w-4 h-4" />
                Hospital Segment
              </TabsTrigger>
              <TabsTrigger value="retail" className="gap-2 text-sm">
                <Stethoscope className="w-4 h-4" />
                IntraClinic
              </TabsTrigger>
              <TabsTrigger value="intradoc" className="gap-2 text-sm">
                <Package className="w-4 h-4" />
                IntraDoc
              </TabsTrigger>
            </TabsList>

            {/* Hospital Monthly View */}
            <TabsContent value="hospital" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Hospital Segment - Monthly Conversion {year}
                </h3>
                
                {/* Monthly Cards - 4 columns */}
                <div className="grid grid-cols-4 gap-2">
                  {hospitalConversion.map((month, index) => {
                    const gap = month.actual - month.target;
                    const isPositive = gap >= 0;
                    
                    return (
                      <Card key={index} className={`border ${getProgressColor(month.progress)}`}>
                        <CardContent className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{month.month}</div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-indigo-600">
                              {month.actual.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">
                              Target: {month.target}%
                            </div>
                            
                            {/* Funnel Stats */}
                            <div className="text-[10px] text-gray-500 space-y-0.5 pt-1 border-t">
                              <div className="flex items-center justify-between">
                                <span>Leads:</span>
                                <span className="font-semibold">{month.leads}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Qualified:</span>
                                <span className="font-semibold">{month.qualified}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Closed:</span>
                                <span className="font-semibold text-green-600">{month.closed}</span>
                              </div>
                            </div>
                            
                            <Progress value={month.progress} className="h-1.5" />
                            <div className="text-xs font-semibold text-center">{month.progress.toFixed(0)}%</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Retail Monthly View */}
            <TabsContent value="retail" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  IntraClinic - Monthly Conversion {year}
                </h3>
                
                {/* Monthly Cards - 4 columns */}
                <div className="grid grid-cols-4 gap-2">
                  {retailConversion.map((month, index) => {
                    const gap = month.actual - month.target;
                    const isPositive = gap >= 0;
                    
                    return (
                      <Card key={index} className={`border ${getProgressColor(month.progress)}`}>
                        <CardContent className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{month.month}</div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-emerald-600">
                              {month.actual.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">
                              Target: {month.target}%
                            </div>
                            
                            {/* Funnel Stats */}
                            <div className="text-[10px] text-gray-500 space-y-0.5 pt-1 border-t">
                              <div className="flex items-center justify-between">
                                <span>Leads:</span>
                                <span className="font-semibold">{month.leads}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Qualified:</span>
                                <span className="font-semibold">{month.qualified}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Closed:</span>
                                <span className="font-semibold text-green-600">{month.closed}</span>
                              </div>
                            </div>
                            
                            <Progress value={month.progress} className="h-1.5" />
                            <div className="text-xs font-semibold text-center">{month.progress.toFixed(0)}%</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* IntraDoc Monthly View */}
            <TabsContent value="intradoc" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-600" />
                  IntraDoc - Monthly Conversion {year}
                </h3>
                
                {/* Monthly Cards - 4 columns */}
                <div className="grid grid-cols-4 gap-2">
                  {intradocConversion.map((month, index) => {
                    const gap = month.actual - month.target;
                    const isPositive = gap >= 0;
                    
                    return (
                      <Card key={index} className={`border ${getProgressColor(month.progress)}`}>
                        <CardContent className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{month.month}</div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-gray-600">
                              {month.actual.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">
                              Target: {month.target}%
                            </div>
                            
                            {/* Funnel Stats */}
                            <div className="text-[10px] text-gray-500 space-y-0.5 pt-1 border-t">
                              <div className="flex items-center justify-between">
                                <span>Leads:</span>
                                <span className="font-semibold">{month.leads}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Qualified:</span>
                                <span className="font-semibold">{month.qualified}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Closed:</span>
                                <span className="font-semibold text-green-600">{month.closed}</span>
                              </div>
                            </div>
                            
                            <Progress value={month.progress} className="h-1.5" />
                            <div className="text-xs font-semibold text-center">{month.progress.toFixed(0)}%</div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

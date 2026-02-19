import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  DollarSign,
  Building2,
  Stethoscope,
  CheckCircle2,
  X,
  Calendar,
  User,
  TrendingUp,
  Clock
} from 'lucide-react';

interface QuarterlyData {
  quarter: string;
  period: string;
  target: number;
  actual: number;
  progress: number;
}

interface MonthlyData {
  month: string;
  target: number;
  actual: number;
  progress: number;
}

interface RevenueDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  year: number;
}

export function RevenueDetailDialog({ 
  open, 
  onOpenChange, 
  employeeName,
  year = 2025 
}: RevenueDetailDialogProps) {
  // State for daily calendar dialog
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [showDailyDialog, setShowDailyDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Mock Data - Rumah Sakit (Quarterly)
  const hospitalQuarterly: QuarterlyData[] = [
    { quarter: 'Q1 2025', period: 'Jan-Mar', target: 250000000, actual: 245000000, progress: 98 },
    { quarter: 'Q2 2025', period: 'Apr-Jun', target: 300000000, actual: 285000000, progress: 95 },
    { quarter: 'Q3 2025', period: 'Jul-Sep', target: 280000000, actual: 210000000, progress: 75 },
    { quarter: 'Q4 2025', period: 'Oct-Dec', target: 320000000, actual: 180000000, progress: 56 }
  ];

  // Mock Data - Retail (Monthly)
  const retailMonthly: MonthlyData[] = [
    { month: 'Jan', target: 40000000, actual: 42000000, progress: 105 },
    { month: 'Feb', target: 38000000, actual: 35000000, progress: 92 },
    { month: 'Mar', target: 42000000, actual: 40000000, progress: 95 },
    { month: 'Apr', target: 45000000, actual: 48000000, progress: 107 },
    { month: 'May', target: 43000000, actual: 41000000, progress: 95 },
    { month: 'Jun', target: 46000000, actual: 44000000, progress: 96 },
    { month: 'Jul', target: 44000000, actual: 38000000, progress: 86 },
    { month: 'Aug', target: 47000000, actual: 42000000, progress: 89 },
    { month: 'Sep', target: 45000000, actual: 40000000, progress: 89 },
    { month: 'Oct', target: 48000000, actual: 35000000, progress: 73 },
    { month: 'Nov', target: 46000000, actual: 30000000, progress: 65 },
    { month: 'Dec', target: 50000000, actual: 25000000, progress: 50 }
  ];

  // Mock Data - IntraDoc (Monthly)
  const intradocMonthly: MonthlyData[] = [
    { month: 'Jan', target: 35000000, actual: 38000000, progress: 109 },
    { month: 'Feb', target: 33000000, actual: 32000000, progress: 97 },
    { month: 'Mar', target: 37000000, actual: 36000000, progress: 97 },
    { month: 'Apr', target: 40000000, actual: 43000000, progress: 108 },
    { month: 'May', target: 38000000, actual: 37000000, progress: 97 },
    { month: 'Jun', target: 41000000, actual: 40000000, progress: 98 },
    { month: 'Jul', target: 39000000, actual: 34000000, progress: 87 },
    { month: 'Aug', target: 42000000, actual: 38000000, progress: 90 },
    { month: 'Sep', target: 40000000, actual: 36000000, progress: 90 },
    { month: 'Oct', target: 43000000, actual: 32000000, progress: 74 },
    { month: 'Nov', target: 41000000, actual: 28000000, progress: 68 },
    { month: 'Dec', target: 45000000, actual: 23000000, progress: 51 }
  ];

  // Calculate totals
  const hospitalTotal = {
    target: hospitalQuarterly.reduce((sum, q) => sum + q.target, 0),
    actual: hospitalQuarterly.reduce((sum, q) => sum + q.actual, 0)
  };
  hospitalTotal.progress = (hospitalTotal.actual / hospitalTotal.target) * 100;

  const retailTotal = {
    target: retailMonthly.reduce((sum, m) => sum + m.target, 0),
    actual: retailMonthly.reduce((sum, m) => sum + m.actual, 0)
  };
  retailTotal.progress = (retailTotal.actual / retailTotal.target) * 100;

  const intradocTotal = {
    target: intradocMonthly.reduce((sum, m) => sum + m.target, 0),
    actual: intradocMonthly.reduce((sum, m) => sum + m.actual, 0)
  };
  intradocTotal.progress = (intradocTotal.actual / intradocTotal.target) * 100;

  const grandTotal = {
    target: hospitalTotal.target + retailTotal.target + intradocTotal.target,
    actual: hospitalTotal.actual + retailTotal.actual + intradocTotal.actual
  };
  grandTotal.progress = (grandTotal.actual / grandTotal.target) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to calculate gap between actual and target
  const calculateGap = (actual: number, target: number): number => {
    return actual - target;
  };

  // Helper function to format gap display (Short/Surplus)
  const formatGap = (gap: number): { label: string; value: string; isPositive: boolean } => {
    const absGap = Math.abs(gap);
    const formattedValue = formatCurrency(absGap);
    
    if (gap < 0) {
      return {
        label: 'Short',
        value: formattedValue,
        isPositive: false
      };
    } else {
      return {
        label: 'Surplus',
        value: formattedValue,
        isPositive: true
      };
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'border-green-500 bg-green-50';
    if (progress >= 90) return 'border-blue-500 bg-blue-50';
    if (progress >= 70) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 100) return <Badge className="bg-green-600 text-white">Achieved</Badge>;
    if (progress >= 90) return <Badge className="bg-blue-600 text-white">On Track</Badge>;
    if (progress >= 70) return <Badge className="bg-yellow-600 text-white">Behind</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  // Helper function to get month number from month string
  const getMonthNumber = (monthStr: string) => {
    const months: Record<string, number> = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthStr] || 1;
  };

  // Generate daily data for selected month
  const getDailyData = (month: string, monthNum: number) => {
    const daysInMonth = new Date(2025, monthNum, 0).getDate();
    const dailyData = [];
    
    const clients = [
      'RS Siloam Jakarta',
      'RS Hermina Bekasi',
      'RS Harapan Kita',
      'Klinik Pratama Sehat',
      'RS Premiere Bintaro',
      'RS Mitra Keluarga',
      'Klinik Kimia Farma',
      'RS Pondok Indah',
    ];

    const doctors = [
      'Dr. Ahmad Hidayat, Sp.PD',
      'Dr. Siti Nurhaliza, Sp.A',
      'Dr. Budi Santoso, Sp.B',
      'Dr. Rina Wijaya, Sp.OG',
      'Dr. Hendra Kusuma, Sp.JP',
      'Dr. Maya Sari, Sp.M',
      'Dr. Rudi Hartono, Sp.THT',
      'Dr. Lisa Amelia, Sp.KK',
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const hasVisit = Math.random() > 0.3; // 70% chance ada visit
      if (hasVisit) {
        const numVisits = Math.floor(Math.random() * 3) + 1; // 1-3 visits per day
        for (let v = 0; v < numVisits; v++) {
          const clientIndex = Math.floor(Math.random() * clients.length);
          const doctorIndex = Math.floor(Math.random() * doctors.length);
          const revenue = (Math.random() * 50 + 10) * 1000000; // 10M-60M
          
          dailyData.push({
            day,
            date: `${day.toString().padStart(2, '0')} ${month} 2025`,
            client: clients[clientIndex],
            doctor: doctors[doctorIndex],
            revenue,
            time: `${8 + Math.floor(Math.random() * 8)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
            status: Math.random() > 0.2 ? 'Completed' : 'Scheduled',
          });
        }
      }
    }
    
    return dailyData.sort((a, b) => a.day - b.day);
  };

  // Handler for month click
  const handleMonthClick = (month: MonthlyData) => {
    const monthNum = getMonthNumber(month.month);
    setSelectedMonth({
      ...month,
      monthNum,
      fullMonth: month.month
    });
    setShowDailyDialog(true);
  };

  const formatNumber = (num: number) => {
    return parseInt(num.toFixed(0)).toLocaleString('id-ID');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[800px] max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 pt-6 px-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                  Revenue Breakdown - {employeeName}
                </DialogTitle>
                <DialogDescription>
                  Year to Date (YTD) {year} - Target vs Actual Performance
                </DialogDescription>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-4 rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6">
          {/* Grand Total Summary - Compact 3 cards */}
          <div className="grid grid-cols-3 gap-3 mb-4 mt-4">
            {/* Total Revenue */}
            <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <div className="text-xs font-semibold text-gray-600 mb-1">Total Revenue YTD</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(grandTotal.actual)}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {formatCurrency(grandTotal.target)}</div>
                  {(() => {
                    const gap = calculateGap(grandTotal.actual, grandTotal.target);
                    const { label, value, isPositive } = formatGap(gap);
                    return (
                      <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {label}: {value}
                      </div>
                    );
                  })()}
                </div>
                <Progress value={grandTotal.progress} className="h-1.5 mb-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{grandTotal.progress.toFixed(1)}%</span>
                  {getProgressBadge(grandTotal.progress)}
                </div>
              </CardContent>
            </Card>

            {/* Hospital Segment */}
            <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <div className="text-xs font-semibold text-gray-600">Hospital Segment</div>
                </div>
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {formatCurrency(hospitalTotal.actual)}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {formatCurrency(hospitalTotal.target)}</div>
                  {(() => {
                    const gap = calculateGap(hospitalTotal.actual, hospitalTotal.target);
                    const { label, value, isPositive } = formatGap(gap);
                    return (
                      <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {label}: {value}
                      </div>
                    );
                  })()}
                </div>
                <Progress value={hospitalTotal.progress} className="h-1.5 mb-1" />
                <div className="text-xs font-semibold">{hospitalTotal.progress.toFixed(1)}%</div>
              </CardContent>
            </Card>

            {/* Retail Segment */}
            <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-green-600" />
                  <div className="text-xs font-semibold text-gray-600">Retail Segment</div>
                </div>
                <div className="text-xl font-bold text-green-600 mb-1">
                  {formatCurrency(retailTotal.actual)}
                </div>
                <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                  <div>Target: {formatCurrency(retailTotal.target)}</div>
                  {(() => {
                    const gap = calculateGap(retailTotal.actual, retailTotal.target);
                    const { label, value, isPositive } = formatGap(gap);
                    return (
                      <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {label}: {value}
                      </div>
                    );
                  })()}
                </div>
                <Progress value={retailTotal.progress} className="h-1.5 mb-1" />
                <div className="text-xs font-semibold">{retailTotal.progress.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Breakdown Tabs */}
          <Tabs defaultValue="hospital" className="w-full">
            <TabsList className="h-14 bg-gray-100/50 p-1 flex overflow-x-auto no-scrollbar justify-start w-full">
              <TabsTrigger value="hospital" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 flex-1">
                <span className="font-bold text-xs">Rumah Sakit</span>
                <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">QUARTERLY</span>
              </TabsTrigger>
              <TabsTrigger value="retail" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 flex-1">
                <span className="font-bold text-xs">IntraClinic</span>
                <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">MONTHLY</span>
              </TabsTrigger>
              <TabsTrigger value="intradoc" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 flex-1">
                <span className="font-bold text-xs">IntraDoc</span>
                <span className="text-[8px] uppercase tracking-wider font-semibold opacity-60">MONTHLY</span>
              </TabsTrigger>
            </TabsList>

            {/* Hospital Quarterly View */}
            <TabsContent value="hospital" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Rumah Sakit - Quarterly Breakdown {year}
                </h3>
                
                {/* Quarterly Cards - 2 columns */}
                <div className="grid grid-cols-2 gap-3">
                  {hospitalQuarterly.map((quarter, index) => (
                    <Card key={index} className={`border-2 ${getProgressColor(quarter.progress)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">{quarter.quarter}</div>
                            <div className="text-xs text-gray-500">{quarter.period}</div>
                          </div>
                          {quarter.progress >= 90 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-gray-600">Actual</div>
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(quarter.actual)}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <div>Target: {formatCurrency(quarter.target)}</div>
                            {(() => {
                              const gap = calculateGap(quarter.actual, quarter.target);
                              const { label, value, isPositive } = formatGap(gap);
                              return (
                                <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {label}: {value}
                                </div>
                              );
                            })()}
                          </div>

                          <Progress value={quarter.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{quarter.progress.toFixed(0)}%</span>
                            {getProgressBadge(quarter.progress)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Retail Monthly View */}
            <TabsContent value="retail" className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  IntraClinic - Monthly Breakdown {year}
                </h3>
                
                {/* Monthly Cards - 4 columns, more compact */}
                <div className="grid grid-cols-4 gap-2">
                  {retailMonthly.map((month, index) => {
                    const gap = month.actual - month.target;
                    const gapInMillions = (Math.abs(gap) / 1000000).toFixed(0);
                    const isPositive = gap >= 0;
                    
                    return (
                      <Card key={index} className={`border ${getProgressColor(month.progress)}`}>
                        <CardContent className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{month.month}</div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-green-600">
                              {(month.actual / 1000000).toFixed(0)}M
                            </div>
                            <div className="text-xs text-gray-600">
                              of {(month.target / 1000000).toFixed(0)}M
                            </div>
                            <div className={`text-xs font-semibold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                              {isPositive ? 'Surplus' : 'Short'}: {gapInMillions}M
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
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  IntraDoc - Monthly Breakdown {year}
                </h3>
                
                {/* Monthly Cards - 4 columns, more compact */}
                <div className="grid grid-cols-4 gap-2">
                  {intradocMonthly.map((month, index) => {
                    const gap = month.actual - month.target;
                    const gapInMillions = (Math.abs(gap) / 1000000).toFixed(0);
                    const isPositive = gap >= 0;
                    
                    return (
                      <Card 
                        key={index} 
                        className={`border ${getProgressColor(month.progress)} cursor-pointer hover:shadow-lg transition-all`}
                        onClick={() => handleMonthClick(month)}
                      >
                        <CardContent className="p-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">{month.month}</div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-green-600">
                              {(month.actual / 1000000).toFixed(0)}M
                            </div>
                            <div className="text-xs text-gray-600">
                              of {(month.target / 1000000).toFixed(0)}M
                            </div>
                            <div className={`text-xs font-semibold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                              {isPositive ? 'Surplus' : 'Short'}: {gapInMillions}M
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

      {/* Daily Calendar Dialog */}
      {selectedMonth && (
        <Dialog open={showDailyDialog} onOpenChange={setShowDailyDialog}>
          <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0 pb-3">
              <DialogTitle className="flex items-center gap-3 text-2xl text-[#01544e]">
                <Calendar className="h-7 w-7" />
                Daily Breakdown - {selectedMonth.fullMonth} 2025
              </DialogTitle>
              <DialogDescription>
                Detailed visit records by day with client and doctor information
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Top Summary Stats - 4 columns */}
              <div className="grid grid-cols-4 gap-3 p-5 bg-gradient-to-r from-[#01544e] to-[#023d39] rounded-xl text-white flex-shrink-0">
                <div>
                  <p className="text-xs opacity-90 mb-1">Total Actual</p>
                  <p className="text-3xl font-bold">{(selectedMonth.actual / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-xs opacity-90 mb-1">Target</p>
                  <p className="text-3xl font-bold">{(selectedMonth.target / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-xs opacity-90 mb-1">Achievement</p>
                  <p className="text-3xl font-bold">{selectedMonth.progress.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs opacity-90 mb-1">
                    {selectedMonth.actual >= selectedMonth.target ? 'Surplus' : 'Short'}
                  </p>
                  <p className="text-3xl font-bold">
                    {Math.abs((selectedMonth.actual - selectedMonth.target) / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>

              {/* 2 Column Layout: Calendar (Left) + Activities (Right) */}
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT COLUMN - Calendar */}
                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Calendar className="h-4 w-4 text-[#01544e]" />
                    <h3 className="font-semibold text-base text-[#01544e]">Calendar</h3>
                  </div>

                  <div className="border-2 border-[#01544e] rounded-xl p-3 bg-white flex-1 flex flex-col">
                    {/* Calendar Header - Month/Year */}
                    <div className="text-center mb-3 pb-2 border-b flex-shrink-0">
                      <h4 className="text-base font-bold text-[#01544e]">{selectedMonth.fullMonth} 2025</h4>
                    </div>

                    {/* Calendar Grid */}
                    <div className="space-y-1.5 flex-1">
                      {/* Weekday Headers */}
                      <div className="grid grid-cols-7 gap-0.5 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="text-center text-[10px] font-bold text-gray-600 py-0.5">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days Grid */}
                      <div className="grid grid-cols-7 gap-0.5">
                        {(() => {
                          const monthNum = selectedMonth.monthNum;
                          const year = 2025;
                          const firstDay = new Date(year, monthNum - 1, 1).getDay();
                          const daysInMonth = new Date(year, monthNum, 0).getDate();
                          const dailyData = getDailyData(selectedMonth.fullMonth, monthNum);
                          
                          // Group visits by day
                          const visitsByDay: Record<number, any[]> = {};
                          dailyData.forEach(visit => {
                            if (!visitsByDay[visit.day]) {
                              visitsByDay[visit.day] = [];
                            }
                            visitsByDay[visit.day].push(visit);
                          });

                          const days = [];
                          
                          // Empty cells before month starts
                          for (let i = 0; i < firstDay; i++) {
                            days.push(
                              <div key={`empty-${i}`} className="aspect-square"></div>
                            );
                          }
                          
                          // Render each day
                          for (let day = 1; day <= daysInMonth; day++) {
                            const hasVisit = visitsByDay[day] && visitsByDay[day].length > 0;
                            const isSelected = selectedDate === day;
                            const visitCount = visitsByDay[day]?.length || 0;
                            
                            days.push(
                              <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`aspect-square rounded-md text-[10px] font-semibold transition-all relative flex items-center justify-center
                                  ${isSelected 
                                    ? 'bg-[#01544e] text-white shadow-lg scale-110 z-10' 
                                    : hasVisit 
                                      ? 'bg-green-100 text-[#01544e] hover:bg-green-200' 
                                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                  }
                                `}
                              >
                                <span className="relative z-10">{day}</span>
                                
                                {/* Visit indicator dot (bottom) */}
                                {hasVisit && !isSelected && (
                                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-[#01544e] rounded-full"></div>
                                )}
                                
                                {/* Visit count badge (top-right) */}
                                {visitCount > 1 && (
                                  <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] rounded-full w-3 h-3 flex items-center justify-center font-bold">
                                    {visitCount}
                                  </div>
                                )}
                              </button>
                            );
                          }
                          
                          return days;
                        })()}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-3 pt-3 border-t space-y-1.5 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <div className="w-4 h-4 bg-green-100 rounded border border-green-300"></div>
                        <span className="text-gray-700 font-medium">Has Visit</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <div className="w-4 h-4 bg-[#01544e] rounded"></div>
                        <span className="text-gray-700 font-medium">Selected</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Activities */}
                <div className="space-y-3 flex flex-col min-h-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-[#01544e]" />
                    <h3 className="font-semibold text-base text-[#01544e]">
                      {selectedDate ? `Activities on ${selectedDate} ${selectedMonth.fullMonth}` : 'Select a date'}
                    </h3>
                  </div>

                  {/* Activities List - Scrollable */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
                    {(() => {
                      const dailyData = getDailyData(selectedMonth.fullMonth, selectedMonth.monthNum);
                      const selectedDayVisits = selectedDate 
                        ? dailyData.filter(v => v.day === selectedDate)
                        : [];

                      // Empty state
                      if (selectedDayVisits.length === 0) {
                        return (
                          <div className="text-center py-20 text-gray-400">
                            <Calendar className="h-20 w-20 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">
                              {selectedDate 
                                ? `No activities on ${selectedDate} ${selectedMonth.fullMonth}` 
                                : 'Select a date to view activities'
                              }
                            </p>
                          </div>
                        );
                      }

                      // Show activities
                      return (
                        <>
                          {selectedDayVisits.map((visit, idx) => (
                            <Card 
                              key={idx} 
                              className="hover:shadow-md transition-shadow border-l-4 border-l-[#01544e] bg-white"
                            >
                              <CardContent className="p-2">
                                <div className="space-y-1.5">
                                  {/* Header - Date, Status, Time */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <Badge className="bg-[#01544e] text-white font-semibold px-2 py-0.5 text-[10px]">
                                        {visit.date}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`px-1.5 py-0.5 font-semibold text-[10px] ${
                                          visit.status === 'Completed' 
                                            ? 'border-green-500 text-green-700 bg-green-50' 
                                            : 'border-blue-500 text-blue-700 bg-blue-50'
                                        }`}
                                      >
                                        {visit.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                      <Clock className="h-3 w-3" />
                                      {visit.time}
                                    </div>
                                  </div>

                                  {/* Client */}
                                  <div className="flex items-start gap-2 pb-1">
                                    <Building2 className="h-3.5 w-3.5 text-[#01544e] mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-[9px] text-gray-500 mb-0">Client</p>
                                      <p className="font-semibold text-gray-900 text-xs">{visit.client}</p>
                                    </div>
                                  </div>

                                  {/* Doctor */}
                                  <div className="flex items-start gap-2 pb-1">
                                    <User className="h-3.5 w-3.5 text-[#01544e] mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-[9px] text-gray-500 mb-0">Doctor</p>
                                      <p className="font-semibold text-gray-900 text-xs">{visit.doctor}</p>
                                    </div>
                                  </div>

                                  {/* Revenue */}
                                  <div className="pt-1.5 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] text-gray-500 font-medium">Revenue</span>
                                      <div className="flex items-center gap-1 text-[#01544e]">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        <p className="text-sm font-bold">
                                          Rp {formatNumber(visit.revenue / 1000000)}M
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {/* Summary Card for Selected Date */}
                          {selectedDate && (() => {
                            const totalRevenue = selectedDayVisits.reduce((sum, v) => sum + v.revenue, 0);
                            
                            return (
                              <Card className="bg-gradient-to-r from-[#01544e] to-[#023d39] text-white border-0">
                                <CardContent className="p-3">
                                  <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                      <p className="text-[10px] opacity-90 mb-0.5">Total Visits</p>
                                      <p className="text-2xl font-bold">{selectedDayVisits.length}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] opacity-90 mb-0.5">Total Revenue</p>
                                      <p className="text-2xl font-bold">
                                        {formatNumber(totalRevenue / 1000000)}M
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
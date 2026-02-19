import React, { useState } from 'react';
import { 
  Target, TrendingUp, DollarSign, Users, Calendar, MapPin, 
  Presentation, UserPlus, Award, Star, CheckCircle, Clock,
  ShoppingCart, FileSignature, Activity, AlertTriangle, Crown,
  BarChart3, PieChart, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { kpiData } from '@/app/data/kpiData';
import { SalesKPI } from '@/types/kpi';

export function PerformanceHub() {
  // Simulate current user - in real app, get from auth context
  const [currentUserKPI] = useState<SalesKPI>(kpiData[0]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'from-green-500 to-emerald-500';
    if (percent >= 80) return 'from-blue-500 to-cyan-500';
    if (percent >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusBadge = (percent: number) => {
    if (percent >= 100) return { text: 'Elite Circle', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' };
    if (percent >= 80) return { text: 'On Track', color: 'bg-green-600' };
    if (percent >= 60) return { text: 'Needs Push', color: 'bg-yellow-600' };
    return { text: 'Critical', color: 'bg-red-600' };
  };

  const status = getStatusBadge(currentUserKPI.pencapaian_target_persen);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Performance Hub
          </h1>
          <p className="text-gray-600 mt-1">Real-time KPI Tracking & Incentive Calculator</p>
        </div>
        <Badge className={`${status.color} text-white text-sm px-4 py-2`}>
          {currentUserKPI.status_elite_circle && <Crown className="h-4 w-4 mr-2" />}
          {status.text}
        </Badge>
      </div>

      {/* Main Progress Gauge */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Left: User Info */}
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentUserKPI.employee_name}</h3>
                <p className="text-indigo-100 text-sm">{currentUserKPI.employee_email}</p>
                <p className="text-xs text-indigo-200 mt-0.5">Periode: {currentUserKPI.periode_bulan}</p>
              </div>
            </div>

            {/* Center: Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - currentUserKPI.pencapaian_target_persen / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{currentUserKPI.pencapaian_target_persen}%</span>
                  <span className="text-xs text-indigo-200">Target Achieved</span>
                </div>
              </div>
            </div>

            {/* Right: Revenue Stats */}
            <div className="space-y-2">
              <div>
                <p className="text-indigo-200 text-xs">Target Revenue (Q)</p>
                <p className="text-xl font-bold">{formatCurrency(currentUserKPI.target_revenue_q)}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-xs">Actual Revenue</p>
                <p className="text-xl font-bold text-yellow-300">{formatCurrency(currentUserKPI.actual_revenue_q)}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-300" />
                <span className="text-sm font-semibold">
                  {formatCurrency(currentUserKPI.actual_revenue_q - currentUserKPI.target_revenue_q)} above target
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incentive Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="py-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <Badge className="bg-white/20 text-white text-xs">This Month</Badge>
            </div>
            <div>
              <p className="text-green-100 text-xs mb-1">Komisi Bulanan</p>
              <p className="text-2xl font-bold">{formatCurrency(currentUserKPI.estimasi_komisi_bulanan)}</p>
              <p className="text-xs text-green-100 mt-1.5">5% dari total revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="py-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <Badge className="bg-white/20 text-white text-xs">Annual</Badge>
            </div>
            <div>
              <p className="text-purple-100 text-xs mb-1">Bonus Tahunan Terkumpul</p>
              <p className="text-2xl font-bold">{formatCurrency(currentUserKPI.accumulated_annual_bonus)}</p>
              <p className="text-xs text-purple-100 mt-1.5">Cair di akhir tahun</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${currentUserKPI.status_elite_circle ? 'from-yellow-500 to-yellow-600' : 'from-gray-400 to-gray-500'} text-white hover:shadow-xl transition-shadow`}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Crown className="h-5 w-5" />
              </div>
              <Badge className="bg-white/20 text-white text-xs">Status</Badge>
            </div>
            <div>
              <p className="text-xs mb-1 opacity-90">Elite Circle Member</p>
              <p className="text-2xl font-bold">{currentUserKPI.status_elite_circle ? 'AKTIF' : 'LOCKED'}</p>
              <p className="text-xs mt-1.5 opacity-90">
                {currentUserKPI.status_elite_circle ? '🎉 Bonus ekstra 10%' : 'Capai 100% untuk unlock'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="h-14 bg-gray-100/50 p-1 flex overflow-x-auto no-scrollbar justify-start">
          <TabsTrigger value="activity" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Activity Metrics</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">METRIK AKTIVITAS</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Output Results</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">HASIL PENCAPAIAN</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Product Push</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">PENJUALAN PRODUK</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Quality & Retention</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">KUALITAS & RETENSI</span>
          </TabsTrigger>
        </TabsList>

        {/* Activity Metrics Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Customer Visit
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {currentUserKPI.total_kunjungan_faskes}
                </div>
                <p className="text-xs text-gray-600 mb-3">Total kunjungan via geo-tagging</p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${Math.min((currentUserKPI.total_kunjungan_faskes / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: 50 kunjungan/bulan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Presentation className="h-4 w-4 text-purple-600" />
                  Sesi Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {currentUserKPI.total_sesi_demo}
                </div>
                <p className="text-xs text-gray-600 mb-3">Presentasi RME/LIS/BPJS</p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${Math.min((currentUserKPI.total_sesi_demo / 40) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: 40 demo/bulan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  Leads Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {currentUserKPI.jumlah_leads_baru}
                </div>
                <p className="text-xs text-gray-600 mb-3">Prospek masuk pipeline</p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${Math.min((currentUserKPI.jumlah_leads_baru / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: 30 leads/bulan</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Output Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Total Closings
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {currentUserKPI.jumlah_closing_simrs}
                      </div>
                      <span className="font-semibold text-sm">Rumah Sakit (SIMRS)</span>
                    </div>
                    <Badge className="bg-blue-600 text-xs">High Value</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {currentUserKPI.jumlah_closing_klinik}
                      </div>
                      <span className="font-semibold text-sm">Klinik</span>
                    </div>
                    <Badge className="bg-purple-600 text-xs">Medium Value</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                        {currentUserKPI.jumlah_closing_dokter}
                      </div>
                      <span className="font-semibold text-sm">Praktek Mandiri</span>
                    </div>
                    <Badge className="bg-green-600 text-xs">Volume Play</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-indigo-600 mb-1">
                    {currentUserKPI.conversion_rate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-600">Demo → Closing Success Rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Demo:</span>
                    <span className="font-semibold">{currentUserKPI.total_sesi_demo}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Closing:</span>
                    <span className="font-semibold text-green-600">
                      {currentUserKPI.jumlah_closing_simrs + currentUserKPI.jumlah_closing_klinik + currentUserKPI.jumlah_closing_dokter}
                    </span>
                  </div>
                  <Progress value={currentUserKPI.conversion_rate} className="h-2" />
                  <p className="text-xs text-gray-500 text-center">
                    {currentUserKPI.conversion_rate >= 50 ? '✅ Excellent conversion!' : '⚠️ Focus on closing techniques'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Push Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Activity className="h-4 w-4 text-green-600" />
                  Modul BPJS
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentUserKPI.persentase_upsell_bpjs.toFixed(0)}%
                </div>
                <p className="text-xs text-gray-600 mb-3">Rasio upsell BPJS Automation</p>
                <Progress value={currentUserKPI.persentase_upsell_bpjs} className="h-1.5 mb-2" />
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Strategic Product
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  Modul LIS
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {currentUserKPI.unit_lis_sold}
                </div>
                <p className="text-xs text-gray-600 mb-3">Laboratory Information System</p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${Math.min((currentUserKPI.unit_lis_sold / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  High Margin
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FileSignature className="h-4 w-4 text-purple-600" />
                  E-Sign
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {currentUserKPI.adopsi_esign_klien}
                </div>
                <p className="text-xs text-gray-600 mb-3">Digital Integrity Adoption</p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${Math.min((currentUserKPI.adopsi_esign_klien / 20) * 100, 100)}%` }}
                  ></div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Future Tech
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality & Retention Tab */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-600 mb-2">
                    {currentUserKPI.customer_satisfaction_score.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= Math.round(currentUserKPI.customer_satisfaction_score)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Average CSAT Score</p>
                  {currentUserKPI.customer_satisfaction_score >= 4.5 && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-800">
                      🏆 Customer Champion
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Churn Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-red-600 mb-2">
                    {currentUserKPI.churn_rate_client.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Client Loss Rate</p>
                  <Progress 
                    value={currentUserKPI.churn_rate_client * 10} 
                    className="h-2 mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    {currentUserKPI.churn_rate_client < 3 ? '✅ Excellent retention' : '⚠️ Needs attention'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Avg Closing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {currentUserKPI.average_closing_time}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Hari (Lead → Closing)</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${Math.min((30 / currentUserKPI.average_closing_time) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentUserKPI.average_closing_time <= 20 ? '⚡ Lightning fast!' : '🐢 Speed up your process'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
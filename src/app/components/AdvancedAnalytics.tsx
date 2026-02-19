import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

// Sample data
const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, target: 50000, deals: 12 },
  { month: 'Feb', revenue: 52000, target: 50000, deals: 15 },
  { month: 'Mar', revenue: 48000, target: 55000, deals: 14 },
  { month: 'Apr', revenue: 61000, target: 55000, deals: 18 },
  { month: 'Mei', revenue: 55000, target: 60000, deals: 16 },
  { month: 'Jun', revenue: 67000, target: 60000, deals: 20 },
];

const leadsBySource = [
  { name: 'Website', value: 35, color: '#4F46E5' },
  { name: 'Referral', value: 25, color: '#10B981' },
  { name: 'Social Media', value: 20, color: '#F59E0B' },
  { name: 'Email Campaign', value: 15, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

const salesPerformance = [
  { name: 'Ahmad', closed: 25, inProgress: 15, lost: 5 },
  { name: 'Budi', closed: 30, inProgress: 10, lost: 3 },
  { name: 'Citra', closed: 22, inProgress: 18, lost: 7 },
  { name: 'Diana', closed: 28, inProgress: 12, lost: 4 },
  { name: 'Eko', closed: 20, inProgress: 20, lost: 6 },
];

const conversionFunnel = [
  { stage: 'Leads', count: 500, percentage: 100 },
  { stage: 'Qualified', count: 350, percentage: 70 },
  { stage: 'Proposal', count: 200, percentage: 40 },
  { stage: 'Negotiation', count: 120, percentage: 24 },
  { stage: 'Closed Won', count: 85, percentage: 17 },
];

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Calculate statistics
  const totalRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / monthlyRevenue.length);
  const totalDeals = monthlyRevenue.reduce((acc, curr) => acc + curr.deals, 0);
  const revenueGrowth = ((monthlyRevenue[5].revenue - monthlyRevenue[0].revenue) / monthlyRevenue[0].revenue) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Advanced Analytics
          </h1>
          <p className="text-gray-500 mt-1">Analisis mendalam performa penjualan dan bisnis</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === 'week' && 'Minggu'}
              {range === 'month' && 'Bulan'}
              {range === 'quarter' && 'Kuartal'}
              {range === 'year' && 'Tahun'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  Rp {(totalRevenue / 1000).toFixed(0)}jt
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {revenueGrowth > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {revenueGrowth.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Revenue/Month</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  Rp {(avgRevenue / 1000).toFixed(0)}jt
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">+8.2%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Deals Closed</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalDeals}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">+12.5%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">17%</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">+3.1%</span>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="h-14 bg-gray-100/50 p-1 flex overflow-x-auto no-scrollbar justify-start max-w-xl">
          <TabsTrigger value="revenue" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Revenue Trends</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">TREN PENDAPATAN</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Team Performance</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">PERFORMA TIM</span>
          </TabsTrigger>
          <TabsTrigger value="funnel" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <span className="font-bold text-sm">Conversion Funnel</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">CORONG KONVERSI</span>
          </TabsTrigger>
        </TabsList>

        {/* Revenue Trends */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Target Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Actual Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorTarget)"
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Performance */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Sales Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="closed" fill="#10B981" name="Closed Won" />
                  <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
                  <Bar dataKey="lost" fill="#EF4444" name="Lost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Funnel */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Sales Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{stage.stage}</span>
                      <span className="text-gray-500">
                        {stage.count} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                        style={{
                          width: `${stage.percentage}%`,
                          backgroundColor: `hsl(${220 - index * 20}, 70%, 50%)`,
                        }}
                      >
                        {stage.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
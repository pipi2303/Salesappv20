import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, DollarSign, Calendar, FileText, Award, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesData, leadSourceData, performanceData } from '@/app/data/dummyData';
import { leadsApi, demosApi, contractsApi, salesTeamApi } from '@/services/api';
import { toast } from 'sonner';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { initializeDemosData } from '@/utils/initializeDemos';

export function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeLeads: 0,
    demosScheduled: 0,
    conversionRate: 0,
    totalRevenue: 0,
    pipelineValue: 0,
    upside: 0,
    strongUpside: 0,
    forecast: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Initialize demo data on app load
    initializeDemosData();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [leadsResult, demosResult, contractsResult, teamResult] = await Promise.all([
        leadsApi.getAll(),
        demosApi.getAll(),
        contractsApi.getAll(),
        salesTeamApi.getAll(),
      ]);

      if (leadsResult.success && leadsResult.data) {
        const leads = leadsResult.data;
        const activeLeads = leads.filter((l: any) => 
          ['new', 'contacted', 'qualified', 'proposal', 'negotiation'].includes(l.status)
        ).length;

        const wonLeads = leads.filter((l: any) => l.status === 'won');
        const totalSales = wonLeads.reduce((sum: number, l: any) => sum + (l.value || 0), 0);
        
        const conversionRate = leads.length > 0 
          ? ((wonLeads.length / leads.length) * 100).toFixed(0)
          : 0;

        // Calculate pipeline metrics
        const pipelineLeads = leads.filter((l: any) => 
          ['qualified', 'proposal', 'negotiation'].includes(l.status)
        );
        const pipelineValue = pipelineLeads.reduce((sum: number, l: any) => sum + (l.value || 0), 0);
        
        // Mock upside and forecast calculations
        const upside = pipelineValue * 0.62; // 62% of pipeline
        const strongUpside = pipelineValue * 0.35; // 35% of pipeline (high confidence)
        const forecast = totalSales + (pipelineValue * 0.75); // Revenue + 75% of pipeline
        const totalRevenue = totalSales * 1.15; // Mock total revenue (sales + recurring)

        setStats(prev => ({
          ...prev,
          activeLeads,
          totalSales,
          conversionRate: Number(conversionRate),
          totalRevenue,
          pipelineValue,
          upside,
          strongUpside,
          forecast,
        }));

        // Generate recent activities from leads
        const activities = leads.slice(0, 4).map((lead: any) => ({
          user: lead.assignedTo || 'System',
          action: `Updated lead - ${lead.name} (${lead.status})`,
          time: getTimeAgo(lead.updatedAt || lead.createdAt),
          value: lead.value ? formatCurrency(lead.value) : '',
        }));
        setRecentActivities(activities);
      }

      if (demosResult.success && demosResult.data) {
        const demos = demosResult.data;
        const upcomingDemos = demos.filter((d: any) => 
          d.status === 'scheduled' || d.status === 'confirmed'
        ).length;
        
        setStats(prev => ({ ...prev, demosScheduled: upcomingDemos }));
      }

      toast.success('Dashboard data loaded');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'baru saja';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  };

  const statsDisplay = [
    {
      title: 'Total Sales',
      value: formatCurrency(stats.totalSales),
      change: '+23.5%',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Leads',
      value: formatNumber(stats.activeLeads),
      change: '+12 new',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Demos Scheduled',
      value: formatNumber(stats.demosScheduled),
      change: '5 this week',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+18.2%',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600'
    },
    // Row 2 starts here
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      change: 'Strong pipeline',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Upside',
      value: formatCurrency(stats.upside),
      change: 'Potential growth',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-500',
      textColor: 'text-cyan-600'
    },
    {
      title: 'Strong Upside',
      value: formatCurrency(stats.strongUpside),
      change: 'High confidence',
      icon: TrendingUp,
      color: 'from-indigo-500 to-pink-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Forecast',
      value: formatCurrency(stats.forecast),
      change: 'Predicted revenue',
      icon: Target,
      color: 'from-teal-500 to-emerald-500',
      textColor: 'text-teal-600'
    },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01544e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#01544e]">
            Dashboard Sales Monitoring
          </h1>
          <p className="text-gray-600 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas sales Anda hari ini.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchDashboardData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid - 2 Rows: 4 cards + 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 truncate">{stat.value}</p>
                  <p className={`text-xs ${stat.textColor} mt-0.5 truncate`}>{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#01544e]" />
              Trend Penjualan (Juta Rupiah)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01544e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#01544e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#01544e" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#01544e]" />
              Sumber Lead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#01544e]" />
            Performance Tim Sales (Juta Rupiah)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="target" fill="#94a3b8" name="Target" radius={[8, 8, 0, 0]} />
              <Bar dataKey="achievement" fill="#01544e" name="Achievement" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#01544e]" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-[#e6f2f1] transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-[#01544e] flex items-center justify-center text-white font-semibold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                {activity.value && (
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{activity.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
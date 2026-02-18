import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, Download, Calendar, BarChart3, PieChart as PieChartIcon, ChevronDown, ChevronRight, Building2, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesData, leadSourceData } from '@/app/data/dummyData';
import { leadsApi, contractsApi, salesTeamApi } from '@/services/api';
import { toast } from 'sonner';
import { SalesKPICards } from '@/app/components/SalesKPICards';
import { formatCurrency, formatNumber } from '@/utils/formatters';

// Dialogs
import { SalesExecutiveDialog } from '@/app/components/dialogs/SalesExecutiveDialog';
import { DirectorDetailDialog } from '@/app/components/dialogs/DirectorDetailDialog';
import { AreaManagerDetailDialog } from '@/app/components/dialogs/AreaManagerDetailDialog';
import { SalesManagerDetailDialog } from '@/app/components/dialogs/SalesManagerDetailDialog';
import { RevenueBreakdownDialog } from '@/app/components/dialogs/RevenueBreakdownDialog';

// Data
import { teamHierarchy, monthlyData, productPerformance, regionalData, conversionFunnel } from '@/app/data/teamHierarchyData';
import { TeamMember, Manager, AreaManager, Director, SalesExecutive } from '@/app/components/dialogs/sales-dialog-types';

export function SalesReports() {
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Jan - 26');
  const [expandedManagers, setExpandedManagers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  
  // Selection States
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
  const [selectedAreaManager, setSelectedAreaManager] = useState<AreaManager | null>(null);
  const [selectedSalesManager, setSelectedSalesManager] = useState<Manager | null>(null);
  const [selectedSalesExecutive, setSelectedSalesExecutive] = useState<SalesExecutive | null>(null);
  const [selectedMemberForRevenue, setSelectedMemberForRevenue] = useState<TeamMember | null>(null);
  const [revenueBreakdownTab, setRevenueBreakdownTab] = useState<'hospital' | 'retail' | 'intradoc'>('hospital');

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalLeads: 0,
    totalContracts: 0,
    avgDealSize: 0,
    pipelineValue: 8500000000,
    upside: 2100000000,
    strongUpside: 1800000000,
    forecast: 3200000000
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [leadsResult, contractsResult, teamResult] = await Promise.all([
        leadsApi.getAll(),
        contractsApi.getAll(),
        salesTeamApi.getAll(),
      ]);

      if (contractsResult.success && contractsResult.data) {
        const contractData = contractsResult.data;
        const activeContracts = contractData.filter((c: any) => c.status === 'active');
        const totalRevenue = activeContracts.reduce((sum: number, c: any) => sum + c.value, 0);
        const avgDealSize = contractData.length > 0 
          ? contractData.reduce((sum: number, c: any) => sum + c.value, 0) / contractData.length 
          : 0;

        setStats({
          totalRevenue,
          totalLeads: leadsResult.data?.length || 0,
          totalContracts: activeContracts.length,
          avgDealSize,
          pipelineValue: totalRevenue * 1.85,
          upside: totalRevenue * 0.42,
          strongUpside: totalRevenue * 0.35,
          forecast: totalRevenue * 0.65
        });
      }
      toast.success('Reports data loaded successfully');
    } catch (error: any) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodOptions = () => {
    const currentYear = 2026;
    if (periodType === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => `${month} - ${currentYear.toString().slice(-2)}`);
    } else if (periodType === 'quarterly') {
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    } else {
      return [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
    }
  };

  const toggleManagerExpand = (managerId: string) => {
    setExpandedManagers(prev =>
      prev.includes(managerId) ? prev.filter(id => id !== managerId) : [...prev, managerId]
    );
  };

  const getFilteredTeamMembers = () => {
    if (!selectedManager) {
      const allMembers: TeamMember[] = [];
      teamHierarchy.areaManagers.forEach(am => am.managers.forEach(m => allMembers.push(...m.team)));
      return allMembers;
    }
    let foundManager: Manager | undefined;
    teamHierarchy.areaManagers.forEach(am => {
      const m = am.managers.find(mgr => mgr.id === selectedManager);
      if (m) foundManager = m;
    });
    return foundManager ? foundManager.team : [];
  };

  const getChartData = () => {
    return getFilteredTeamMembers().map(member => ({
      name: member.name,
      target: member.target / 1000000,
      achievement: member.achievement / 1000000
    }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01544e]"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#01544e]">Sales Reports</h1>
          <p className="text-gray-600 mt-1">Analisis lengkap performa sales Anda</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodType} onValueChange={(v: any) => setPeriodType(v)}>
            <SelectTrigger className="w-40"><Calendar className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="yearly">Yearly</SelectItem></SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{getPeriodOptions().map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={() => toast.success('Exporting PDF...')} className="bg-[#01544e] hover:bg-[#023d39]"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
        </div>
      </div>

      <SalesKPICards stats={stats} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="h-11">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-600" />Revenue Trend (Juta Rupiah)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-purple-600" />Lead Sources</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={leadSourceData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>{leadSourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Sales Funnel</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-sm font-medium">{stage.stage}</span><span className="text-sm text-gray-600">{formatNumber(stage.count)} ({stage.percentage}%)</span></div>
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold" style={{ width: `${stage.percentage}%` }}>{stage.percentage}%</div></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Monthly Sales Metrics</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                  <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="forecast" stroke="#14b8a6" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-[#01544e]" />Team Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Director */}
              <div className="border-2 border-[#01544e] rounded-lg p-4 bg-gradient-to-r from-[#e6f2f1] to-white cursor-pointer hover:shadow-md" onClick={() => setSelectedDirector(teamHierarchy)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="h-14 w-14 rounded-full bg-[#01544e] flex items-center justify-center text-white font-bold">{teamHierarchy.avatar}</div><div><h3 className="font-bold text-[#01544e]">{teamHierarchy.name}</h3><p className="text-sm text-gray-600">{teamHierarchy.position}</p></div></div>
                  <div className="text-right"><div className="text-2xl font-bold text-green-600">{formatCurrency(teamHierarchy.achievement)}</div><div className="text-sm font-semibold text-[#01544e]">{teamHierarchy.performance.toFixed(1)}% • {teamHierarchy.totalDeals} Deals</div></div>
                </div>
              </div>

              {/* Area Managers */}
              <div className="ml-6 space-y-4">
                {teamHierarchy.areaManagers.map(am => (
                  <div key={am.id} className="border border-gray-300 rounded-lg p-4 bg-white hover:border-[#01544e] transition-all cursor-pointer" onClick={() => setSelectedAreaManager(am)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[#01544e]">{am.avatar}</div><div><h4 className="font-bold text-[#01544e]">{am.name}</h4><p className="text-sm text-gray-600">{am.position}</p></div></div>
                      <div className="text-right"><div className="text-xl font-bold text-green-600">{formatCurrency(am.achievement)}</div><div className="text-sm font-semibold text-[#01544e]">{am.performance.toFixed(1)}%</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Team Performance Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                  <Bar dataKey="target" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="achievement" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card><CardHeader><CardTitle>Product Performance</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={150} /><Tooltip /><Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Sales by Region</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={regionalData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({region, percentage}) => `${region} ${percentage}%`}>{regionalData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card><CardHeader><CardTitle>Regional Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {regionalData.map((r, i) => (
                  <div key={r.region} className="space-y-2">
                    <div className="flex justify-between items-center"><span className="font-medium">{r.region}</span><span className="text-sm text-gray-600">{r.percentage}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full" style={{ width: `${r.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}></div></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DirectorDetailDialog 
        selectedDirector={selectedDirector} 
        onClose={() => setSelectedDirector(null)} 
        periodFilter="monthly" 
        selectedPeriod={selectedPeriod} 
        onPeriodFilterChange={() => {}} 
        aiTab="insights" 
        onAiTabChange={() => {}} 
      />
      
      <AreaManagerDetailDialog 
        selectedAreaManager={selectedAreaManager} 
        onClose={() => setSelectedAreaManager(null)} 
        periodFilter="monthly" 
        selectedPeriod={selectedPeriod} 
        onPeriodFilterChange={() => {}} 
        aiTab="insights" 
        onAiTabChange={() => {}} 
      />

      <SalesManagerDetailDialog 
        selectedManager={selectedSalesManager} 
        onClose={() => setSelectedSalesManager(null)} 
        periodFilter="monthly" 
        selectedPeriod={selectedPeriod} 
        onPeriodFilterChange={() => {}} 
        aiTab="insights" 
        onAiTabChange={() => {}} 
      />

      <SalesExecutiveDialog 
        selectedExecutive={selectedSalesExecutive} 
        onClose={() => setSelectedSalesExecutive(null)} 
        periodFilter="monthly" 
        selectedPeriod={selectedPeriod} 
        onPeriodFilterChange={() => {}} 
      />

      <RevenueBreakdownDialog 
        selectedMember={selectedMemberForRevenue} 
        onClose={() => setSelectedMemberForRevenue(null)} 
        tab={revenueBreakdownTab} 
        onTabChange={setRevenueBreakdownTab} 
      />
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Opportunity } from './OpportunityManagement';

interface SalesForecastProps {
  opportunities: Opportunity[];
}

export function SalesForecast({ opportunities }: SalesForecastProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}K`;
    return `Rp ${value}`;
  };

  // Calculate metrics
  const openOpportunities = opportunities.filter(o => o.status === 'open');
  const wonOpportunities = opportunities.filter(o => o.status === 'won');
  const lostOpportunities = opportunities.filter(o => o.status === 'lost');
  const closedOpportunities = [...wonOpportunities, ...lostOpportunities];

  const totalPipelineValue = openOpportunities.reduce((sum, o) => sum + o.totalValue, 0);
  const weightedPipelineValue = openOpportunities.reduce((sum, o) => sum + (o.totalValue * o.probability / 100), 0);
  const totalWonValue = wonOpportunities.reduce((sum, o) => sum + o.totalValue, 0);
  const totalLostValue = lostOpportunities.reduce((sum, o) => sum + o.totalValue, 0);

  const winRate = closedOpportunities.length > 0 
    ? (wonOpportunities.length / closedOpportunities.length * 100).toFixed(1)
    : 0;

  const avgDealSize = openOpportunities.length > 0
    ? totalPipelineValue / openOpportunities.length
    : 0;

  // Pipeline by Stage
  const stageData = [
    { 
      stage: 'Prospecting',
      count: opportunities.filter(o => o.stage === 'prospecting').length,
      value: opportunities.filter(o => o.stage === 'prospecting').reduce((sum, o) => sum + o.totalValue, 0),
    },
    { 
      stage: 'Proposal',
      count: opportunities.filter(o => o.stage === 'proposal').length,
      value: opportunities.filter(o => o.stage === 'proposal').reduce((sum, o) => sum + o.totalValue, 0),
    },
    { 
      stage: 'Negotiation',
      count: opportunities.filter(o => o.stage === 'negotiation').length,
      value: opportunities.filter(o => o.stage === 'negotiation').reduce((sum, o) => sum + o.totalValue, 0),
    },
    { 
      stage: 'Closed Won',
      count: wonOpportunities.length,
      value: totalWonValue,
    },
    { 
      stage: 'Closed Lost',
      count: lostOpportunities.length,
      value: totalLostValue,
    },
  ];

  // Win/Loss Distribution
  const pieData = [
    { name: 'Won', value: wonOpportunities.length, color: '#10b981' },
    { name: 'Lost', value: lostOpportunities.length, color: '#ef4444' },
    { name: 'Open', value: openOpportunities.length, color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Source Distribution
  const sourceData = [
    { source: 'Website', count: opportunities.filter(o => o.source === 'website').length },
    { source: 'Referral', count: opportunities.filter(o => o.source === 'referral').length },
    { source: 'Cold Call', count: opportunities.filter(o => o.source === 'cold-call').length },
    { source: 'Email', count: opportunities.filter(o => o.source === 'email').length },
    { source: 'Social Media', count: opportunities.filter(o => o.source === 'social-media').length },
  ].filter(d => d.count > 0);

  // Monthly Forecast (next 3 months)
  const getForecastData = () => {
    const now = new Date();
    const forecast = [];

    for (let i = 0; i < 3; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = month.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      
      const monthOpps = openOpportunities.filter(o => {
        const closeDate = new Date(o.closeDate);
        return closeDate.getMonth() === month.getMonth() && 
               closeDate.getFullYear() === month.getFullYear();
      });

      const expectedValue = monthOpps.reduce((sum, o) => sum + (o.totalValue * o.probability / 100), 0);
      const maxValue = monthOpps.reduce((sum, o) => sum + o.totalValue, 0);

      forecast.push({
        month: monthName,
        expected: expectedValue / 1000000, // in millions
        potential: maxValue / 1000000,
        count: monthOpps.length,
      });
    }

    return forecast;
  };

  const forecastData = getForecastData();

  // Top Opportunities
  const topOpportunities = [...openOpportunities]
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalPipelineValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {openOpportunities.length} open deals
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weighted Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(weightedPipelineValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Expected revenue
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{winRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {wonOpportunities.length} won / {closedOpportunities.length} closed
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(avgDealSize)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Per opportunity
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Pipeline by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'Value') return formatCurrency(value);
                    return value;
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#6366f1" name="Count" />
                <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win/Loss Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Opportunity Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3-Month Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              3-Month Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => `Rp ${value.toFixed(0)}M`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="expected" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Expected (M)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="potential" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Potential (M)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Lead Source Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="source" type="category" width={100} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Opportunities" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Top 5 Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topOpportunities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No open opportunities</p>
            ) : (
              topOpportunities.map((opp, index) => (
                <div key={opp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{opp.name}</p>
                      <p className="text-sm text-gray-600">{opp.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">
                      {formatCurrency(opp.totalValue)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {opp.probability}%
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(opp.closeDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

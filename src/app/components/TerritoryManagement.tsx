import React, { useState } from 'react';
import { MapPin, Users, Target, TrendingUp, Award, Plus, Search, Edit, Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Territory {
  id: string;
  name: string;
  region: string;
  assignedTo: string;
  leads: number;
  opportunities: number;
  revenue: number;
  target: number;
  achievement: number;
  coverage: number;
}

export function TerritoryManagement() {
  const [activeTab, setActiveTab] = useState('territories');
  const [searchQuery, setSearchQuery] = useState('');

  const [territories] = useState<Territory[]>([
    { id: '1', name: 'Jakarta Pusat', region: 'DKI Jakarta', assignedTo: 'Budi Santoso', leads: 45, opportunities: 12, revenue: 350000000, target: 300000000, achievement: 116.7, coverage: 85 },
    { id: '2', name: 'Jakarta Selatan', region: 'DKI Jakarta', assignedTo: 'Ani Wijaya', leads: 38, opportunities: 10, revenue: 280000000, target: 300000000, achievement: 93.3, coverage: 78 },
    { id: '3', name: 'Bandung', region: 'Jawa Barat', assignedTo: 'Dewi Kartika', leads: 52, opportunities: 15, revenue: 520000000, target: 400000000, achievement: 130.0, coverage: 92 },
    { id: '4', name: 'Surabaya', region: 'Jawa Timur', assignedTo: 'Eko Prasetyo', leads: 30, opportunities: 8, revenue: 185000000, target: 250000000, achievement: 74.0, coverage: 65 },
  ]);

  const stats = {
    total: territories.length,
    totalRevenue: territories.reduce((sum, t) => sum + t.revenue, 0),
    totalTarget: territories.reduce((sum, t) => sum + t.target, 0),
    avgCoverage: territories.reduce((sum, t) => sum + t.coverage, 0) / territories.length,
    topPerformer: territories.reduce((max, t) => t.achievement > max.achievement ? t : max, territories[0])
  };

  const regionData = [
    { name: 'DKI Jakarta', value: 2, color: '#6366f1' },
    { name: 'Jawa Barat', value: 1, color: '#8b5cf6' },
    { name: 'Jawa Timur', value: 1, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Territory Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Geographic territory assignment, performance tracking & market penetration metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Territories</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">All territories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievement</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((stats.totalRevenue / stats.totalTarget) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.avgCoverage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Market penetration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Territory</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topPerformer.name}</div>
            <p className="text-xs text-muted-foreground">{stats.topPerformer.achievement.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full h-auto p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200 grid grid-cols-3">
          <TabsTrigger 
            value="territories" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#01544e] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Territories</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Daftar Wilayah</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#01544e] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Analytics</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Data Performa</span>
          </TabsTrigger>
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#01544e] data-[state=active]:shadow-sm rounded-lg py-3 flex flex-col gap-0.5 transition-all duration-300"
          >
            <span className="font-bold text-sm uppercase tracking-tight">Map View</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Visual Geografis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="territories" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search territories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button><Plus className="h-4 w-4 mr-2" />Add Territory</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {territories.map((territory) => (
              <Card key={territory.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                        {territory.name}
                      </CardTitle>
                      <CardDescription>{territory.region}</CardDescription>
                    </div>
                    <Badge variant={territory.achievement >= 100 ? 'default' : 'secondary'} className={territory.achievement >= 100 ? 'bg-green-500' : ''}>
                      {territory.achievement.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{territory.assignedTo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Leads</p>
                      <p className="text-lg font-bold">{territory.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Opportunities</p>
                      <p className="text-lg font-bold">{territory.opportunities}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(territory.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coverage</p>
                      <p className="text-lg font-bold">{territory.coverage}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Target Progress</span>
                      <span className="font-semibold">{formatCurrency(territory.revenue)} / {formatCurrency(territory.target)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${territory.achievement >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(territory.achievement, 100)}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1"><Eye className="h-3 w-3 mr-1" />View</Button>
                    <Button variant="outline" size="sm" className="flex-1"><Edit className="h-3 w-3 mr-1" />Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Territory Performance</CardTitle>
                <CardDescription>Revenue by territory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={territories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#6366f1" name="Revenue" />
                    <Bar dataKey="target" fill="#94a3b8" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Region Distribution</CardTitle>
                <CardDescription>Territories by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={regionData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {regionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Territory Map</CardTitle>
              <CardDescription>Geographic distribution of territories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                <p className="text-sm text-muted-foreground">Map visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

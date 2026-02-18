import React from 'react';
import { DollarSign, Users, Target, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface SalesKPICardsProps {
  stats: {
    totalRevenue: number;
    totalLeads: number;
    totalContracts: number;
    avgDealSize: number;
    pipelineValue: number;
    upside: number;
    strongUpside: number;
    forecast: number;
  };
}

export function SalesKPICards({ stats }: SalesKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Revenue */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.totalRevenue * 1000000)}</p>
              <p className="text-xs text-green-600 mt-0.5">+23.5% vs last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Pipeline Value - NEW */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pipeline Value</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.pipelineValue)}</p>
              <p className="text-xs text-purple-600 mt-0.5">Strong pipeline</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Upside - NEW */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Upside</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.upside)}</p>
              <p className="text-xs text-cyan-600 mt-0.5">Potential growth</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Strong Upside - NEW */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Strong Upside</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.strongUpside)}</p>
              <p className="text-xs text-indigo-600 mt-0.5">High confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Forecast - NEW */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Forecast</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.forecast)}</p>
              <p className="text-xs text-teal-600 mt-0.5">Predicted revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Total Leads */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Leads</p>
              <p className="text-xl font-bold mt-1">{formatNumber(stats.totalLeads)}</p>
              <p className="text-xs text-blue-600 mt-0.5">+12 new this week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Active Contracts */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Active Contracts</p>
              <p className="text-xl font-bold mt-1">{formatNumber(stats.totalContracts)}</p>
              <p className="text-xs text-purple-600 mt-0.5">68% conversion rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Avg Deal Size */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Deal Size</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(stats.avgDealSize)}</p>
              <p className="text-xs text-orange-600 mt-0.5">+15% vs last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
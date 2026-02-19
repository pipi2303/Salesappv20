import React from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { AIFeaturesSection } from '@/app/components/AIFeaturesSection';
import { formatCurrency } from '@/utils/formatters';
import { Director, calculateGap, formatGap } from './sales-dialog-types';

interface DirectorDetailDialogProps {
  selectedDirector: Director | null;
  onClose: () => void;
  periodFilter: string;
  selectedPeriod: string;
  onPeriodFilterChange: (filter: string, period: string) => void;
  aiTab: string;
  onAiTabChange: (tab: string) => void;
}

export function DirectorDetailDialog({
  selectedDirector,
  onClose,
  periodFilter,
  selectedPeriod,
  onPeriodFilterChange,
  aiTab,
  onAiTabChange
}: DirectorDetailDialogProps) {
  if (!selectedDirector) return null;

  return (
    <Dialog open={!!selectedDirector} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Director Performance - {selectedDirector.name}</DialogTitle>
          <DialogDescription>
            Comprehensive performance metrics, team breakdown, and AI insights for Director {selectedDirector.name}
          </DialogDescription>
        </DialogHeader>

        {/* Visual Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01544e] to-[#023d39] text-white p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {selectedDirector.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedDirector.name}</h2>
              <p className="text-sm text-white/80">{selectedDirector.position}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-900">
          {/* Period Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter Period:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPeriodFilterChange('monthly', 'Jan - 26')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodFilter === 'monthly'
                    ? 'bg-[#01544e] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => onPeriodFilterChange('quarterly', 'Q1 - 2026')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodFilter === 'quarterly'
                    ? 'bg-[#01544e] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Quarterly
              </button>
            </div>
            {/* ... rest of the filters ... */}
            {periodFilter === 'quarterly' && (
              <div className="flex gap-2 md:ml-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => onPeriodFilterChange('quarterly', e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#01544e] min-w-[150px] cursor-pointer"
                >
                  <option value="Q1 - 2026">Quarter 1 - 2026</option>
                  <option value="Q2 - 2026">Quarter 2 - 2026</option>
                  <option value="Q3 - 2026">Quarter 3 - 2026</option>
                  <option value="Q4 - 2026">Quarter 4 - 2026</option>
                </select>
              </div>
            )}
            {periodFilter === 'monthly' && (
              <div className="flex gap-2 md:ml-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => onPeriodFilterChange('monthly', e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#01544e] min-w-[150px] cursor-pointer"
                >
                  <option value="Jan - 26">January 2026</option>
                  <option value="Feb - 26">February 2026</option>
                  <option value="Mar - 26">March 2026</option>
                  <option value="Apr - 26">April 2026</option>
                  <option value="Mei - 26">May 2026</option>
                  <option value="Jun - 26">June 2026</option>
                  <option value="Jul - 26">July 2026</option>
                  <option value="Aug - 26">August 2026</option>
                  <option value="Sep - 26">September 2026</option>
                  <option value="Okt - 26">October 2026</option>
                  <option value="Nov - 26">November 2026</option>
                  <option value="Des - 26">December 2026</option>
                </select>
              </div>
            )}
          </div>

          {/* Selected Period Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Current Performance View: <span className="font-bold underline">{selectedPeriod}</span>
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {periodFilter === 'monthly' ? 'Monthly Audit' : 'Quarterly Review'}
            </span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <Card className="border-2 border-[#01544e]/20 hover:border-[#01544e] transition-colors bg-gradient-to-br from-[#e6f2f1] to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Achievement</p>
                    <p className="text-xl font-bold text-[#01544e]">
                      {formatCurrency(selectedDirector.achievement)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#01544e] flex items-center justify-center shadow-lg shadow-[#01544e]/20">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-500 transition-colors bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Target</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedDirector.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedDirector.achievement, selectedDirector.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md inline-block ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 hover:border-emerald-500 transition-colors bg-gradient-to-br from-emerald-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Performance</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {selectedDirector.performance.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 hover:border-amber-500 transition-colors bg-gradient-to-br from-amber-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Total Deals</p>
                    <p className="text-xl font-bold text-amber-600">
                      {selectedDirector.totalDeals}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-500 transition-colors bg-gradient-to-br from-purple-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Pipeline</p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(selectedDirector.pipelineValue || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-200 hover:border-cyan-500 transition-colors bg-gradient-to-br from-cyan-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Upside</p>
                    <p className="text-xl font-bold text-cyan-600">
                      {formatCurrency(selectedDirector.upside || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 hover:border-indigo-500 transition-colors bg-gradient-to-br from-indigo-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Strong Upside</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {formatCurrency(selectedDirector.strongUpside || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-200 hover:border-teal-500 transition-colors bg-gradient-to-br from-teal-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Forecast</p>
                    <p className="text-xl font-bold text-teal-600">
                      {formatCurrency(selectedDirector.forecast || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Section */}
          <AIFeaturesSection 
            personName={selectedDirector.name}
            personRole={selectedDirector.position}
          />

          {/* Area Managers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                Area Managers Performance ({selectedDirector.areaManagers.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDirector.areaManagers.map((areaManager) => (
                <Card key={areaManager.id} className="border border-purple-100 hover:border-purple-400 transition-all bg-white shadow-sm hover:shadow-md group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                        {areaManager.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-purple-900 text-lg truncate">{areaManager.name}</h4>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {areaManager.performance.toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{areaManager.position}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Achievement</p>
                            <p className="text-base font-bold text-emerald-600">
                              {formatCurrency(areaManager.achievement)}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target</p>
                            <p className="text-base font-bold text-gray-700">
                              {formatCurrency(areaManager.target)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-purple-600">Overall Progress</span>
                            <span className="text-xs text-gray-500 font-medium">{areaManager.totalDeals} Deals Closed</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(areaManager.performance, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Org Summary */}
          <Card className="border-none bg-[#01544e] text-white shadow-xl shadow-[#01544e]/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <CardHeader className="relative z-10 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Directorate Organization Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-8 pb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center space-y-1">
                  <p className="text-4xl font-black">{selectedDirector.areaManagers.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Area Managers</p>
                </div>
                <div className="text-center space-y-1 border-l border-white/10">
                  <p className="text-4xl font-black">
                    {selectedDirector.areaManagers.reduce((sum, am) => sum + am.managers.length, 0)}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Sales Managers</p>
                </div>
                <div className="text-center space-y-1 border-l border-white/10">
                  <p className="text-4xl font-black">{selectedDirector.accountManagers.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Account Managers</p>
                </div>
                <div className="text-center space-y-1 border-l border-white/10">
                  <p className="text-4xl font-black">
                    {selectedDirector.areaManagers.reduce((sum, am) => 
                      sum + am.managers.reduce((s, m) => s + m.team.length, 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Sales Executives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

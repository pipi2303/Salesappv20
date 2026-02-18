import React from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01544e] to-[#023d39] text-white p-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              {selectedDirector.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedDirector.name}</h2>
              <p className="text-sm text-white/80">{selectedDirector.position}</p>
              <p className="text-xs text-white/60">{selectedDirector.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Period Filter */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter Period:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPeriodFilterChange('monthly', 'Jan - 26')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodFilter === 'monthly'
                    ? 'bg-[#01544e] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => onPeriodFilterChange('quarterly', 'Q1 - 2026')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodFilter === 'quarterly'
                    ? 'bg-[#01544e] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Quarterly
              </button>
            </div>
            {periodFilter === 'quarterly' && (
              <div className="flex gap-2 ml-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => onPeriodFilterChange('quarterly', e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors min-w-[150px] cursor-pointer"
                >
                  <option value="Q1 - 2026">Quarter 1 - 2026</option>
                  <option value="Q2 - 2026">Quarter 2 - 2026</option>
                  <option value="Q3 - 2026">Quarter 3 - 2026</option>
                  <option value="Q4 - 2026">Quarter 4 - 2026</option>
                </select>
              </div>
            )}
            {periodFilter === 'monthly' && (
              <div className="flex gap-2 ml-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => onPeriodFilterChange('monthly', e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors min-w-[150px] cursor-pointer"
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Showing data for: <span className="font-bold">{selectedPeriod}</span>
              </span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
              {periodFilter === 'monthly' ? 'Monthly View' : 'Quarterly View'}
            </span>
          </div>

          {/* Overall Performance KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <Card className="border-2 border-[#01544e] bg-gradient-to-br from-[#e6f2f1] to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Achievement</p>
                    <p className="text-2xl font-bold text-[#01544e]">
                      {formatCurrency(selectedDirector.achievement)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#01544e] flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Total Target</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedDirector.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedDirector.achievement, selectedDirector.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Performance</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedDirector.performance.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Deals</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedDirector.totalDeals}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(selectedDirector.pipelineValue || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-500 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Upside</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {formatCurrency(selectedDirector.upside || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Strong Upside</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(selectedDirector.strongUpside || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-500 bg-gradient-to-br from-teal-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Forecast</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {formatCurrency(selectedDirector.forecast || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
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
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Area Managers ({selectedDirector.areaManagers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDirector.areaManagers.map((areaManager) => (
                <Card key={areaManager.id} className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {areaManager.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-purple-900 truncate">{areaManager.name}</h4>
                        <p className="text-sm text-gray-600">{areaManager.position}</p>
                        <p className="text-xs text-gray-500 truncate">{areaManager.email}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Achievement</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(areaManager.achievement)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Target</p>
                            <p className="text-lg font-bold text-gray-700">
                              {formatCurrency(areaManager.target)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-purple-600">
                            {areaManager.performance.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-600">
                            {areaManager.totalDeals} Deals
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(areaManager.performance, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sales Managers Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Sales Managers ({selectedDirector.areaManagers.reduce((sum, am) => sum + am.managers.length, 0)})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedDirector.areaManagers.map((areaManager) => 
                areaManager.managers.map((manager) => (
                  <Card key={manager.id} className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-white">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {manager.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-blue-900 truncate">{manager.name}</h4>
                          <p className="text-xs text-gray-600">{manager.position}</p>
                          
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-600">Achievement</p>
                              <p className="text-sm font-bold text-green-600">
                                {formatCurrency(manager.achievement)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Target</p>
                              <p className="text-sm font-bold text-gray-700">
                                {formatCurrency(manager.target)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="font-semibold text-blue-600">
                              {manager.performance.toFixed(1)}%
                            </span>
                            <span className="text-gray-600">
                              {manager.totalDeals} Deals
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-blue-800 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(manager.performance, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Account Managers Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-600" />
              Account Managers ({selectedDirector.accountManagers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDirector.accountManagers.map((accountManager) => (
                <Card key={accountManager.id} className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {accountManager.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-orange-900 truncate">{accountManager.name}</h4>
                        <p className="text-sm text-gray-600">{accountManager.position}</p>
                        <p className="text-xs text-gray-500 truncate">{accountManager.email}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Achievement</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(accountManager.achievement)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Target</p>
                            <p className="text-lg font-bold text-gray-700">
                              {formatCurrency(accountManager.target)}
                            </p>
                          </div>
                        </div>

                        {/* Short/Surplus */}
                        {(() => {
                          const gap = accountManager.achievement - accountManager.target;
                          const gapInMillions = (Math.abs(gap) / 1000000).toFixed(0);
                          const isPositive = gap >= 0;
                          return (
                            <div className={`mt-2 text-sm font-semibold ${isPositive ? 'text-blue-600' : 'text-red-600'}`}>
                              {isPositive ? 'Surplus' : 'Short'}: {gapInMillions}M
                            </div>
                          );
                        })()}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-orange-600">
                            {accountManager.performance.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-600">
                            {accountManager.totalDeals} Deals
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-600 to-orange-800 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(accountManager.performance, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary Statistics */}
          <Card className="border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#01544e]" />
                Organization Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {selectedDirector.areaManagers.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Area Managers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {selectedDirector.areaManagers.reduce((sum, am) => sum + am.managers.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Sales Managers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {selectedDirector.accountManagers.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Account Managers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {selectedDirector.areaManagers.reduce((sum, am) => 
                      sum + am.managers.reduce((s, m) => s + m.team.length, 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Sales Executives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, Users, StickyNote, Trash2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AIFeaturesSection } from '@/app/components/AIFeaturesSection';
import { formatCurrency } from '@/utils/formatters';
import { AreaManager, Note, calculateGap, formatGap, formatTimestamp } from './sales-dialog-types';

interface AreaManagerDetailDialogProps {
  selectedAreaManager: AreaManager | null;
  onClose: () => void;
  periodFilter: string;
  selectedPeriod: string;
  onPeriodFilterChange: (filter: string, period: string) => void;
  notes: Note[];
  newNote: string;
  onNewNoteChange: (note: string) => void;
  onAddNote: () => void;
  onDeleteNote: (noteId: string) => void;
}

export function AreaManagerDetailDialog({
  selectedAreaManager,
  onClose,
  periodFilter,
  selectedPeriod,
  onPeriodFilterChange,
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onDeleteNote
}: AreaManagerDetailDialogProps) {
  if (!selectedAreaManager) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01544e] to-[#02665c] text-white p-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              {selectedAreaManager.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedAreaManager.name}</h2>
              <p className="text-sm text-white/80">{selectedAreaManager.position}</p>
              <p className="text-xs text-white/60">{selectedAreaManager.email}</p>
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
                  className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer"
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
                  className="px-4 py-2 rounded-lg border-2 border-blue-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer"
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Achievement</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(selectedAreaManager.achievement)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Target</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedAreaManager.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedAreaManager.achievement, selectedAreaManager.target);
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
                      {selectedAreaManager.performance.toFixed(1)}%
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
                      {selectedAreaManager.totalDeals}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-500 bg-gradient-to-br from-violet-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
                    <p className="text-2xl font-bold text-violet-600">
                      {formatCurrency(selectedAreaManager.pipelineValue || 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-violet-500 flex items-center justify-center">
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
                      {formatCurrency(selectedAreaManager.upside || 0)}
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
                      {formatCurrency(selectedAreaManager.strongUpside || 0)}
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
                      {formatCurrency(selectedAreaManager.forecast || 0)}
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
            personName={selectedAreaManager.name}
            personRole={selectedAreaManager.position}
          />

          {/* Sales Managers */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Sales Managers ({selectedAreaManager.managers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedAreaManager.managers.map((manager) => (
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
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-white">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Notes & Activity Log
              </CardTitle>
              <p className="text-sm text-white/80 mt-1">Track important updates and observations</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
                    placeholder="Add a new note..."
                    className="flex-1 px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Button
                    onClick={onAddNote}
                    disabled={!newNote.trim()}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet. Add your first note above!</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border-2 border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-gray-800 mb-2">{note.text}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTimestamp(note.timestamp)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

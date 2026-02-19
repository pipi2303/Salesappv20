import React from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, Users, StickyNote, Trash2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { AIFeaturesSection } from '@/app/components/AIFeaturesSection';
import { formatCurrency } from '@/utils/formatters';
import { Manager, Note, calculateGap, formatGap, formatTimestamp } from './sales-dialog-types';

interface SalesManagerDetailDialogProps {
  selectedManager: Manager | null;
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

export function SalesManagerDetailDialog({
  selectedManager,
  onClose,
  periodFilter,
  selectedPeriod,
  onPeriodFilterChange,
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onDeleteNote
}: SalesManagerDetailDialogProps) {
  if (!selectedManager) return null;

  return (
    <Dialog open={!!selectedManager} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Sales Manager Performance - {selectedManager.name}</DialogTitle>
          <DialogDescription>
            Performance metrics, team results, and activity notes for Sales Manager {selectedManager.name}
          </DialogDescription>
        </DialogHeader>

        {/* Visual Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01544e] to-[#02665c] text-white p-4 flex items-center justify-between z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {selectedManager.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedManager.name}</h2>
              <p className="text-sm text-white/80">{selectedManager.position}</p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                Displaying Results for: <span className="font-bold underline">{selectedPeriod}</span>
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {periodFilter === 'monthly' ? 'Monthly Audit' : 'Quarterly Review'}
            </span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <Card className="border-2 border-blue-100 hover:border-blue-500 transition-colors bg-gradient-to-br from-blue-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Achievement</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedManager.achievement)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-500 transition-colors bg-gradient-to-br from-indigo-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Target</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {formatCurrency(selectedManager.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedManager.achievement, selectedManager.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md inline-block ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-500 transition-colors bg-gradient-to-br from-green-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Performance</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedManager.performance.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-500 transition-colors bg-gradient-to-br from-orange-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Total Deals</p>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedManager.totalDeals}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-100 hover:border-violet-500 transition-colors bg-gradient-to-br from-violet-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Pipeline</p>
                    <p className="text-xl font-bold text-violet-600">
                      {formatCurrency(selectedManager.pipelineValue || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-100 hover:border-cyan-500 transition-colors bg-gradient-to-br from-cyan-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Upside</p>
                    <p className="text-xl font-bold text-cyan-600">
                      {formatCurrency(selectedManager.upside || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 hover:border-pink-500 transition-colors bg-gradient-to-br from-pink-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Strong Upside</p>
                    <p className="text-xl font-bold text-pink-600">
                      {formatCurrency(selectedManager.strongUpside || 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100 hover:border-teal-500 transition-colors bg-gradient-to-br from-teal-50 to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Forecast</p>
                    <p className="text-xl font-bold text-teal-600">
                      {formatCurrency(selectedManager.forecast || 0)}
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
            personName={selectedManager.name}
            personRole={selectedManager.position}
          />

          {/* Sales Team Members Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Users className="h-5 w-5" />
              </div>
              Team Member Breakdown ({selectedManager.team.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedManager.team.map((member) => (
                <Card key={member.id} className="border border-green-100 hover:border-green-400 transition-all bg-white shadow-sm hover:shadow-md group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-green-900 truncate">{member.name}</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {member.performance.toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.position}</p>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Achievement</p>
                            <p className="text-sm font-bold text-emerald-600">
                              {formatCurrency(member.achievement)}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target</p>
                            <p className="text-sm font-bold text-gray-700">
                              {formatCurrency(member.target)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Member Progress</span>
                            <span className="text-[10px] text-gray-500 font-medium">{member.totalDeals} Deals</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden border border-gray-200">
                            <div 
                              className="bg-gradient-to-r from-green-600 to-emerald-600 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(member.performance, 100)}%` }}
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

          {/* Notes Section */}
          <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Management Notes & Activity Log
              </CardTitle>
              <p className="text-sm text-white/80 mt-1 uppercase tracking-widest font-bold text-[10px]">COACHING & PERFORMANCE LOG</p>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
                    placeholder="Capture a management observation..."
                    className="flex-1 px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm shadow-sm"
                  />
                  <Button
                    onClick={onAddNote}
                    disabled={!newNote?.trim()}
                    className="bg-[#01544e] hover:bg-[#023d39] text-white px-6 rounded-xl shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white/50 rounded-2xl border-2 border-dashed border-amber-200">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-wider">No team notes found</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-amber-100 rounded-xl p-4 hover:border-amber-400 transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-gray-800 mb-3 text-sm leading-relaxed">{note.text}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTimestamp(note.timestamp)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
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
      </DialogContent>
    </Dialog>
  );
}

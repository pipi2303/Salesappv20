import React, { useState } from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, StickyNote, Trash2, Send, Percent, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { AIFeaturesSection } from '@/app/components/AIFeaturesSection';
import { formatCurrency } from '@/utils/formatters';
import { SalesExecutive, Note, calculateGap, formatGap, formatTimestamp } from './sales-dialog-types';

interface SalesExecutiveDialogProps {
  selectedExecutive: SalesExecutive | null;
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

export function SalesExecutiveDialog({
  selectedExecutive,
  onClose,
  periodFilter,
  selectedPeriod,
  onPeriodFilterChange,
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onDeleteNote
}: SalesExecutiveDialogProps) {
  if (!selectedExecutive) return null;

  return (
    <Dialog open={!!selectedExecutive} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[calc(100%-2rem)] overflow-y-auto p-0 border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Sales Executive Performance - {selectedExecutive.name}</DialogTitle>
          <DialogDescription>
            Individual performance metrics, pipeline tracking, and personal activity log for {selectedExecutive.name}
          </DialogDescription>
        </DialogHeader>

        {/* Visual Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#013E37] to-[#02665c] text-white p-4 flex items-center justify-between z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {selectedExecutive.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedExecutive.name}</h2>
              <p className="text-sm text-white/80">{selectedExecutive.position}</p>
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
          {/* Period Filter Section */}
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
                    ? 'bg-[#013E37] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => onPeriodFilterChange('quarterly', 'Q1 - 2026')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodFilter === 'quarterly'
                    ? 'bg-[#013E37] text-white shadow-md'
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
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#013E37] min-w-[150px] cursor-pointer"
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
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#013E37] min-w-[150px] cursor-pointer"
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
                Performance Status: <span className="font-bold underline">{selectedPeriod}</span>
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {periodFilter === 'monthly' ? 'Monthly Audit' : 'Quarterly Review'}
            </span>
          </div>

          {/* Performance Overview KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-[#DFF0EC] hover:border-[#013E37] transition-colors bg-gradient-to-br from-[#EEF7F5] to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Achievement</p>
                    <p className="text-xl font-bold text-[#013E37]">
                      {formatCurrency(selectedExecutive.achievement)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#013E37] flex items-center justify-center shadow-lg shadow-[#013E37]/20">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#DFF0EC] hover:border-[#EEF7F5]0 transition-colors bg-gradient-to-br from-[#EEF7F5] to-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Target</p>
                    <p className="text-xl font-bold text-[#013E37]">
                      {formatCurrency(selectedExecutive.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedExecutive.achievement, selectedExecutive.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md inline-block ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#EEF7F5]0 flex items-center justify-center shadow-lg shadow-[#EEF7F5]0/20">
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
                      {selectedExecutive.performance.toFixed(1)}%
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
                      {selectedExecutive.totalDeals}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Section */}
          <AIFeaturesSection 
            personName={selectedExecutive.name}
            personRole={selectedExecutive.position}
          />

          {/* Performance Progress */}
          <Card className="border border-[#DFF0EC] bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-[#EEF7F5]/50 border-b border-[#DFF0EC]">
              <CardTitle className="text-lg flex items-center gap-2 text-[#012D29]">
                <TrendingUp className="h-5 w-5 text-[#013E37]" />
                Individual Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Real-time Goal Tracking</span>
                    <span className="text-lg font-black text-[#013E37]">
                      {selectedExecutive.performance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-5 p-1 border border-gray-200">
                    <div 
                      className="bg-gradient-to-r from-[#013E37] via-pink-500 to-[#013E37] h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 relative"
                      style={{ width: `${Math.min(selectedExecutive.performance, 100)}%` }}
                    >
                      {selectedExecutive.performance > 15 && (
                        <span className="text-[10px] text-white font-black drop-shadow-sm">
                          {selectedExecutive.performance.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-inner">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Current Achievement</p>
                    <p className="text-2xl font-black text-emerald-700">
                      {formatCurrency(selectedExecutive.achievement)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedExecutive.achievement, selectedExecutive.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isPositive ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {label}: {value}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-inner">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Assigned Target</p>
                    <p className="text-2xl font-black text-blue-700">
                      {formatCurrency(selectedExecutive.target)}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      <Clock className="h-3 w-3" />
                      {selectedExecutive.totalDeals} deals closed this period
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Personal Performance Log
              </CardTitle>
              <p className="text-sm text-white/80 mt-1 uppercase tracking-widest font-bold text-[10px]">COACHING & ACTIVITY HISTORY</p>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
                    placeholder="Capture a performance observation..."
                    className="flex-1 px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm shadow-sm"
                  />
                  <Button
                    onClick={onAddNote}
                    disabled={!newNote?.trim()}
                    className="bg-[#013E37] hover:bg-[#025C52] text-white px-6 rounded-xl shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white/50 rounded-2xl border-2 border-dashed border-amber-200">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-wider">No active log entries</p>
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

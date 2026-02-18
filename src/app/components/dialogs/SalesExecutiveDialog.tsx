import React from 'react';
import { X, Calendar, DollarSign, Target, TrendingUp, BarChart3, StickyNote, Trash2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#01544e] to-[#02665c] text-white p-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              {selectedExecutive.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedExecutive.name}</h2>
              <p className="text-sm text-white/80">{selectedExecutive.position}</p>
              <p className="text-xs text-white/60">{selectedExecutive.email}</p>
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
          {/* Period Filter Section */}
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
                Showing data for: {selectedPeriod}
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {periodFilter === 'monthly' ? '📊 Monthly View' : '📊 Quarterly View'}
            </span>
          </div>

          {/* Performance Overview KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-purple-600 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Achievement</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(selectedExecutive.achievement)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Target</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(selectedExecutive.target)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedExecutive.achievement, selectedExecutive.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
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
                      {selectedExecutive.performance.toFixed(1)}%
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
                      {selectedExecutive.totalDeals}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
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
          <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Performance Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Achievement vs Target</span>
                    <span className="text-lg font-bold text-purple-600">
                      {selectedExecutive.performance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(selectedExecutive.performance, 100)}%` }}
                    >
                      <span className="text-xs text-white font-bold">
                        {selectedExecutive.performance.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Current Achievement</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(selectedExecutive.achievement)}
                    </p>
                    {(() => {
                      const gap = calculateGap(selectedExecutive.achievement, selectedExecutive.target);
                      const { label, value, isPositive } = formatGap(gap);
                      return (
                        <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {label}: {value}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Target Goal</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedExecutive.target)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedExecutive.totalDeals} deals closed
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedExecutive.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Position</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedExecutive.position}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    {selectedExecutive.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">ID</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedExecutive.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
              {/* Add New Note */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => onNewNoteChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
                    placeholder="Add a new note..."
                    className="flex-1 px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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

              {/* Notes List */}
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

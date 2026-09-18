import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { 
  Edit2, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  Search,
  Filter,
  Building2,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';
import type { Opportunity } from '@/types/opportunity';

interface OpportunityListProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  onView: (opportunity: Opportunity) => void;
}

export function OpportunityList({ opportunities, onEdit, onDelete, onView }: OpportunityListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('closeDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'prospecting': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-[#DFF0EC] text-[#012D29]',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getStageName = (stage: string) => {
    const names: Record<string, string> = {
      'prospecting': 'Prospecting',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost',
    };
    return names[stage] || stage;
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = 
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  // Sort opportunities
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Opportunity];
    let bValue: any = b[sortBy as keyof Opportunity];

    if (sortBy === 'closeDate' || sortBy === 'createdAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, client, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stage Filter */}
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter by stage" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="closeDate">Close Date</SelectItem>
                <SelectItem value="totalValue">Value</SelectItem>
                <SelectItem value="probability">Probability</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {sortedOpportunities.length} of {opportunities.length} opportunities
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {sortedOpportunities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium">No opportunities found</p>
              <p className="text-sm mt-1">Try adjusting your filters or create a new opportunity</p>
            </CardContent>
          </Card>
        ) : (
          sortedOpportunities.map((opportunity) => (
            <Card 
              key={opportunity.id} 
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] hover:bg-gradient-to-r hover:from-[#EEF7F5]/30 hover:to-[#EEF7F5]/30"
              onClick={() => onEdit(opportunity)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 space-y-2">
                    {/* Title & Stage */}
                    <div className="flex items-start gap-3">
                      <h3 className="font-semibold text-lg text-gray-900 flex-1">
                        {opportunity.name}
                      </h3>
                      <Badge className={getStageColor(opportunity.stage)}>
                        {getStageName(opportunity.stage)}
                      </Badge>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{opportunity.clientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{opportunity.contactPerson}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {opportunity.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {opportunity.description}
                      </p>
                    )}

                    {/* Products Summary */}
                    {opportunity.products && opportunity.products.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">Products:</span>
                        {opportunity.products.slice(0, 3).map((p, idx) => (
                          <span key={idx}>
                            {p.quantity}x {p.productName}
                            {idx < Math.min(2, opportunity.products.length - 1) && ','}
                          </span>
                        ))}
                        {opportunity.products.length > 3 && (
                          <span>+{opportunity.products.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Value */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Deal Value</div>
                      <div className="text-xl font-bold text-[#013E37] flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        {formatCurrency(opportunity.totalValue)}
                      </div>
                    </div>

                    {/* Probability */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#013E37] h-2 rounded-full transition-all"
                          style={{ width: `${opportunity.probability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {opportunity.probability}%
                      </span>
                    </div>

                    {/* Close Date */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(opportunity.closeDate)}</span>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{opportunity.ownerName}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          onEdit(opportunity);
                        }}
                        className="hover:bg-[#EEF7F5] hover:text-[#013E37]"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          onDelete(opportunity.id);
                        }}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          onView(opportunity);
                        }}
                        className="hover:bg-gray-50 hover:text-gray-600"
                      >
                        <User className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
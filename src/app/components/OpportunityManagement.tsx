import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { 
  LayoutGrid, 
  List, 
  TrendingUp, 
  Plus, 
  RefreshCw,
  DollarSign,
  Target,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { opportunitiesApi, productsApi } from '@/services/api';
import { OpportunityPipeline } from './OpportunityPipeline';
import { OpportunityList } from './OpportunityList';
import { OpportunityFormNew } from './OpportunityFormNew';
import { SalesForecast } from './SalesForecast';
import { OpportunityDetailDialog } from './OpportunityDetailDialog';

export interface ProductItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  createdBy?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  leadId?: string;
  clientName: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  
  // Products
  products: ProductItem[];
  
  // Financial
  totalValue: number;
  currency: string;
  probability: number;
  
  // Timeline
  createdDate?: string;
  closeDate: string;
  actualCloseDate?: string;
  
  // Sales Process
  stage: 'prospecting' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  status: 'open' | 'won' | 'lost';
  lossReason?: string;
  
  // Assignment
  ownerId?: string;
  ownerName: string;
  
  // Additional Info
  source: string;
  description: string;
  notes?: string;
  
  // Reminders
  nextFollowUpDate?: string;
  reminderSent: boolean;
  activities: Activity[];
  
  // NEW FIELDS - Sales Process Details
  opportunityMaturity?: {
    selected: boolean; // S - Selected
    funded: boolean; // F - Funded
    timeline: boolean; // T - Timeline
  };
  budgetStatus?: 'Budget Proposed' | 'Budget Approved' | 'Budget Released' | '';
  target?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  targetYear?: string;
  closingTarget?: string; // calendar date
  forecastType?: 'Pipeline' | 'Upside' | 'Strong Upside' | 'Forecast/Commit';
  lowHangingFruit?: boolean;
  solution?: string;
  product?: string;
  existingSystem?: string;
  competitor?: string;
  competitorWebsite?: string;
  partnerName?: string;
  partnerId?: string;
  salesRep?: string;
  salesRepId?: string;
  bizmod?: string;
  annualRevenue?: number;
  sizeOfDeal?: number;
  monthlyRev?: number;
  salesStage?: 'Engage' | 'Understand' | 'Solution' | 'Align' | 'Execute' | 'Close';
  winProbability?: number;
  currentStatus?: string;
  nextAction?: string;
  
  // Overview Details
  managerNotes?: string;
  actionsToClose?: string;
  engineerNotes?: string;
  
  // Commercial Detail
  whyBuyAnything?: string;
  whyBuyNow?: string;
  evaluationStarted?: boolean;
  budgetStatus?: 'No' | 'Available' | 'Approved';
  whyBuyIntramedika?: string;
  winStrategyBuyingProcess?: string;
  jointExecutionPlanCreated?: string;
  vendorChoice?: boolean;
  agreementStatus?: 'Agreement Reviewed' | 'Terms & Conditions Agreed' | null;
  customerCommit?: 'No' | 'Customer Commit in 90 Days' | 'Commit to Sign';
  businessCaseStatus?: 'Business Case Validated' | 'No Business Case Required' | null;
  jointExecutionPlanAgreed?: 'N/A' | 'No' | 'Yes';
  risk?: string;
  
  // Technical Detail
  functionFit?: 'Major Gaps' | 'Some Gaps (addressable)' | 'No Gaps';
  competitiveDifferentiation?: 'Disadvantage' | 'Neutral' | 'Clear Advantage';
  solutionDemoStatus?: boolean;
  implementationStrategy?: 'No Implementation Required' | 'Strategy Known' | null;
  solutionArchitectureValidated?: boolean;
  implementationPlanAgreed?: boolean;
  
  // Timestamps for Sales Detail fields
  timestamps?: {
    currentStatus?: string | null;
    nextAction?: string | null;
    notes?: string | null;
  };
  
  // Metadata
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export function OpportunityManagement() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [reminders, setReminders] = useState<any[]>([]);
  const [viewOpportunity, setViewOpportunity] = useState<Opportunity | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    fetchData();
    // Check reminders every minute
    const reminderInterval = setInterval(fetchReminders, 60000);
    return () => clearInterval(reminderInterval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [oppResult, prodResult] = await Promise.all([
        opportunitiesApi.getAll(),
        productsApi.getAll(),
      ]);
      
      if (oppResult.success && oppResult.data) {
        setOpportunities(oppResult.data);
      }
      
      if (prodResult.success && prodResult.data) {
        setProducts(prodResult.data);
      }
      
      await fetchReminders();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error loading opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const result = await opportunitiesApi.getReminders();
      if (result.success && result.data) {
        setReminders(result.data);
        
        // Show toast for urgent reminders
        result.data.forEach((reminder: any) => {
          if (reminder.priority === 'urgent' && !reminder.reminderSent) {
            toast.error(reminder.reminderMessage, {
              description: `${reminder.name} - ${reminder.clientName}`,
              duration: 10000,
            });
          }
        });
      }
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleCreate = () => {
    setSelectedOpportunity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsFormOpen(true);
  };

  const handleView = (opportunity: Opportunity) => {
    setViewOpportunity(opportunity);
    setShowDetailDialog(true);
  };

  const handleSave = async (opportunityData: Partial<Opportunity>) => {
    try {
      if (selectedOpportunity) {
        // Update
        const result = await opportunitiesApi.update(selectedOpportunity.id, opportunityData);
        if (result.success && result.data) {
          setOpportunities(opportunities.map(o => 
            o.id === selectedOpportunity.id ? result.data : o
          ));
          toast.success('Opportunity updated successfully!');
        } else {
          toast.error(result.error || 'Failed to update opportunity');
        }
      } else {
        // Create
        const result = await opportunitiesApi.create(opportunityData);
        if (result.success && result.data) {
          setOpportunities([...opportunities, result.data]);
          toast.success('Opportunity created successfully!');
        } else {
          toast.error(result.error || 'Failed to create opportunity');
        }
      }
      
      setIsFormOpen(false);
      setSelectedOpportunity(null);
    } catch (error: any) {
      console.error('Error saving opportunity:', error);
      toast.error('Error saving opportunity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }
    
    try {
      const result = await opportunitiesApi.delete(id);
      if (result.success) {
        setOpportunities(opportunities.filter(o => o.id !== id));
        toast.success('Opportunity deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete opportunity');
      }
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      toast.error('Error deleting opportunity');
    }
  };

  const handleStageChange = async (id: string, newStage: string) => {
    const opportunity = opportunities.find(o => o.id === id);
    if (!opportunity) return;

    // Auto-map Pipeline Stage to Sales Stage
    const pipelineToSalesStageMap: Record<string, string> = {
      'prospecting': 'Engage',
      'proposal': 'Solution',
      'negotiation': 'Align',
      'closed-won': 'Execute',
      'closed-lost': 'Close (Win/Loss)',
    };

    const autoSalesStage = pipelineToSalesStageMap[newStage] || opportunity.salesStage || 'Engage';

    const updatedData = {
      ...opportunity,
      stage: newStage,
      salesStage: autoSalesStage, // Auto-update sales stage based on pipeline stage
      activities: [
        ...opportunity.activities,
        {
          id: `ACT-${Date.now()}`,
          type: 'stage-change',
          description: `Stage changed to ${newStage}`,
          createdAt: new Date().toISOString(),
        }
      ],
    };

    try {
      const result = await opportunitiesApi.update(id, updatedData);
      if (result.success && result.data) {
        setOpportunities(opportunities.map(o => 
          o.id === id ? result.data : o
        ));
        toast.success(`Moved to ${newStage} • Sales Stage: ${autoSalesStage}`);
      }
    } catch (error: any) {
      console.error('Error updating stage:', error);
      toast.error('Error updating stage');
    }
  };

  // Calculate stats
  const stats = {
    total: opportunities.length,
    open: opportunities.filter(o => o.status === 'open').length,
    won: opportunities.filter(o => o.status === 'won').length,
    totalValue: opportunities
      .filter(o => o.status === 'open')
      .reduce((sum, o) => sum + o.totalValue, 0),
    weightedValue: opportunities
      .filter(o => o.status === 'open')
      .reduce((sum, o) => sum + (o.totalValue * o.probability / 100), 0),
    upside: opportunities
      .filter(o => o.status === 'open' && o.forecastType === 'Upside')
      .reduce((sum, o) => sum + o.totalValue, 0),
    strongUpside: opportunities
      .filter(o => o.status === 'open' && o.forecastType === 'Strong Upside')
      .reduce((sum, o) => sum + o.totalValue, 0),
    forecast: opportunities
      .filter(o => o.status === 'open' && o.forecastType === 'Forecast/Commit')
      .reduce((sum, o) => sum + o.totalValue, 0),
    winRate: opportunities.filter(o => o.status !== 'open').length > 0
      ? (opportunities.filter(o => o.status === 'won').length / 
         opportunities.filter(o => o.status !== 'open').length * 100).toFixed(1)
      : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01544e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#01544e]">
            Opportunity Management
          </h1>
          <p className="text-gray-600 mt-1">Track deals from prospect to close</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleCreate} 
            className="bg-[#01544e] hover:bg-[#023d39] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Deals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.open}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rp {(stats.totalValue / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upside</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rp {(stats.upside / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Strong Upside</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rp {(stats.strongUpside / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Forecast</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Rp {(stats.forecast / 1000000).toFixed(0)}M
                </p>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-teal-600" />
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
                  Rp {(stats.weightedValue / 1000000).toFixed(0)}M
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.winRate}%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders */}
      {reminders.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-5 w-5" />
              Action Required ({reminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reminders.slice(0, 3).map((reminder: any) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{reminder.name}</p>
                    <p className="text-sm text-gray-600">{reminder.clientName}</p>
                    <p className="text-sm text-orange-600 mt-1">{reminder.reminderMessage}</p>
                  </div>
                  <Badge className={
                    reminder.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    reminder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {reminder.daysUntilClose < 0 ? 'Overdue' : `${reminder.daysUntilClose}d left`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-14 bg-gray-100/50 p-1 flex overflow-x-auto no-scrollbar justify-start max-w-xl">
          <TabsTrigger value="pipeline" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <div className="flex items-center gap-1.5 justify-center">
              <LayoutGrid className="h-4 w-4" />
              <span className="font-bold text-sm">Pipeline</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">VISUALISASI PROSES</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <div className="flex items-center gap-1.5 justify-center">
              <List className="h-4 w-4" />
              <span className="font-bold text-sm">List View</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">DATA TERSTRUKTUR</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex flex-col gap-0.5 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700 min-w-[120px]">
            <div className="flex items-center gap-1.5 justify-center">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold text-sm">Forecast</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">PREDIKSI PENJUALAN</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-6">
          <OpportunityPipeline 
            opportunities={opportunities}
            onStageChange={handleStageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <OpportunityList 
            opportunities={opportunities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <SalesForecast opportunities={opportunities} />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      {isFormOpen && (
        <OpportunityFormNew
          opportunity={selectedOpportunity}
          products={products}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedOpportunity(null);
          }}
        />
      )}

      {/* Detail Dialog */}
      {showDetailDialog && (
        <OpportunityDetailDialog
          open={showDetailDialog}
          opportunity={viewOpportunity}
          onClose={() => setShowDetailDialog(false)}
        />
      )}
    </div>
  );
}
export interface KPITargetData {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  periodType: 'monthly' | 'quarterly' | 'yearly';
  
  revenueTarget: number;
  revenueActual: number;
  
  dealsTarget: number;
  dealsActual: number;
  
  activitiesTarget: number;
  activitiesActual: number;
  
  conversionRateTarget: number;
  conversionRateActual: number;
  
  meetingsTarget: number;
  meetingsActual: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestions: string[];
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  priority: number;
  title: string;
  description: string;
  expectedImpact: string;
  successProbability: number;
  actionItems: string[];
  estimatedTime: string;
}

export interface AIPrediction {
  metric: string;
  currentValue: number;
  targetValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  risk: 'low' | 'medium' | 'high';
}

export interface AIAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metric: string;
  timestamp: string;
  actionRequired: boolean;
}

export interface Manager {
  id: string;
  name: string;
  position: string;
  department: string;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  managerId: string;
}

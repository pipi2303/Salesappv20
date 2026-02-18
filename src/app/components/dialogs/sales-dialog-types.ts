// Shared types and interfaces for Sales Dialogs

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
  achievement: number;
  target: number;
  performance: number;
  totalDeals: number;
  email: string;
  pipelineValue?: number;
  upside?: number;
  strongUpside?: number;
  forecast?: number;
}

export interface Manager extends TeamMember {
  team: TeamMember[];
}

export interface AreaManager extends TeamMember {
  managers: Manager[];
}

export interface Director extends TeamMember {
  areaManagers: AreaManager[];
  accountManagers: TeamMember[];
}

export interface SalesExecutive extends TeamMember {
  // Sales Executive doesn't have a team, just extends TeamMember
}

export interface Note {
  id: string;
  text: string;
  timestamp: Date;
}

// Helper function to calculate gap between actual and target
export const calculateGap = (actual: number, target: number): number => {
  return actual - target;
};

// Helper function to format gap display (Short/Surplus)
export const formatGap = (gap: number): { label: string; value: string; isPositive: boolean } => {
  const absGap = Math.abs(gap);
  // Using basic formatting since formatCurrency will be imported separately
  const formattedValue = `Rp ${(absGap / 1000000).toFixed(0)}M`;
  
  if (gap < 0) {
    return {
      label: 'Short',
      value: formattedValue,
      isPositive: false
    };
  } else {
    return {
      label: 'Surplus',
      value: formattedValue,
      isPositive: true
    };
  }
};

// Helper function to format timestamp
export const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

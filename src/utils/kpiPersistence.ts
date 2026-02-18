import { KPITargetData, Manager } from '@/types/kpi-enhanced';
import { KPI_MANAGERS } from '@/data/kpi-managers';

const STORAGE_KEY = 'sales_monitoring_kpi_targets';

export const getKPITargets = (): KPITargetData[] => {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing KPI data from localStorage:', error);
      return [];
    }
  }
  
  // If no data exists, generate initial data
  const initialData = generateInitialData();
  saveKPITargets(initialData);
  return initialData;
};

export const saveKPITargets = (targets: KPITargetData[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
};

export const updateKPITarget = (target: KPITargetData): KPITargetData[] => {
  const currentTargets = getKPITargets();
  const index = currentTargets.findIndex(t => t.id === target.id);
  
  let newTargets;
  if (index >= 0) {
    newTargets = [...currentTargets];
    newTargets[index] = { ...target, updatedAt: new Date().toISOString() };
  } else {
    newTargets = [...currentTargets, { ...target, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
  }
  
  saveKPITargets(newTargets);
  return newTargets;
};

// Helper function to generate initial data (migrated from KPIAIEnhanced.tsx)
const generateInitialData = (): KPITargetData[] => {
  const mockTargets: KPITargetData[] = [];
  
  // Generate for all period types
  const periods = [
    // Monthly 2026
    ...Array.from({ length: 12 }, (_, i) => ({
      period: `2026-${String(i + 1).padStart(2, '0')}`,
      periodType: 'monthly' as const,
      multiplier: 1
    })),
    // Quarterly 2026
    { period: '2026-Q1', periodType: 'quarterly' as const, multiplier: 3 },
    { period: '2026-Q2', periodType: 'quarterly' as const, multiplier: 3 },
    { period: '2026-Q3', periodType: 'quarterly' as const, multiplier: 3 },
    { period: '2026-Q4', periodType: 'quarterly' as const, multiplier: 3 },
    // Yearly
    { period: '2026', periodType: 'yearly' as const, multiplier: 12 },
    { period: '2025', periodType: 'yearly' as const, multiplier: 12 },
  ];
  
  KPI_MANAGERS.forEach((manager, managerIndex) => {
    periods.forEach(({ period, periodType, multiplier: periodMultiplier }) => {
      // Create target for manager
      mockTargets.push({
        id: `TARGET-${manager.id}-${period}`,
        employeeId: manager.id,
        employeeName: manager.name,
        period,
        periodType,
        revenueTarget: 1150000000 * periodMultiplier,
        revenueActual: (920000000 + (Math.random() * 100000000)) * periodMultiplier,
        dealsTarget: 25 * periodMultiplier,
        dealsActual: Math.floor((20 + Math.random() * 8) * periodMultiplier),
        activitiesTarget: 150 * periodMultiplier,
        activitiesActual: Math.floor((120 + Math.random() * 40) * periodMultiplier),
        conversionRateTarget: 30,
        conversionRateActual: 25 + (Math.random() * 10),
        meetingsTarget: 50 * periodMultiplier,
        meetingsActual: Math.floor((40 + Math.random() * 15) * periodMultiplier),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create targets for team members
      manager.teamMembers.forEach((member, memberIndex) => {
        const memberMultiplier = memberIndex + 1;
        mockTargets.push({
          id: `TARGET-${member.id}-${period}`,
          employeeId: member.id,
          employeeName: member.name,
          period,
          periodType,
          revenueTarget: (memberMultiplier * 150000000 + (managerIndex * 50000000)) * periodMultiplier,
          revenueActual: ((memberMultiplier * 150000000 + (managerIndex * 50000000)) * (0.65 + Math.random() * 0.35)) * periodMultiplier,
          dealsTarget: (memberMultiplier * 4 + 2) * periodMultiplier,
          dealsActual: Math.floor(((memberMultiplier * 4 + 2) * (0.6 + Math.random() * 0.45)) * periodMultiplier),
          activitiesTarget: (40 + (memberMultiplier * 8)) * periodMultiplier,
          activitiesActual: Math.floor(((40 + (memberMultiplier * 8)) * (0.7 + Math.random() * 0.3)) * periodMultiplier),
          conversionRateTarget: 22 + (memberMultiplier * 3),
          conversionRateActual: (22 + (memberMultiplier * 3)) * (0.75 + Math.random() * 0.35),
          meetingsTarget: (15 + (memberMultiplier * 3)) * periodMultiplier,
          meetingsActual: Math.floor(((15 + (memberMultiplier * 3)) * (0.65 + Math.random() * 0.4)) * periodMultiplier),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    });
  });

  return mockTargets;
};

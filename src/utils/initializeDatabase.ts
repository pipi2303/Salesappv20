import { leads, products, demos, contracts, salesTeam, users, auditLogs, opportunities } from '@/app/data/dummyData';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-67367fc1`;

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database with dummy data...');
    
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
      body: JSON.stringify({
        leads,
        products,
        demos,
        contracts,
        salesTeam,
        users,
        auditTrail: auditLogs,
        opportunities,
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Database initialized successfully!');
      console.log(`  - Leads: ${leads.length}`);
      console.log(`  - Products: ${products.length}`);
      console.log(`  - Demos: ${demos.length}`);
      console.log(`  - Contracts: ${contracts.length}`);
      console.log(`  - Sales Team: ${salesTeam.length}`);
      console.log(`  - Users: ${users.length}`);
      console.log(`  - Audit Logs: ${auditLogs.length}`);
      console.log(`  - Opportunities: ${opportunities.length}`);
      
      // Mark as initialized in localStorage
      localStorage.setItem('dbInitialized', 'true');
      
      return { success: true };
    } else {
      console.error('❌ Failed to initialize database:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('❌ Error initializing database:', error);
    return { success: false, error: error.message };
  }
}

export function isDataInitialized(): boolean {
  return localStorage.getItem('dbInitialized') === 'true';
}

export function resetInitialization() {
  localStorage.removeItem('dbInitialized');
}
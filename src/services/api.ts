// Mock API config values (Supabase disabled)
const projectId = 'mock-project';
const publicAnonKey = 'mock-anon-key';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-67367fc1`;
const USE_LOCAL_STORAGE = true; // Pure frontend mode - always use localStorage

// LocalStorage Keys
const LS_KEYS = {
  LEADS: 'sales_monitoring_leads',
  PRODUCTS: 'sales_monitoring_products',
  DEMOS: 'sales_monitoring_demos',
  CONTRACTS: 'sales_monitoring_contracts',
  SALES_TEAM: 'sales_monitoring_sales_team',
  OPPORTUNITIES: 'sales_monitoring_opportunities',
  CLIENTS: 'sales_monitoring_clients',
  PARTNERS: 'sales_monitoring_partners',
  EMPLOYEES: 'sales_monitoring_employees',
  USERS: 'sales_monitoring_users',
  AUDIT_TRAIL: 'sales_monitoring_audit_trail',
};

// LocalStorage Helper Functions
const localStorageHelper = {
  get: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  },
  
  add: <T extends { id: string }>(key: string, item: T): T => {
    const items = localStorageHelper.get<T>(key);
    items.push(item);
    localStorageHelper.set(key, items);
    return item;
  },
  
  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null => {
    const items = localStorageHelper.get<T>(key);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    localStorageHelper.set(key, items);
    return items[index];
  },
  
  delete: (key: string, id: string): boolean => {
    const items = localStorageHelper.get(key);
    const filtered = items.filter((item: any) => item.id !== id);
    if (filtered.length === items.length) return false;
    
    localStorageHelper.set(key, filtered);
    return true;
  },
  
  clear: (key: string): void => {
    localStorageHelper.set(key, []);
  },
};

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    
    // If using localStorage fallback, don't return error
    if (USE_LOCAL_STORAGE) {
      throw error; // Let the caller handle with localStorage
    }
    
    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// Wrapper function to use localStorage as fallback
async function apiCallWithFallback<T>(
  endpoint: string,
  localStorageKey: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  if (USE_LOCAL_STORAGE) {
    // Use localStorage directly
    try {
      const method = options.method || 'GET';
      
      if (method === 'GET') {
        const data = localStorageHelper.get<any>(localStorageKey);
        return { success: true, data: data as T };
      }
      
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        const newItem = { ...body, id: body.id || crypto.randomUUID() };
        localStorageHelper.add(localStorageKey, newItem);
        return { success: true, data: newItem as T };
      }
      
      if (method === 'PUT') {
        const id = endpoint.split('/').pop();
        const body = JSON.parse(options.body as string);
        const updated = localStorageHelper.update(localStorageKey, id!, body);
        if (!updated) {
          return { success: false, error: 'Item not found' };
        }
        return { success: true, data: updated as T };
      }
      
      if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        if (id && endpoint.includes('/')) {
          // Delete single item
          const deleted = localStorageHelper.delete(localStorageKey, id);
          if (!deleted) {
            return { success: false, error: 'Item not found' };
          }
        } else {
          // Clear all
          localStorageHelper.clear(localStorageKey);
        }
        return { success: true };
      }
      
      return { success: false, error: 'Unsupported method' };
    } catch (error: any) {
      console.error(`LocalStorage Error (${endpoint}):`, error);
      return {
        success: false,
        error: error.message || 'LocalStorage error',
      };
    }
  }
  
  // Try API call
  return apiCall<T>(endpoint, options);
}

// ===== LEADS API =====
export const leadsApi = {
  getAll: () => apiCallWithFallback<any[]>(`/leads`, LS_KEYS.LEADS),
  
  create: (lead: any) =>
    apiCallWithFallback<any>(`/leads`, LS_KEYS.LEADS, {
      method: 'POST',
      body: JSON.stringify(lead),
    }),
  
  update: (id: string, lead: any) =>
    apiCallWithFallback<any>(`/leads/${id}`, LS_KEYS.LEADS, {
      method: 'PUT',
      body: JSON.stringify(lead),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/leads/${id}`, LS_KEYS.LEADS, {
      method: 'DELETE',
    }),
  
  clearAll: () =>
    apiCallWithFallback<void>(`/leads`, LS_KEYS.LEADS, {
      method: 'DELETE',
    }),
};

// ===== PRODUCTS API =====
export const productsApi = {
  getAll: () => apiCallWithFallback<any[]>(`/products`, LS_KEYS.PRODUCTS),
  
  create: (product: any) =>
    apiCallWithFallback<any>(`/products`, LS_KEYS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(product),
    }),
  
  update: (id: string, product: any) =>
    apiCallWithFallback<any>(`/products/${id}`, LS_KEYS.PRODUCTS, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/products/${id}`, LS_KEYS.PRODUCTS, {
      method: 'DELETE',
    }),
};

// ===== DEMOS API =====
export const demosApi = {
  getAll: () => apiCallWithFallback<any[]>(`/demos`, LS_KEYS.DEMOS),
  
  create: (demo: any) =>
    apiCallWithFallback<any>(`/demos`, LS_KEYS.DEMOS, {
      method: 'POST',
      body: JSON.stringify(demo),
    }),
  
  update: (id: string, demo: any) =>
    apiCallWithFallback<any>(`/demos/${id}`, LS_KEYS.DEMOS, {
      method: 'PUT',
      body: JSON.stringify(demo),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/demos/${id}`, LS_KEYS.DEMOS, {
      method: 'DELETE',
    }),
  
  clearAll: () =>
    apiCallWithFallback<void>(`/demos`, LS_KEYS.DEMOS, {
      method: 'DELETE',
    }),
};

// ===== CONTRACTS API =====
export const contractsApi = {
  getAll: () => apiCallWithFallback<any[]>(`/contracts`, LS_KEYS.CONTRACTS),
};

// ===== SALES TEAM API =====
export const salesTeamApi = {
  getAll: () => apiCallWithFallback<any[]>(`/sales-team`, LS_KEYS.SALES_TEAM),
};

// ===== REPORTS API =====
export const reportsApi = {
  getOverview: () => apiCall<any>(`/reports/overview`),
};

// ===== USERS API =====
export const usersApi = {
  getAll: (accessToken?: string) =>
    apiCallWithFallback<any[]>(`/users`, LS_KEYS.USERS, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
  
  create: (accessToken?: string, user?: any) =>
    apiCallWithFallback<any>(`/users`, LS_KEYS.USERS, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
  
  update: (accessToken: string | undefined, id: string, user: any) =>
    apiCallWithFallback<any>(`/users/${id}`, LS_KEYS.USERS, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
  
  delete: (accessToken: string | undefined, id: string) =>
    apiCallWithFallback<void>(`/users/${id}`, LS_KEYS.USERS, {
      method: 'DELETE',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
};

// ===== AUDIT TRAIL API =====
export const auditTrailApi = {
  getAll: (accessToken?: string) =>
    apiCallWithFallback<any[]>(`/audit-trail`, LS_KEYS.AUDIT_TRAIL, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }),
  
  create: (entry: any) =>
    apiCallWithFallback<any>(`/audit-trail`, LS_KEYS.AUDIT_TRAIL, {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
};

// ===== AUTHENTICATION API =====
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    apiCall<any>(`/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
};

// ===== INITIALIZATION API =====
export const initApi = {
  // Helper untuk seed initial data
  seedData: async (dataType: string, data: any[]) => {
    const key = dataType;
    // Directly call the KV store through a generic endpoint
    // This would need to be implemented on the server side
    return apiCall<void>(`/seed-data`, {
      method: 'POST',
      body: JSON.stringify({ key, data }),
    });
  },
};

// ===== OPPORTUNITIES API =====
export const opportunitiesApi = {
  getAll: () => apiCallWithFallback<any[]>(`/opportunities`, LS_KEYS.OPPORTUNITIES),
  
  create: (opportunity: any) =>
    apiCallWithFallback<any>(`/opportunities`, LS_KEYS.OPPORTUNITIES, {
      method: 'POST',
      body: JSON.stringify(opportunity),
    }),
  
  update: (id: string, opportunity: any) =>
    apiCallWithFallback<any>(`/opportunities/${id}`, LS_KEYS.OPPORTUNITIES, {
      method: 'PUT',
      body: JSON.stringify(opportunity),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/opportunities/${id}`, LS_KEYS.OPPORTUNITIES, {
      method: 'DELETE',
    }),
  
  convertLead: (leadId: string, opportunityData: any) =>
    apiCallWithFallback<any>(`/opportunities/convert-lead/${leadId}`, LS_KEYS.OPPORTUNITIES, {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    }),
  
  getReminders: () => {
    // Get reminders from opportunities (filter by close date)
    if (USE_LOCAL_STORAGE) {
      const opportunities = localStorageHelper.get<any>(LS_KEYS.OPPORTUNITIES);
      const today = new Date();
      const reminders = opportunities.filter((opp: any) => {
        if (!opp.closeDate) return false;
        const closeDate = new Date(opp.closeDate);
        const diffDays = Math.floor((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7; // Within 7 days
      });
      return Promise.resolve({ success: true, data: reminders });
    }
    return apiCall<any[]>(`/opportunities/reminders`);
  },
};

// ===== CLIENTS API =====
export const clientsApi = {
  getAll: () => apiCallWithFallback<any[]>(`/clients`, LS_KEYS.CLIENTS),
  
  create: (client: any) =>
    apiCallWithFallback<any>(`/clients`, LS_KEYS.CLIENTS, {
      method: 'POST',
      body: JSON.stringify(client),
    }),
  
  update: (id: string, client: any) =>
    apiCallWithFallback<any>(`/clients/${id}`, LS_KEYS.CLIENTS, {
      method: 'PUT',
      body: JSON.stringify(client),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/clients/${id}`, LS_KEYS.CLIENTS, {
      method: 'DELETE',
    }),
};

// ===== PARTNERS API =====
export const partnersApi = {
  getAll: () => apiCallWithFallback<any[]>(`/partners`, LS_KEYS.PARTNERS),
  
  create: (partner: any) =>
    apiCallWithFallback<any>(`/partners`, LS_KEYS.PARTNERS, {
      method: 'POST',
      body: JSON.stringify(partner),
    }),
  
  update: (id: string, partner: any) =>
    apiCallWithFallback<any>(`/partners/${id}`, LS_KEYS.PARTNERS, {
      method: 'PUT',
      body: JSON.stringify(partner),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/partners/${id}`, LS_KEYS.PARTNERS, {
      method: 'DELETE',
    }),
};

// ===== EMPLOYEES API =====
export const employeesApi = {
  getAll: () => apiCallWithFallback<any[]>(`/employees`, LS_KEYS.EMPLOYEES),
  
  create: (employee: any) =>
    apiCallWithFallback<any>(`/employees`, LS_KEYS.EMPLOYEES, {
      method: 'POST',
      body: JSON.stringify(employee),
    }),
  
  update: (id: string, employee: any) =>
    apiCallWithFallback<any>(`/employees/${id}`, LS_KEYS.EMPLOYEES, {
      method: 'PUT',
      body: JSON.stringify(employee),
    }),
  
  delete: (id: string) =>
    apiCallWithFallback<void>(`/employees/${id}`, LS_KEYS.EMPLOYEES, {
      method: 'DELETE',
    }),
};
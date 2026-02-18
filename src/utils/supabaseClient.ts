// Mock Supabase client for pure frontend mode
// All authentication and data storage is handled via localStorage

// Mock supabase client object
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithPassword: async () => ({ 
      data: { session: null, user: null }, 
      error: { message: 'Supabase is disabled. Please use demo login.' } 
    }),
    signOut: async () => ({ error: null }),
  },
};

export default supabase;
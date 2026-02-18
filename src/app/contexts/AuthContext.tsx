import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  email: string;
  name: string;
  role: string;
  id?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, role: string, name: string) => void;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('salesMonitorUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('salesMonitorUser');
      }
    }
  }, []);

  // Demo login (for quick access buttons)
  const login = (email: string, role: string, name: string) => {
    // Create a mock access token for demo purposes
    const mockAccessToken = 'demo-access-token-' + Date.now();
    const userData = { 
      email, 
      name, 
      role,
      id: 'user-' + Date.now(),
      accessToken: mockAccessToken 
    };
    setUser(userData);
    localStorage.setItem('salesMonitorUser', JSON.stringify(userData));
  };

  // Mock Supabase login (disabled - redirects to demo login)
  const loginWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Supabase is disabled, return error message
    return { 
      success: false, 
      error: 'Backend authentication is disabled. Please use the demo login buttons below.' 
    };
  };

  // Logout
  const logout = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('salesMonitorUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithSupabase,
        logout,
        isAuthenticated: !!user,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  id?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, role: string, name: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fase 1 item 3/4: the backend's Role enum (prisma/schema.prisma) is
// SCREAMING_SNAKE_CASE; the rest of this app's RBAC checks (e.g.
// TaskManagement.tsx, AdminSystem.tsx) compare against the human-readable
// "Super Admin" style strings that the old demo accounts used. This map is
// the one seam between the two so neither side has to change.
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SALES_MANAGER: 'Sales Manager',
  SALES_REPRESENTATIVE: 'Sales Representative',
  SALES_EXECUTIVE: 'Sales Executive',
  MASTER_DATA_ADMIN: 'Master Data Admin',
};

function toDisplayRole(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

// A token minted by the old client-only demo login (AuthContext.login,
// still used for quick-access flows). Never send these to the real API.
function isDemoToken(token: string | undefined): boolean {
  return !token || token.startsWith('demo-access-token-');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);

  // Load user from localStorage on mount, then confirm real (non-demo)
  // sessions are still valid server-side — item 3's "session divalidasi
  // backend", rather than just trusting whatever's cached locally.
  useEffect(() => {
    const savedUser = localStorage.getItem('salesMonitorUser');
    if (!savedUser) return;

    let parsed: AuthUser;
    try {
      parsed = JSON.parse(savedUser);
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('salesMonitorUser');
      return;
    }

    if (isDemoToken(parsed.accessToken)) {
      setUser(parsed);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${parsed.accessToken}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((body: { data: { id: string; email: string; name: string; role: string } }) => {
        setUser({
          email: body.data.email,
          name: body.data.name,
          role: toDisplayRole(body.data.role),
          id: body.data.id,
          accessToken: parsed.accessToken,
        });
      })
      .catch(() => {
        // Expired/revoked/invalid — don't leave a dead session sitting in
        // localStorage pretending to still be logged in.
        localStorage.removeItem('salesMonitorUser');
        setUser(null);
      });
  }, []);

  // Demo login (for quick access buttons) — unchanged, still fully mock.
  const login = (email: string, role: string, name: string) => {
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

  // Real login against the Fase 1 backend (POST /api/auth/login) —
  // server-hashed password check + a backend-issued, revocable session
  // token. Replaces the old client-side loginWithSupabase stub.
  const loginWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();

      if (!res.ok || !body.success) {
        return { success: false, error: body.error ?? 'Email atau password salah' };
      }

      const userData: AuthUser = {
        email: body.data.user.email,
        name: body.data.user.name,
        role: toDisplayRole(body.data.user.role),
        id: body.data.user.id,
        accessToken: body.data.token,
      };
      setUser(userData);
      localStorage.setItem('salesMonitorUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('loginWithCredentials failed:', error);
      return {
        success: false,
        error: 'Tidak dapat terhubung ke server. Periksa koneksi Anda dan coba lagi.',
      };
    }
  };

  // Logout — revokes the session server-side when it's a real one (a demo
  // token has nothing on the backend to revoke).
  const logout = async () => {
    if (user?.accessToken && !isDemoToken(user.accessToken)) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
      } catch (error) {
        // Best-effort: even if the revoke call fails (offline, etc.), the
        // client still forgets the session below.
        console.error('logout revoke failed:', error);
      }
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('salesMonitorUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithCredentials,
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

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const ADMIN_USERNAME = 'mserman90';

interface AuthContextType {
  isAdmin: boolean;
  username: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = username === ADMIN_USERNAME;

  const login = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Verify the token against GitHub API
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return false;

      const data = await res.json();
      const ghUsername = data.login;

      if (ghUsername === ADMIN_USERNAME) {
        setUsername(ghUsername);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

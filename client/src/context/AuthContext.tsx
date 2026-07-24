import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getErrorMessage } from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const { data } = await api.get<User>("/api/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    try {
      await api.post("/api/auth/sign-in/email", { email, password });
      await refreshUser();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      await api.post("/api/auth/sign-up/email", { name, email, password });
      await refreshUser();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  async function logout() {
    try {
      await api.post("/api/auth/sign-out");
    } catch {
      // even if the request fails, clear local state so the UI reflects logged-out
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
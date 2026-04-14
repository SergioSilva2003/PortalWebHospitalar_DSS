import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "patient" | "doctor" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  tokenExpiry: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock auth for frontend demo — replace with Django REST calls
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call — replace with: POST /api/auth/login/
    await new Promise((r) => setTimeout(r, 800));
    const role: UserRole = email.includes("admin")
      ? "admin"
      : email.includes("doctor")
      ? "doctor"
      : "patient";
    setUser({
      id: "usr_" + Math.random().toString(36).slice(2, 10),
      name: email.split("@")[0],
      email,
      role,
    });
    setToken("mock_jwt_" + Date.now());
    setTokenExpiry(Date.now() + 15 * 60 * 1000); // 15 min
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: "usr_" + Math.random().toString(36).slice(2, 10), name, email, role: "patient" });
    setToken("mock_jwt_" + Date.now());
    setTokenExpiry(Date.now() + 15 * 60 * 1000);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpiry(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, register, logout, tokenExpiry }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

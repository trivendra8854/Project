import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (data: SignupData) => void;
  logout: () => void;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nyayasetu_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const signup = (data: SignupData) => {
    const u: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      city: data.city,
    };
    const accounts = JSON.parse(localStorage.getItem("nyayasetu_accounts") || "[]");
    accounts.push({ ...data });
    localStorage.setItem("nyayasetu_accounts", JSON.stringify(accounts));
    localStorage.setItem("nyayasetu_user", JSON.stringify(u));
    setUser(u);
  };

  const login = (email: string, password: string): boolean => {
    const accounts = JSON.parse(localStorage.getItem("nyayasetu_accounts") || "[]");
    const found = accounts.find((a: SignupData) => a.email === email && a.password === password);
    if (found) {
      const u: User = {
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        phone: found.phone,
        city: found.city,
      };
      localStorage.setItem("nyayasetu_user", JSON.stringify(u));
      setUser(u);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("nyayasetu_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

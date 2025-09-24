"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { AuthUser } from "@/types/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  signUp: (user: AuthUser, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (user: AuthUser, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const signUp = (user: AuthUser, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Validate token on route change and periodically
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const validate = async () => {
      try {
        // call /me (baseURL already contains /api)
        await api.get("/me");
        // if success, do nothing
      } catch (err: any) {
        // axios errors contain response.status
        if (err?.response?.status === 401) {
          // Token is stale — logout immediately
          logout();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        } else {
          // other errors are ignored here but logged
          // keep token as-is
          // console.error("Token validation error:", err);
        }
      }
    };

    // validate immediately when token or pathname changes
    validate();

    // set up periodic validation (every 5 minutes)
    const interval = setInterval(() => {
      validate();
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token, pathname]); // re-run on route change

  return (
    <AuthContext.Provider value={{ user, token, login, logout,signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

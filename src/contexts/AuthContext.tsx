"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/config/axios";
import type { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (t: string, u: User) => {
    if (typeof window !== "undefined") localStorage.setItem("auth_token", t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!t) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<User>("/api/user/me");
      setUser(data);
      setToken(t);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!t) {
      setLoading(false);
      return;
    }
    setToken(t);
    refreshUser();
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth_logout", handler);
    return () => window.removeEventListener("auth_logout", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

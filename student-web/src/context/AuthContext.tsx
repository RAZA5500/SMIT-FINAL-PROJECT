"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type UserRole = "admin" | "customer";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

/* ------------------------------------------------------------------ */
/*  Demo credentials (replace with real API later)                     */
/* ------------------------------------------------------------------ */
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  "admin@gmail.com": {
    password: "12345678",
    user: { email: "admin@gmail.com", name: "Admin User", role: "admin" },
  },
  "user@freshes.co.uk": {
    password: "12345678",
    user: { email: "user@freshes.co.uk", name: "Customer", role: "customer" },
  },
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("freshes_auth");
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      /* ignore parse errors */
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 600));

      const account = DEMO_ACCOUNTS[email.toLowerCase()];
      if (!account || account.password !== password) {
        return { success: false, message: "Invalid email or password." };
      }

      setUser(account.user);
      localStorage.setItem("freshes_auth", JSON.stringify(account.user));

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("freshes_auth");
    toast.success("Signed Out Successfully", {
      description: "You have been logged out. See you soon!",
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
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

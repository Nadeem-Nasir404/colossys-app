import React, { createContext, useCallback, useState } from "react";
import * as storage from "../utils/storage";

export type AuthContextType = {
  userToken: string | null;
  user: any | null;
  restoreSession: () => Promise<void>;
  login: (token: string, user?: any) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  user: null,
  restoreSession: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const REST_BASE = "http://192.168.1.101:801/api"; // ✅ Base API

  const restoreSession = useCallback(async () => {
    const token = await storage.getToken();
    console.log("🔑 Restored token:", token);

    if (token) {
      setUserToken(token);
    } else {
      setUserToken(null);
    }
  }, []);

  const login = useCallback(async (token: string, u?: any) => {
    await storage.saveToken(token);
    setUserToken(token);
    setUser(u ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (userToken) {
        console.log("📤 Logging out from server...");
        await fetch(`${REST_BASE}/account/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
      }
    } catch (err) {
      console.warn("⚠️ Server logout failed:", err);
    } finally {
      // Always clear local session
      await storage.removeToken();
      setUserToken(null);
      setUser(null);
      console.log("✅ Logged out locally");
    }
  }, [userToken]);

  return (
    <AuthContext.Provider
      value={{ userToken, user, restoreSession, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

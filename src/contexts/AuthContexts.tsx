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

  const restoreSession = useCallback(async () => {
    const token = await storage.getToken();
    console.log("🔑 Restored token:", token);
    setUserToken(token ?? null);
  }, []);

  const login = useCallback(async (token: string, u?: any) => {
    await storage.saveToken(token);
    setUserToken(token);
    setUser(u ?? null);
  }, []);

  const logout = useCallback(async () => {
    await storage.removeToken();
    setUserToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, user, restoreSession, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

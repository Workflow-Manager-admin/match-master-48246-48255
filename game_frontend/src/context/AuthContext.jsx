import React, { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // PUBLIC_INTERFACE
  /**
   * Provides user authentication context (simple in-memory mock)
   */
  const [user, setUser] = useState(null);
  const login = (userObj) => setUser({ ...userObj });
  const logout = () => setUser(null);
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  // PUBLIC_INTERFACE
  /**
   * Access authentication context
   */
  return useContext(AuthContext);
}

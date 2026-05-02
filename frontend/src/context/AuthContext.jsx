import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem("techmart_admin") || "null"));

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("techmart_token", data.token);
    localStorage.setItem("techmart_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("techmart_token", data.token);
    localStorage.setItem("techmart_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem("techmart_token");
    localStorage.removeItem("techmart_admin");
    setAdmin(null);
  };

  const value = useMemo(() => ({ admin, login, logout, register, isAuthenticated: Boolean(admin) }), [admin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

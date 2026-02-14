import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "fft_token";
const USER_KEY = "fft_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setAuth = (data) => {
    const nextToken = data?.token || "";
    const nextUser = data
      ? { _id: data._id, name: data.name, email: data.email }
      : null;

    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    setToken(nextToken || null);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUser({ email, password });
      setAuth(data);
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await registerUser({ name, email, password });
      setAuth(data);
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, register, logout }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
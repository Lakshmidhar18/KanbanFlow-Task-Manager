import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);

  // Load token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setTokenState(savedToken);
    }
  }, []);

  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

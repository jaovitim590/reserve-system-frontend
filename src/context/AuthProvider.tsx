import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { type User } from "../services/authService";
import { TOKEN_KEY } from "../lib/token";
import authService from "../services/authService";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  // Se não há token, já inicia sem loading
  const [loading, setLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const setAccessToken = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  useEffect(() => {
    if (!token) return;

    authService.getUser()
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setAccessToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
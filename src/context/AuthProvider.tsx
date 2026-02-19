import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { type User } from "../services/authService";
import { TOKEN_KEY } from "../lib/token";
import authService from "../services/authService";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const setAccessToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  };

  useEffect(() => {

    if (!token) {
      setLoading(false)
      return;}
      

    authService.getUser()
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(()=> setLoading(false))
  }, [token]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ user, token,loading, setAccessToken, setUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

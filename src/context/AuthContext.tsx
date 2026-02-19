import React, { createContext, useEffect, useState } from "react";
import { type User } from "../services/authService";
import { TOKEN_KEY } from "../lib/token";
import authService from "../services/authService";

type AuthContextProps = {
  user?: User;
  token: string | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider(
  {children}: React.PropsWithChildren
) {
  const [user, setUser] =   useState<User>();
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

  const setAccessToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    setToken(token)
  }

  useEffect(() => {
    if (!token) return
  
    authService.getUser()
      .then((user) => setUser(user))
      .catch(() => {
        setToken(null)
        localStorage.removeItem(TOKEN_KEY)
      })
  }, [])
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(undefined)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      setAccessToken,
      setUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
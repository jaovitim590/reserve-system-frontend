import { createContext } from "react";
import { type User } from "../services/authService";

export type AuthContextProps = {
  user?: User;
  token: string | null;
  loading: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

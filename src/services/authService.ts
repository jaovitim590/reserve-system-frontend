import { api } from "./api";
import {ROLE} from "../lib/role"

type SignInPayload = {
  email: string;
  password: string;
}

type SignUpPayload = {
  name: string,
  email: string,
  password: string
}

type TokenResponse = {
  token: string;
}


export type User = {
  name: string;
  email: string;
  role: string;
}

async function signIn({email, password}: SignInPayload): Promise<TokenResponse> {
  try {
    const res = await api.post<TokenResponse>("/api/auth/login", {
      email,
      password
    });
    return res.data;
  } catch (error) {
    throw new Error("Falha ao fazer login. Verifique suas credenciais.");
  }
}

async function signUp({name, email, password}: SignUpPayload) {
  try{
    const res = await api.post("/api/auth/register",{
      email,
      password,
      name,
      role: ROLE
    });
    return res.data;
  }catch (error){
    throw new Error("falha ao fazer registro")
  }
}


async function getUser(): Promise<User> {
  const res = await api.get('/api/auth/me')
  return res.data;
}

export default{
  signIn,
  signUp,
  getUser
}
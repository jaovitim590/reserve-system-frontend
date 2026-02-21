import { api } from "./api";
import { TOKEN_KEY } from "../lib/token";

export type userProps={
  email: string,
  name: string,
  data_criado: string
}

type userUpdate={
  message: string,
  perfil: userProps
}

export async function getPerfil(): Promise<userProps> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.get<userProps>("/api/user/perfil",{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return res.data;
}

export async function updatePerfil(nome: string): Promise<userUpdate>{
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.put("/api/user/perfil",{
    name: nome
  },{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  return res.data;
}

export async function deletePerfil() {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await api.delete("/api/user/perfil",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })

  return res.data;
}
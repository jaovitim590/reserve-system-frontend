import { adminApi } from "./api";
import { TOKEN_KEY } from "../lib/token";

type quartoRes ={
  id: number,
  status: string,
  descricao: string,
  capacidade: number,
  name: string,
  valor: number,
  tipo: string,
  data_criacao: string
}
type bestRes ={
  total: number,
  quarto: quartoRes
}
type authorities = {
  authority: string
}
type usuarioRes = {
  id: number,
  email: string,
  password: string,
  name: string,
  role: string,
  data_criado: string,
  ativo: boolean,
  authorities: authorities
}
type reservaRes = {
  id: number,
  status: string,
  quarto: quartoRes,
  usuario: usuarioRes,
  data_incio: string,
  data_fim: string,
  valorTotal: number,
  data_criado: string
}
type receitaRes = {
  ativa: number,
  canceladas: number
}
type receitaPeriodoRes = {
  dataInicio: string,
  dataFim: string,
  receitaAtivas: number,
  receitaCanceladas: number,
  receitaTotal: number
}
type quartoStatsRes = {
  disponiveis: number,
  ocupados: number
}
export type statsRes = {
  totalUsuarios: number,
  totalReservas: number,
  totalQuartos: number,
  reservasAtivos: number,
  reservasCanceladas: number,
  tavaOcupacao: number
}

export function adminService() {
  const getAllQuartos = async (): Promise<quartoRes[]> => {
    const token = localStorage.getItem(TOKEN_KEY)
    const res = await adminApi.get<quartoRes[]>("/quarto",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return res.data;
  }

}
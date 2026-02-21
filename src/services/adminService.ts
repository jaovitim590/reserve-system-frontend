import { api } from "./api";
import { TOKEN_KEY } from "../lib/token";

export type QuartoRes = {
  id: number;
  status: string;
  descricao: string;
  capacidade: number;
  nome?: string;
  name?: string;
  valor: number;
  tipo: string;
  data_criacao: string;
};

export type BestRes = {
  total: number;
  quarto: QuartoRes;
};

type Authority = {
  authority: string;
};

export type UsuarioRes = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  data_criado: string;
  ativo: boolean;
  authorities: Authority;
};

export type ReservaRes = {
  id: number;
  status: string;
  quarto: QuartoRes;
  usuario: UsuarioRes;
  data_inicio: string;
  data_fim: string;
  valorTotal: number;
  data_criado: string;
};

export type ReceitaRes = {
  ativa: number;
  canceladas: number;
};

export type ReceitaPeriodoRes = {
  dataInicio: string;
  dataFim: string;
  receitaAtivas: number;
  receitaCanceladas: number;
  receitaTotal: number;
};

export type QuartoStatsRes = {
  disponiveis: number;
  ocupados: number;
};

export type StatsRes = {
  totalUsuarios: number;
  totalReservas: number;
  totalQuartos: number;
  reservasAtivas: number;
  reservasCanceladas: number;
  tavaOcupacao: number;
};

type QuartoReq = {
  id: number;
  name: string;
  descricao: string;
  capacidade: number;
  valor: number;
  status: string;
  tipo: string;
}

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  },
});

export const adminService = {
  async getAllQuartos(): Promise<QuartoRes[]> {
    const res = await api.get<QuartoRes[]>("/admin/quarto", authHeaders());
    return res.data;
  },

  async getRecentReservas(): Promise<ReservaRes[]> {
    const res = await api.get<ReservaRes[]>("/admin/reserva", authHeaders());
    return res.data;
  },

  async getBestQuartos(): Promise<BestRes[]> {
    const res = await api.get<BestRes[]>("/admin/quarto/best", authHeaders());
    return res.data;
  },

  async getReceita(): Promise<ReceitaRes> {
    const res = await api.get<ReceitaRes>("/admin/receita", authHeaders());
    return res.data;
  },

  async getReceitaPeriodo(dataInicio: string, dataFim: string): Promise<ReceitaPeriodoRes> {
    const res = await api.get<ReceitaPeriodoRes>("/admin/receita/periodo", {
      ...authHeaders(),
      params: { dataInicio, dataFim },
    });
    return res.data;
  },

  async getQuartoStats(): Promise<QuartoStatsRes> {
    const res = await api.get<QuartoStatsRes>("/admin/quarto/status", authHeaders());
    return res.data;
  },

  async getStats(): Promise<StatsRes> {
    const res = await api.get<StatsRes>("/admin/stats", authHeaders());
    return res.data;
    
  },

  async deleteReserva(id: number){
    const res = await api.delete(`/admin/reserva/${id}`, authHeaders());
    return res.data;
  } ,

  async deleteQuarto(id: number){
    const res = await api.delete(`/admin/quarto/${id}`, authHeaders());
    return res.data;
  }, 

  async createQuarto(data: QuartoReq): Promise<QuartoRes>{
    const res = await api.post<QuartoRes>("/admin/quarto",data ,authHeaders());
    return res.data;
  },

  async updateQuarto(data: QuartoReq): Promise<QuartoRes>{
    const res = await api.put<QuartoRes>(`/admin/quarto/${data.id}`, data, authHeaders());
    return res.data;
  }
};

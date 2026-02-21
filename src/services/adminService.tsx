import { adminApi } from "./api";
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
  data_incio: string;
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

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  },
});

export const adminService = {
  async getAllQuartos(): Promise<QuartoRes[]> {
    const res = await adminApi.get<QuartoRes[]>("/quarto", authHeaders());
    return res.data;
  },

  async getRecentReservas(): Promise<ReservaRes[]> {
    const res = await adminApi.get<ReservaRes[]>("/reserva", authHeaders());
    return res.data;
  },

  async getBestQuartos(): Promise<BestRes[]> {
    const res = await adminApi.get<BestRes[]>("/quarto/best", authHeaders());
    return res.data;
  },

  async getReceita(): Promise<ReceitaRes> {
    const res = await adminApi.get<ReceitaRes>("/receita", authHeaders());
    return res.data;
  },

  async getReceitaPeriodo(dataInicio: string, dataFim: string): Promise<ReceitaPeriodoRes> {
    const res = await adminApi.get<ReceitaPeriodoRes>("/receita/periodo", {
      ...authHeaders(),
      params: { dataInicio, dataFim },
    });
    return res.data;
  },

  async getQuartoStats(): Promise<QuartoStatsRes> {
    const res = await adminApi.get<QuartoStatsRes>("/quarto/status", authHeaders());
    return res.data;
  },

  async getStats(): Promise<StatsRes> {
    const res = await adminApi.get<StatsRes>("/stats", authHeaders());
    return res.data;
    
  },
};

import { api } from "./api";
import { TOKEN_KEY } from "../lib/token";

type ReservaRequest = {
  quarto_id: number,
  dataInicio: string,
  dataFim: string
}
export type Quarto = {
  id: number;
  status: string;
  descricao: string;
  capacidade: number;
  nome: string;
  valor: number;
  tipo: string;
  data_criacao: string; // ISO date
};

export type Reserva = {
  id: number;
  quartoId: Quarto;
  dataInicio: string; // yyyy-MM-dd
  dataFim: string;    // yyyy-MM-dd
  status: string | null;
  valorTotal: number;
};

export async function createReservaa(params: ReservaRequest) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.post("/api/reserva", {
    quartoId: params.quarto_id,
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return res.data;
}

export async function GetMyReservas() {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.get<Reserva[]>("/api/reserva/minhas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}
export async function cancelarReserva(id: number) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.put(`/api/reserva/${id}/cancelar`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}
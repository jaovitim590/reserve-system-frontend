import { api } from "./api";

type ReservaRequest = {
  quarto_id: number;
  dataInicio: string;
  dataFim: string;
};

export type Quarto = {
  id: number;
  status: string;
  descricao: string;
  capacidade: number;
  nome: string;
  valor: number;
  tipo: string;
  data_criacao: string;
};

export type Reserva = {
  id: number;
  quartoId: Quarto;
  dataInicio: string;
  dataFim: string;
  status: string | null;
  valorTotal: number;
};

export async function createReservaa(params: ReservaRequest) {
  const res = await api.post("/api/reserva", {
    quartoId: params.quarto_id,
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
  });
  return res.data;
}

export async function GetMyReservas() {
  const res = await api.get<Reserva[]>("/api/reserva/minhas");
  return res.data;
}

export async function cancelarReserva(id: number) {
  const res = await api.put(`/api/reserva/${id}/cancelar`, null);
  return res.data;
}
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
  name: string;
  valor: number;
  tipo: string;
  data_criacao: string; // ISO date
};

export type Reserva = {
  id: number;
  quarto: Quarto;
  data_inicio: string; // yyyy-MM-dd
  data_fim: string;    // yyyy-MM-dd
  status: string | null;
  valorTotal: number;
};

export async function createReservaa(params: ReservaRequest) {
  const token = localStorage.getItem(TOKEN_KEY)
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
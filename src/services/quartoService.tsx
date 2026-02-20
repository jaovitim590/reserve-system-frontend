import { api } from "./api";
import { getRandomRoomImage } from "../lib/randomImg";
import { TOKEN_KEY } from "../lib/token";

type QuartoResponse = {
  id: number;
  status: string;
  descricao: string;
  capacidade: string;
  name: string;
  valor: number;
  tipo: string;
  data_criado: string;
}

export type QuartoProps = {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  status: string;
  image: string;
  valor: number;
};

type DisponibilidadeResponse = {
  quartoId: number;
  dataInicio: string;
  dataFim: string;
  disponivel: boolean;
}

export async function getQuartos(): Promise<QuartoProps[]> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await api.get<QuartoResponse[]>("/api/quarto",{
    headers:{
      Authorization: `Bearer ${token}`
    }
  });

  const quartos = res.data.map((quarto) => ({
    id: quarto.id,
    nome: quarto.name,
    descricao: quarto.descricao,
    tipo: quarto.tipo,
    status: quarto.status,
    image: getRandomRoomImage(),
    valor: quarto.valor
  }));

  return quartos;
}

export async function getQuartoById(id: number): Promise<QuartoProps> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await api.get<QuartoResponse>(`/api/quarto/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return {
    id: res.data.id,
    nome: res.data.name,
    descricao: res.data.descricao,
    tipo: res.data.tipo,
    status: res.data.status,
    image: getRandomRoomImage(),
    valor: res.data.valor
  }
}

export async function getDisponibilidade(
  id: number,
  inicio: string,
  fim: string
) {
  const res = await api.get(`/api/reserva/${id}`, {
    params: {
      inicio: inicio,
      fim: fim
    }
  });

  return res.data;
}

export async function checkQuartoDisponibilidade(id: number, inicio: string, fim: string): Promise<boolean> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await api.get<DisponibilidadeResponse>(`/api/quarto/${id}/disponibilidade`, {
    params: { inicio, fim },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.disponivel;
}
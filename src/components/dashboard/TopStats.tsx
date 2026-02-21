import {
  adminService,
  type StatsRes,
  type ReceitaRes
} from "../../services/adminService";
import { useState, useEffect} from "react";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import {
  Box,
  CircularProgress,
  Grid
} from "@mui/material";
import { StatCard } from "./StatCard";

const defaultStats: StatsRes = {
  totalUsuarios: 0,
  totalReservas: 0,
  totalQuartos: 0,
  reservasAtivas: 0,
  reservasCanceladas: 0,
  tavaOcupacao: 0,
};

type topStatsData = {
    stats: StatsRes;
    receita: ReceitaRes;

}

export const TopStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<topStatsData>({
    stats: defaultStats,
    receita: { ativa: 0, canceladas: 0 }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [stats, receita] = await Promise.all([
            adminService.getStats(),
            adminService.getReceita()
        ])
        setData({
            stats,
            receita,
        });
      } catch (err) {
        setError("Erro ao carregar top datas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData()
},[]);

if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Usuários"
            value={data.stats.totalUsuarios}
            icon={<PeopleAltRoundedIcon color="primary" />}
            helper="Total de contas cadastradas"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Quartos"
            value={data.stats.totalQuartos}
            icon={<HotelRoundedIcon color="primary" />}
            helper={`Taxa de ocupação: ${(data.stats.tavaOcupacao ?? 0).toFixed(1)}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Reservas"
            value={data.stats.totalReservas}
            icon={<EventAvailableRoundedIcon color="primary" />}
            helper={`Ativas: ${data.stats.reservasAtivas}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Receita (R$)"
            value={data.receita.ativa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            icon={<PaidRoundedIcon color="primary" />}
            helper={`Canceladas: R$ ${data.receita.canceladas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          />
        </Grid>
      </Grid>
}
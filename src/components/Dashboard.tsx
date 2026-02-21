import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  adminService,
  type BestRes,
  type QuartoStatsRes,
  type ReceitaRes,
  type ReservaRes,
  type StatsRes,
} from "../services/adminService";
import { StatCard } from "./dashboard/StatCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, Tooltip, Legend);

type DashboardData = {
  stats: StatsRes;
  receita: ReceitaRes;
  quartoStats: QuartoStatsRes;
  bestQuartos: BestRes[];
  reservasRecentes: ReservaRes[];
};

const defaultStats: StatsRes = {
  totalUsuarios: 0,
  totalReservas: 0,
  totalQuartos: 0,
  reservasAtivos: 0,
  reservasCanceladas: 0,
  tavaOcupacao: 0,
};

const getStatusColor = (status: string): "success" | "warning" | "error" | "info" => {
  const value = status.toLowerCase();
  if (value.includes("ativa") || value.includes("confirmada")) return "success";
  if (value.includes("cancel")) return "error";
  if (value.includes("pend")) return "warning";
  return "info";
};

export const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    stats: defaultStats,
    receita: { ativa: 0, canceladas: 0 },
    quartoStats: { disponiveis: 0, ocupados: 0 },
    bestQuartos: [],
    reservasRecentes: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [stats, receita, quartoStats, bestQuartos, reservasRecentes] = await Promise.all([
          adminService.getStats(),
          adminService.getReceita(),
          adminService.getQuartoStats(),
          adminService.getBestQuartos(),
          adminService.getRecentReservas(),
        ]);

        setData({ stats, receita, quartoStats, bestQuartos, reservasRecentes: reservasRecentes.slice(0, 8) });
      } catch {
        setError("Não foi possível carregar a dashboard administrativa.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const reservasChart = useMemo(
    () => ({
      labels: ["Ativas", "Canceladas"],
      datasets: [
        {
          label: "Reservas",
          data: [data.stats.reservasAtivos, data.stats.reservasCanceladas],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderRadius: 8,
        },
      ],
    }),
    [data.stats.reservasAtivos, data.stats.reservasCanceladas],
  );

  const ocupacaoChart = useMemo(
    () => ({
      labels: ["Disponíveis", "Ocupados"],
      datasets: [
        {
          data: [data.quartoStats.disponiveis, data.quartoStats.ocupados],
          backgroundColor: ["#3b82f6", "#f59e0b"],
          borderWidth: 0,
        },
      ],
    }),
    [data.quartoStats.disponiveis, data.quartoStats.ocupados],
  );

  const bestRoomsChart = useMemo(
    () => ({
      labels: data.bestQuartos.map((item) => item.quarto.nome ?? item.quarto.name ?? `Quarto ${item.quarto.id}`),
      datasets: [
        {
          label: "Total de reservas",
          data: data.bestQuartos.map((item) => item.total),
          backgroundColor: "#8b5cf6",
          borderRadius: 8,
        },
      ],
    }),
    [data.bestQuartos],
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard Administrativa
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão consolidada de reservas, ocupação e receita do sistema.
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
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
            helper={`Taxa de ocupação: ${data.stats.tavaOcupacao.toFixed(1)}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Reservas"
            value={data.stats.totalReservas}
            icon={<EventAvailableRoundedIcon color="primary" />}
            helper={`Ativas: ${data.stats.reservasAtivos}`}
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

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Situação das reservas
              </Typography>
              <Bar data={reservasChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Ocupação de quartos
              </Typography>
              <Box sx={{ maxWidth: 340, mx: "auto" }}>
                <Doughnut data={ocupacaoChart} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quartos mais reservados
              </Typography>
              {data.bestQuartos.length > 0 ? (
                <Bar
                  data={bestRoomsChart}
                  options={{ indexAxis: "y", responsive: true, plugins: { legend: { display: false } } }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sem dados de quartos mais reservados.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Reservas recentes
              </Typography>
              <Stack spacing={1.5}>
                {data.reservasRecentes.map((reserva) => (
                  <Box
                    key={reserva.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {reserva.usuario.name} • {reserva.quarto.nome ?? reserva.quarto.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(reserva.data_incio).toLocaleDateString("pt-BR")} - {" "}
                        {new Date(reserva.data_fim).toLocaleDateString("pt-BR")}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        R$ {reserva.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </Typography>
                      <Chip label={reserva.status} color={getStatusColor(reserva.status)} size="small" />
                    </Stack>
                  </Box>
                ))}

                {data.reservasRecentes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma reserva recente encontrada.
                  </Typography>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

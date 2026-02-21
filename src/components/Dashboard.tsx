import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
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
  type QuartoRes,
  type QuartoStatsRes,
  type ReceitaPeriodoRes,
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
  quartos: QuartoRes[];
};

const defaultStats: StatsRes = {
  totalUsuarios: 0,
  totalReservas: 0,
  totalQuartos: 0,
  reservasAtivos: 0,
  reservasCanceladas: 0,
  tavaOcupacao: 0,
};

const todayIso = new Date().toISOString().slice(0, 10);

const firstDayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  .toISOString()
  .slice(0, 10);

const getRoomName = (quarto: QuartoRes) => quarto.nome ?? quarto.name ?? `Quarto ${quarto.id}`;

const getStatusColor = (status: string): "success" | "warning" | "error" | "info" => {
  const value = status.toLowerCase();
  if (value.includes("ativa") || value.includes("confirmada")) return "success";
  if (value.includes("cancel")) return "error";
  if (value.includes("pend")) return "warning";
  return "info";
};

export const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [periodStart, setPeriodStart] = useState(firstDayMonth);
  const [periodEnd, setPeriodEnd] = useState(todayIso);
  const [periodData, setPeriodData] = useState<ReceitaPeriodoRes | null>(null);
  const [periodLoading, setPeriodLoading] = useState(false);

  const [data, setData] = useState<DashboardData>({
    stats: defaultStats,
    receita: { ativa: 0, canceladas: 0 },
    quartoStats: { disponiveis: 0, ocupados: 0 },
    bestQuartos: [],
    reservasRecentes: [],
    quartos: [],
  });

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [stats, receita, quartoStats, bestQuartos, reservasRecentes, quartos] = await Promise.all([
        adminService.getStats(),
        adminService.getReceita(),
        adminService.getQuartoStats(),
        adminService.getBestQuartos(),
        adminService.getRecentReservas(),
        adminService.getAllQuartos(),
      ]);

      setData({
        stats,
        receita,
        quartoStats,
        bestQuartos,
        reservasRecentes: reservasRecentes.slice(0, 12),
        quartos,
      });
    } catch {
      setError("Não foi possível carregar os dados da dashboard administrativa.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadPeriodData = useCallback(async () => {
    try {
      setPeriodLoading(true);
      const receitaPeriodo = await adminService.getReceitaPeriodo(periodStart, periodEnd);
      setPeriodData(receitaPeriodo);
    } catch {
      setPeriodData(null);
    } finally {
      setPeriodLoading(false);
    }
  }, [periodEnd, periodStart]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    void loadPeriodData();
  }, [loadPeriodData]);

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

  const roomTypeChart = useMemo(() => {
    const types = data.quartos.reduce<Record<string, number>>((acc, quarto) => {
      const roomType = quarto.tipo || "Sem tipo";
      acc[roomType] = (acc[roomType] ?? 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(types),
      datasets: [
        {
          label: "Quantidade de quartos",
          data: Object.values(types),
          backgroundColor: ["#8b5cf6", "#06b6d4", "#f97316", "#84cc16", "#e11d48"],
          borderRadius: 8,
        },
      ],
    };
  }, [data.quartos]);

  const bestRoomsChart = useMemo(
    () => ({
      labels: data.bestQuartos.map((item) => getRoomName(item.quarto)),
      datasets: [
        {
          label: "Total de reservas",
          data: data.bestQuartos.map((item) => item.total),
          backgroundColor: "#6366f1",
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Dashboard Administrativa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Acompanhe receita, reservas, ocupação e desempenho dos quartos em tempo real.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => void loadDashboardData(true)}
              disabled={refreshing}
            >
              {refreshing ? "Atualizando..." : "Atualizar dados"}
            </Button>
          </Stack>
          {refreshing ? <LinearProgress sx={{ mt: 2 }} /> : null}
        </Paper>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard label="Usuários" value={data.stats.totalUsuarios} icon={<PeopleAltRoundedIcon color="primary" />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard label="Quartos" value={data.stats.totalQuartos} icon={<HotelRoundedIcon color="primary" />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard label="Reservas" value={data.stats.totalReservas} icon={<EventAvailableRoundedIcon color="primary" />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              label="Receita ativa"
              value={`R$ ${data.receita.ativa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              icon={<PaidRoundedIcon color="primary" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard label="Ativas" value={data.stats.reservasAtivos} icon={<BedRoundedIcon color="success" />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              label="Canceladas"
              value={data.stats.reservasCanceladas}
              icon={<CancelRoundedIcon color="error" />}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Situação de reservas
                </Typography>
                <Bar data={reservasChart} options={{ plugins: { legend: { display: false } }, responsive: true }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Ocupação geral
                </Typography>
                <Box sx={{ maxWidth: 320, mx: "auto" }}>
                  <Doughnut data={ocupacaoChart} />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                  Taxa de ocupação
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {data.stats.tavaOcupacao.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Receita por período
                  </Typography>
                  <TrendingUpRoundedIcon color="primary" />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
                  <TextField
                    label="Início"
                    type="date"
                    value={periodStart}
                    onChange={(event) => setPeriodStart(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Fim"
                    type="date"
                    value={periodEnd}
                    onChange={(event) => setPeriodEnd(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>

                <Button variant="outlined" onClick={() => void loadPeriodData()} disabled={periodLoading}>
                  {periodLoading ? "Consultando..." : "Consultar período"}
                </Button>

                <Divider sx={{ my: 2 }} />

                {periodData ? (
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Total no período
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      R$ {periodData.receitaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ativas: R$ {periodData.receitaAtivas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} •
                      Canceladas: R$ {periodData.receitaCanceladas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </Typography>
                  </Stack>
                ) : (
                  <Alert severity="warning">Não foi possível carregar os dados do período selecionado.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Distribuição por tipo de quarto
                </Typography>
                {roomTypeChart.labels.length > 0 ? (
                  <Bar data={roomTypeChart} options={{ plugins: { legend: { display: false } }, responsive: true }} />
                ) : (
                  <Typography color="text.secondary">Sem dados de tipos de quarto.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Quartos mais reservados
                </Typography>
                {data.bestQuartos.length > 0 ? (
                  <Bar
                    data={bestRoomsChart}
                    options={{ indexAxis: "y", plugins: { legend: { display: false } }, responsive: true }}
                  />
                ) : (
                  <Typography color="text.secondary">Sem dados de ranking de quartos.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Filtro rápido de reservas
                </Typography>
                <TextField select label="Status" size="small" fullWidth defaultValue="todos" sx={{ mb: 2 }}>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ativas">Ativas</MenuItem>
                  <MenuItem value="canceladas">Canceladas</MenuItem>
                </TextField>
                <Typography variant="body2" color="text.secondary">
                  Use a tabela abaixo para acompanhar as reservas mais recentes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Reservas recentes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Hóspede</TableCell>
                    <TableCell>Quarto</TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.reservasRecentes.map((reserva) => (
                    <TableRow key={reserva.id} hover>
                      <TableCell>#{reserva.id}</TableCell>
                      <TableCell>{reserva.usuario.name}</TableCell>
                      <TableCell>{getRoomName(reserva.quarto)}</TableCell>
                      <TableCell>
                        {new Date(reserva.data_incio).toLocaleDateString("pt-BR")} até {" "}
                        {new Date(reserva.data_fim).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell align="right">
                        R$ {reserva.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={reserva.status} color={getStatusColor(reserva.status)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

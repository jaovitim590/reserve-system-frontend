import {
  adminService,
  type StatsRes
} from "../../services/adminService";
import { useState, useEffect,useMemo } from "react";

import { Bar} from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Alert
} from "@mui/material";

const defaultStats: StatsRes = {
  totalUsuarios: 0,
  totalReservas: 0,
  totalQuartos: 0,
  reservasAtivas: 0,
  reservasCanceladas: 0,
  tavaOcupacao: 0,
};

type statsData = {
    stats: StatsRes;
}

export const ReservaSituationChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<statsData>({
    stats: defaultStats,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getStats();

        setData({
          stats: response
        });
      } catch (err) {
        setError("Erro ao carregar melhores quartos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData()
},[]);

const reservasChart = useMemo(
    () => ({
      labels: ["Ativas", "Canceladas"],
      datasets: [
        {
          label: "Reservas",
          data: [data.stats.reservasAtivas, data.stats.reservasCanceladas],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderRadius: 8,
        },
      ],
    }),
    [data.stats.reservasAtivas, data.stats.reservasCanceladas],
  );

if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
if (error) {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );
}
  return <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Situação das reservas
              </Typography>
              <Bar key={`${data.stats.reservasAtivas}-${data.stats.reservasCanceladas}`} data={reservasChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>
        </Grid>
}
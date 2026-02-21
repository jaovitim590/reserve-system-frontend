import { adminService, type QuartoStatsRes } from "../../services/adminService";
import { useState, useEffect, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";

export const OcupacaoChart = () => {
  const [quartoStats, setQuartoStats] = useState<QuartoStatsRes>({ disponiveis: 0, ocupados: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setQuartoStats(await adminService.getQuartoStats());
      } catch {
        setError("Erro ao carregar ocupação");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = quartoStats.disponiveis + quartoStats.ocupados;
  const taxaOcupacao = total > 0 ? Math.round((quartoStats.ocupados / total) * 100) : 0;

  const chartData = useMemo(() => ({
    labels: ["Disponíveis", "Ocupados"],
    datasets: [
      {
        data: [quartoStats.disponiveis, quartoStats.ocupados],
        backgroundColor: ["#3b82f6", "#f59e0b"],
        hoverBackgroundColor: ["#2563eb", "#d97706"],
        borderWidth: 0,
        borderRadius: 4,
        spacing: 3,
      },
    ],
  }), [quartoStats.disponiveis, quartoStats.ocupados]);

  const legendItems = [
    { label: "Disponíveis", value: quartoStats.disponiveis, color: "#3b82f6", pct: total > 0 ? Math.round((quartoStats.disponiveis / total) * 100) : 0 },
    { label: "Ocupados",    value: quartoStats.ocupados,    color: "#f59e0b", pct: taxaOcupacao },
  ];

  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Card sx={{ borderRadius: 3, height: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                Ocupação de quartos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Situação atual do inventário
              </Typography>
            </Box>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              bgcolor: "rgba(59,130,246,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <DoorFrontRoundedIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
            </Box>
          </Stack>

          {loading ? (
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={32} />
            </Box>
          ) : error ? (
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="body2" color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              {/* Gráfico com taxa no centro */}
              <Box sx={{ position: "relative", maxWidth: 220, mx: "auto", my: 1 }}>
                <Doughnut
                  key={`${quartoStats.disponiveis}-${quartoStats.ocupados}`}
                  data={chartData}
                  options={{
                    responsive: true,
                    cutout: "72%",
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} quartos`,
                        },
                      },
                    },
                  }}
                />
                {/* Taxa de ocupação no centro */}
                <Box sx={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <Typography variant="h4" fontWeight={800} lineHeight={1} color="text.primary">
                    {taxaOcupacao}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    ocupado
                  </Typography>
                </Box>
              </Box>

              {/* Legenda customizada */}
              <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                {legendItems.map((item) => (
                  <Stack key={item.label} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{
                        bgcolor: "action.hover", px: 0.75, py: 0.25, borderRadius: 1,
                      }}>
                        {item.pct}%
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
                {/* Total */}
                <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">Total de quartos</Typography>
                    <Typography variant="body2" fontWeight={700}>{total}</Typography>
                  </Stack>
                </Box>
              </Stack>
            </>
          )}

        </CardContent>
      </Card>
    </Grid>
  );
};
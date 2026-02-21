import { adminService, type BestRes } from "../../services/adminService";
import { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

export const BestRoomCard = () => {
  const [bestQuartos, setBestQuartos] = useState<BestRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminService.getBestQuartos();
        setBestQuartos(Array.isArray(res) ? res : [res]);
      } catch {
        setError("Erro ao carregar melhores quartos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const top1 = bestQuartos[0];

  const chartData = useMemo(() => ({
    labels: bestQuartos.map(
      (item) => item.quarto.nome ?? item.quarto.name ?? `Quarto ${item.quarto.id}`
    ),
    datasets: [
      {
        label: "Reservas",
        data: bestQuartos.map((item) => item.total),
        backgroundColor: bestQuartos.map((_, i) =>
          i === 0 ? "#8b5cf6" : i === 1 ? "#a78bfa" : "#c4b5fd"
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }), [bestQuartos]);

  return (
    <Grid size={{ xs: 12, lg: 6 }}>
      <Card sx={{ borderRadius: 3, height: "100%", overflow: "hidden" }}>
        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>

          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                Quartos mais reservados
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ranking por total de reservas
              </Typography>
            </Box>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              bgcolor: "rgba(139,92,246,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <EmojiEventsRoundedIcon sx={{ fontSize: 20, color: "#8b5cf6" }} />
            </Box>
          </Stack>

          {top1 && !loading && (
            <Box sx={{
              mb: 2, p: 1.5, borderRadius: 2,
              background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(167,139,250,0.06) 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: 18 }}>🏆</Typography>
                <Box>
                  <Typography variant="body2" fontWeight={700} color="primary">
                    {top1.quarto.nome ?? top1.quarto.name ?? `Quarto ${top1.quarto.id}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Melhor desempenho
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${top1.total} reservas`}
                size="small"
                sx={{
                  bgcolor: "#8b5cf6", color: "white",
                  fontWeight: 700, fontSize: 11,
                }}
              />
            </Box>
          )}

          <Box sx={{ flexGrow: 1, minHeight: 160, position: "relative" }}>
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <CircularProgress size={32} />
              </Box>
            ) : error ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="body2" color="error">{error}</Typography>
              </Box>
            ) : bestQuartos.length > 0 ? (
              <Bar
                key={bestQuartos.length}
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => ` ${ctx.parsed.x} reservas`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { color: "rgba(0,0,0,0.05)" },
                      ticks: { font: { size: 11 }, color: "#94a3b8" },
                    },
                    y: {
                      grid: { display: false },
                      ticks: { font: { size: 12, weight: 600 }, color: "#64748b" },
                    },
                  },
                }}
              />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  Sem dados disponíveis.
                </Typography>
              </Box>
            )}
          </Box>

        </CardContent>
      </Card>
    </Grid>
  );
};
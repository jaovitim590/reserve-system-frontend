import {
  adminService,
  type BestRes,
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
} from "@mui/material";

type BestData = {
  bestQuartos: BestRes[];
};

export const BestRoomCard = () => {
  const [data, setData] = useState<BestData>({
    bestQuartos: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getBestQuartos();

        setData({
          bestQuartos: Array.isArray(response)
            ? response
            : [response],
        });
      } catch (err) {
        setError("Erro ao carregar melhores quartos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const bestRoomsChart = useMemo(
  () => ({
    labels: data.bestQuartos.map(
      (item) =>
        item.quarto.nome ??
        item.quarto.name ??
        `Quarto ${item.quarto.id}`
    ),
    datasets: [
      {
        label: "Total de reservas",
        data: data.bestQuartos.map((item) => item.total),
        backgroundColor: "#8b5cf6",
        borderRadius: 8,
      },
    ],
  }),
  [data.bestQuartos]
);

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  return <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{height: 250,
              width: "100%"
            }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quarto mais reservados
              </Typography>
              {data.bestQuartos.length > 0 ? (
                <Bar
                key={data.bestQuartos.length}
                  data={bestRoomsChart}
                  options={{
              responsive: true,
              maintainAspectRatio: false, // 👈 ESSENCIAL
              indexAxis: "y",
              plugins: {
                legend: { display: false },
              },
            }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sem dados de quartos mais reservados.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
};
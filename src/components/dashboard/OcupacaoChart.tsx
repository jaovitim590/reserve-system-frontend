import {
  adminService,
  type QuartoStatsRes
} from "../../services/adminService";
import { useState, useEffect,useMemo } from "react";
import { Doughnut} from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

type ocupacaoData = {
    quartoStats: QuartoStatsRes;
}

export const OcupacaoChart = ()=>{
    const [data, setData] = useState<ocupacaoData>({
        quartoStats: { disponiveis: 0, ocupados: 0 },
      });
    
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        const loadData = async () => {
          try {
            setLoading(true);
            setError(null);
    
            const response = await adminService.getQuartoStats();
    
            setData({
              quartoStats: response
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
    
    if (loading) {
      return (
        <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      );
    }
    return <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Ocupação de quartos
              </Typography>
              <Box sx={{ maxWidth: 340, mx: "auto" }}>
                <Doughnut 
                key={`${data.quartoStats.disponiveis}- ${data.quartoStats.ocupados}`}
                data={ocupacaoChart} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
}
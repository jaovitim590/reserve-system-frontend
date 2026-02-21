import {
  adminService,
  type ReservaRes
} from "../../services/adminService";
import { useState, useEffect} from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Stack,
  Chip
} from "@mui/material";

type recentesData = {
    reservasRecentes: ReservaRes[];
}

const getStatusColor = (
  status: string,
): "success" | "warning" | "error" | "info" => {
  const value = status.toLowerCase();
  if (value.includes("ativa") || value.includes("confirmada")) return "success";
  if (value.includes("cancel")) return "error";
  if (value.includes("pend")) return "warning";
  return "info";
};

export const ReservasRecentes = () => {
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [data, setData] = useState<recentesData>({
        reservasRecentes: [],
      });
    
      useEffect(() => {
        const loadData = async () => {
          try {
            setLoading(true);
            setError(null);
    
            const response = await adminService.getRecentReservas();
    
            setData({
              reservasRecentes: response.slice(0, 8),
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

    if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
return <Grid size={{ xs: 12, lg: 6 }}>
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
                        {reserva.usuario.name} •{" "}
                        {reserva.quarto.nome ?? reserva.quarto.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(reserva.data_incio).toLocaleDateString(
                          "pt-BR",
                        )}{" "}
                        -{" "}
                        {new Date(reserva.data_fim).toLocaleDateString("pt-BR")}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        R${" "}
                        {reserva.valorTotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                      <Chip
                        label={reserva.status}
                        color={getStatusColor(reserva.status)}
                        size="small"
                      />
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
}
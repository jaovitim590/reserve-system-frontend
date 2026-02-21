import { Box, Grid, Stack, Typography } from "@mui/material";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { BestRoomCard } from "./dashboard/BestRoomChart";
import { ReservaSituationChart } from "./dashboard/ReservasSituationChart";
import { OcupacaoChart } from "./dashboard/OcupacaoChart";
import { TopStats } from "./dashboard/TopStats";
import { ReservasRecentes } from "./dashboard/ReservasRecentes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  LineElement,
);

export const DashBoard = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Stack spacing={1}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Painel Administrativo
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Visão geral das reservas, usuáriose quartos do sistema.
          </Typography>
        </Stack>
      </Box>
      <TopStats />
      <Grid container spacing={2.5}>
        <ReservaSituationChart />
        <OcupacaoChart />
        <BestRoomCard />
        <ReservasRecentes />
      </Grid>
    </Box>
  );
};

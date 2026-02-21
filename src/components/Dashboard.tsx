import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
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
  LineElement
);



export const DashBoard = () => {

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

      <TopStats />

      <Grid container spacing={2.5}>
        <ReservaSituationChart />

        <OcupacaoChart />

        <BestRoomCard />

        <ReservasRecentes/>
        
      </Grid>
    </Box>
  );
};

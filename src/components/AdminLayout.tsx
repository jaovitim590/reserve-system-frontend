import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuContent, { type PageView } from "./dashboard/MenuContent";
import { DashBoard } from "./Dashboard";
import UsuariosCrud from "./dashboard/UsuariosCrud";
import QuartosCrud from "./dashboard/QuartosCrud";
import ReservasCrud from "./dashboard/ReservasCrud";

const DRAWER_WIDTH = 240;

function PageContent({ page }: { page: PageView }) {
  switch (page) {
    case "dashboard": return <DashBoard />;
    case "usuarios":  return <UsuariosCrud />;
    case "quartos":   return <QuartosCrud />;
    case "reservas":  return <ReservasCrud />;
  }
}

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentPage, setCurrentPage] = useState<PageView>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1, fontSize: 11 }}>
          Painel Admin
        </Typography>
      </Box>
      <Divider />
      <MenuContent currentPage={currentPage} onNavigate={handleNavigate} />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100%", minHeight: "calc(100vh - 64px)" }}>

      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: "primary.main",
            color: "white",
            boxShadow: 4,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      )}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {drawerContent}
        </Drawer>
      ) : (

        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              top: 64,
              height: "calc(100% - 64px)",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          minHeight: "100%",
          overflow: "auto",
        }}
      >
        <PageContent page={currentPage} />
      </Box>
    </Box>
  );
}
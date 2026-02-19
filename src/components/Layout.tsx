import { Box } from "@mui/material";
import { Header } from "./layout/Header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
import { AppBar, Toolbar, Box, Typography, Container } from "@mui/material";
import { UserMenu } from "./UserMenu";
import { TopButton } from "./TopButton";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              component="img"
              src="/hotel.png"
              alt="Logo Hotel"
              sx={{
                width: 40,
                height: 40,
                display: { xs: "none", sm: "block" },
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Hotel Jaovitim
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <TopButton label="Quartos" link="/quartos" />
            <TopButton label="Contato" link="/contato" />
          </Box>

          <Box>
            <UserMenu />
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

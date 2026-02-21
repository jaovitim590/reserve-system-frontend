import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  Wifi,
  LocalParking,
  Restaurant,
  FitnessCenter,
  Pool,
  AcUnit,
  Tv,
  LocalLaundryService,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export const Home = () => {
  const amenities = [
    { icon: <Wifi />, label: "Wi-Fi Grátis" },
    { icon: <AcUnit />, label: "Ar Condicionado" },
    { icon: <Tv />, label: "TV a Cabo" },
    { icon: <LocalParking />, label: "Estacionamento" },
    { icon: <Restaurant />, label: "Café da Manhã" },
    { icon: <FitnessCenter />, label: "Academia" },
    { icon: <Pool />, label: "Piscina" },
    { icon: <LocalLaundryService />, label: "Lavanderia" },
  ];

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: { xs: "70vh", md: "85vh" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "3.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Bem-vindo ao Hotel Jaovitim
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              mb: 5,
              fontSize: { xs: "1.1rem", md: "1.5rem" },
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            Conforto e hospitalidade para sua estadia perfeita
          </Typography>
          <Button
            component={Link}
            to="/quartos"
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            Verificar Disponibilidade
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Quartos Disponíveis Agora!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
            Aproveite nossas tarifas especiais e reserve já
          </Typography>
          <Button
            component={Link}
            to="/quartos"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            Ver Quartos e Preços
          </Button>
        </Paper>
      </Container>

      <Box sx={{py: 8 }}>
        <Container>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Nossos Diferenciais
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: "auto" }}
          >
            Oferecemos tudo que você precisa para uma estadia confortável e
            relaxante
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 4 }}
          >
            {amenities.map((amenity, index) => (
              <Chip
                key={index}
                icon={amenity.icon}
                label={amenity.label}
                sx={{
                  py: 3,
                  px: 2,
                  fontSize: "1rem",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    fontSize: "1.5rem",
                    color: "primary.main",
                  },
                }}
                variant="outlined"
                color="primary"
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", sm: "calc(50% - 16px)", md: "300px" },
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                24h
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Recepção
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atendimento disponível a qualquer hora
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "calc(50% - 16px)", md: "300px" },
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                100%
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Conforto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quartos equipados e climatizados
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "calc(50% - 16px)", md: "300px" },
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                ★★★★★
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Avaliação
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Excelência reconhecida pelos hóspedes
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Pronto para reservar?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Entre em contato conosco ou verifique a disponibilidade online
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/quartos"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                px: 4,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              Ver Disponibilidade
            </Button>
            <Button
              component={Link}
              to="/contato"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                px: 4,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Fale Conosco
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
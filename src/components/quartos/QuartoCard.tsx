import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { type QuartoProps } from "../../services/quartoService";
import { useNavigate } from "react-router-dom";

export const QuartoCard = (props: QuartoProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL": return "success";
      case "OCUPADO":    return "error";
      default:           return "default";
    }
  };

  const handleClick = () => navigate(`/quartos/${props.id}/reservar`);

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <CardMedia sx={{ height: 300 }} image={props.image} title={props.nome} />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Chip label={props.tipo} color="primary" size="small" variant="outlined" />
          <Chip label={props.status} color={getStatusColor(props.status)} size="small" />
        </Box>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          {props.nome}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {props.descricao}
        </Typography>

        <Box sx={{
          display: "flex", alignItems: "baseline", gap: 0.5,
          mt: "auto", pt: 1, borderTop: "1px solid", borderColor: "divider",
        }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            {props.valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Typography>
          <Typography variant="caption" color="text.secondary">/ noite</Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          color={props.status !== "DISPONIVEL" ? "secondary" : "primary"}
          onClick={handleClick}
        >
          {props.status === "DISPONIVEL" ? "Reservar" : "Verificar disponibilidade"}
        </Button>
      </CardActions>
    </Card>
  );
};
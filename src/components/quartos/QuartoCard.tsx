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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return "success";
      case "OCUPADO":
        return "error";
      default:
        return "default";
    }
  };
  const navigate = useNavigate()

  const handleClick = () => {
    if (props.status === "DISPONIVEL") {
      navigate(`/quartos/${props.id}/reservar`)
    } else {
      navigate(`/quartos/${props.id}/reservar`)
    }
  }

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
      <CardMedia
        sx={{ height: 300 }}
        image={props.image}
        title={props.nome}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
          <Chip
            label={props.tipo}
            color="primary"
            size="small"
            variant="outlined"
          />
          <Chip
            label={props.status}
            color={getStatusColor(props.status)}
            size="small"
          />
        </Box>

        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
          {props.nome}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {props.descricao}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          color={props.status !== "Disponível" ? "secondary" : "primary"}
          onClick={handleClick}
        >
          {props.status === "Disponível" ? "Reservar" : "Verificar disponibilidade"}
        </Button>
      </CardActions>
    </Card>
  );
};
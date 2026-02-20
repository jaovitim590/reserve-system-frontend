import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  CalendarMonth,
  KingBed,
  Cancel,
  EventAvailable,
  ArrowBack,
} from "@mui/icons-material";
import { GetMyReservas, cancelarReserva, type Reserva } from "../services/reservaService";

export const MinhasReservas = () => {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; reservaId: number | null }>({
    open: false,
    reservaId: null,
  });
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    GetMyReservas()
      .then(setReservas)
      .catch(() => setError("Erro ao carregar reservas."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelarClick = (id: number) => {
    setCancelError(null);
    setConfirmDialog({ open: true, reservaId: id });
  };

  const handleConfirmarCancelamento = async () => {
    if (!confirmDialog.reservaId) return;
    setCanceling(true);
    try {
      await cancelarReserva(confirmDialog.reservaId);
      setReservas((prev) =>
        prev.map((r) =>
          r.id === confirmDialog.reservaId ? { ...r, status: "CANCELADO" } : r
        )
      );
      setConfirmDialog({ open: false, reservaId: null });
    } catch {
      setCancelError("Erro ao cancelar reserva. Tente novamente.");
    } finally {
      setCanceling(false);
    }
  };

  const handleFecharDialog = () => {
    if (canceling) return;
    setConfirmDialog({ open: false, reservaId: null });
  };

  const formatDate = (date: string) =>
    new Date(date + "T00:00:00").toLocaleDateString("pt-BR");

  const calcDias = (inicio: string, fim: string) => {
    const diff = new Date(fim).getTime() - new Date(inicio).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/quartos")}
        sx={{ mb: 3, textTransform: "none", color: "text.secondary" }}
      >
        Voltar para quartos
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
        <EventAvailable color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Minhas Reservas
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{error}</Alert>}
      {cancelError && <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>{cancelError}</Alert>}

      {reservas.length === 0 && !error ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <CalendarMonth sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma reserva encontrada
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Você ainda não fez nenhuma reserva.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/quartos")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            Ver quartos disponíveis
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reservas.map((reserva) => {
            const cancelado = reserva.status === "CANCELADO";
            const dias = calcDias(reserva.dataInicio, reserva.dataFim);

            return (
              <Card
                key={reserva.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  opacity: cancelado ? 0.65 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <KingBed color="primary" />
                      <Typography variant="subtitle1" fontWeight={700}>
                        {reserva.quartoId.nome}
                      </Typography>
                      <Chip
                        label={reserva.quartoId.tipo}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                    <Chip
                      label={reserva.status ?? "ATIVA"}
                      size="small"
                      color={cancelado ? "error" : "success"}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Check-in</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatDate(reserva.dataInicio)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Check-out</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatDate(reserva.dataFim)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Duração</Typography>
                      <Typography variant="body2" fontWeight={600}>{dias} {dias === 1 ? "dia" : "dias"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="body2" fontWeight={700} color="primary">
                        R$ {reserva.valorTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {!cancelado && (
                    <Box sx={{ mt: 2.5, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleCancelarClick(reserva.id)}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                      >
                        Cancelar reserva
                      </Button>
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Dialog de confirmação */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleFecharDialog}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancelar reserva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleFecharDialog}
            disabled={canceling}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirmarCancelamento}
            variant="contained"
            color="error"
            disabled={canceling}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minWidth: 120 }}
          >
            {canceling ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
                Cancelando...
              </Box>
            ) : "Confirmar cancelamento"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
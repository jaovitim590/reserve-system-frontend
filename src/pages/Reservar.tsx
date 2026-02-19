import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  CalendarMonth,
  KingBed,
  ArrowBack,
  CheckCircleOutline,
  SearchOff,
  EventAvailable,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "../components/FormInput";
import { getQuartoById, getDisponibilidade, type QuartoProps } from "../services/quartoService";
import { createReservaa } from "../services/reservaService";

const reservaSchema = z.object({
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFim: z.string().min(1, "Data de fim obrigatória"),
}).refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
  message: "A data de fim deve ser maior que a data de início",
  path: ["dataFim"],
});

type ReservaForm = z.infer<typeof reservaSchema>;

export const QuartoReserva = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quarto, setQuarto] = useState<QuartoProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [disponibilidade, setDisponibilidade] = useState<boolean | null>(null);
  const [checkingDisp, setCheckingDisp] = useState(false);
  const [dispError, setDispError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ReservaForm>({
    resolver: zodResolver(reservaSchema),
    defaultValues: { dataInicio: "", dataFim: "" },
  });

  const dataInicio = watch("dataInicio");
  const dataFim = watch("dataFim");

  const calcularDias = () => {
    if (!dataInicio || !dataFim) return 0;
    const diff = new Date(dataFim).getTime() - new Date(dataInicio).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    if (!id) return;
    getQuartoById(Number(id))
  .then((data) => setQuarto(data))
  .catch((err) => console.error(err))
  .finally(() => setLoading(false))
  }, [id]);

  useEffect(() => {
    setDisponibilidade(null);
    setDispError(null);
  }, [dataInicio, dataFim]);

  const handleVerificarDisponibilidade = async () => {
    if (!dataInicio || !dataFim || !id) return;
    setCheckingDisp(true);
    setDispError(null);
    try {
      const res = await getDisponibilidade(Number(id), dataInicio, dataFim);
      setDisponibilidade(res);
    } catch {
      setDispError("Erro ao verificar disponibilidade. Tente novamente.");
    } finally {
      setCheckingDisp(false);
    }
  };

  const onSubmit = async (data: ReservaForm) => {
    try {
      await createReservaa({
        quarto_id: Number(id),
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
      });
      setSuccess(true);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setError("root", { message: "Já existe uma reserva para este período. Escolha outras datas." })
      } else {
        setError("root", { message: "Erro ao criar reserva. Tente novamente." })
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quarto) return null;

  if (success) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", px: 2 }}>
        <Card sx={{ maxWidth: 440, width: "100%", p: 4, textAlign: "center", borderRadius: 3 }}>
          <CheckCircleOutline sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Reserva confirmada!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sua reserva para o quarto <strong>{quarto.nome}</strong> foi realizada com sucesso.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/reservas")}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, py: 1.5 }}
          >
            Ver minhas reservas
          </Button>
        </Card>
      </Box>
    );
  }

  const ocupado = quarto.status === "OCUPADO";
  const dias = calcularDias();
  const datasPreenchidas = !!dataInicio && !!dataFim && new Date(dataFim) > new Date(dataInicio);
  const podeReservar = !ocupado || disponibilidade === true;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/quartos")}
        sx={{ mb: 3, textTransform: "none", color: "text.secondary" }}
      >
        Voltar para quartos
      </Button>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>

        {/* Coluna esquerda — info do quarto */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <CardMedia sx={{ height: 240 }} image={quarto.image} title={quarto.nome} />
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Chip label={quarto.tipo} color="primary" size="small" variant="outlined" />
                <Chip label={quarto.status} color={ocupado ? "error" : "success"} size="small" />
              </Box>
              <Typography variant="h6" fontWeight={700} mb={1}>{quarto.nome}</Typography>
              <Typography variant="body2" color="text.secondary">{quarto.descricao}</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                <KingBed fontSize="small" />
                <Typography variant="body2">Quarto #{quarto.id}</Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Coluna direita — formulário */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <CalendarMonth color={ocupado ? "error" : "primary"} />
              <Typography variant="h6" fontWeight={700}>
                {ocupado ? "Verificar disponibilidade" : "Selecione o período"}
              </Typography>
            </Box>

            {ocupado && (
              <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
                Este quarto está atualmente ocupado. Selecione um período para verificar disponibilidade.
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormInput
                type="date"
                name="dataInicio"
                control={control}
                label="Data de entrada"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
              <FormInput
                type="date"
                name="dataFim"
                control={control}
                label="Data de saída"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: dataInicio || new Date().toISOString().split("T")[0] }}
              />

              {dias > 0 && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 1, bgcolor: "action.hover" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Duração</Typography>
                    <Typography variant="body2" fontWeight={600}>{dias} {dias === 1 ? "dia" : "dias"}</Typography>
                  </Box>
                </Paper>
              )}

              {/* Botão de verificar — só aparece se OCUPADO */}
              {ocupado && (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={!datasPreenchidas || checkingDisp}
                    onClick={handleVerificarDisponibilidade}
                    sx={{ mt: 1, py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  >
                    {checkingDisp ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={18} thickness={5} />
                        Verificando...
                      </Box>
                    ) : "Verificar disponibilidade"}
                  </Button>

                  {dispError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{dispError}</Alert>
                  )}

                  {disponibilidade === true && (
                    <Alert severity="success" icon={<EventAvailable />} sx={{ borderRadius: 2 }}>
                      Quarto disponível para o período selecionado!
                    </Alert>
                  )}

                  {disponibilidade === false && (
                    <Alert severity="error" icon={<SearchOff />} sx={{ borderRadius: 2 }}>
                      Quarto indisponível para este período. Tente outras datas.
                    </Alert>
                  )}
                </>
              )}

              {/* Botão de reservar — bloqueado se OCUPADO e não verificou disponibilidade */}
              {podeReservar && (
                <>
                  {errors.root && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{errors.root.message}</Alert>
                  )}
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "1rem",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd6, #6a3f9a)",
                        boxShadow: "0 6px 25px rgba(102,126,234,0.5)",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={18} thickness={5} sx={{ color: "white" }} />
                        Reservando...
                      </Box>
                    ) : "Confirmar reserva"}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
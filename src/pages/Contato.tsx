import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "../components/FormInput";

const contatoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContatoForm = z.infer<typeof contatoSchema>;

const INFO_ITEMS = [
  {
    icon: <Email color="primary" />,
    label: "E-mail",
    value: "contato@reservsystem.com",
  },
  {
    icon: <Phone color="primary" />,
    label: "Telefone",
    value: "+55 (11) 9 9999-9999",
  },
  {
    icon: <LocationOn color="primary" />,
    label: "Endereço",
    value: "Av. Paulista, 1000 — São Paulo, SP",
  },
];

export const Contato = () => {
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContatoForm>({
    resolver: zodResolver(contatoSchema),
    defaultValues: { nome: "", email: "", assunto: "", mensagem: "" },
  });

  const onSubmit = async (data: ContatoForm) => {
    // Simula envio (substituir por chamada real à API)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    console.log("Contato enviado:", data);
    setSuccess(true);
    reset();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="Fale conosco"
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Entre em contato
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={500} mx="auto">
          Tem alguma dúvida ou precisa de ajuda? Preencha o formulário e retornaremos em breve.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>

        {/* Info lateral */}
        <Box sx={{ flex: "0 0 280px" }}>
          <Paper sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Informações
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Estamos disponíveis de segunda a sexta, das 8h às 18h.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {INFO_ITEMS.map((item) => (
                <Box key={item.label} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Formulário */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            {success ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircleOutline sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Mensagem enviada!
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Recebemos sua mensagem e entraremos em contato em breve.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSuccess(false)}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                >
                  Enviar outra mensagem
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormInput name="nome" control={control} label="Nome completo" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormInput type="email" name="email" control={control} label="E-mail" />
                  </Box>
                </Box>

                <FormInput name="assunto" control={control} label="Assunto" />

                <FormInput
                  name="mensagem"
                  control={control}
                  label="Mensagem"
                  multiline
                  rows={5}
                />

                {errors.root && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {errors.root.message}
                  </Alert>
                )}

                <Button
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={!isSubmitting && <Send />}
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
                      Enviando...
                    </Box>
                  ) : "Enviar mensagem"}
                </Button>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
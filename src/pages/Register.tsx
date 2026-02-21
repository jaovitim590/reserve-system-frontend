import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import authService from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { FormInput } from "../components/FormInput";
import { type RegisterForm, registerSchema } from "../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import type { AxiosError } from "axios";

export const Register = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const navigate = useNavigate();

  const password = useWatch({ control, name: "password" });
  const passwordConfirmation = useWatch({ control, name: "passwordConfirmation" });

  const passwordsMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;
  const passwordsMismatch =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;

  const onSubmit = async (data: RegisterForm) => {
    try {
      const payload = {
  name: data.name,
  email: data.email,
  password: data.password,
};
      await authService.signUp(payload);
      navigate("/login");
    } catch (error: unknown) {
  const err = error as AxiosError;

  if (err.response?.status === 409) {
    setError("root", { message: "E-mail já cadastrado." });
  } else {
    setError("root", { message: "Erro ao criar conta. Tente novamente." });
  }
}
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(102,126,234,0.5)",
              }}
            >
              <LockOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Seja bem-vindo!
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mb: 3 }}>
            Registre-se para continuar
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 0.5, pb: 3 }}
          >
            <FormInput type="text" name="name" control={control} label="Usuário" autoComplete="name" />
            <FormInput type="email" name="email" control={control} label="E-mail" autoComplete="email" />
            <FormInput type="password" name="password" control={control} label="Senha" autoComplete="new-password" />
            <FormInput type="password" name="passwordConfirmation" control={control} label="Confirmar senha" autoComplete="new-password" />

            {passwordConfirmation.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
                {passwordsMatch ? (
                  <>
                    <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "success.main" }} />
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                      Senhas coincidem
                    </Typography>
                  </>
                ) : (
                  <>
                    <CancelRoundedIcon sx={{ fontSize: 16, color: "error.main" }} />
                    <Typography variant="caption" color="error.main" fontWeight={600}>
                      Senhas não coincidem
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {errors.root && (
              <Alert severity="error" sx={{ borderRadius: 2, mt: 1 }}>
                {errors.root.message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting || passwordsMismatch}
              sx={{
                mt: 1.5,
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
                  Registrando...
                </Box>
              ) : "Registrar"}
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mt: 1 }}>
              Já tem uma conta?{" "}
              <Box
                component={Link}
                to="/login"
                sx={{ color: "#667eea", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                Login
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
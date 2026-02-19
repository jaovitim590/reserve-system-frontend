import { useForm } from "react-hook-form";
import { FormInput } from "../components/FormInput";
import { type LoginForm, loginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box, Button, Card, CardContent, Divider,
  Typography, CircularProgress, Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import authService from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
export const Login = () => {
  const { setAccessToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const { token } = await authService.signIn(data)
      setAccessToken(token)
      const user = await authService.getUser()
      setUser(user)
      navigate("/")
    } catch {
      setError("root", { message: "E-mail ou senha inválidos." })
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
            Bem-vindo de volta
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mb: 3 }}>
            Faça login para continuar
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 0.5, pb: 3 }}
          >
            <FormInput type="email" name="email" control={control} label="E-mail" autoComplete="email" />
            <FormInput type="password" name="password" control={control} label="Senha" autoComplete="current-password" />

            {errors.root && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errors.root.message}
              </Alert>
            )}

            <Button
              type="submit"
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
                  Entrando...
                </Box>
              ) : "Entrar"}
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary", mt: 1 }}>
              Não tem uma conta?{" "}
              <Box
                component={Link}
                to="/register"
                sx={{ color: "#667eea", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                Cadastre-se
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
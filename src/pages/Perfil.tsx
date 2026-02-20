import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarMonth,
  Edit,
  Delete,
  Check,
  Close,
} from "@mui/icons-material";
import { getPerfil, updatePerfil, deletePerfil, type userProps } from "../services/userService";
import { TOKEN_KEY } from "../lib/token";

export const Perfil = () => {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<userProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    getPerfil()
      .then((data) => {
        setPerfil(data);
        setNewName(data.name);
      })
      .catch(() => setError("Erro ao carregar perfil."))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setNameError("Nome não pode ser vazio.");
      return;
    }
    setSavingName(true);
    setNameError(null);
    try {
      const res = await updatePerfil(newName.trim());
      setPerfil(res.perfil);
      setEditingName(false);
    } catch {
      setNameError("Erro ao atualizar nome. Tente novamente.");
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setNameError(null);
    if (perfil) setNewName(perfil.name);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePerfil();
      localStorage.removeItem(TOKEN_KEY);
      navigate("/login");
    } catch {
      setDeleteError("Erro ao deletar conta. Tente novamente.");
      setDeleting(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !perfil) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error ?? "Perfil não encontrado."}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={4}>
        Meu Perfil
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            px: 4,
            py: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 88,
              height: 88,
              fontSize: "2rem",
              fontWeight: 700,
              bgcolor: "rgba(255,255,255,0.25)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.4)",
            }}
          >
            {getInitials(perfil.name)}
          </Avatar>
          <Typography variant="h6" fontWeight={700} color="white">
            {perfil.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {perfil.email}
          </Typography>
        </Box>

        <Box sx={{ px: 4, py: 3, display: "flex", flexDirection: "column", gap: 3 }}>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Person fontSize="small" color="primary" />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                Nome
              </Typography>
            </Box>

            {editingName ? (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    autoFocus
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                </Box>
                <Tooltip title="Salvar">
                  <IconButton
                    onClick={handleSaveName}
                    disabled={savingName}
                    color="primary"
                    sx={{ mt: 0.5 }}
                  >
                    {savingName ? <CircularProgress size={18} /> : <Check />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancelar">
                  <IconButton onClick={handleCancelEdit} sx={{ mt: 0.5 }}>
                    <Close />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body1" fontWeight={500}>{perfil.name}</Typography>
                <Tooltip title="Editar nome">
                  <IconButton size="small" onClick={() => setEditingName(true)} color="primary">
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          <Divider />

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Email fontSize="small" color="primary" />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                E-mail
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={500}>{perfil.email}</Typography>
          </Box>

          <Divider />

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarMonth fontSize="small" color="primary" />
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                Membro desde
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight={500}>{formatDate(perfil.data_criado)}</Typography>
          </Box>

          <Divider />

          {/* Ações rápidas */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/reservas")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1 }}
            >
              Minhas reservas
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/quartos")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1 }}
            >
              Ver quartos
            </Button>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="error" fontWeight={700} mb={1}>
              Zona de perigo
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Ao deletar sua conta, todos os seus dados serão removidos permanentemente.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialog(true)}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Deletar minha conta
            </Button>
          </Box>
        </Box>
      </Card>

      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
          Deletar conta
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar sua conta? Todos os seus dados e reservas serão removidos permanentemente. Esta ação <strong>não pode ser desfeita</strong>.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>{deleteError}</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minWidth: 130 }}
          >
            {deleting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
                Deletando...
              </Box>
            ) : "Confirmar exclusão"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { adminService, type QuartoRes } from "../../services/adminService";

function fmtDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtBRL(value: number) {
  return value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "-";
}

const statusColor: Record<string, "success" | "warning" | "error" | "default"> = {
  DISPONIVEL: "success",
  OCUPADO: "warning",
  MANUTENCAO: "error",
};

const statusLabel: Record<string, string> = {
  DISPONIVEL: "Disponível",
  OCUPADO: "Ocupado",
  MANUTENCAO: "Manutenção",
};

const EMPTY_FORM = {
  id: 0 as number,
  name: "",
  descricao: "",
  capacidade: 1,
  valor: 0,
  status: "DISPONIVEL",
  tipo: "",
};

export default function QuartosCrud() {
  const [rows, setRows] = useState<QuartoRes[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [confirmId, setConfirmId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      setRows(await adminService.getAllQuartos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setIsEdit(false);
    setOpen(true);
  };

  const handleOpenEdit = (quarto: QuartoRes) => {
    setForm({
      id: quarto.id,
      name: quarto.nome ?? quarto.name ?? "",
      descricao: quarto.descricao,
      capacidade: quarto.capacidade,
      valor: quarto.valor,
      status: quarto.status,
      tipo: quarto.tipo,
    });
    setIsEdit(true);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await adminService.updateQuarto(form as Parameters<typeof adminService.updateQuarto>[0]);
      } else {
        await adminService.createQuarto(form as Parameters<typeof adminService.createQuarto>[0]);
      }
      setOpen(false);
      await fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmId === null) return;
    await adminService.deleteQuarto(confirmId);
    setConfirmId(null);
    await fetchData();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      width: 60,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },

    {
      field: "nome",
      headerName: "Quarto",
      flex: 1,
      minWidth: 180,
      valueGetter: (_v: unknown, row: QuartoRes) => row.nome ?? row.name ?? "-",
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as QuartoRes;
        const nome = row.nome ?? row.name ?? "-";
        return (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 1, bgcolor: "action.selected", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MeetingRoomRoundedIcon sx={{ fontSize: 17, color: "text.secondary" }} />
            </Box>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>{nome}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {row.tipo}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },

    {
      field: "capacidade",
      headerName: "Capacidade",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <PeopleAltRoundedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
          <Typography variant="body2">{params.value} pessoa{params.value !== 1 ? "s" : ""}</Typography>
        </Stack>
      ),
    },

    {
      field: "valor",
      headerName: "Valor/noite",
      width: 140,
      type: "number",
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <AttachMoneyRoundedIcon sx={{ fontSize: 15, color: "success.main" }} />
          <Typography variant="body2" fontWeight={700} color="success.main"
            sx={{ fontVariantNumeric: "tabular-nums" }}>
            {fmtBRL(params.value as number)}
          </Typography>
        </Stack>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={statusLabel[params.value as string] ?? params.value}
          color={statusColor[params.value as string] ?? "default"}
          size="small"
          sx={{ fontWeight: 600, fontSize: 11, letterSpacing: 0.3 }}
        />
      ),
    },

    {
      field: "data_criacao",
      headerName: "Criado em",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">
          {fmtDate(params.value as string)}
        </Typography>
      ),
    },

    {
      field: "id_acoes",
      headerName: "Ações",
      width: 100,
      sortable: false,
      filterable: false,
      valueGetter: (_v: unknown, row: QuartoRes) => row.id,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(params.row as QuartoRes)}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              color="error"
              onClick={() => setConfirmId(params.value as number)}
              sx={{
                border: "1px solid", borderColor: "error.light", borderRadius: 1,
                "&:hover": { bgcolor: "error.main", color: "white" },
              }}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Quartos</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os quartos disponíveis no sistema.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
          Novo Quarto
        </Button>
      </Stack>

      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          loading={loading}
          rowHeight={56}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
          pageSizeOptions={[10, 20, 50]}
          disableColumnResize
          density="comfortable"
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            },
          }}
          slotProps={{
            filterPanel: {
              filterFormProps: {
                logicOperatorInputProps: { variant: "outlined", size: "small" },
                columnInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
                operatorInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
                valueInputProps: { InputComponentProps: { variant: "outlined", size: "small" } },
              },
            },
          }}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? "Editar Quarto" : "Novo Quarto"}</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome" value={form.name} size="small" fullWidth
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Descrição" value={form.descricao} size="small" fullWidth multiline rows={2}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Capacidade" type="number" value={form.capacidade} size="small" fullWidth
                inputProps={{ min: 1 }}
                onChange={(e) => setForm({ ...form, capacidade: Number(e.target.value) })}
              />
              <TextField
                label="Valor/noite (R$)" type="number" value={form.valor} size="small" fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select value={form.tipo} label="Tipo" onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <MenuItem value="SIMPLES">Simples</MenuItem>
                  <MenuItem value="DUPLO">Duplo</MenuItem>
                  <MenuItem value="SUITE">Suíte</MenuItem>
                  <MenuItem value="LUXO">Luxo</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="DISPONIVEL">Disponível</MenuItem>
                  <MenuItem value="OCUPADO">Ocupado</MenuItem>
                  <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir quarto</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
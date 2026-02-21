import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { adminService, type ReservaRes } from "../../services/adminService";

type StatusCfg = { color: "success" | "warning" | "error" | "info" | "default"; label: string };

const STATUS_CFG: Record<string, StatusCfg> = {
  ATIVA:     { color: "success", label: "Ativa" },
  PENDENTE:  { color: "warning", label: "Pendente" },
  CANCELADA: { color: "error",   label: "Cancelada" },
  CONCLUIDA: { color: "info",    label: "Concluída" },
};

function fmtDate(value: string | undefined | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtBRL(value: number) {
  return value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "-";
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}


export default function ReservasCrud() {
  const [rows, setRows] = useState<ReservaRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      setRows(await adminService.getRecentReservas());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (confirmId === null) return;
    await adminService.deleteReserva(confirmId);
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
      field: "usuario",
      headerName: "Hóspede",
      flex: 1.2,
      minWidth: 200,
      valueGetter: (_v: unknown, row: ReservaRes) => row.usuario?.name ?? "-",
      renderCell: (params: GridRenderCellParams) => {
        const usuario = (params.row as ReservaRes).usuario;
        const name = usuario?.name ?? "-";
        return (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%", minWidth: 0 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "primary.main", flexShrink: 0 }}>
              {initials(name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>{name}</Typography>
              {usuario?.email && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {usuario.email}
                </Typography>
              )}
            </Box>
          </Stack>
        );
      },
    },

    {
      field: "quarto",
      headerName: "Quarto",
      flex: 1,
      minWidth: 160,
      valueGetter: (_v: unknown, row: ReservaRes) => row.quarto?.nome ?? row.quarto?.name ?? "-",
      renderCell: (params: GridRenderCellParams) => {
        const quarto = (params.row as ReservaRes).quarto;
        const nome = quarto?.nome ?? quarto?.name ?? "-";
        return (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%", minWidth: 0 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 1, bgcolor: "action.selected", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <HotelRoundedIcon sx={{ fontSize: 17, color: "text.secondary" }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>{nome}</Typography>
              {quarto?.tipo && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {quarto.tipo}
                </Typography>
              )}
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "data_incio",
      headerName: "Check-in",
      width: 155,
      valueGetter: (_v: unknown, row: ReservaRes) =>
        (row as ReservaRes & { data_inicio?: string }).data_inicio ?? row.data_inicio ?? null,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <LoginRoundedIcon sx={{ fontSize: 15, color: "success.main", flexShrink: 0 }} />
          <Typography variant="body2">{fmtDate(params.value as string)}</Typography>
        </Stack>
      ),
    },

    {
      field: "data_fim",
      headerName: "Check-out",
      width: 155,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <LogoutRoundedIcon sx={{ fontSize: 15, color: "error.main", flexShrink: 0 }} />
          <Typography variant="body2">{fmtDate(params.value as string)}</Typography>
        </Stack>
      ),
    },

    {
      field: "valorTotal",
      headerName: "Total",
      width: 135,
      type: "number",
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2" fontWeight={700} color="success.main"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmtBRL(params.value as number)}
        </Typography>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const cfg = STATUS_CFG[params.value as string] ?? { color: "default", label: params.value };
        return (
          <Chip
            label={cfg.label}
            color={cfg.color}
            size="small"
            sx={{ fontWeight: 600, fontSize: 11, letterSpacing: 0.3 }}
          />
        );
      },
    },

    {
      field: "data_criado",
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
      width: 80,
      sortable: false,
      filterable: false,
      valueGetter: (_v: unknown, row: ReservaRes) => row.id,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="Excluir reserva">
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
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Reservas</Typography>
        <Typography variant="body2" color="text.secondary">
          Visualize e gerencie todas as reservas do sistema.
        </Typography>
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

      <Dialog open={confirmId !== null} onClose={() => setConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Excluir reserva</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
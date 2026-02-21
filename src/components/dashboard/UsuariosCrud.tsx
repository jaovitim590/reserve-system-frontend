import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { adminService, type UsuarioRes } from "../../services/adminService";

function fmtDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const roleColor: Record<string, "warning" | "primary" | "default"> = {
  ADMIN: "warning",
  USER: "primary",
};

const roleLabel: Record<string, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

export default function UsuariosCrud() {
  const [rows, setRows] = useState<UsuarioRes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getRecentReservas().then((reservas) => {
      const map = new Map<number, UsuarioRes>();
      reservas.forEach((r) => {
        if (r.usuario && !map.has(r.usuario.id)) map.set(r.usuario.id, r.usuario);
      });
      setRows(Array.from(map.values()));
    }).finally(() => setLoading(false));
  }, []);

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
      field: "name",
      headerName: "Usuário",
      flex: 1,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as UsuarioRes;
        return (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "primary.main", flexShrink: 0 }}>
              {initials(row.name ?? "-")}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight={600} noWrap>{row.name}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                {row.email}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },
    {
      field: "role",
      headerName: "Perfil",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={roleLabel[params.value as string] ?? params.value}
          color={roleColor[params.value as string] ?? "default"}
          size="small"
          sx={{ fontWeight: 600, fontSize: 11 }}
        />
      ),
    },
    {
      field: "ativo",
      headerName: "Situação",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Ativo" : "Inativo"}
          color={params.value ? "success" : "default"}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: 11 }}
        />
      ),
    },
    {
      field: "data_criado",
      headerName: "Cadastrado em",
      width: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">
          {fmtDate(params.value as string)}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Usuários</Typography>
        <Typography variant="body2" color="text.secondary">
          Visualize os usuários cadastrados no sistema.
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
              overflow: "hidden",
            },
            "& .MuiDataGrid-columnHeader": {
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
    </Box>
  );
}
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Pagination,
  Grid as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import { QuartoCard } from "./QuartoCard";
import { getQuartos } from "../../services/quartoService";
import { type QuartoProps } from "../../services/quartoService";




export const QuartoGrid = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filtroTipo, setFiltroTipo] = useState<string>("Todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos");
  const [quartosData, setQuartosData] = useState<QuartoProps[]>([]);
  
  useEffect(() => {
    async function fetchQuartos() {
      const data = await getQuartos();
      setQuartosData(data);
    }
  
    fetchQuartos();
  }, []);
  const quartosFiltrados = quartosData.filter((quarto) => {
    const tipoMatch = filtroTipo === "Todos" || quarto.tipo === filtroTipo;
    const statusMatch = filtroStatus === "Todos" || quarto.status === filtroStatus;
    return tipoMatch && statusMatch;
  });

  const totalPages = Math.ceil(quartosFiltrados.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const quartosExibidos = quartosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setPage(1); 
  };

  const handleFiltroTipoChange = (value: string) => {
    setFiltroTipo(value);
    setPage(1);
  };

  const handleFiltroStatusChange = (value: string) => {
    setFiltroStatus(value);
    setPage(1);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Nossos Quartos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encontramos {quartosFiltrados.length} {quartosFiltrados.length === 1 ? "quarto" : "quartos"}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tipo de Quarto</InputLabel>
          <Select
            value={filtroTipo}
            label="Tipo de Quarto"
            onChange={(e) => handleFiltroTipoChange(e.target.value)}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="CASAL">Casal</MenuItem>
            <MenuItem value="LUXO">Luxo</MenuItem>
            <MenuItem value="SOLTEIRO">Solteiro</MenuItem>
            <MenuItem value="SUITE">Suite</MenuItem>  
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filtroStatus}
            label="Status"
            onChange={(e) => handleFiltroStatusChange(e.target.value)}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="DISPONIVEL">Disponível</MenuItem>
            <MenuItem value="OCUPADO">Ocupado</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Por página</InputLabel>
          <Select
            value={itemsPerPage}
            label="Por página"
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <MenuItem value={3}>3 quartos</MenuItem>
            <MenuItem value={6}>6 quartos</MenuItem>
            <MenuItem value={9}>9 quartos</MenuItem>
            <MenuItem value={12}>12 quartos</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {(filtroTipo !== "Todos" || filtroStatus !== "Todos") && (
        <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
          {filtroTipo !== "Todos" && (
            <Chip
              label={`Tipo: ${filtroTipo}`}
              onDelete={() => handleFiltroTipoChange("Todos")}
              color="primary"
              variant="outlined"
            />
          )}
          {filtroStatus !== "Todos" && (
            <Chip
              label={`Status: ${filtroStatus}`}
              onDelete={() => handleFiltroStatusChange("Todos")}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      )}
      {quartosExibidos.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {quartosExibidos.map((quarto) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quarto.id}>
                <QuartoCard
                  id={quarto.id}
                  nome={quarto.nome}
                  descricao={quarto.descricao}
                  tipo={quarto.tipo}
                  status={quarto.status}
                  image={quarto.image}
                  valor={quarto.valor}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Exibindo {startIndex + 1} - {Math.min(endIndex, quartosFiltrados.length)} de{" "}
            {quartosFiltrados.length} {quartosFiltrados.length === 1 ? "quarto" : "quartos"}
          </Typography>
        </>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum quarto encontrado com os filtros selecionados
          </Typography>
        </Box>
      )}
    </Container>
  );
};
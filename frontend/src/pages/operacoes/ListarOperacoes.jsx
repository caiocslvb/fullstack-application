import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import { getOperacoesApi, getMercadoriasByIdApi } from '../../services/api';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Modal from '@mui/material/Modal';
import CadastrarOperacao from "./CadastroOperacao"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  // Obter as partes da data e hora
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa de 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Formatar como "DD/MM/YYYY às HH:mm"
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

export default function ListarMercadorias() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [operacoes, setOperacoes] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = (v) => {

    if (v){
      const dadosFiltrados = operacoes.filter(item => item.tipo_operacao.includes(v.toLowerCase()));
      setOperacoes(dadosFiltrados)
    } else {
      fetchOperacoes();
    }
  };

  const fetchOperacoes = async () => {
    try {
      const response = await getOperacoesApi();
      setOperacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar operacoes:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOperacoes();
  }, []);

  return (
    <>
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CadastrarOperacao closeEvent={handleClose} buscar={fetchOperacoes}/>
        </Box>
      </Modal>
    </div>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
          >
            Operações de entradas e saídas
        </Typography>
        <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["ENTRADA", "SAIDA"]}
              sx={{ width: 300 }}
              onChange={(e, v) => filterData(v)}
              // getOptionLabel={(rows) => rows.id || ""}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Filtrar operações" />
              )}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />}>
              Novo
            </Button>
          </Stack>
          <Box height={10} />
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Tipo de Operação</TableCell>
            <TableCell align="left">Mercadoria</TableCell>
            <TableCell align="left">Quantidade</TableCell>
            <TableCell align="left">Local</TableCell>
            <TableCell align="left">Data e hora</TableCell>
          </TableRow>
        </TableHead>
          <TableBody>
          {operacoes.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.tipo_operacao.toUpperCase()}
                </TableCell>
                <TableCell align="left">{row.mercadoria}</TableCell>
                <TableCell align="left">{row.quantidade}</TableCell>
                <TableCell align="left">{row.local}</TableCell>
                <TableCell align="left">{formatDateTime(row.data_hora)}</TableCell>
              </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={operacoes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>

  );
}

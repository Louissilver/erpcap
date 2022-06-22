import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import {
  IListagemPessoa,
  PessoasService,
} from '../../shared/services/api/pessoas/PessoasService';
import { useDebounce } from '../../shared/hooks';
import {
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';
import { Environment } from '../../shared/environment';
import { LocalizationProvider } from '@mui/x-date-pickers';

export const ListagemDePessoa: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce(1000);
  const navigate = useNavigate();

  const [dadosData, setDadosData] = useState<IListagemPessoa[]>([]);
  const [rows, setRows] = useState<IListagemPessoa[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      PessoasService.getAll(pagina, busca).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          return;
        } else {
          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, [busca, pagina]);

  const handleChangeDataInicial = (newValue: Date | null) => {
    setDadosData([]);
    if (newValue == null) {
      setDataInicial('');
    } else {
      setDataInicial(moment(newValue).format('YYYY-MM-DD'));
    }
  };

  const handleChangeDataFinal = (newValue: Date | null) => {
    setDadosData([]);
    if (newValue == null) {
      setDataFinal('');
    } else {
      setDataFinal(moment(newValue).format('YYYY-MM-DD'));
    }
  };

  const carregarDadosData = async () => {
    await PessoasService.getAllByDate(dataInicial, dataFinal).then((result) => {
      if (result instanceof Error) {
        alert(result.message);
        return;
      } else {
        if (result.data.length == 0) {
          alert('Não foram encontrados clientes entre as datas informadas.');
        } else {
          alert(
            `Foram encontrados ${result.totalCount} clientes entre as datas informadas.`
          );
          setDadosData(result.data);
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que quer excluir esse registro?')) {
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows((oldRows) => [
            ...oldRows.filter((oldRow) => oldRow._id !== id),
          ]);
          alert('Registro excluído com sucesso.');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo="Listagem de clientes"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo="Nova"
          aoClicarBotaoNovo={() => navigate('/pessoas/detalhe/nova')}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: '1' }, { replace: true })
          }
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: 'auto' }}
      >
        <TableRow>
          <TableCell>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                label="Data inicial"
                inputFormat="DD/MM/yyyy"
                mask="__/__/____"
                value={dataInicial}
                onChange={handleChangeDataInicial}
                renderInput={(params) => (
                  <TextField {...params} error={false} />
                )}
              />
            </LocalizationProvider>
          </TableCell>
          <TableCell>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                label="Data final"
                inputFormat="DD/MM/yyyy"
                mask="__/__/____"
                value={dataFinal}
                onChange={handleChangeDataFinal}
                renderInput={(params) => (
                  <TextField {...params} error={false} />
                )}
              />
            </LocalizationProvider>
          </TableCell>
          <TableCell>
            {dadosData.length == 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={carregarDadosData}
              >
                Buscar dados
              </Button>
            )}
            {dadosData.length > 0 && (
              <Button variant="contained" color="primary">
                <CSVLink
                  asyncOnClick={true}
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.contrastText,
                  }}
                  data={dadosData}
                  filename="Clientes.csv"
                >
                  Exportar CSV
                </CSVLink>
              </Button>
            )}
          </TableCell>
        </TableRow>
      </TableContainer>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Ações</TableCell>
              <TableCell>Nome completo</TableCell>
              <TableCell>Telefone celular</TableCell>
              <TableCell>Data de cadastro</TableCell>
              <TableCell>Contato realizado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/pessoas/detalhe/${row._id}`)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row._id)}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.nomeCompleto}</TableCell>
                <TableCell>{row.telefone}</TableCell>
                <TableCell>
                  {moment(row.dataCriacao).format('DD/MM/YYYY - HH:mm:ss')}
                </TableCell>
                <TableCell>{row.contatoRealizado ? 'Sim' : 'Não'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}
          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
            )}
            {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) =>
                      setSearchParams(
                        { busca, pagina: newPage.toString() },
                        { replace: true }
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};

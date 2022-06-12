import {
  Paper,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePagina';
import { CidadesService } from '../../shared/services/api/cidades/CidadesService';
import { EmpreendimentosService } from '../../shared/services/api/empreendimentos/EmpreendimentosService';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';

export const Dashboard: React.FC = () => {
  const [totalCountPessoas, setTotalCountPessoas] = useState(0);
  const [totalCountEmpreendimentos, setTotalCountEmpreendimentos] = useState(0);
  const [totalCountCidades, setTotalCountCidades] = useState(0);
  const [isLoadingCidades, setIsLoadingCidades] = useState(true);
  const [isLoadingPessoas, setIsLoadingPessoas] = useState(true);
  const [isLoadingEmpreendimentos, setIsLoadingEmpreendimentos] =
    useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingEmpreendimentos(true);
    EmpreendimentosService.getAll().then((result) => {
      setIsLoadingEmpreendimentos(false);
      if (result instanceof Error) {
        alert(result.message);
        return;
      } else {
        setTotalCountEmpreendimentos(result.totalCount);
      }
    });
  }, [totalCountEmpreendimentos]);

  useEffect(() => {
    setIsLoadingCidades(true);
    CidadesService.getAll().then((result) => {
      setIsLoadingCidades(false);
      if (result instanceof Error) {
        alert(result.message);
        return;
      } else {
        setTotalCountCidades(result.totalCount);
      }
    });
  }, [totalCountCidades]);

  useEffect(() => {
    setIsLoadingPessoas(true);
    PessoasService.getAll().then((result) => {
      setIsLoadingPessoas(false);
      if (result instanceof Error) {
        alert(result.message);
        return;
      } else {
        setTotalCountPessoas(result.totalCount);
      }
    });
  }, [totalCountPessoas]);

  return (
    <LayoutBaseDePagina titulo="Corretores de Alta Performance">
      <Grid container direction="row">
        <Grid item xs={12} md={4}>
          <Card component={Paper} sx={{ margin: 4 }}>
            <CardActionArea onClick={() => navigate('/pessoas')}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Clientes
                </Typography>
                <Box
                  padding={6}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {!isLoadingPessoas && (
                    <Typography variant="h1">{totalCountPessoas}</Typography>
                  )}
                  {isLoadingPessoas && <CircularProgress />}
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component={Paper} sx={{ margin: 4 }}>
            <CardActionArea onClick={() => navigate('/empreendimentos')}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Empreendimentos
                </Typography>
                <Box
                  padding={6}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {!isLoadingEmpreendimentos && (
                    <Typography variant="h1">
                      {totalCountEmpreendimentos}
                    </Typography>
                  )}
                  {isLoadingEmpreendimentos && <CircularProgress />}
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card component={Paper} sx={{ margin: 4 }}>
            <CardActionArea onClick={() => navigate('/cidades')}>
              <CardContent>
                <Typography variant="h6" align="center">
                  Cidades
                </Typography>
                <Box
                  padding={6}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {!isLoadingCidades && (
                    <Typography variant="h1">{totalCountCidades}</Typography>
                  )}
                  {isLoadingCidades && <CircularProgress />}
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </LayoutBaseDePagina>
  );
};

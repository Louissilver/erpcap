import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FerramentasDeDetalhe } from '../../shared/components';
import {
  VTextField,
  VForm,
  useVForm,
  IVFormErrors,
  VPhoneTextField,
} from '../../shared/forms';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { PessoasService } from '../../shared/services/api/pessoas/PessoasService';
import * as yup from 'yup';
import { AutoCompleteCidade } from '../../shared/components/autocomplete-cidade/AutoCompleteCidade';
import { VDateField } from '../../shared/forms/VDateField';
import { VCheckBox } from '../../shared/forms/VCheckBox';

interface IFormData {
  nomeCompleto: string;
  telefone: string;
  cidadeInteresse: string;
  dataCriacao?: Date;
  contatoRealizado?: boolean;
  aceiteDosTermos?: boolean;
}

const phoneRegExp = RegExp('^\\([\\d]{2}\\) \\d [\\d]{4}\\-[\\d]{4}$');

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required().min(3),
  telefone: yup
    .string()
    .required()
    .matches(phoneRegExp, 'O número de telefone não é válido.'),
  cidadeInteresse: yup.string().required(),
  dataCriacao: yup.date(),
  contatoRealizado: yup.boolean(),
  aceiteDosTermos: yup.boolean(),
});

export const DetalheDePessoas: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);
      PessoasService.getById(id).then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          alert(result.message);
          navigate('/pessoas');
        } else {
          setNome(result.nomeCompleto);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        telefone: '',
        cidadeInteresse: '',
        dataCriacao: '',
        contatoRealizado: false,
        aceiteDosTermos: false,
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          PessoasService.create(dadosValidados).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              alert('Registro cadastrado com sucesso.');
              if (isSaveAndClose()) {
                navigate('/pessoas');
              } else {
                navigate(`/pessoas/detalhe/${result}`);
              }
            }
          });
        } else {
          PessoasService.updateById(id, {
            _id: id,
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);
            if (result instanceof Error) {
              alert(result.message);
            } else {
              alert('Registro alterado com sucesso.');
              if (isSaveAndClose()) {
                navigate('/pessoas');
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;
          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que quer excluir esse registro?')) {
      PessoasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert('Registro excluído com sucesso.');
          navigate('/pessoas');
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoVoltar
          mostrarBotaoApagar={id !== 'nova'}
          mostrarBotaoSalvar
          mostrarBotaoSalvarEVoltar
          aoClicarEmApagar={() => handleDelete(id)}
          aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEVoltar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/pessoas')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column">
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress />
              </Grid>
            )}
            <Grid item>
              <Typography variant="caption">
                Todos os campos são obrigatórios
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={8}>
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label="Nome completo"
                  name="nomeCompleto"
                  onChange={(e) => setNome(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={8}>
                <VPhoneTextField
                  disabled={isLoading}
                  fullWidth
                  label="Telefone celular"
                  name="telefone"
                />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} md={8}>
                <AutoCompleteCidade disabled={isLoading} />
              </Grid>
            </Grid>
            {id !== 'nova' && (
              <>
                <Grid item>
                  <Typography variant="h6">Outros</Typography>
                </Grid>
                <Grid container item direction="row" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <VDateField
                      disabled
                      fullWidth
                      label="Data de criação"
                      name="dataCriacao"
                    />
                  </Grid>
                </Grid>
                <Grid container item direction="row" spacing={2}>
                  <Grid item xs={12} md={5}>
                    <VCheckBox
                      name="contatoRealizado"
                      label="Contato realizado"
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <VCheckBox
                      name="aceiteDosTermos"
                      disabled
                      label="Aceite dos termos"
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};

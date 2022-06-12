import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { useField } from '@unform/core';
import { CidadesService } from '../../../shared/services/api/cidades/CidadesService';
import { useDebounce } from '../../../shared/hooks';

type TAutoCompleteOption = {
  id: string;
  label: string;
};

interface IAutoCompleteCidadeProps {
  isExternalLoading?: boolean;
  disabled?: boolean;
  name?: string;
}

export const AutoCompleteCidade: React.FC<IAutoCompleteCidadeProps> = ({
  isExternalLoading = false,
  disabled = false,
  name = 'cidadeInteresse',
}) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);
  const { debounce } = useDebounce();
  const [isLoading, setIsLoading] = useState(false);

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [busca, setBusca] = useState('');

  const [cidadeSelecionada, setCidadeSelecionada] = useState<
    string | undefined
  >(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => cidadeSelecionada,
      setValue: (_, newCidadeSelecionada) =>
        setCidadeSelecionada(newCidadeSelecionada),
    });
  }, [registerField, fieldName, cidadeSelecionada]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CidadesService.getAll(true).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          console.log(result.message);
        } else {
          setOpcoes(
            result.data.map((cidade) => ({
              id: cidade._id,
              label: cidade.cidade,
            }))
          );
        }
      });
    });
  }, [busca]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!cidadeSelecionada) return null;

    const selectedOption = opcoes.find(
      (opcao) => opcao.label === cidadeSelecionada
    );
    if (!selectedOption) return null;

    return selectedOption;
  }, [cidadeSelecionada, opcoes]);

  return (
    <Autocomplete
      loading={isLoading}
      openText="Abrir"
      closeText="Fechar"
      noOptionsText="Não foram encontradas opções. Tente novamente mais tarde."
      loadingText="Carregando..."
      disablePortal
      popupIcon={
        isExternalLoading || isLoading ? (
          <CircularProgress size={28} />
        ) : undefined
      }
      options={opcoes}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onChange={(_, newValue) => {
        setCidadeSelecionada(newValue?.label || '');
        setBusca('');
        clearError();
      }}
      onInputChange={(_, newValue) => setBusca(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={name == 'cidadeInteresse' ? 'Cidade de interesse' : 'Cidade'}
          error={!!error}
          helperText={error}
          fullWidth
          variant="outlined"
          color="primary"
          disabled={disabled}
        />
      )}
    />
  );
};

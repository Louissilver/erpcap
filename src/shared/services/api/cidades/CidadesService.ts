import { Environment } from '../../../environment';
import { Api } from '../axios.config';

interface IListagemCidade {
  id: number;
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

interface IDetalheCidade {
  id: number;
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}

type TCidadesComTotalCount = {
  data: IListagemCidade;
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ''
): Promise<TCidadesComTotalCount | Error> => {
  try {
    const urlRelativa = `/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_DE_LINHAS
        ),
      };
    }
    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao listar os registros.'
    );
  }
};

const getById = async (id: number): Promise<IDetalheCidade | Error> => {
  try {
    const { data } = await Api.get(`/cidades/${id}`);

    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao consultar o registro.'
    );
  }
};

const create = async (
  dados: Omit<IDetalheCidade, 'id'>
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCidade>('/cidades', dados);

    if (data) {
      return data.id;
    }
    return new Error('Erro ao cadastrar o registro.');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao cadastrar o registro.'
    );
  }
};

const updateById = async (id: number, dados: IDetalheCidade): Promise<any> => {
  try {
    await Api.put<IDetalheCidade>(`/cidades/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao atualizar o registro.'
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete<IDetalheCidade>(`/cidades/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao deletar o registro.'
    );
  }
};

export const cidadesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

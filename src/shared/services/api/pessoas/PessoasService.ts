import { Environment } from '../../../environment';
import { Api } from '../axios.config';

export interface IListagemPessoa {
  _id: string;
  nomeCompleto: string;
  telefone: string;
  cidadeInteresse: string;
  dataCriacao?: Date;
  contatoRealizado?: boolean;
}

export interface IDetalhePessoa {
  _id: string;
  nomeCompleto: string;
  telefone: string;
  cidadeInteresse: string;
  dataCriacao?: Date;
  contatoRealizado?: boolean;
  aceiteDosTermos?: boolean;
}

type TPessoasComTotalCount = {
  data: IListagemPessoa[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ''
): Promise<TPessoasComTotalCount | Error> => {
  try {
    const urlRelativa = `/clientes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;
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
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const getById = async (id: string): Promise<IDetalhePessoa | Error> => {
  try {
    const { data } = await Api.get(`/clientes/${id}`);

    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const create = async (
  dados: Omit<IDetalhePessoa, '_id'>
): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IDetalhePessoa>('/clientes', dados);

    if (data) {
      return data._id;
    }
    return new Error('Erro ao cadastrar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const updateById = async (
  id: string,
  dados: IDetalhePessoa
): Promise<unknown> => {
  try {
    await Api.put<IDetalhePessoa>(`/clientes/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete<IDetalhePessoa>(`/clientes/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

export const PessoasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

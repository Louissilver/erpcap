import { Environment } from '../../../environment';
import { Api } from '../axios.config';

export interface IImagemProps {
  imagem: string;
  alt: string;
}

export interface IListagemEmpreendimento {
  _id: string;
  ativo: boolean;
  titulo: string;
  to: string;
  descricao: string;
  cidade: string;
  thumb: string;
  alt: string;
  texto: string;
  imagens: IImagemProps[];
}

export interface IDetalheEmpreendimento {
  _id: string;
  ativo?: boolean;
  titulo: string;
  to: string;
  descricao: string;
  cidade: string;
  thumb: string;
  alt: string;
  texto: string;
  imagens?: IImagemProps[] | undefined;
}

type TEmpreendimentosComTotalCount = {
  data: IListagemEmpreendimento[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ''
): Promise<TEmpreendimentosComTotalCount | Error> => {
  try {
    const urlRelativa = `/empreendimentos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&titulo_like=${filter}`;
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

const getById = async (id: string): Promise<IDetalheEmpreendimento | Error> => {
  try {
    const { data } = await Api.get(`/empreendimentos/${id}`);

    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.log(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const create = async (
  dados: Omit<IDetalheEmpreendimento, '_id'>
): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IDetalheEmpreendimento>(
      '/empreendimentos',
      dados
    );

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
  dados: IDetalheEmpreendimento
): Promise<unknown> => {
  try {
    await Api.put<IDetalheEmpreendimento>(`/empreendimentos/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete<IDetalheEmpreendimento>(`/empreendimentos/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as string) || 'Erro ao consultar o registro.');
  }
};

export const EmpreendimentosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

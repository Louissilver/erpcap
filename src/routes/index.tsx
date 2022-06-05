import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  ListagemDePessoa,
  DetalheDePessoas,
  ListagemDeCidade,
  DetalheDeCidades,
  DetalheDeEmpreendimentos,
  ListagemDeEmpreendimento,
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: 'Página inicial',
        path: 'pagina-inicial',
        icon: 'home',
      },
      {
        label: 'Clientes',
        path: 'pessoas',
        icon: 'person',
      },
      {
        label: 'Empreendimentos',
        path: 'empreendimentos',
        icon: 'real_estate_agent',
      },
      {
        label: 'Cidades',
        path: 'cidades',
        icon: 'location_city',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      <Route path="/cidades" element={<ListagemDeCidade />} />
      <Route path="/cidades/detalhe/:id" element={<DetalheDeCidades />} />

      <Route path="/empreendimentos" element={<ListagemDeEmpreendimento />} />
      <Route
        path="/Empreendimentos/detalhe/:id"
        element={<DetalheDeEmpreendimentos />}
      />

      <Route path="/pessoas" element={<ListagemDePessoa />} />
      <Route path="/pessoas/detalhe/:id" element={<DetalheDePessoas />} />

      <Route path="*" element={<Navigate to="/pagina-inicial"></Navigate>} />
    </Routes>
  );
};

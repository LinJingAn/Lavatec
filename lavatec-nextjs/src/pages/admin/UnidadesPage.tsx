import React from 'react';
import { useNavigate } from 'react-router-dom';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const UnidadesPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unidades</h1>
      <p className="text-gray-600 mb-6">Gerencie as unidades e filiais da sua empresa. Aqui você pode ver o resumo de todas as localizações.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-lg mb-2">Unidades Ativas</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Operando normalmente</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-lg mb-2">Em Manutenção</h3>
          <p className="text-3xl font-bold text-yellow-500">2</p>
          <p className="text-sm text-gray-500 mt-1">Serviço temporariamente suspenso</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="font-semibold text-lg mb-2">Inativas</h3>
          <p className="text-3xl font-bold text-red-500">1</p>
          <p className="text-sm text-gray-500 mt-1">Fora de serviço</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/unidades/list')}
        >
          Ver todas as unidades
        </button>
        
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => navigate('/unidades/add')}
        >
          Adicionar nova unidade
        </button>
        
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={() => navigate('/unidades/map')}
        >
          Ver mapa de localizações
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="border-b pb-3">
            <p className="font-medium">Unidade São José atualizada</p>
            <p className="text-sm text-gray-500">Atualização de horário • Há 2 horas</p>
          </div>
          <div className="border-b pb-3">
            <p className="font-medium">Unidade Escazú em manutenção</p>
            <p className="text-sm text-gray-500">Mudança de estado • Há 1 dia</p>
          </div>
          <div className="border-b pb-3">
            <p className="font-medium">Nova unidade adicionada: Heredia</p>
            <p className="text-sm text-gray-500">Criação • Há 5 dias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnidadesPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
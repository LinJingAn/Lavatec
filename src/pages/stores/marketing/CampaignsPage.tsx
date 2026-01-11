import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdCampaign,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdPause,
  MdPlayArrow,
  MdEdit,
  MdDelete,
  MdBarChart
} from 'react-icons/md';

// Mock data to match the screenshot
const mockCampaigns = [
  {
    id: 1,
    name: 'Desconto para Primeiros Clientes',
    description: 'Oferecer 20% de desconto para novos clientes',
    status: 'active',
    audience: 'Novos Clientes',
    startDate: '2023-09-29',
    endDate: '2023-12-29',
    budget: 1500,
    performance: {
      impressions: 12400,
      clicks: 980,
      conversions: 145
    }
  },
  {
    id: 2,
    name: 'Promoção de Volta às Aulas',
    description: 'Descontos em uniformes e itens escolares',
    status: 'scheduled',
    audience: 'Famílias com Crianças',
    startDate: '2024-01-13',
    endDate: '2024-02-13',
    budget: 2000,
    performance: null
  },
  {
    id: 3,
    name: 'Limpeza de Primavera',
    description: 'Promoção para limpeza de edredons e cobertores',
    status: 'paused',
    audience: 'Todos os Clientes',
    startDate: '2023-08-30',
    endDate: '2023-10-29',
    budget: 1200,
    performance: {
      impressions: 8500,
      clicks: 720,
      conversions: 65
    }
  },
  {
    id: 4,
    name: 'Mensalidade Premium',
    description: 'Assinatura mensal com descontos e benefícios',
    status: 'active',
    audience: 'Clientes Recorrentes',
    startDate: '2023-05-30',
    endDate: '2024-05-29',
    budget: 3500,
    performance: {
      impressions: 15800,
      clicks: 2100,
      conversions: 310
    }
  },
  {
    id: 5,
    name: 'Campanha de Reativação',
    description: 'Recuperação de clientes inativos há mais de 3 meses',
    status: 'draft',
    audience: 'Clientes Inativos',
    startDate: null,
    endDate: null,
    budget: 800,
    performance: null
  }
];

const CampaignsPage = () => {
  const [campaigns] = useState(mockCampaigns);

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 flex items-center">
            <MdCampaign className="mr-2 text-blue-600" size={20} />
            Campanhas Promocionais
          </h1>
          <p className="text-sm text-gray-600">Gerencie suas campanhas de marketing e promoções para seus clientes</p>
        </div>
        
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <MdAdd className="mr-1" /> Nova Campanha
        </button>
      </div>

      <div className="flex mb-4">
        <div className="relative flex-1 mr-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar campanhas..."
            className="pl-10 w-full border border-gray-300 rounded py-2 px-4"
          />
        </div>
        
        <button
          className="px-4 py-2 rounded bg-white text-gray-700 border border-gray-300 flex items-center"
        >
          <MdFilterList className="mr-1" size={18} />
          <span>Filtros</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-medium">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Campanha</th>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Público-Alvo</th>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Status</th>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Período</th>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Orçamento</th>
              <th className="px-6 py-3 text-left tracking-wider font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-sm text-gray-500">{campaign.description}</div>
                  {campaign.performance && (
                    <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                      <span>{campaign.performance.impressions.toLocaleString()} impressões</span>
                      <span>{campaign.performance.clicks.toLocaleString()} cliques</span>
                      <span>{campaign.performance.conversions.toLocaleString()} conversões</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.audience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {campaign.status === 'active' && (
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativa
                    </span>
                  )}
                  {campaign.status === 'scheduled' && (
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Agendada
                    </span>
                  )}
                  {campaign.status === 'paused' && (
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pausada
                    </span>
                  )}
                  {campaign.status === 'draft' && (
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Rascunho
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.startDate ? (
                    <>
                      {new Date(campaign.startDate).toLocaleDateString()} até {campaign.endDate && new Date(campaign.endDate).toLocaleDateString()}
                    </>
                  ) : (
                    'Não agendada'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {campaign.budget ? `R$ ${campaign.budget.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-6 items-center">
                    {campaign.status === 'active' && (
                      <button title="Pausar">
                        <MdPause className="text-yellow-500" size={18} />
                      </button>
                    )}
                    
                    {campaign.status === 'paused' && (
                      <button title="Iniciar">
                        <MdPlayArrow className="text-green-500" size={18} />
                      </button>
                    )}
                    
                    <button title="Editar">
                      <MdEdit className="text-blue-500" size={18} />
                    </button>
                    
                    <button title="Excluir">
                      <MdDelete className="text-red-500" size={18} />
                    </button>
                    
                    {campaign.performance && (
                      <button title="Estatísticas">
                        <MdBarChart className="text-blue-500" size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsPage; 
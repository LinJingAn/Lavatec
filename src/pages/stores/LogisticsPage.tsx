import React, { useState } from 'react';
import { MdLocalShipping, MdLocationOn, MdOutlineSettings } from 'react-icons/md';

interface OrderStaging {
  name: string;
  count: string;
  zone: string;
}

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'route' | 'pickup'>('route');
  const [isLoading, setIsLoading] = useState(false);

  const stagingAreas: OrderStaging[] = [
    { name: 'Balcão Frontal', count: '12/20', zone: 'Zona A1' },
    { name: 'Sala dos Fundos', count: '28/50', zone: 'Zona B1' },
    { name: 'Retirada Expressa', count: '4/10', zone: 'Zona C1' },
  ];

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          <button
            className={`pb-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'route'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('route')}
          >
            PLANEJAMENTO DE ROTAS
          </button>
          <button
            className={`pb-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'pickup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pickup')}
          >
            GESTÃO DE RETIRADAS
          </button>
        </div>
      </div>

      {/* Route Planning Content */}
      {activeTab === 'route' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Planejamento e Otimização de Rotas</h1>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MdLocalShipping className="mr-2" />
              OTIMIZAR ROTAS
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              {/* Add your route planning content here */}
              <div className="text-gray-500">O conteúdo do planejamento de rotas será exibido aqui</div>
            </div>
          )}
        </div>
      )}

      {/* Pickup Management Content */}
      {activeTab === 'pickup' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Gestão de Retiradas</h1>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <MdOutlineSettings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <MdLocalShipping className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Staging Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Áreas de Preparação</h2>
            <div className="grid grid-cols-3 gap-4">
              {stagingAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">{area.name}</h3>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                      {area.count}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MdLocationOn className="mr-1" />
                    {area.zone}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staged Orders Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Pedidos em Preparação</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-800 font-medium mb-4">Pedidos para Retirada</h3>
              {/* Add your pickup orders list here */}
              <div className="text-gray-500">Nenhum pedido para retirada disponível</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsPage; 
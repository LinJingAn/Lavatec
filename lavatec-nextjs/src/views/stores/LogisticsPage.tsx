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
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex space-x-6">
          <button
            className={`pb-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'route'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('route')}
          >
            PLANEJAMENTO DE ROTAS
          </button>
          <button
            className={`pb-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'pickup'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-xl font-medium text-slate-900 dark:text-white">Planejamento e Otimização de Rotas</h1>
            <button className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 whitespace-nowrap">
              <MdLocalShipping className="mr-2" />
              OTIMIZAR ROTAS
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500 dark:text-slate-400">Carregando...</div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
              {/* Add your route planning content here */}
              <div className="text-slate-500 dark:text-slate-400">O conteúdo do planejamento de rotas será exibido aqui</div>
            </div>
          )}
        </div>
      )}

      {/* Pickup Management Content */}
      {activeTab === 'pickup' && (
        <div>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-xl font-medium text-slate-900 dark:text-white">Gestão de Retiradas</h1>
            <div className="flex space-x-2">
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
                <MdOutlineSettings className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
                <MdLocalShipping className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Staging Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Áreas de Preparação</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stagingAreas.map((area, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-900 dark:text-white">{area.name}</h3>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-sm">
                      {area.count}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                    <MdLocationOn className="mr-1" />
                    {area.zone}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staged Orders Section */}
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Pedidos em Preparação</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white font-medium mb-4">Pedidos para Retirada</h3>
              {/* Add your pickup orders list here */}
              <div className="text-slate-500 dark:text-slate-400">Nenhum pedido para retirada disponível</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsPage; 
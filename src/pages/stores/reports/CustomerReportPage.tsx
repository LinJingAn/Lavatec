import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaChartBar, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const CustomerReportPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('daily');

  // Dados simulados para métricas de clientes
  const customerMetrics = {
    totalCustomers: 1250,
    newCustomers: 85,
    activeCustomers: 750,
    churnRate: 2.5,
    avgOrdersPerCustomer: 3.2,
    customerLifetimeValue: 850.00
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Relatório de Clientes</h1>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-gray-600" />
            <span>Filtros</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
            <FaFileDownload className="text-gray-600" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total de Clientes</h3>
          <p className="text-3xl font-bold text-blue-600">{customerMetrics.totalCustomers}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 7,3%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Novos Clientes</h3>
          <p className="text-3xl font-bold text-blue-600">{customerMetrics.newCustomers}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 12,5%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Clientes Ativos</h3>
          <p className="text-3xl font-bold text-blue-600">{customerMetrics.activeCustomers}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 5,8%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
      </div>

      {/* Métricas de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Crescimento de Clientes</h2>
          <div className="flex items-center justify-center h-60">
            <div className="text-center text-gray-500">
              <FaChartLine className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Tendência de crescimento de clientes será exibida aqui</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Segmentos de Clientes</h2>
          <div className="flex items-center justify-center h-60">
            <div className="text-center text-gray-500">
              <FaChartBar className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Distribuição dos segmentos de clientes será exibida aqui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Taxa de Cancelamento</h3>
          <p className="text-3xl font-bold text-blue-600">{customerMetrics.churnRate}%</p>
          <div className="flex items-center mt-2 text-sm text-red-600">
            <span className="mr-1">↓ 0,5%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Média de Pedidos/Cliente</h3>
          <p className="text-3xl font-bold text-blue-600">{customerMetrics.avgOrdersPerCustomer}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 8,2%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Valor Vitalício do Cliente</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {customerMetrics.customerLifetimeValue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 15,3%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReportPage; 
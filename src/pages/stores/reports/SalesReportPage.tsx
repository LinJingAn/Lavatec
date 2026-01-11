import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaChartBar, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const SalesReportPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('daily');

  // Dados simulados para vendas
  const salesData = [
    { date: '2023-06-01', services: 28, revenue: 1680.00, avgTicket: 60.00, topService: 'Lavagem completa' },
    { date: '2023-06-02', services: 32, revenue: 1920.00, avgTicket: 60.00, topService: 'Lavagem a seco' },
    { date: '2023-06-03', services: 35, revenue: 2100.00, avgTicket: 60.00, topService: 'Lavagem completa' },
    { date: '2023-06-04', services: 25, revenue: 1500.00, avgTicket: 60.00, topService: 'Lavagem simples' },
    { date: '2023-06-05', services: 30, revenue: 1800.00, avgTicket: 60.00, topService: 'Lavagem a seco' },
    { date: '2023-06-06', services: 29, revenue: 1740.00, avgTicket: 60.00, topService: 'Passadoria' },
    { date: '2023-06-07', services: 31, revenue: 1860.00, avgTicket: 60.00, topService: 'Lavagem completa' },
    { date: '2023-06-08', services: 33, revenue: 1980.00, avgTicket: 60.00, topService: 'Lavagem simples' },
    { date: '2023-06-09', services: 36, revenue: 2160.00, avgTicket: 60.00, topService: 'Lavagem a seco' },
    { date: '2023-06-10', services: 34, revenue: 2040.00, avgTicket: 60.00, topService: 'Lavagem completa' },
    { date: '2023-06-11', services: 27, revenue: 1620.00, avgTicket: 60.00, topService: 'Passadoria' },
    { date: '2023-06-12', services: 29, revenue: 1740.00, avgTicket: 60.00, topService: 'Lavagem simples' },
    { date: '2023-06-13', services: 32, revenue: 1920.00, avgTicket: 60.00, topService: 'Lavagem a seco' },
    { date: '2023-06-14', services: 35, revenue: 2100.00, avgTicket: 60.00, topService: 'Lavagem completa' },
  ];

  // Dados de desempenho dos serviços
  const servicePerformance = [
    { service: 'Lavagem simples', count: 120, revenue: 6000.00, avgPrice: 50.00, growth: 5 },
    { service: 'Lavagem completa', count: 150, revenue: 12000.00, avgPrice: 80.00, growth: 8 },
    { service: 'Lavagem a seco', count: 85, revenue: 7650.00, avgPrice: 90.00, growth: 12 },
    { service: 'Passadoria', count: 70, revenue: 3500.00, avgPrice: 50.00, growth: -2 },
    { service: 'Tingimento', count: 30, revenue: 3000.00, avgPrice: 100.00, growth: 15 },
  ];

  // Calcular totais
  const totalServices = salesData.reduce((total, day) => total + day.services, 0);
  const totalRevenue = salesData.reduce((total, day) => total + day.revenue, 0);
  const avgDailyRevenue = totalRevenue / salesData.length;
  const avgTicketSize = totalRevenue / totalServices;

  // Calcular distribuição de serviços
  const totalServicesByType = servicePerformance.reduce((total, service) => total + service.count, 0);
  const bestPerformingService = [...servicePerformance].sort((a, b) => b.revenue - a.revenue)[0];
  const fastestGrowingService = [...servicePerformance].sort((a, b) => b.growth - a.growth)[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Relatório de Vendas</h1>
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

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Últimos 7 dias</option>
              <option value="month">Últimos 30 dias</option>
              <option value="quarter">Últimos 90 dias</option>
              <option value="year">Últimos 12 meses</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todos os Serviços</option>
              <option value="lavagem-simples">Lavagem Simples</option>
              <option value="lavagem-completa">Lavagem Completa</option>
              <option value="lavagem-seco">Lavagem a Seco</option>
              <option value="passadoria">Passadoria</option>
              <option value="tingimento">Tingimento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loja</label>
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Todas as Lojas</option>
              <option value="store-1">Loja Centro</option>
              <option value="store-2">Loja Norte</option>
              <option value="store-3">Loja Sul</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visualização</label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                className={`px-4 py-2 ${view === 'daily' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                onClick={() => setView('daily')}
              >
                Diária
              </button>
              <button
                className={`px-4 py-2 ${view === 'weekly' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                onClick={() => setView('weekly')}
              >
                Semanal
              </button>
              <button
                className={`px-4 py-2 ${view === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-white'}`}
                onClick={() => setView('monthly')}
              >
                Mensal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Receita Total</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 8,5%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Serviços Realizados</h3>
          <p className="text-3xl font-bold text-blue-600">{totalServices}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 5,2%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Ticket Médio</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {avgTicketSize.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 3,1%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Receita Média Diária</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {avgDailyRevenue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 7,8%</span>
            <span className="text-gray-500">vs. período anterior</span>
          </div>
        </div>
      </div>

      {/* Tendência de Receita e Melhores Desempenhos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tendência de Receita</h2>
          <div className="flex items-center justify-center h-60">
            {/* Espaço reservado para o gráfico de receita */}
            <div className="text-center text-gray-500">
              <FaChartLine className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>O gráfico de tendência de receita será exibido aqui</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Serviços</h2>
          <div className="flex items-center justify-center h-60">
            {/* Espaço reservado para o gráfico de distribuição de serviços */}
            <div className="text-center text-gray-500">
              <FaChartBar className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>O gráfico de distribuição de serviços será exibido aqui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Desempenho dos Serviços */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Desempenho dos Serviços</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % do Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crescimento
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicePerformance.map((service, index) => {
                const percentage = ((service.count / totalServicesByType) * 100).toFixed(1);
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {service.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {service.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`flex items-center ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {service.growth >= 0 ? '↑' : '↓'} 
                        <span className="ml-1">{Math.abs(service.growth)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Principais Insights */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Principais Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium text-lg mb-2 text-blue-800">Serviço com Melhor Desempenho</h3>
            <p className="text-xl font-bold text-blue-700 mb-1">{bestPerformingService.service}</p>
            <p className="text-gray-700">
              Gerou R$ {bestPerformingService.revenue.toFixed(2)} em receita 
              com {bestPerformingService.count} pedidos.
            </p>
          </div>
          <div className="border border-gray-100 rounded-lg p-4 bg-green-50">
            <h3 className="font-medium text-lg mb-2 text-green-800">Serviço com Maior Crescimento</h3>
            <p className="text-xl font-bold text-green-700 mb-1">{fastestGrowingService.service}</p>
            <p className="text-gray-700">
              Cresceu {fastestGrowingService.growth}% em comparação ao período anterior.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Vendas Diárias */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Vendas Diárias</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviços
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço Principal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.services}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {day.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {day.avgTicket.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.topService}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage; 
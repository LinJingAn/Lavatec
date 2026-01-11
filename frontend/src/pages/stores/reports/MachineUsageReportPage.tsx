import React, { useState } from 'react';
import { FaFileDownload, FaFilter, FaChartBar, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const MachineUsageReportPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('daily');

  // Dados simulados para métricas de máquinas
  const machineMetrics = {
    totalMachines: 24,
    activeMachines: 20,
    totalHoursUsed: 1850,
    averageUtilization: 78.5,
    maintenanceHours: 120,
    revenue: 45800.00
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Relatório de Uso de Máquinas</h1>
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
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total de Máquinas</h3>
          <p className="text-3xl font-bold text-blue-600">{machineMetrics.totalMachines}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 4 novas</span>
            <span className="text-gray-500">este mês</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Máquinas Ativas</h3>
          <p className="text-3xl font-bold text-blue-600">{machineMetrics.activeMachines}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">{((machineMetrics.activeMachines / machineMetrics.totalMachines) * 100).toFixed(1)}%</span>
            <span className="text-gray-500">disponibilidade</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Total de Horas Utilizadas</h3>
          <p className="text-3xl font-bold text-blue-600">{machineMetrics.totalHoursUsed}h</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 12,5%</span>
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Gráficos de Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tendência de Uso</h2>
          <div className="flex items-center justify-center h-60">
            <div className="text-center text-gray-500">
              <FaChartLine className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Tendência de uso das máquinas será exibida aqui</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Máquinas</h2>
          <div className="flex items-center justify-center h-60">
            <div className="text-center text-gray-500">
              <FaChartBar className="mx-auto text-5xl mb-3 text-blue-200" />
              <p>Distribuição por tipo de máquina será exibida aqui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Utilização Média</h3>
          <p className="text-3xl font-bold text-blue-600">{machineMetrics.averageUtilization}%</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 5,2%</span>
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Horas em Manutenção</h3>
          <p className="text-3xl font-bold text-blue-600">{machineMetrics.maintenanceHours}h</p>
          <div className="flex items-center mt-2 text-sm text-red-600">
            <span className="mr-1">↑ 8,3%</span>
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-1 text-gray-600">Receita Gerada</h3>
          <p className="text-3xl font-bold text-blue-600">R$ {machineMetrics.revenue.toFixed(2)}</p>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <span className="mr-1">↑ 15,8%</span>
            <span className="text-gray-500">vs. mês anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineUsageReportPage; 
import React, { useState } from 'react';
import { 
  MdCalendarToday, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdAttachMoney,
  MdPieChart,
  MdShowChart
} from 'react-icons/md';

// Mock data for revenue
const revenueData = {
  summary: {
    currentMonth: 54850.75,
    previousMonth: 48350.25,
    yearToDate: 367890.50,
    change: 13.44
  },
  revenueByService: [
    { name: 'Lavagem Completa', value: 25600.50, percentage: 46.7 },
    { name: 'Lavagem Express', value: 12350.25, percentage: 22.5 },
    { name: 'Passadoria', value: 8900.00, percentage: 16.2 },
    { name: 'Lavagem a Seco', value: 5800.00, percentage: 10.6 },
    { name: 'Outros', value: 2200.00, percentage: 4.0 }
  ],
  monthlySummary: [
    { month: 'Jan', value: 42500.50 },
    { month: 'Fev', value: 45700.25 },
    { month: 'Mar', value: 48200.75 },
    { month: 'Abr', value: 47500.50 },
    { month: 'Mai', value: 49800.75 },
    { month: 'Jun', value: 51200.25 },
    { month: 'Jul', value: 49850.50 },
    { month: 'Ago', value: 48350.25 },
    { month: 'Set', value: 54850.75 }
  ]
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const RevenuePage: React.FC = () => {
  const [period, setPeriod] = useState('month');
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Receita</h1>
        
        <div className="flex space-x-2 bg-white rounded-lg shadow-sm">
          <button 
            className={`px-4 py-2 text-sm ${period === 'week' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setPeriod('week')}
          >
            Semana
          </button>
          <button 
            className={`px-4 py-2 text-sm ${period === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setPeriod('month')}
          >
            Mês
          </button>
          <button 
            className={`px-4 py-2 text-sm ${period === 'quarter' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setPeriod('quarter')}
          >
            Trimestre
          </button>
          <button 
            className={`px-4 py-2 text-sm ${period === 'year' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setPeriod('year')}
          >
            Ano
          </button>
        </div>
      </div>
      
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <MdCalendarToday className="mr-1" /> Mês Atual
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(revenueData.summary.currentMonth)}
              </h3>
            </div>
            <div className={`flex items-center ${revenueData.summary.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueData.summary.change >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
              <span className="ml-1 text-sm">{revenueData.summary.change}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <MdCalendarToday className="mr-1" /> Mês Anterior
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(revenueData.summary.previousMonth)}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <MdAttachMoney className="mr-1" /> Receita Anual (YTD)
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(revenueData.summary.yearToDate)}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <MdShowChart className="mr-1" /> Projeção Anual
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(revenueData.summary.yearToDate * 1.5)}
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MdShowChart className="mr-2 text-blue-600" /> Receita Mensal
        </h2>
        
        <div className="h-64 w-full flex items-end justify-between space-x-2">
          {revenueData.monthlySummary.map((item, index) => {
            // Calculate height percentage based on the max value
            const maxValue = Math.max(...revenueData.monthlySummary.map(d => d.value));
            const heightPercentage = (item.value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-14 bg-blue-500 rounded-t-sm ${
                    index === revenueData.monthlySummary.length - 1 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                >
                  <div className="h-full w-full relative">
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                      {formatCurrency(item.value).replace('R$', '')}
                    </span>
                  </div>
                </div>
                <span className="mt-2 text-xs font-medium text-gray-600">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MdPieChart className="mr-2 text-blue-600" /> Receita por Serviço
          </h2>
          
          <div className="space-y-4">
            {revenueData.revenueByService.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(service.value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {service.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Insights de Receita</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="font-medium text-blue-700">Aumento de Receita</h3>
              <p className="text-sm text-blue-600 mt-1">
                A receita de Setembro aumentou 13.44% em comparação com Agosto, principalmente devido ao aumento nas lavagens completas.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <h3 className="font-medium text-green-700">Serviço Mais Lucrativo</h3>
              <p className="text-sm text-green-600 mt-1">
                A Lavagem Completa continua sendo o serviço mais lucrativo, representando 46.7% da receita total.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <h3 className="font-medium text-yellow-700">Sugestão</h3>
              <p className="text-sm text-yellow-600 mt-1">
                Considere promover mais os serviços de passadoria para aumentar sua participação na receita total.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage; 
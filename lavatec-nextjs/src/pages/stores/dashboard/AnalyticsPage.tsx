import React from 'react';
import { Link } from 'react-router-dom';
import { MdChevronLeft } from 'react-icons/md';
import { PerformanceTrends } from '@/components/dashboard/PerformanceTrends';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { Widget } from '@/components/dashboard/DashboardWidgets';

const AnalyticsPage: React.FC = () => {
  // Example data - in a real app, this would come from an API
  const performanceData = {
    monthlyData: [
      { month: 'Jan', actual: 25000, target: 30000, growth: 5 },
      { month: 'Fev', actual: 28000, target: 30000, growth: 8 },
      { month: 'Mar', actual: 32000, target: 30000, growth: 12 },
      { month: 'Abr', actual: 29000, target: 30000, growth: 6 },
      { month: 'Mai', actual: 31000, target: 30000, growth: 10 },
    ],
    goals: {
      revenue: 350000,
      orders: 2000,
      customers: 500
    }
  };

  const widgets = [
    {
      id: '1',
      type: 'chart',
      title: 'Segmentos de Clientes',
      data: [
        { name: 'Regular', value: 45 },
        { name: 'Premium', value: 30 },
        { name: 'Novo', value: 25 }
      ]
    },
    {
      id: '2',
      type: 'metric',
      title: 'Análise de Clientes',
      data: {
        'Valor Médio do Pedido': 85.50,
        'Taxa de Retenção': '78%',
        'Novos Clientes': 25
      }
    },
    {
      id: '3',
      type: 'table',
      title: 'Serviços com Melhor Desempenho',
      data: [
        { service: 'Lavar e Dobrar', revenue: 15000, orders: 200, avgRating: 4.8 },
        { service: 'Lavagem a Seco', revenue: 12000, orders: 150, avgRating: 4.7 },
        { service: 'Passar', revenue: 8000, orders: 100, avgRating: 4.6 }
      ]
    }
  ];

  const handleWidgetsChange = (newWidgets: any[]) => {
    // In a real app, this would save the widget layout to the backend
    console.log('Widgets alterados:', newWidgets);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <Link to="/stores/dashboard/overview" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <MdChevronLeft />
          <span>Voltar ao Painel</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Análises</h1>
      </div>
      
      {/* Analytics Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Visão Geral de Análises</h2>
        <p className="text-gray-600 mb-4">Esta página mostrará análises detalhadas de desempenho, incluindo gráficos e dados para ajudar na tomada de decisões.</p>
        
        {/* Placeholder for Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Receita por Filial</h3>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Gráfico de Barras - Receita por Filial</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Tendência de Vendas (Últimos 12 meses)</h3>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Gráfico de Linha - Tendência de Vendas</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Distribuição de Serviços</h3>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Gráfico de Pizza - Distribuição de Serviços</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Clientes por Segmento</h3>
            <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Gráfico de Donut - Segmentação de Clientes</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Métricas-Chave</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Taxa de Conversão</h3>
            <p className="text-3xl font-bold text-blue-600">8.7%</p>
            <p className="text-sm text-gray-500">+1.2% vs. mês anterior</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Valor Médio do Pedido</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 125</p>
            <p className="text-sm text-gray-500">+5.3% vs. mês anterior</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Taxa de Retenção</h3>
            <p className="text-3xl font-bold text-blue-600">72%</p>
            <p className="text-sm text-gray-500">+3.1% vs. mês anterior</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Custo de Aquisição</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 48</p>
            <p className="text-sm text-gray-500">-2.8% vs. mês anterior</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Pontuação NPS</h3>
            <p className="text-3xl font-bold text-blue-600">68</p>
            <p className="text-sm text-gray-500">+5 vs. mês anterior</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-1">Tempo de Resposta</h3>
            <p className="text-3xl font-bold text-blue-600">1.8h</p>
            <p className="text-sm text-gray-500">-0.3h vs. mês anterior</p>
          </div>
        </div>
      </div>
      
      <PerformanceTrends data={performanceData} />
      
      <DashboardWidgets 
        widgets={widgets as Widget[]} 
        onWidgetsChange={handleWidgetsChange} 
      />
    </div>
  );
};

export default AnalyticsPage; 
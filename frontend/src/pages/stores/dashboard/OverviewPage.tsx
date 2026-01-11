import React from 'react';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';

const OverviewPage: React.FC = () => {
  // Example data - in a real app, this would come from an API
  const metricsData = {
    orders: 150,
    revenue: 25000,
    customers: 45,
    dailyData: [
      { date: '2024-01-01', orders: 10, revenue: 2000, customers: 5 },
      { date: '2024-01-02', orders: 15, revenue: 3000, customers: 8 },
      { date: '2024-01-03', orders: 12, revenue: 2400, customers: 6 },
      { date: '2024-01-04', orders: 18, revenue: 3600, customers: 9 },
      { date: '2024-01-05', orders: 20, revenue: 4000, customers: 10 },
    ]
  };

  const widgets = [
    {
      id: '1',
      type: 'chart',
      title: 'Principais Serviços',
      data: [
        { name: 'Lavar e Dobrar', value: 45 },
        { name: 'Lavagem a Seco', value: 30 },
        { name: 'Passar', value: 25 }
      ]
    },
    {
      id: '2',
      type: 'metric',
      title: 'Resumo de Hoje',
      data: {
        'Pedidos': 15,
        'Receita': 3000,
        'Clientes': 8
      }
    },
    {
      id: '3',
      type: 'table',
      title: 'Pedidos Recentes',
      data: [
        { id: 'PED001', customer: 'João Silva', service: 'Lavar e Dobrar', amount: 45.00, status: 'Concluído' },
        { id: 'PED002', customer: 'Maria Santos', service: 'Lavagem a Seco', amount: 30.00, status: 'Em Andamento' },
        { id: 'PED003', customer: 'Roberto Pereira', service: 'Passar', amount: 25.00, status: 'Pendente' }
      ]
    }
  ];

  const handleWidgetsChange = (newWidgets: any[]) => {
    // In a real app, this would save the widget layout to the backend
    console.log('Widgets alterados:', newWidgets);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Visão Geral do Painel</h1>
      
      <DashboardMetrics data={metricsData} />
      
      <DashboardWidgets 
        widgets={widgets} 
        onWidgetsChange={handleWidgetsChange} 
      />
    </div>
  );
};

export default OverviewPage; 
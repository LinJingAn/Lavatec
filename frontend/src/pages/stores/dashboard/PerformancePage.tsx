import React from 'react';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdWarning, MdCheckCircle } from 'react-icons/md';
import { PerformanceTrends } from '@/components/dashboard/PerformanceTrends';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';

const performanceData = [
  { 
    id: 1, 
    branch: 'Lavatec - Centro', 
    efficiency: 92, 
    utilization: 78, 
    customer_satisfaction: 4.7, 
    response_time: 22,
    completion_rate: 97,
    issues: 3
  },
  { 
    id: 2, 
    branch: 'Lavatec - Moema', 
    efficiency: 88, 
    utilization: 82, 
    customer_satisfaction: 4.5, 
    response_time: 25,
    completion_rate: 94,
    issues: 5
  },
  { 
    id: 3, 
    branch: 'Lavatec - Campinas', 
    efficiency: 95, 
    utilization: 85, 
    customer_satisfaction: 4.8, 
    response_time: 18,
    completion_rate: 99,
    issues: 1
  },
  { 
    id: 4, 
    branch: 'Lavatec - Rio de Janeiro', 
    efficiency: 87, 
    utilization: 76, 
    customer_satisfaction: 4.4, 
    response_time: 29,
    completion_rate: 92,
    issues: 8
  },
];

const PerformancePage: React.FC = () => {
  // Example data - in a real app, this would come from an API
  const performanceDataExample = {
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
      title: 'Utilização de Máquinas',
      data: [
        { name: 'Máquinas de Lavar', value: 85 },
        { name: 'Secadoras', value: 75 },
        { name: 'Estações de Passar', value: 65 }
      ]
    },
    {
      id: '2',
      type: 'metric',
      title: 'KPIs Operacionais',
      data: {
        'Tempo Médio de Processamento': '45 min',
        'Tempo de Inatividade': '2%',
        'Nota de Qualidade': '4.8/5'
      }
    },
    {
      id: '3',
      type: 'table',
      title: 'Desempenho da Equipe',
      data: [
        { name: 'João Silva', tasks: 120, efficiency: '95%', rating: 4.9 },
        { name: 'Maria Santos', tasks: 110, efficiency: '92%', rating: 4.8 },
        { name: 'Roberto Pereira', tasks: 100, efficiency: '90%', rating: 4.7 }
      ]
    }
  ];

  const handleWidgetsChange = (newWidgets: any[]) => {
    // In a real app, this would save the widget layout to the backend
    console.log('Widgets alterados:', newWidgets);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Painel de Desempenho</h1>
      
      <PerformanceTrends data={performanceDataExample} />
      
      <DashboardWidgets 
        widgets={widgets} 
        onWidgetsChange={handleWidgetsChange} 
      />
    </div>
  );
};

export default PerformancePage; 
import React, { useState, useEffect, useCallback } from 'react';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardWidgets, Widget } from '@/components/dashboard/DashboardWidgets';
import { DashboardService, OrderService } from '@/services';
import { MdError } from 'react-icons/md';

const OverviewPage: React.FC = () => {
  const [metricsData, setMetricsData] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    dailyData: [] as { date: string; orders: number; revenue: number; customers: number }[]
  });
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard overview data
      const [overviewResult, ordersResult] = await Promise.all([
        DashboardService.getOverviewDashboard().catch(() => null),
        OrderService.getOrders({ limit: 5 }).catch(() => ({ orders: [] }))
      ]);

      if (overviewResult) {
        setMetricsData({
          orders: overviewResult.todayOrders || 0,
          revenue: overviewResult.todayRevenue || 0,
          customers: overviewResult.newCustomers || 0,
          dailyData: overviewResult.dailyData || []
        });

        // Build widgets from API data
        const recentOrders = (ordersResult.orders || []).slice(0, 5).map((order: any) => ({
          id: order.id || 'N/A',
          customer: order.customer_name || 'N/A',
          service: order.items?.[0]?.service_name || 'N/A',
          amount: order.total || 0,
          status: order.status === 'completed' ? 'Concluído' : 
                  order.status === 'in_progress' ? 'Em Andamento' : 'Pendente'
        }));

        const newWidgets: Widget[] = [
          {
            id: '1',
            type: 'chart',
            title: 'Principais Serviços',
            data: Array.isArray(overviewResult.topServices) && overviewResult.topServices.length > 0
              ? overviewResult.topServices
              : [
                  { name: 'Lavar e Dobrar', value: 0 },
                  { name: 'Lavagem a Seco', value: 0 },
                  { name: 'Passar', value: 0 }
                ]
          },
          {
            id: '2',
            type: 'metric',
            title: 'Resumo de Hoje',
            data: {
              'Pedidos': overviewResult.todayOrders || 0,
              'Receita': overviewResult.todayRevenue || 0,
              'Clientes': overviewResult.newCustomers || 0
            }
          },
          {
            id: '3',
            type: 'table',
            title: 'Pedidos Recentes',
            data: recentOrders.length > 0 ? recentOrders : []
          }
        ];

        setWidgets(newWidgets);
      } else {
        // Fallback to sample data if API fails
        setMetricsData({
          orders: 0,
          revenue: 0,
          customers: 0,
          dailyData: []
        });
        setWidgets([
          {
            id: '1',
            type: 'chart',
            title: 'Principais Serviços',
            data: []
          },
          {
            id: '2',
            type: 'metric',
            title: 'Resumo de Hoje',
            data: { 'Pedidos': 0, 'Receita': 0, 'Clientes': 0 }
          },
          {
            id: '3',
            type: 'table',
            title: 'Pedidos Recentes',
            data: []
          }
        ]);
        setError('Não foi possível carregar os dados do dashboard. Verifique a conexão com o servidor.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleWidgetsChange = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    // In a real app, this would save the widget layout to the backend
    console.log('Widgets alterados:', newWidgets);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral do Painel</h1>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}
      
      <DashboardMetrics data={metricsData} />
      
      <DashboardWidgets 
        widgets={widgets} 
        onWidgetsChange={handleWidgetsChange} 
      />
    </div>
  );
};

export default OverviewPage;

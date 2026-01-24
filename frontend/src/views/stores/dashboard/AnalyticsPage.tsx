import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdError } from 'react-icons/md';
import { PerformanceTrends } from '@/components/dashboard/PerformanceTrends';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { Widget } from '@/components/dashboard/DashboardWidgets';
import { DashboardService, ReportsService } from '@/services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [performanceData, setPerformanceData] = useState({
    monthlyData: [] as any[],
    goals: { revenue: 0, orders: 0, customers: 0 }
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsResult, kpisResult] = await Promise.all([
        DashboardService.getCustomerAnalytics().catch(() => null),
        DashboardService.getKPIs().catch(() => null)
      ]);

      if (analyticsResult) {
        setAnalytics(analyticsResult);
        
        // Build widgets from API data
        setWidgets([
          {
            id: '1',
            type: 'chart',
            title: 'Segmentos de Clientes',
            data: analyticsResult.customerSegments || []
          },
          {
            id: '2',
            type: 'metric',
            title: 'Análise de Clientes',
            data: {
              'Valor Médio do Pedido': analyticsResult.averageOrderValue || 0,
              'Taxa de Retenção': `${analyticsResult.retentionRate || 0}%`,
              'Novos Clientes': analyticsResult.newCustomers || 0
            }
          },
          {
            id: '3',
            type: 'table',
            title: 'Serviços com Melhor Desempenho',
            data: analyticsResult.topServices || []
          }
        ]);
      }

      if (kpisResult) {
        setKpis(kpisResult);
        setPerformanceData({
          monthlyData: kpisResult.monthlyData || [],
          goals: kpisResult.goals || { revenue: 0, orders: 0, customers: 0 }
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Erro ao carregar análises. Verifique a conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWidgetsChange = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    console.log('Widgets alterados:', newWidgets);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center mb-8">
        <Link to="/stores/dashboard/overview" className="flex items-center text-emerald-600 hover:text-emerald-800 mr-4">
          <MdChevronLeft />
          <span>Voltar ao Painel</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Análises</h1>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}
      
      {/* Analytics Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b dark:border-slate-700 pb-2">Visão Geral de Análises</h2>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Receita por Período</h3>
            <div className="h-64">
              {performanceData.monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#10b981" name="Receita Real" />
                    <Bar dataKey="target" fill="#3b82f6" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sem dados disponíveis
                </div>
              )}
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Tendência de Crescimento</h3>
            <div className="h-64">
              {performanceData.monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="growth" stroke="#10b981" name="Crescimento (%)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sem dados disponíveis
                </div>
              )}
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Distribuição de Serviços</h3>
            <div className="h-64">
              {analytics?.serviceDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.serviceDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sem dados disponíveis
                </div>
              )}
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Segmentação de Clientes</h3>
            <div className="h-64">
              {analytics?.customerSegments?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.customerSegments.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sem dados disponíveis
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b dark:border-slate-700 pb-2">Métricas-Chave</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Taxa de Conversão', value: kpis?.conversionRate || '0%', change: kpis?.conversionRateChange || '0%' },
            { label: 'Valor Médio do Pedido', value: formatCurrency(kpis?.averageOrderValue || 0), change: kpis?.aovChange || '0%' },
            { label: 'Taxa de Retenção', value: `${kpis?.retentionRate || 0}%`, change: kpis?.retentionChange || '0%' },
            { label: 'Custo de Aquisição', value: formatCurrency(kpis?.acquisitionCost || 0), change: kpis?.cacChange || '0%' },
            { label: 'Pontuação NPS', value: kpis?.npsScore || 0, change: kpis?.npsChange || '0' },
            { label: 'Tempo de Resposta', value: `${kpis?.responseTime || 0}h`, change: kpis?.responseTimeChange || '0h' }
          ].map((metric, index) => (
            <div key={index} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-1">{metric.label}</h3>
              <p className="text-3xl font-bold text-emerald-600">{metric.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.change} vs. mês anterior</p>
            </div>
          ))}
        </div>
      </div>
      
      {performanceData.monthlyData.length > 0 && (
        <PerformanceTrends data={performanceData} />
      )}
      
      {widgets.length > 0 && (
        <DashboardWidgets 
          widgets={widgets} 
          onWidgetsChange={handleWidgetsChange} 
        />
      )}
    </div>
  );
};

export default AnalyticsPage;

import React, { useState, useEffect } from 'react';
import { CustomerSpendingAnalytics as SpendingAnalytics, generateMockOrders, generateSpendingAnalytics } from '../../models/CustomerAnalytics';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat, MdPieChart, MdShowChart, MdShoppingCart, MdOutlineShoppingBag } from 'react-icons/md';

interface CustomerSpendingAnalyticsProps {
  customerId: number;
}

const CustomerSpendingAnalytics: React.FC<CustomerSpendingAnalyticsProps> = ({ customerId }) => {
  const [analytics, setAnalytics] = useState<SpendingAnalytics | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'monthly' | 'category'>('overview');
  
  useEffect(() => {
    // In a real app, this would be an API call
    const mockOrders = generateMockOrders(customerId, 15);
    const analyticsData = generateSpendingAnalytics(mockOrders);
    setAnalytics(analyticsData);
  }, [customerId]);
  
  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-56 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${month}/${year}`;
  };
  
  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <MdTrendingUp className="text-green-500 text-xl" />;
      case 'decreasing':
        return <MdTrendingDown className="text-red-500 text-xl" />;
      case 'stable':
        return <MdTrendingFlat className="text-blue-500 text-xl" />;
    }
  };
  
  // Find the maximum value for the monthly spending chart
  const maxMonthlySpending = Math.max(...analytics.monthlySpending.map(month => month.total));
  
  // Calculate the height for monthly spending bars (percentage of the maximum)
  const getBarHeight = (total: number) => {
    return Math.max(10, Math.round((total / maxMonthlySpending) * 100));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Análise de Gastos do Cliente</h2>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveView('overview')}
          className={`flex items-center px-4 py-2 border-b-2 ${
            activeView === 'overview' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent hover:text-blue-500'
          }`}
        >
          <MdShowChart className="mr-1" /> Visão Geral
        </button>
        <button
          onClick={() => setActiveView('monthly')}
          className={`flex items-center px-4 py-2 border-b-2 ${
            activeView === 'monthly' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent hover:text-blue-500'
          }`}
        >
          <MdOutlineShoppingBag className="mr-1" /> Evolução Mensal
        </button>
        <button
          onClick={() => setActiveView('category')}
          className={`flex items-center px-4 py-2 border-b-2 ${
            activeView === 'category' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent hover:text-blue-500'
          }`}
        >
          <MdPieChart className="mr-1" /> Categorias
        </button>
      </div>
      
      <div className="p-4">
        {/* Overview Panel */}
        {activeView === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Total Gasto</p>
                <p className="text-2xl font-bold text-blue-800">{formatCurrency(analytics.totalSpending)}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Total de Pedidos</p>
                <p className="text-2xl font-bold text-green-800">{analytics.orderCount}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700 mb-1">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-800">{formatCurrency(analytics.averageOrderValue)}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 mb-1">Tendência</p>
                  <p className="text-md font-medium text-orange-800">
                    {analytics.spendingTrend === 'increasing' ? 'Aumento' : 
                     analytics.spendingTrend === 'decreasing' ? 'Diminuição' : 'Estável'}
                  </p>
                </div>
                {getTrendIcon(analytics.spendingTrend)}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Pontuação de Fidelidade</h3>
              <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-700" 
                  style={{ width: `${analytics.loyaltyScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>Novo Cliente</span>
                <span>Cliente Frequente</span>
                <span>Cliente VIP</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center">
                  <MdOutlineShoppingBag className="mr-1" /> Informações de Pedidos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Primeiro pedido</span>
                    <span>{formatDate(analytics.firstOrderDate)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Último pedido</span>
                    <span>{formatDate(analytics.lastOrderDate)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-600">Frequência média</span>
                    <span>A cada {Math.round(30 * analytics.orderCount / (new Date().getTime() - new Date(analytics.firstOrderDate).getTime()) * (1000*60*60*24*30))} dias</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3 flex items-center">
                  <MdShoppingCart className="mr-1" /> Itens Frequentes
                </h3>
                
                {analytics.frequentItems.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.frequentItems.map((item, index) => (
                      <div key={index} className="flex justify-between py-1 border-b">
                        <span className="flex-grow">{item.name}</span>
                        <span className="text-gray-600 mr-2">{item.count}x</span>
                        <span>{formatCurrency(item.totalSpent)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sem dados de itens frequentes</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Monthly Spending Panel */}
        {activeView === 'monthly' && (
          <div>
            <div className="mb-6">
              <h3 className="text-md font-medium mb-4">Evolução de Gastos por Mês</h3>
              
              <div className="h-64 flex items-end space-x-1">
                {analytics.monthlySpending.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: `${getBarHeight(month.total)}%` }}></div>
                    <div className="mt-2 text-xs text-gray-500 rotate-45 origin-top-left">
                      {formatMonth(month.month)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pedidos</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.monthlySpending.map((month, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-3 text-sm text-gray-900">{formatMonth(month.month)}</td>
                      <td className="py-3 px-3 text-right text-sm text-gray-900">{month.orderCount}</td>
                      <td className="py-3 px-3 text-right text-sm text-gray-900">{formatCurrency(month.total)}</td>
                      <td className="py-3 px-3 text-right text-sm text-gray-900">{formatCurrency(month.averageOrderValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Category Panel */}
        {activeView === 'category' && (
          <div>
            <div className="mb-6">
              <h3 className="text-md font-medium mb-4">Distribuição de Gastos por Categoria</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="space-y-3">
                    {analytics.categorySpendings.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">
                            {category.category === 'lavagem' ? 'Lavagem' :
                             category.category === 'passadoria' ? 'Passadoria' :
                             category.category === 'lavagem_especial' ? 'Lavagem Especial' :
                             category.category === 'tingimento' ? 'Tingimento' :
                             category.category === 'costura' ? 'Costura' : category.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(category.totalSpent)}
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              index % 5 === 0 ? 'bg-blue-500' :
                              index % 5 === 1 ? 'bg-green-500' :
                              index % 5 === 2 ? 'bg-purple-500' :
                              index % 5 === 3 ? 'bg-orange-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="grid grid-cols-1 gap-3">
                    {analytics.categorySpendings.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          index % 5 === 0 ? 'bg-blue-500' :
                          index % 5 === 1 ? 'bg-green-500' :
                          index % 5 === 2 ? 'bg-purple-500' :
                          index % 5 === 3 ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-grow">
                          <div className="text-sm font-medium">
                            {category.category === 'lavagem' ? 'Lavagem' :
                             category.category === 'passadoria' ? 'Passadoria' :
                             category.category === 'lavagem_especial' ? 'Lavagem Especial' :
                             category.category === 'tingimento' ? 'Tingimento' :
                             category.category === 'costura' ? 'Costura' : category.category}
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.itemCount} {category.itemCount === 1 ? 'item' : 'itens'} • {category.percentage.toFixed(1)}% do total
                          </div>
                        </div>
                        <div className="text-sm font-medium">{formatCurrency(category.totalSpent)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSpendingAnalytics; 
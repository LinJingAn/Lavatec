import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdDownload, MdPrint, MdClose, MdCheck, MdOutlineLocalShipping, MdPerson, MdRefresh } from 'react-icons/md';
import { OrderService, Order, OrderStatus as OrderStatusType } from '../../services';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Order status display component
interface OrderStatusProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusProps> = ({ status }) => {
  let bgColor = "bg-slate-100 dark:bg-slate-700";
  let textColor = "text-slate-600 dark:text-slate-300";
  let statusText = status;

  const statusMap: { [key: string]: { bg: string; text: string; label: string } } = {
    'new': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'Novo' },
    'pending': { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300', label: 'Pendente' },
    'in_progress': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Em Andamento' },
    'processing': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', label: 'Processando' },
    'washing': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', label: 'Lavando' },
    'drying': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', label: 'Secando' },
    'ironing': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', label: 'Passando' },
    'quality_check': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', label: 'Controle de Qualidade' },
    'ready': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Pronto' },
    'ready_for_pickup': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Pronto para Retirada' },
    'ready_for_delivery': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', label: 'Pronto para Entrega' },
    'out_for_delivery': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'Em Rota de Entrega' },
    'delivered': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Entregue' },
    'picked_up': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Retirado' },
    'completed': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Concluído' },
    'cancelled': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'Cancelado' },
  };

  const statusConfig = statusMap[status] || { bg: bgColor, text: textColor, label: status };

  return (
    <span className={`${statusConfig.bg} ${statusConfig.text} text-xs font-medium px-2.5 py-0.5 rounded-lg transition-colors duration-200`}>
      {statusConfig.label}
    </span>
  );
};

interface OrdersPageProps {
  initialFilter?: 'active' | 'completed' | 'all';
}

const OrdersPage: React.FC<OrdersPageProps> = ({ initialFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalValue: 0,
    avgValue: 0
  });
  
  // Get the filter from URL parameters or use the initialFilter prop
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');
  
  const [activeFilter, setActiveFilter] = useState(initialFilter || filterParam || 'active');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await OrderService.getOrders();
      const allOrders = response.orders || [];
      setOrders(allOrders);
      
      // Calculate stats
      const totalValue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats({
        totalOrders: allOrders.length,
        totalValue: totalValue,
        avgValue: allOrders.length > 0 ? totalValue / allOrders.length : 0
      });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update the URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [activeFilter, navigate]);

  // Active statuses for filtering
  const activeStatuses: OrderStatusType[] = ['new', 'pending', 'in_progress', 'processing', 'washing', 'drying', 'ironing', 'quality_check'];
  const completedStatuses: OrderStatusType[] = ['ready', 'ready_for_pickup', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'picked_up', 'completed'];

  // Filter orders based on the active filter and search query
  const filteredOrders = orders.filter(order => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(query) ||
        order.customer_name?.toLowerCase().includes(query) ||
        order.branch_name?.toLowerCase().includes(query) ||
        order.id?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (activeFilter === 'active') {
      return activeStatuses.includes(order.status);
    } else if (activeFilter === 'completed') {
      return completedStatuses.includes(order.status);
    }
    return true;
  });

  // Handler for order selection
  const handleOrderClick = (order: Order) => {
    navigate(`/stores/orders/${order.id}`);
  };

  // Close order details
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Function to create a new order
  const handleCreateOrder = () => {
    navigate('/stores/orders/new');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Header with stats */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Pedidos</h1>
        
        <div className="flex flex-wrap space-x-6 gap-4">
          <div className="text-center">
            <p className="text-2xl text-emerald-500 font-semibold">{stats.totalOrders}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total de pedidos</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-emerald-600 font-semibold">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Valor total</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-purple-500 dark:text-purple-400 font-semibold">{formatCurrency(stats.avgValue)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Valor médio</p>
          </div>
        </div>
      </div>

      {/* Filter and controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6 transition-colors duration-300">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300">Mostrando</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{filteredOrders.length} pedidos</span>
            <span className="text-slate-700 dark:text-slate-300">de {orders.length} total</span>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
              onClick={handleCreateOrder}
            >
              <MdAdd className="mr-1" size={20} />
              <span>Novo Pedido</span>
            </button>
            <button 
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 flex-shrink-0"
              onClick={fetchOrders}
              title="Atualizar"
            >
              <MdRefresh size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 flex-shrink-0">
              <MdDownload size={20} />
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 flex-shrink-0">
              <MdPrint size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${activeFilter === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveFilter('active')}
            >
              Ativos
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${activeFilter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveFilter('completed')}
            >
              Concluídos
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${activeFilter === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setActiveFilter('all')}
            >
              Todos
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pedidos..."
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg w-full sm:w-64 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 text-slate-400" size={20} />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-2 text-red-700 dark:text-red-300 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando pedidos...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {searchQuery ? 'Nenhum pedido encontrado para a busca.' : 'Nenhum pedido encontrado.'}
          </p>
          <button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={handleCreateOrder}
          >
            Criar Novo Pedido
          </button>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                    Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[120px]">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[150px]">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                    Data Prometida
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[140px]">
                    Loja
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                    onClick={() => handleOrderClick(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {order.order_number || order.id}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {order.items?.length || 0} itens
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
                        {order.customer_name || 'Cliente não informado'}
                      </div>
                      {order.customer_phone && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{order.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
                      <div className="flex flex-col gap-1">
                        <OrderStatusBadge status={order.status} />
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatCurrency(order.total || 0)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {order.payment_status === 'paid' ? 'Pago' : 
                         order.payment_status === 'partial' ? 'Parcial' : 'Pendente'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {order.promised_date ? new Date(order.promised_date).toLocaleDateString('pt-BR') : '-'}
                      </div>
                      {order.promised_time && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{order.promised_time}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                      <div className="text-sm text-slate-900 dark:text-white truncate max-w-[200px]">
                        {order.branch_name || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail sidebar */}
      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 shadow-lg z-50 overflow-auto border-l border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedOrder.order_number || selectedOrder.id}
              </h3>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Detalhes</span>
            </div>
            <button onClick={closeOrderDetails} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MdClose size={24} />
            </button>
          </div>
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between mb-1">
              <div className="text-slate-500 dark:text-slate-400 text-sm">Total do Pedido</div>
              <div className="font-medium text-slate-900 dark:text-white">{formatCurrency(selectedOrder.total || 0)}</div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-slate-500 dark:text-slate-400 text-sm">Total de Itens</div>
              <div className="font-medium text-slate-900 dark:text-white">{selectedOrder.items?.length || 0} itens</div>
            </div>
            <div className="flex justify-between">
              <div className="text-slate-500 dark:text-slate-400 text-sm">Status do Pedido</div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>
          </div>
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h4 className="font-medium mb-2 text-slate-900 dark:text-white">DETALHES PRINCIPAIS</h4>
            <div className="mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm">Cliente</div>
              <div className="font-medium text-slate-900 dark:text-white">{selectedOrder.customer_name}</div>
              {selectedOrder.customer_phone && (
                <div className="text-sm text-slate-500 dark:text-slate-400">{selectedOrder.customer_phone}</div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm">Data Prometida</div>
              <div className="font-medium text-slate-900 dark:text-white">
                {selectedOrder.promised_date ? new Date(selectedOrder.promised_date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
              </div>
              {selectedOrder.promised_time && (
                <div className="text-sm text-slate-500 dark:text-slate-400">{selectedOrder.promised_time}</div>
              )}
            </div>
            
            {selectedOrder.notes && (
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">Observações</div>
                <div className="text-slate-900 dark:text-white">{selectedOrder.notes}</div>
              </div>
            )}
          </div>
          
          {selectedOrder.items && selectedOrder.items.length > 0 && (
            <div className="p-4">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">ITENS</h4>
              <div className="border border-slate-200 dark:border-slate-700 rounded-md">
                {selectedOrder.items.map((item, index) => (
                  <div key={item.id || index} className={`p-3 ${index < selectedOrder.items.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                    <div className="flex justify-between">
                      <div className="font-medium text-slate-900 dark:text-white">{item.service_name}</div>
                      <div className="text-sm text-slate-900 dark:text-white">{formatCurrency(item.subtotal || item.unit_price * item.quantity)}</div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {item.quantity}x {item.garment_type || item.service_category}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2 text-slate-900 dark:text-white">RESUMO DE PREÇOS</h4>
                <div className="flex justify-between mb-1">
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Subtotal</div>
                  <div className="text-sm text-slate-900 dark:text-white">{formatCurrency(selectedOrder.subtotal || 0)}</div>
                </div>
                <div className="flex justify-between mb-1">
                  <div className="text-slate-500 dark:text-slate-400 text-sm">Impostos</div>
                  <div className="text-sm text-slate-900 dark:text-white">{formatCurrency(selectedOrder.tax || 0)}</div>
                </div>
                {selectedOrder.discount && (
                  <div className="flex justify-between mb-1">
                    <div className="text-slate-500 dark:text-slate-400 text-sm">Desconto</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">-{formatCurrency(selectedOrder.discount)}</div>
                  </div>
                )}
                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-slate-900 dark:text-white">Total</div>
                  <div className="text-slate-900 dark:text-white">{formatCurrency(selectedOrder.total || 0)}</div>
                </div>
              </div>
              
              <button 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg mt-6 transition-colors duration-200"
                onClick={() => navigate(`/stores/orders/${selectedOrder.id}`)}
              >
                Gerenciar pedido
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OrdersPage.defaultProps = {
  initialFilter: undefined
};

export default OrdersPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
}

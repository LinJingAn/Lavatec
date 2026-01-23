import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdDownload, MdPrint, MdClose, MdCheck, MdOutlineLocalShipping, MdPerson } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Order status types and their corresponding components
interface OrderStatusProps {
  status: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  let bgColor = "bg-slate-100 dark:bg-slate-700";
  let textColor = "text-slate-600 dark:text-slate-300";
  let statusText = status;

  switch (status) {
    case 'ready_for_intake':
      bgColor = "bg-blue-100 dark:bg-blue-900/30";
      textColor = "text-blue-600 dark:text-blue-400";
      statusText = "Pronto para Recebimento";
      break;
    case 'en_route':
      bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
      textColor = "text-indigo-600 dark:text-indigo-400";
      statusText = "A Caminho da Loja";
      break;
    case 'submitted_online':
      bgColor = "bg-purple-100 dark:bg-purple-900/30";
      textColor = "text-purple-600 dark:text-purple-400";
      statusText = "Enviado Online";
      break;
    case 'processing':
      bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
      textColor = "text-yellow-600 dark:text-yellow-400";
      statusText = "Em Processamento";
      break;
    case 'ready_for_customer':
      bgColor = "bg-emerald-100 dark:bg-emerald-900/30";
      textColor = "text-emerald-600 dark:text-emerald-400";
      statusText = "Pronto para o Cliente";
      break;
    case 'ready_for_driver':
      bgColor = "bg-orange-100 dark:bg-orange-900/30";
      textColor = "text-orange-600 dark:text-orange-400";
      statusText = "Pronto para o Motorista";
      break;
    default:
      break;
  }

  return (
    <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-lg transition-colors duration-200`}>
      {statusText}
    </span>
  );
};

// Sample data for orders
const SAMPLE_ORDERS = [
  {
    id: 'DS-1535',
    customer: { name: 'Donna Jean', id: '1235' },
    status: 'ready_for_intake',
    status_time: '4/22/24, 10:30am',
    total: 37.50,
    store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Tse)' }
  },
  {
    id: 'DS-1533',
    customer: { name: 'Ricardo Martinez', id: '1236' },
    status: 'en_route',
    status_time: '4/21/24, 1:15pm',
    total: 22.67,
    store: { name: '456 Washington Ave', id: '2', location: '6/27/20, DB (Sam Samson)' }
  },
  {
    id: 'S-1529',
    customer: { name: 'Louise Angel', id: '1237' },
    status: 'submitted_online',
    status_time: '4/21/24, 9:05am',
    total: 17.29,
    store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Small)' }
  },
  {
    id: 'S-1527',
    customer: { name: 'Max Watson', id: '1238' },
    status: 'processing',
    status_time: '4/21/24, 08:15am',
    total: 41.90,
    store: { name: '789 Flatbush Blvd', id: '3', location: '6/27/20, DB (Sam Turner)' }
  },
  {
    id: 'DS-1321',
    customer: { name: 'Tasha Johnson', id: '1239' },
    status: 'processing',
    status_time: '4/21/24, 08:05pm',
    total: 34.11,
    store: { name: '456 Washington Ave', id: '2', location: '6/27/20, DB (Sam Samson)' }
  },
  {
    id: 'DS-1317',
    customer: { name: 'Elena Barnes', id: '1240' },
    status: 'processing',
    status_time: '4/21/24, 04:10pm',
    total: 37.18,
    store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Tse)' }
  },
  {
    id: 'S-1315',
    customer: { name: 'Brian Kim', id: '1241' },
    status: 'ready_for_customer',
    status_time: '4/22/24, 07:30am',
    total: 36.12,
    store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Tse)' }
  },
  {
    id: 'DS-1314',
    customer: { name: 'Allison Copley', id: '1242' },
    status: 'ready_for_driver',
    status_time: '4/22/24, 11:00am',
    total: 68.30,
    store: { name: '123 Belle Ave', id: '1', location: '6/27/20, DB (Sam Tse)' }
  }
];

interface Order {
  id: string;
  customer: { name: string; id: string };
  status: string;
  status_time: string;
  total: number;
  store: { name: string; id: string; location: string };
}

interface OrdersPageProps {
  initialFilter?: 'active' | 'completed' | 'all';
}

const OrdersPage: React.FC<OrdersPageProps> = ({ initialFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Add debug logging
  useEffect(() => {
    console.log('OrdersPage mounted with initialFilter:', initialFilter);
    console.log('Current location:', location.pathname + location.search);
  }, [initialFilter, location]);
  
  // Get the filter from URL parameters or use the initialFilter prop
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter');
  
  const [activeFilter, setActiveFilter] = useState(initialFilter || filterParam || 'active');
  const [searchQuery, setSearchQuery] = useState('');

  // Update the URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [activeFilter, navigate]);

  // Filter orders based on the active filter
  const filteredOrders = SAMPLE_ORDERS.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.store.name.toLowerCase().includes(query)
      );
    }
    
    if (activeFilter === 'active') {
      return ['ready_for_intake', 'en_route', 'submitted_online', 'processing'].includes(order.status);
    } else if (activeFilter === 'completed') {
      return ['ready_for_customer', 'ready_for_driver'].includes(order.status);
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

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 overflow-x-hidden">
      {/* Header with stats */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Pedidos</h1>
        
        <div className="flex flex-wrap space-x-6 gap-4">
          <div className="text-center">
            <p className="text-2xl text-emerald-500 font-semibold">167</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total de pedidos este mês</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-emerald-600 font-semibold">R$ 7.063,57</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Valor total dos pedidos este mês</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-purple-500 dark:text-purple-400 font-semibold">R$ 42,29</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Valor médio dos pedidos este mês</p>
          </div>
        </div>
      </div>

      {/* Filter and controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6 transition-colors duration-300">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300">Mostrando</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">pedidos de serviço</span>
            <span className="text-slate-700 dark:text-slate-300">em todas as localizações</span>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
              onClick={handleCreateOrder}
            >
              <MdAdd className="mr-1" size={20} />
              <span>Novo Pedido</span>
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

      {/* Orders list */}
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
                Total do Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[180px]">
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
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{order.id}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {order.status === 'processing' || order.status === 'submitted_online' ? 
                          <div className="flex items-center">
                            <MdOutlineLocalShipping className="mr-1 flex-shrink-0" size={14} />
                            <span>Peças: 5</span>
                          </div> : 
                          <div className="flex items-center">
                            <MdPerson className="mr-1 flex-shrink-0" size={14} />
                            <span>Presencial</span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">{order.customer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
                  <div className="flex flex-col gap-1">
                    <OrderStatus status={order.status} />
                    <div className="text-xs text-slate-500 dark:text-slate-400">Data: {order.status_time}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                  <div className={`text-sm font-medium ${order.status === 'processing' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    R$ {order.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                    {order.status === 'processing' ? 'Parcialmente pago R$ 17,00' : 'Pago'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap min-w-[180px]">
                  <div className="text-sm text-slate-900 dark:text-white truncate max-w-[200px]">{order.store.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{order.store.location}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Order detail sidebar */}
      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{selectedOrder.id}</h3>
              <span className="ml-2 text-sm text-gray-500">Detalhes</span>
            </div>
            <button onClick={closeOrderDetails} className="text-gray-400 hover:text-gray-600">
              <MdClose size={24} />
            </button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex justify-between mb-1">
              <div className="text-gray-500 text-sm">Total do Pedido</div>
              <div className="font-medium">R$ {selectedOrder.total.toFixed(2)}</div>
            </div>
            <div className="flex justify-between mb-1">
              <div className="text-gray-500 text-sm">Total de Itens</div>
              <div className="font-medium">5 itens</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500 text-sm">Status do Pedido</div>
              <OrderStatus status={selectedOrder.status} />
            </div>
          </div>
          
          <div className="p-4 border-b">
            <h4 className="font-medium mb-2">DETALHES PRINCIPAIS</h4>
            <div className="mb-4">
              <div className="text-gray-500 text-sm">Cliente</div>
              <div className="font-medium">{selectedOrder.customer.name}</div>
              <div className="text-sm text-gray-500">(415) 555-5555</div>
              <div className="text-sm text-blue-500">client@example.com</div>
              <div className="text-sm text-gray-500 mt-1">456 Washington Ave, Apt 3B, New York, NY 10022</div>
            </div>
            
            <div className="mb-4">
              <div className="text-gray-500 text-sm">Data e Hora de Recebimento</div>
              <div className="font-medium">Segunda-feira, 22 de Abril, 2024</div>
              <div className="text-sm text-gray-500">10:30 - 11:00</div>
            </div>
            
            <div>
              <div className="text-gray-500 text-sm">Atendente</div>
              <div className="font-medium">Sam Tse</div>
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="font-medium mb-2">ITENS</h4>
            <div className="border rounded-md mb-2">
              <div className="p-3 border-b">
                <div className="flex justify-between">
                  <div className="font-medium">Lavagem a Seco</div>
                  <div className="text-sm">R$ 25,75</div>
                </div>
                <div className="text-sm text-gray-500">1 Paletó, 1 Camisa Social, 1 Calça</div>
              </div>
              <div className="p-3">
                <div className="flex justify-between">
                  <div className="font-medium">Lavanderia</div>
                  <div className="text-sm">R$ 12,25</div>
                </div>
                <div className="text-sm text-gray-500">5 camisas</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">RESUMO DE PREÇOS</h4>
              <div className="flex justify-between mb-1">
                <div className="text-gray-500 text-sm">Serviços</div>
                <div className="text-sm">R$ 38,00</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-gray-500 text-sm">Pacote na Loja</div>
                <div className="text-sm">-R$ 5,50 / 15%</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-gray-500 text-sm">Subtotal</div>
                <div className="text-sm">R$ 32,50</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-gray-500 text-sm">Gorjeta na Loja</div>
                <div className="text-sm">+R$ 5,00 / 15%</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-gray-500 text-sm">Taxa de Serviço</div>
                <div className="text-sm">R$ 0,00</div>
              </div>
              <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                <div>Total</div>
                <div>R$ {selectedOrder.total.toFixed(2)}</div>
              </div>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-6">
              Gerenciar pedido
            </button>
          </div>
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
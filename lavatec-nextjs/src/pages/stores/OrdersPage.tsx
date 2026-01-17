import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdSearch, MdFilterList, MdAdd, MdDownload, MdPrint, MdClose, MdCheck, MdOutlineLocalShipping, MdPerson } from 'react-icons/md';

// Order status types and their corresponding components
interface OrderStatusProps {
  status: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";
  let statusText = status;

  switch (status) {
    case 'ready_for_intake':
      bgColor = "bg-blue-100";
      textColor = "text-blue-600";
      statusText = "Pronto para Recebimento";
      break;
    case 'en_route':
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-600";
      statusText = "A Caminho da Loja";
      break;
    case 'submitted_online':
      bgColor = "bg-purple-100";
      textColor = "text-purple-600";
      statusText = "Enviado Online";
      break;
    case 'processing':
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-600";
      statusText = "Em Processamento";
      break;
    case 'ready_for_customer':
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      statusText = "Pronto para o Cliente";
      break;
    case 'ready_for_driver':
      bgColor = "bg-orange-100";
      textColor = "text-orange-600";
      statusText = "Pronto para o Motorista";
      break;
    default:
      break;
  }

  return (
    <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
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
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header with stats */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-2xl text-blue-500 font-semibold">167</p>
            <p className="text-sm text-gray-500">Total de pedidos este mês</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-green-500 font-semibold">R$ 7.063,57</p>
            <p className="text-sm text-gray-500">Valor total dos pedidos este mês</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl text-purple-500 font-semibold">R$ 42,29</p>
            <p className="text-sm text-gray-500">Valor médio dos pedidos este mês</p>
          </div>
        </div>
      </div>

      {/* Filter and controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Mostrando</span>
            <span className="font-medium text-blue-600">pedidos de serviço</span>
            <span className="text-gray-700 ml-2">em todas as localizações</span>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
              onClick={handleCreateOrder}
            >
              <MdAdd className="mr-1" size={20} />
              <span>Novo Pedido</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MdDownload size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MdPrint size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md ${activeFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveFilter('active')}
            >
              Ativos
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveFilter('completed')}
            >
              Concluídos
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pedidos..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total do Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loja
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-600">{order.id}</div>
                      <div className="text-xs text-gray-500">
                        {order.status === 'processing' || order.status === 'submitted_online' ? 
                          <div className="flex items-center">
                            <MdOutlineLocalShipping className="mr-1" size={14} />
                            <span>Peças: 5</span>
                          </div> : 
                          <div className="flex items-center">
                            <MdPerson className="mr-1" size={14} />
                            <span>Presencial</span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">{order.customer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatus status={order.status} />
                  <div className="text-xs text-gray-500 mt-1">Data: {order.status_time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${order.status === 'processing' ? 'text-green-600' : 'text-gray-900'}`}>
                    R$ {order.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.status === 'processing' ? 'Parcialmente pago R$ 17,00' : 'Pago'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.store.name}</div>
                  <div className="text-xs text-gray-500">{order.store.location}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdEdit, 
  MdDelete, 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdShoppingCart,
  MdLocalLaundryService,
  MdNotes,
  MdCategory,
  MdCalendarToday,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdAnalytics
} from 'react-icons/md';
import CustomerNotesSummary from '../../components/customer/CustomerNotesSummary';
import CustomerCommunicationSummary from '../../components/customer/CustomerCommunicationSummary';
import CustomerSpendingAnalytics from '../../components/customer/CustomerSpendingAnalytics';
import WashingPreferencesPanel from '../../components/customers/WashingPreferencesPanel';
import { WashingPreferences, DEFAULT_WASHING_PREFERENCES } from '../../models/CustomerPreferences';

// Mock data for a single customer
const MOCK_CUSTOMER = {
  id: 2,
  name: 'Carlos Oliveira',
  email: 'carlos.oliveira@email.com',
  phone: '(11) 91234-5678',
  address: 'Avenida Paulista, 1000 - São Paulo, SP',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  category: 'heavy',
  lastVisit: '2023-10-05',
  totalOrders: 24,
  totalSpent: 3450.75,
  washPreferences: 'Extra limpo, perfume suave',
  notes: 'Cliente VIP, sempre verificar se está satisfeito',
  createdAt: '2022-03-15'
};

// Mock order history
const MOCK_ORDERS = [
  {
    id: 501,
    date: '2023-10-05',
    status: 'completed',
    items: [
      { name: 'Lavagem Completa', quantity: 3, price: 45.00 },
      { name: 'Lavagem de Edredom', quantity: 1, price: 60.00 }
    ],
    total: 195.00
  },
  {
    id: 487,
    date: '2023-09-20',
    status: 'completed',
    items: [
      { name: 'Lavagem de Roupa', quantity: 5, price: 35.00 },
      { name: 'Passar Roupa', quantity: 10, price: 12.00 }
    ],
    total: 295.00
  },
  {
    id: 465,
    date: '2023-09-05',
    status: 'completed',
    items: [
      { name: 'Lavagem de Terno', quantity: 1, price: 80.00 },
      { name: 'Lavagem de Camisa', quantity: 5, price: 25.00 }
    ],
    total: 205.00
  },
  {
    id: 442,
    date: '2023-08-22',
    status: 'completed',
    items: [
      { name: 'Lavagem Completa', quantity: 4, price: 45.00 }
    ],
    total: 180.00
  },
  {
    id: 522,
    date: '2023-10-18',
    status: 'pending',
    items: [
      { name: 'Lavagem Completa', quantity: 2, price: 45.00 },
      { name: 'Lavagem de Cobertor', quantity: 2, price: 70.00 }
    ],
    total: 230.00
  }
];

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Category translation
const getCategoryLabel = (category: string) => {
  switch(category) {
    case 'regular': return 'Regular';
    case 'heavy': return 'Frequente';
    case 'occasional': return 'Ocasional';
    case 'rare': return 'Raro';
    default: return category;
  }
};

// Order status badge
const getOrderStatusBadge = (status: string) => {
  switch(status) {
    case 'completed':
      return <span className="flex items-center text-green-600"><MdCheckCircle className="mr-1" /> Concluído</span>;
    case 'pending':
      return <span className="flex items-center text-yellow-600"><MdPending className="mr-1" /> Pendente</span>;
    case 'cancelled':
      return <span className="flex items-center text-red-600"><MdCancel className="mr-1" /> Cancelado</span>;
    default:
      return <span className="text-gray-600">{status}</span>;
  }
};

const CustomerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const id = parseInt(customerId || '0');
  
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [washingPreferences, setWashingPreferences] = useState<WashingPreferences>({
    ...DEFAULT_WASHING_PREFERENCES,
    customerId: id
  });
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'analytics'>('info');
  
  // Fetch customer data (simulated)
  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, fetch customer by ID from API
        setCustomer(MOCK_CUSTOMER);
        setOrders(MOCK_ORDERS);
        setIsLoading(false);
      }, 800);
    };
    
    fetchCustomer();
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/stores/customers');
  };
  
  const handleEdit = () => {
    navigate(`/stores/customers/edit/${id}`);
  };
  
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    // In a real app, call API to delete customer
    alert('Cliente excluído com sucesso!');
    navigate('/stores/customers');
  };
  
  const handleSendEmail = () => {
    // In a real app, open email composition or show modal
    window.open(`mailto:${customer.email}`);
  };
  
  const handleViewOrder = (orderId: number) => {
    // In a real app, navigate to order details
    alert(`Visualizando pedido #${orderId}`);
  };
  
  const handleViewNotes = () => {
    navigate(`/customers/${id}/notes`);
  };
  
  const handleViewCommunications = () => {
    navigate(`/customers/${id}/communication`);
  };
  
  const handleSavePreferences = (updatedPreferences: WashingPreferences) => {
    // In a real app, this would call an API
    setWashingPreferences(updatedPreferences);
    alert('Preferências salvas com sucesso!');
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Cliente não encontrado</p>
          <p>Não foi possível encontrar o cliente com o ID {id}.</p>
        </div>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Voltar para a lista de clientes
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Detalhes do Cliente
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleSendEmail}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MdEmail className="mr-2" /> Email
          </button>
          <button 
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <MdEdit className="mr-2" /> Editar
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <MdDelete className="mr-2" /> Excluir
          </button>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'info' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'orders' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'analytics' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Análises
          </button>
        </div>
      </div>
      
      {/* Customer Info Tab */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info Card - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-700 text-2xl font-bold">
                      {customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{customer.name}</h2>
                    <div className="flex items-center mt-1">
                      <MdCategory className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {getCategoryLabel(customer.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MdEmail className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdPhone className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-gray-800">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdLocationOn className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p className="text-gray-800">{customer.address}</p>
                      <p className="text-gray-800">{customer.city}, {customer.state} - {customer.zipCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdCalendarToday className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Cliente desde</p>
                      <p className="text-gray-800">{formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MdNotes className="mr-2" /> Observações
                </h3>
                <p className="text-gray-800">
                  {customer.notes || 'Nenhuma observação registrada'}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MdShoppingCart className="mr-2" /> Resumo de Pedidos
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-blue-800">{customer.totalOrders}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Valor Total</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Última visita em {formatDate(customer.lastVisit)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Washing Preferences */}
            <WashingPreferencesPanel
              preferences={washingPreferences}
              onSave={handleSavePreferences}
              isReadOnly={false}
            />
            
            {/* Customer Notes Summary */}
            <CustomerNotesSummary 
              customerId={id} 
              maxNotes={3}
              showActions={true}
            />
            
            {/* Customer Communication Summary */}
            <CustomerCommunicationSummary
              customerId={id}
              maxLogs={3}
              showActions={true}
            />
          </div>
        </div>
      )}
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Histórico de Pedidos</h3>
          </div>
          
          {orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium">Pedido #{order.id}</h4>
                      <p className="text-sm text-gray-500">Data: {formatDate(order.date)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>{getOrderStatusBadge(order.status)}</div>
                      <div className="font-bold text-gray-800">{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="text-center text-xs text-gray-500 uppercase tracking-wider">Qtd</th>
                          <th className="text-right text-xs text-gray-500 uppercase tracking-wider">Preço</th>
                          <th className="text-right text-xs text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.items.map((item: { name: string; quantity: number; price: number }, index: number) => (
                          <tr key={index}>
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-center">{item.quantity}</td>
                            <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                            <td className="py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleViewOrder(order.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver detalhes do pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Este cliente ainda não realizou nenhum pedido.
            </div>
          )}
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <CustomerSpendingAnalytics customerId={id} />
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir o cliente <strong>{customer.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage; 
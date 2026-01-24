import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdDelete, MdPerson, MdPhone, MdEmail, MdLocationOn, MdHistory, MdShoppingBag } from 'react-icons/md';
import { Customer } from '@/models/Customer';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Extended customer type for this page with additional properties from mock data
interface CustomerWithDetails extends Customer {
  orders?: Array<{
    id: string;
    date: string;
    status: string;
    total: number;
  }>;
  contracts?: Array<{
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    value: number;
    status?: string;
  }>;
  notes?: string;
  lastOrder?: string;
}

// Mock data - same as in CustomersPage
const mockCustomers = [
  {
    id: '1',
    name: 'Hotel Panorama',
    code: 'HP001',
    category: 'Premium',
    categoryId: '1',
    contact: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'contato@hotelpanorama.com',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    lastOrder: '2023-10-15',
    totalOrders: 48,
    status: 'active',
    notes: 'Cliente VIP. Entrega prioritária.',
    contracts: [
      { id: 'c1', type: 'Manutenção', startDate: '2023-01-15', endDate: '2024-01-14', value: 12500 },
      { id: 'c2', type: 'Limpeza', startDate: '2023-03-01', endDate: '2024-02-28', value: 8750 }
    ],
    orders: [
      { id: 'o1', date: '2023-10-15', status: 'completed', total: 2500 },
      { id: 'o2', date: '2023-09-20', status: 'completed', total: 1800 },
      { id: 'o3', date: '2023-08-15', status: 'completed', total: 2200 }
    ]
  },
  {
    id: '2',
    name: 'Restaurante Sabor & Arte',
    code: 'RSA002',
    category: 'Standard',
    categoryId: '2',
    contact: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    email: 'maria@saborearte.com.br',
    address: 'Rua Augusta, 500, São Paulo, SP',
    lastOrder: '2023-10-10',
    totalOrders: 36,
    status: 'active',
    notes: 'Preferência por entregas pela manhã.',
    contracts: [
      { id: 'c3', type: 'Limpeza', startDate: '2023-02-10', endDate: '2024-02-09', value: 5600 }
    ],
    orders: [
      { id: 'o4', date: '2023-10-10', status: 'completed', total: 1200 },
      { id: 'o5', date: '2023-09-25', status: 'completed', total: 980 }
    ]
  },
  {
    id: '3',
    name: 'Hospital Santa Cruz',
    code: 'HSC003',
    category: 'Premium',
    categoryId: '1',
    contact: 'Dr. Roberto Santos',
    phone: '(11) 3456-7890',
    email: 'contato@hospitalsantacruz.org',
    address: 'Av. Rebouças, 3000, São Paulo, SP',
    lastOrder: '2023-10-05',
    totalOrders: 65,
    status: 'active',
    notes: 'Necessita certificação de higienização especial.',
    contracts: [
      { id: 'c4', type: 'Manutenção', startDate: '2023-01-05', endDate: '2024-01-04', value: 24000 },
      { id: 'c5', type: 'Limpeza', startDate: '2023-01-05', endDate: '2024-01-04', value: 36000 }
    ],
    orders: [
      { id: 'o6', date: '2023-10-05', status: 'completed', total: 4500 },
      { id: 'o7', date: '2023-09-20', status: 'completed', total: 3800 }
    ]
  },
  {
    id: '4',
    name: 'Lavanderias Express',
    code: 'LE004',
    category: 'Economy',
    categoryId: '3',
    contact: 'Ana Sousa',
    phone: '(11) 97654-3210',
    email: 'ana@lavanderiasexpress.com',
    address: 'Rua Consolação, 250, São Paulo, SP',
    lastOrder: '2023-09-28',
    totalOrders: 24,
    status: 'inactive',
    notes: 'Contrato suspenso temporariamente.',
    contracts: [
      { id: 'c6', type: 'Manutenção', startDate: '2023-03-15', endDate: '2023-09-14', value: 3600, status: 'expired' }
    ],
    orders: [
      { id: 'o8', date: '2023-09-28', status: 'completed', total: 850 },
      { id: 'o9', date: '2023-08-15', status: 'completed', total: 920 }
    ]
  },
  {
    id: '5',
    name: 'Pousada Mar Azul',
    code: 'PMA005',
    category: 'Standard',
    categoryId: '2',
    contact: 'Carlos Mendes',
    phone: '(13) 98765-4321',
    email: 'reservas@pousadamarazul.com.br',
    address: 'Av. Beira Mar, 500, Santos, SP',
    lastOrder: '2023-09-20',
    totalOrders: 30,
    status: 'active',
    notes: 'Aumento na demanda durante temporada de verão.',
    contracts: [
      { id: 'c7', type: 'Limpeza', startDate: '2023-04-01', endDate: '2024-03-31', value: 7200 }
    ],
    orders: [
      { id: 'o10', date: '2023-09-20', status: 'completed', total: 1650 },
      { id: 'o11', date: '2023-08-25', status: 'completed', total: 1480 }
    ]
  }
];

const CustomerDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerWithDetails | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (id) {
      const foundCustomer = mockCustomers.find(c => c.id === id) as CustomerWithDetails | undefined;
      setCustomer(foundCustomer ?? null);
    }
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/stores/customers');
  };
  
  const handleEditCustomer = () => {
    navigate(`/stores/customers/edit/${id}`);
  };
  
  const handleDeleteCustomer = () => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      // In a real app, make API call to delete
      navigate('/stores/customers');
    }
  };
  
  if (!customer) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <button 
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-0"
          >
            <MdArrowBack className="mr-1" /> Voltar para lista de clientes
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{customer.name}</h1>
          <p className="text-gray-500">{customer.id}</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleEditCustomer}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <MdEdit className="mr-1" /> Editar
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="px-4 py-2 text-sm bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 transition duration-200 flex items-center"
          >
            <MdDelete className="mr-1" /> Excluir
          </button>
        </div>
      </div>
      
      {/* Customer status badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {customer.isActive ? 'Ativo' : 'Inativo'}
        </span>
        <span className={`ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          customer.category === 'regular' ? 'bg-purple-100 text-purple-800' : 
          customer.category === 'heavy' ? 'bg-blue-100 text-blue-800' : 
          customer.category === 'occasional' ? 'bg-green-100 text-green-800' : 
          customer.category === 'rare' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {customer.category}
        </span>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contracts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('contracts')}
          >
            Contratos
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Cliente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <MdPerson className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Contato</p>
                  <p className="text-gray-800">{customer.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MdEmail className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MdPhone className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="text-gray-800">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MdLocationOn className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="text-gray-800">{customer.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MdHistory className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Último Pedido</p>
                  <p className="text-gray-800">{new Date(customer.lastVisit ?? '').toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MdShoppingBag className="text-gray-400 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Total de Pedidos</p>
                  <p className="text-gray-800">{customer.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">Observações</p>
              <p className="text-gray-800 mt-1">{customer.notes || 'Nenhuma observação registrada.'}</p>
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-800">{customer.totalOrders}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Contratos Ativos</p>
                <p className="text-2xl font-bold text-gray-800">
                  {customer.contracts?.filter(c => !c.status || c.status !== 'expired').length || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Último Pedido</p>
                <p className="text-gray-800">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-semibold ${customer.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {customer.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Histórico de Pedidos</h2>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              onClick={() => navigate('/stores/orders/create', { state: { customerId: customer.id } })}
            >
              Novo Pedido
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID do Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Concluído' : 
                         order.status === 'processing' ? 'Em Processamento' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/stores/orders/${order.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {(!customer.orders || customer.orders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'contracts' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Contratos</h2>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
              onClick={() => navigate('/stores/contracts/create', { state: { customerId: customer.id } })}
            >
              Novo Contrato
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Início
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.contracts?.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contract.startDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {contract.value.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contract.status === 'expired' ? 'bg-red-100 text-red-800' : 
                        new Date(contract.endDate) < new Date() ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {contract.status === 'expired' ? 'Expirado' : 
                         new Date(contract.endDate) < new Date() ? 'Expirado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/stores/contracts/${contract.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {(!customer.contracts || customer.contracts.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum contrato encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
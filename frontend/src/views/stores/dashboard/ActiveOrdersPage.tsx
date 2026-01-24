import React, { useState } from 'react';
import {
  MdLocalLaundryService,
  MdSearch,
  MdFilterList,
  MdSort,
  MdRefresh,
  MdPerson,
  MdLocationOn,
  MdAccessTime,
  MdDoNotDisturb,
  MdPlayArrow,
  MdPause,
  MdDone,
  MdCheck
} from 'react-icons/md';

// Mock data for active orders
const activeOrders = [
  {
    id: 1,
    customer: 'Hotel Panorama',
    customerType: 'Premium',
    items: [
      { id: 101, name: 'Lavagem Completa', quantity: 25, unit: 'kg' },
      { id: 102, name: 'Passadoria', quantity: 15, unit: 'peças' }
    ],
    status: 'in_progress',
    priority: 'high',
    startTime: '2023-10-01T09:15:00',
    estimatedFinish: '2023-10-01T14:30:00',
    machineId: 'M102',
    assignedTo: 'Carlos Silva',
    notes: 'Cliente exige cuidado especial com toalhas de mesa'
  },
  {
    id: 2,
    customer: 'Restaurante Sabor & Arte',
    customerType: 'Standard',
    items: [
      { id: 103, name: 'Lavagem de Uniformes', quantity: 12, unit: 'peças' },
      { id: 104, name: 'Lavagem de Toalhas', quantity: 8, unit: 'peças' }
    ],
    status: 'queued',
    priority: 'normal',
    startTime: null,
    estimatedFinish: '2023-10-01T16:45:00',
    machineId: null,
    assignedTo: 'Ana Santos',
    notes: ''
  },
  {
    id: 3,
    customer: 'Hospital Santa Cruz',
    customerType: 'Premium',
    items: [
      { id: 105, name: 'Lavagem Hospitalar', quantity: 30, unit: 'kg' },
      { id: 106, name: 'Esterilização', quantity: 20, unit: 'peças' }
    ],
    status: 'in_progress',
    priority: 'urgent',
    startTime: '2023-10-01T10:30:00',
    estimatedFinish: '2023-10-01T13:00:00',
    machineId: 'M101',
    assignedTo: 'Ricardo Martins',
    notes: 'Materiais precisam de esterilização especial'
  },
  {
    id: 4,
    customer: 'Pousada Mar Azul',
    customerType: 'Standard',
    items: [
      { id: 107, name: 'Lavagem de Roupas de Cama', quantity: 18, unit: 'peças' },
      { id: 108, name: 'Lavagem de Toalhas', quantity: 24, unit: 'peças' }
    ],
    status: 'paused',
    priority: 'normal',
    startTime: '2023-10-01T08:45:00',
    estimatedFinish: '2023-10-01T15:15:00',
    machineId: 'M103',
    assignedTo: 'Juliana Costa',
    notes: 'Pausado por falta de material'
  },
  {
    id: 5,
    customer: 'Academia FitPro',
    customerType: 'Economy',
    items: [
      { id: 109, name: 'Lavagem de Toalhas', quantity: 40, unit: 'peças' }
    ],
    status: 'queued',
    priority: 'low',
    startTime: null,
    estimatedFinish: '2023-10-01T18:00:00',
    machineId: null,
    assignedTo: 'Carlos Silva',
    notes: ''
  }
];

// Format date/time
const formatTime = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Calculate remaining time in minutes
const getRemainingTime = (estimatedFinish: string) => {
  const now = new Date();
  const finish = new Date(estimatedFinish);
  const diffMs = finish.getTime() - now.getTime();
  return Math.round(diffMs / 60000); // Convert to minutes
};

const ActiveOrdersPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  
  // Filter and search orders
  const filteredOrders = activeOrders.filter(order => {
    // Apply status filter
    if (filter !== 'all' && order.status !== filter) {
      return false;
    }
    
    // Apply search
    if (searchTerm && !order.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (sortBy === 'priority') {
      const priorityWeight = { urgent: 3, high: 2, normal: 1, low: 0 };
      return priorityWeight[b.priority as keyof typeof priorityWeight] - priorityWeight[a.priority as keyof typeof priorityWeight];
    } else if (sortBy === 'time') {
      if (!a.estimatedFinish) return 1;
      if (!b.estimatedFinish) return -1;
      return new Date(a.estimatedFinish).getTime() - new Date(b.estimatedFinish).getTime();
    } else {
      return a.id - b.id;
    }
  });
  
  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'queued':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
            <MdAccessTime className="mr-1" /> Na Fila
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
            <MdPlayArrow className="mr-1" /> Em Progresso
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium flex items-center">
            <MdPause className="mr-1" /> Pausado
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
            <MdDone className="mr-1" /> Concluído
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
            <MdDoNotDisturb className="mr-1" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'urgent':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Urgente</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Alta</span>;
      case 'normal':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Normal</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Baixa</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{priority}</span>;
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pedidos Ativos</h1>
        <p className="text-gray-600 mt-1">Monitoramento em tempo real de todos os pedidos em andamento</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Total de Pedidos</p>
            <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs font-medium">{activeOrders.length}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">5 Pedidos</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Em Progresso</p>
            <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-xs font-medium">
              {activeOrders.filter(order => order.status === 'in_progress').length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">2 Pedidos</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Na Fila</p>
            <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full text-xs font-medium">
              {activeOrders.filter(order => order.status === 'queued').length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">2 Pedidos</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Pausado</p>
            <span className="bg-gray-100 text-gray-800 px-2 rounded-full text-xs font-medium">
              {activeOrders.filter(order => order.status === 'paused').length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">1 Pedido</h3>
        </div>
      </div>
      
      {/* Filter and Search */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('in_progress')}
            >
              Em Progresso
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'queued' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('queued')}
            >
              Na Fila
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'paused' ? 'bg-gray-50 text-gray-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('paused')}
            >
              Pausado
            </button>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="priority">Ordenar por Prioridade</option>
                <option value="time">Ordenar por Tempo</option>
                <option value="id">Ordenar por ID</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <MdSort />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Pedidos Ativos</h2>
          <button className="text-blue-600 flex items-center text-sm">
            <MdRefresh className="mr-1" /> Atualizar
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const remainingMinutes = order.estimatedFinish ? getRemainingTime(order.estimatedFinish) : null;
            
            return (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="bg-blue-50 rounded-full p-2 mr-3">
                      <MdLocalLaundryService className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center">
                        Pedido #{order.id} 
                        <span className="mx-2">•</span> 
                        {order.customer}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MdPerson className="mr-1" /> {order.assignedTo || 'Não atribuído'}
                        {order.machineId && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Máquina: {order.machineId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(order.status)}
                    {getPriorityBadge(order.priority)}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Itens do Pedido:</h4>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-gray-600 flex items-center">
                        <MdCheck className="mr-1 text-green-500" />
                        {item.quantity} {item.unit} - {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500 mb-2 md:mb-0">
                    <MdAccessTime className="mr-1" />
                    {order.startTime ? (
                      <span>
                        Iniciado às {formatTime(order.startTime)} • 
                        Previsão de término: {formatTime(order.estimatedFinish)}
                      </span>
                    ) : (
                      <span>Não iniciado • Previsão de término: {formatTime(order.estimatedFinish)}</span>
                    )}
                  </div>
                  
                  {remainingMinutes !== null && remainingMinutes > 0 && (
                    <div className={`font-medium ${
                      remainingMinutes < 30 ? 'text-red-600' : 
                      remainingMinutes < 60 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {Math.floor(remainingMinutes / 60) > 0 ? `${Math.floor(remainingMinutes / 60)}h ` : ''}
                      {remainingMinutes % 60}min restantes
                    </div>
                  )}
                  
                  {remainingMinutes !== null && remainingMinutes <= 0 && (
                    <div className="font-medium text-red-600">
                      Atrasado
                    </div>
                  )}
                </div>
                
                {order.notes && (
                  <div className="mt-3 text-sm text-gray-500 italic">
                    <span className="font-medium">Observações:</span> {order.notes}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              Nenhum pedido encontrado com os critérios selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveOrdersPage; 
import React, { useState } from 'react';
import {
  MdAttachMoney,
  MdFilterList,
  MdSearch,
  MdRefresh,
  MdWarning,
  MdAccessTime,
  MdCheckCircle,
  MdHourglassEmpty,
  MdPerson
} from 'react-icons/md';

// Mock data for receivables
const receivablesData = {
  summary: {
    totalReceivables: 83750.25,
    overdue: 12450.75,
    dueThisWeek: 24300.50,
    dueNextWeek: 19500.00,
    dueLater: 27499.00
  },
  receivables: [
    {
      id: 1,
      client: 'Hotel Panorama',
      invoice: 'INV-2023-0854',
      amount: 12450.75,
      issueDate: '2023-08-15',
      dueDate: '2023-09-15',
      status: 'overdue',
      daysOverdue: 20
    },
    {
      id: 2,
      client: 'Restaurante Sabor & Arte',
      invoice: 'INV-2023-0876',
      amount: 8760.50,
      issueDate: '2023-09-01',
      dueDate: '2023-10-01',
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: 3,
      client: 'Hospital Santa Cruz',
      invoice: 'INV-2023-0889',
      amount: 15540.00,
      issueDate: '2023-09-05',
      dueDate: '2023-10-05',
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: 4,
      client: 'Pousada Mar Azul',
      invoice: 'INV-2023-0912',
      amount: 9300.00,
      issueDate: '2023-09-10',
      dueDate: '2023-10-10',
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: 5,
      client: 'Hotel Panorama',
      invoice: 'INV-2023-0925',
      amount: 13700.50,
      issueDate: '2023-09-15',
      dueDate: '2023-10-15',
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: 6,
      client: 'Restaurante Sabor & Arte',
      invoice: 'INV-2023-0940',
      amount: 5800.00,
      issueDate: '2023-09-20',
      dueDate: '2023-10-20',
      status: 'pending',
      daysOverdue: 0
    },
    {
      id: 7,
      client: 'Hospital Santa Cruz',
      invoice: 'INV-2023-0952',
      amount: 18200.50,
      issueDate: '2023-09-25',
      dueDate: '2023-10-25',
      status: 'pending',
      daysOverdue: 0
    }
  ]
};

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

const ReceivablesPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter and search receivables
  const filteredReceivables = receivablesData.receivables.filter(receivable => {
    // Apply status filter
    if (filter !== 'all' && receivable.status !== filter) {
      return false;
    }
    
    // Apply search
    if (searchTerm && !receivable.client.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get status badge based on status
  const getStatusBadge = (status: string, daysOverdue: number) => {
    switch(status) {
      case 'overdue':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
            <MdWarning className="mr-1" /> {daysOverdue} dias em atraso
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
            <MdAccessTime className="mr-1" /> Pendente
          </span>
        );
      case 'paid':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
            <MdCheckCircle className="mr-1" /> Pago
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
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Contas a Receber</h1>
        <p className="text-gray-600 mt-1">Gerencie seus recebimentos pendentes e monitore pagamentos em atraso</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Total a Receber</p>
          <h3 className="text-xl font-bold text-gray-800">{formatCurrency(receivablesData.summary.totalReceivables)}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-red-500">Em Atraso</p>
          <h3 className="text-xl font-bold text-red-600">{formatCurrency(receivablesData.summary.overdue)}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-yellow-500">Vence Esta Semana</p>
          <h3 className="text-xl font-bold text-yellow-600">{formatCurrency(receivablesData.summary.dueThisWeek)}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-blue-500">Vence Próxima Semana</p>
          <h3 className="text-xl font-bold text-blue-600">{formatCurrency(receivablesData.summary.dueNextWeek)}</h3>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-green-500">Vence Depois</p>
          <h3 className="text-xl font-bold text-green-600">{formatCurrency(receivablesData.summary.dueLater)}</h3>
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
              className={`px-4 py-2 rounded-md text-sm ${filter === 'overdue' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('overdue')}
            >
              Em Atraso
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Receivables Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Faturas a Receber</h2>
          <button className="text-blue-600 flex items-center text-sm">
            <MdRefresh className="mr-1" /> Atualizar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emissão
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReceivables.map((receivable) => (
                <tr key={receivable.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <MdPerson className="text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{receivable.client}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {receivable.invoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(receivable.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(receivable.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(receivable.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(receivable.status, receivable.daysOverdue)}
                  </td>
                </tr>
              ))}
              
              {filteredReceivables.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma fatura encontrada com os critérios selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-right">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            <MdAttachMoney className="inline-block mr-1" /> Registrar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesPage; 
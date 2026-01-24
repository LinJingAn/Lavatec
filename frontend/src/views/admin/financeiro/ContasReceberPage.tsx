import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdAttachMoney, 
  MdNotifications, 
  MdFilterList,
  MdSearch,
  MdFileDownload,
  MdRefresh
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSidebar } from '@/contexts/SidebarContext';
import { FinancialService, AccountReceivable } from '@/services';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Default mock data for fallback
const defaultInvoices = [
  {
    id: 1,
    customerName: 'John Doe',
    invoiceNumber: 'INV-2024-001',
    amount: 1500.00,
    dueDate: '2024-04-15',
    status: 'pending',
    aging: 0,
    partialPayments: []
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    invoiceNumber: 'INV-2024-002',
    amount: 2500.00,
    dueDate: '2024-03-20',
    status: 'overdue',
    aging: 15,
    partialPayments: [
      { date: '2024-03-25', amount: 1000.00 }
    ]
  },
  {
    id: 3,
    customerName: 'Acme Corp',
    invoiceNumber: 'INV-2024-003',
    amount: 3500.00,
    dueDate: '2024-04-01',
    status: 'paid',
    aging: 0,
    partialPayments: [
      { date: '2024-03-28', amount: 2000.00 },
      { date: '2024-04-01', amount: 1500.00 }
    ]
  }
];

const ContasReceberPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts receivable from API
  const fetchAccountsReceivable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await FinancialService.getAccountsReceivable();
      if (response.accounts && response.accounts.length > 0) {
        // Transform API data to match component format
        const transformedInvoices = response.accounts.map((account: AccountReceivable, index: number) => ({
          id: index + 1,
          customerName: account.customer_name || 'Cliente',
          invoiceNumber: account.invoice_id || `INV-${account.id.substring(0, 8)}`,
          amount: account.amount,
          dueDate: account.due_date,
          status: account.status,
          aging: account.status === 'overdue' 
            ? Math.floor((Date.now() - new Date(account.due_date).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
          partialPayments: []
        }));
        setInvoices(transformedInvoices);
      }
    } catch (err: any) {
      console.error('Error fetching accounts receivable:', err);
      setError(err.message || 'Erro ao carregar contas a receber');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountsReceivable();
  }, [fetchAccountsReceivable]);

  // Invoice data (from API or default)
  const [invoices, setInvoices] = useState(defaultInvoices.map(inv => ({...inv})) as typeof defaultInvoices);

  // Legacy mock data kept for backwards compatibility (unused, kept for reference)
  const _legacyMockData = [
    {
      id: 1,
      customerName: 'John Doe',
      invoiceNumber: 'INV-2024-001',
      amount: 1500.00,
      dueDate: '2024-04-15',
      status: 'pending',
      aging: 0,
      partialPayments: [] as { date: string; amount: number }[]
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      invoiceNumber: 'INV-2024-002',
      amount: 2500.00,
      dueDate: '2024-03-20',
      status: 'overdue',
      aging: 15,
      partialPayments: [
        { date: '2024-03-25', amount: 1000.00 }
      ]
    },
    {
      id: 3,
      customerName: 'Acme Corp',
      invoiceNumber: 'INV-2024-003',
      amount: 3500.00,
      dueDate: '2024-04-01',
      status: 'paid',
      aging: 0,
      partialPayments: [
        { date: '2024-03-28', amount: 2000.00 },
        { date: '2024-04-01', amount: 1500.00 }
      ]
    }
  ];

  const [agingReport, setAgingReport] = useState([
    { range: '0-30 days', amount: 50000.00, count: 25 },
    { range: '31-60 days', amount: 25000.00, count: 15 },
    { range: '61-90 days', amount: 15000.00, count: 8 },
    { range: '>90 days', amount: 10000.00, count: 5 }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'overdue',
      customerName: 'Jane Smith',
      invoiceNumber: 'INV-2024-002',
      daysOverdue: 15,
      amount: 1500.00
    },
    {
      id: 2,
      type: 'upcoming',
      customerName: 'John Doe',
      invoiceNumber: 'INV-2024-001',
      daysUntilDue: 5,
      amount: 1500.00
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    aging: 'all',
    search: ''
  });

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    navigate('/admin/financeiro');
  };

  const handleAddPayment = (invoiceId: number) => {
    // In a real app, this would open a payment modal
    console.log('Add payment for invoice:', invoiceId);
  };

  const handleEditInvoice = (invoiceId: number) => {
    // In a real app, this would open an edit modal
    console.log('Edit invoice:', invoiceId);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filters.status !== 'all' && invoice.status !== filters.status) return false;
    if (filters.aging !== 'all') {
      if (filters.aging === 'overdue' && invoice.aging <= 0) return false;
      if (filters.aging === 'upcoming' && invoice.aging > 0) return false;
    }
    if (filters.search && !invoice.customerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToFinanceiro}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Contas a Receber</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie suas contas a receber e acompanhe o status dos pagamentos
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button>
            <MdFileDownload className="mr-2" size={20} />
            Exportar
          </Button>
          <Button>
            <MdAdd className="mr-2" size={20} />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              R$ {invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              R$ {invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">A Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              R$ {invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              R$ {invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Report Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Relatório de Envelhecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Valor (R$)" />
                <Bar dataKey="count" fill="#82ca9d" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Em Atraso</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Envelhecimento</label>
              <Select
                value={filters.aging}
                onValueChange={(value) => handleFilterChange('aging', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="overdue">Em Atraso</SelectItem>
                  <SelectItem value="upcoming">A Vencer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Cliente</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Nome do cliente..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Pago' : invoice.status === 'overdue' ? 'Em Atraso' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAddPayment(invoice.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdAttachMoney size={20} />
                      </button>
                      <button
                        onClick={() => handleEditInvoice(invoice.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.customerName}</h3>
                    <p className="text-sm text-gray-600">{notification.invoiceNumber}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    notification.type === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {notification.type === 'overdue' 
                      ? `${notification.daysOverdue} dias em atraso`
                      : `Vence em ${notification.daysUntilDue} dias`}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>Valor: R$ {notification.amount.toFixed(2)}</span>
                  <button className="text-blue-600 hover:text-blue-900">
                    Enviar Lembrete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContasReceberPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
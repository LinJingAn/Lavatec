import React, { useState } from 'react';
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
  MdCheckCircle,
  MdPendingActions,
  MdCategory
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSidebar } from '@/contexts/SidebarContext';

const ContasPagarPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();
  
  // Mock data for demonstration
  const [bills, setBills] = useState([
    {
      id: 1,
      vendorName: 'Fornecedor A',
      billNumber: 'FAT-2024-001',
      amount: 1500.00,
      dueDate: '2024-04-15',
      status: 'pending',
      category: 'Materiais',
      approvalStatus: 'approved',
      paymentStatus: 'scheduled',
      paymentDate: '2024-04-10'
    },
    {
      id: 2,
      vendorName: 'Fornecedor B',
      billNumber: 'FAT-2024-002',
      amount: 2500.00,
      dueDate: '2024-03-20',
      status: 'overdue',
      category: 'Serviços',
      approvalStatus: 'approved',
      paymentStatus: 'pending',
      paymentDate: null
    },
    {
      id: 3,
      vendorName: 'Fornecedor C',
      billNumber: 'FAT-2024-003',
      amount: 3500.00,
      dueDate: '2024-04-01',
      status: 'paid',
      category: 'Equipamentos',
      approvalStatus: 'approved',
      paymentStatus: 'paid',
      paymentDate: '2024-03-28'
    }
  ]);

  const [expenseReport, setExpenseReport] = useState([
    { category: 'Materiais', amount: 50000.00, count: 25 },
    { category: 'Serviços', amount: 25000.00, count: 15 },
    { category: 'Equipamentos', amount: 15000.00, count: 8 },
    { category: 'Outros', amount: 10000.00, count: 5 }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'overdue',
      vendorName: 'Fornecedor B',
      billNumber: 'FAT-2024-002',
      daysOverdue: 15,
      amount: 2500.00
    },
    {
      id: 2,
      type: 'upcoming',
      vendorName: 'Fornecedor A',
      billNumber: 'FAT-2024-001',
      daysUntilDue: 5,
      amount: 1500.00
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    approvalStatus: 'all',
    search: ''
  });

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    navigate('/admin/financeiro');
  };

  const handleAddBill = () => {
    // In a real app, this would open a bill entry modal
    console.log('Add new bill');
  };

  const handleEditBill = (billId: number) => {
    // In a real app, this would open an edit modal
    console.log('Edit bill:', billId);
  };

  const handleDeleteBill = (billId: number) => {
    setBills(bills.filter(bill => bill.id !== billId));
  };

  const handleApproveBill = (billId: number) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, approvalStatus: 'approved' }
        : bill
    ));
  };

  const handleSchedulePayment = (billId: number) => {
    // In a real app, this would open a payment scheduling modal
    console.log('Schedule payment for bill:', billId);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredBills = bills.filter(bill => {
    if (filters.status !== 'all' && bill.status !== filters.status) return false;
    if (filters.category !== 'all' && bill.category !== filters.category) return false;
    if (filters.approvalStatus !== 'all' && bill.approvalStatus !== filters.approvalStatus) return false;
    if (filters.search && !bill.vendorName.toLowerCase().includes(filters.search.toLowerCase())) return false;
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
            <h1 className="text-2xl font-semibold">Contas a Pagar</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie suas contas a pagar e acompanhe o status dos pagamentos
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button>
            <MdFileDownload className="mr-2" size={20} />
            Exportar
          </Button>
          <Button onClick={handleAddBill}>
            <MdAdd className="mr-2" size={20} />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              R$ {bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              R$ {bills.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">A Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              R$ {bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              R$ {bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Report Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Relatório de Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
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
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="overdue">Em Atraso</option>
                <option value="paid">Pago</option>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="Materiais">Materiais</option>
                <option value="Serviços">Serviços</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Outros">Outros</option>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Aprovação</label>
              <Select
                value={filters.approvalStatus}
                onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Fornecedor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Nome do fornecedor..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
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
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {bill.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {bill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : bill.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status === 'paid' ? 'Pago' : bill.status === 'overdue' ? 'Em Atraso' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {bill.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproveBill(bill.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          <MdCheckCircle size={20} />
                        </button>
                      )}
                      {bill.status !== 'paid' && (
                        <button
                          onClick={() => handleSchedulePayment(bill.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <MdPendingActions size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditBill(bill.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
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
                    <h3 className="font-medium">{notification.vendorName}</h3>
                    <p className="text-sm text-gray-600">{notification.billNumber}</p>
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
                    Agendar Pagamento
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

export default ContasPagarPage; 
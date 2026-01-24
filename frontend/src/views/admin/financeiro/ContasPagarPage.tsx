import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch,
  MdFileDownload,
  MdCheckCircle,
  MdPendingActions,
  MdError
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSidebar } from '@/contexts/SidebarContext';
import { FinancialService, AccountPayable, FinancialCategory } from '@/services';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const ContasPagarPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();
  
  const [bills, setBills] = useState<AccountPayable[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // Calculate summary values
  const totalToPay = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdue = bills.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0);
  const pending = bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const paid = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

  // Generate expense report by category
  const expenseReport = categories.map(cat => ({
    category: cat.name,
    amount: bills.filter(b => b.category_id === cat.id).reduce((sum, b) => sum + b.amount, 0),
    count: bills.filter(b => b.category_id === cat.id).length
  })).filter(item => item.amount > 0);

  // Get notifications (overdue and upcoming)
  const notifications = [
    ...bills.filter(b => b.status === 'overdue').map(b => ({
      id: b.id,
      type: 'overdue' as const,
      vendorName: b.vendor_name || 'N/A',
      billNumber: b.description || b.id,
      daysOverdue: Math.floor((new Date().getTime() - new Date(b.due_date).getTime()) / (1000 * 60 * 60 * 24)),
      amount: b.amount
    })),
    ...bills.filter(b => {
      if (b.status !== 'pending') return false;
      const daysUntil = Math.floor((new Date(b.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil > 0;
    }).map(b => ({
      id: b.id,
      type: 'upcoming' as const,
      vendorName: b.vendor_name || 'N/A',
      billNumber: b.description || b.id,
      daysUntilDue: Math.floor((new Date(b.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      amount: b.amount
    }))
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [billsResult, categoriesResult] = await Promise.all([
        FinancialService.getAccountsPayable({
          status: filters.status !== 'all' ? filters.status as any : undefined,
          category_id: filters.category !== 'all' ? filters.category : undefined
        }),
        FinancialService.getCategories('expense')
      ]);
      
      setBills(billsResult.accounts || []);
      setCategories(categoriesResult.categories || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar contas a pagar. Verifique a conexão com o servidor.');
      setBills([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    navigate('/admin/financeiro');
  };

  const handleAddBill = () => {
    console.log('Add new bill');
  };

  const handleEditBill = (billId: string) => {
    console.log('Edit bill:', billId);
  };

  const handleDeleteBill = async (billId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta?')) return;
    
    try {
      await FinancialService.deleteAccountPayable(billId);
      setBills(bills.filter(bill => bill.id !== billId));
    } catch (err) {
      console.error('Error deleting bill:', err);
      alert('Erro ao excluir conta');
    }
  };

  const handleMarkAsPaid = async (billId: string) => {
    try {
      await FinancialService.updateAccountPayable(billId, { status: 'paid', paid_date: new Date().toISOString() });
      fetchData();
    } catch (err) {
      console.error('Error marking as paid:', err);
      alert('Erro ao marcar como pago');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredBills = bills.filter(bill => {
    if (filters.search && !bill.vendor_name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !bill.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToFinanceiro}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition duration-200"
          >
            <MdArrowBack className="text-gray-600 dark:text-gray-400" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Contas a Pagar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas contas a pagar e acompanhe o status dos pagamentos
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <MdFileDownload className="mr-2" size={20} />
            Exportar
          </Button>
          <Button onClick={handleAddBill}>
            <MdAdd className="mr-2" size={20} />
            Nova Conta
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Total a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalToPay)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(overdue)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">A Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatCurrency(pending)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(paid)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Report Chart */}
      {expenseReport.length > 0 && (
        <Card className="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Relatório de Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#10b981" name="Valor (R$)" />
                  <Bar dataKey="count" fill="#6366f1" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Fornecedor ou descrição..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fornecedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredBills.length > 0 ? (
                    filteredBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          {bill.vendor_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {bill.description || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          {formatCurrency(bill.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {new Date(bill.due_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bill.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : bill.status === 'overdue'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {bill.status === 'paid' ? 'Pago' : bill.status === 'overdue' ? 'Em Atraso' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {bill.status !== 'paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(bill.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                              title="Marcar como pago"
                            >
                              <MdCheckCircle size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditBill(bill.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        {error ? 'Erro ao carregar dados.' : 'Nenhuma conta a pagar encontrada.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="mt-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700 dark:text-gray-300">Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{notification.vendorName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{notification.billNumber}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      notification.type === 'overdue' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {notification.type === 'overdue' 
                        ? `${notification.daysOverdue} dias em atraso`
                        : `Vence em ${notification.daysUntilDue} dias`}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Valor: {formatCurrency(notification.amount)}</span>
                    <button 
                      onClick={() => handleMarkAsPaid(notification.id)}
                      className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400"
                    >
                      Marcar como Pago
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContasPagarPage;

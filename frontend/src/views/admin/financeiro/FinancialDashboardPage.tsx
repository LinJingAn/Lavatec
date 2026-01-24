import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAttachMoney, 
  MdTrendingUp, 
  MdTrendingDown,
  MdAccountBalance,
  MdShowChart,
  MdPieChart,
  MdBarChart
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useSidebar } from '@/contexts/SidebarContext';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const FinancialDashboardPage = () => {
  const navigate = useNavigate();
  const { closeSecondarySidebar } = useSidebar();
  
  // Mock data for demonstration
  const [cashFlowData] = useState([
    { month: 'Jan', income: 50000, expenses: 35000 },
    { month: 'Fev', income: 55000, expenses: 38000 },
    { month: 'Mar', income: 60000, expenses: 40000 },
    { month: 'Abr', income: 65000, expenses: 42000 },
    { month: 'Mai', income: 70000, expenses: 45000 },
    { month: 'Jun', income: 75000, expenses: 48000 }
  ]);

  const [accountsReceivable] = useState({
    total: 150000,
    overdue: 25000,
    pending: 75000,
    paid: 50000
  });

  const [accountsPayable] = useState({
    total: 100000,
    overdue: 15000,
    pending: 45000,
    paid: 40000
  });

  const [profitLoss] = useState({
    revenue: 450000,
    expenses: 300000,
    profit: 150000,
    margin: 33.33
  });

  const [revenueTrend] = useState([
    { month: 'Jan', revenue: 50000, growth: 0 },
    { month: 'Fev', revenue: 55000, growth: 10 },
    { month: 'Mar', revenue: 60000, growth: 9.1 },
    { month: 'Abr', revenue: 65000, growth: 8.3 },
    { month: 'Mai', revenue: 70000, growth: 7.7 },
    { month: 'Jun', revenue: 75000, growth: 7.1 }
  ]);

  const [expenseBreakdown] = useState([
    { name: 'Materiais', value: 120000 },
    { name: 'Serviços', value: 80000 },
    { name: 'Equipamentos', value: 60000 },
    { name: 'Outros', value: 40000 }
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleBackToFinanceiro = () => {
    closeSecondarySidebar();
    console.log('Navigating back to financeiro main page');
    navigate('/admin/financeiro');
  };

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
            <h1 className="text-2xl font-semibold">Dashboard Financeiro</h1>
            <p className="text-sm text-gray-600 mt-1">
              Visão geral do desempenho financeiro da empresa
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Select defaultValue="last6months">
            <option value="last6months">Últimos 6 meses</option>
            <option value="last3months">Últimos 3 meses</option>
            <option value="lastmonth">Último mês</option>
            <option value="thisyear">Este ano</option>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MdTrendingUp className="text-green-600 mr-2" size={24} />
              <p className="text-3xl font-bold text-green-600">
                R$ {profitLoss.revenue.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              +15% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MdAttachMoney className="text-blue-600 mr-2" size={24} />
              <p className="text-3xl font-bold text-blue-600">
                R$ {profitLoss.profit.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Margem: {profitLoss.margin}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contas a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MdAccountBalance className="text-yellow-600 mr-2" size={24} />
              <p className="text-3xl font-bold text-yellow-600">
                R$ {accountsReceivable.total.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {accountsReceivable.overdue > 0 ? `${accountsReceivable.overdue.toLocaleString()} em atraso` : 'Sem atrasos'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contas a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MdTrendingDown className="text-red-600 mr-2" size={24} />
              <p className="text-3xl font-bold text-red-600">
                R$ {accountsPayable.total.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {accountsPayable.overdue > 0 ? `${accountsPayable.overdue.toLocaleString()} em atraso` : 'Sem atrasos'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Receita" />
                <Bar dataKey="expenses" fill="#F44336" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4CAF50" name="Receita" />
                  <Line type="monotone" dataKey="growth" stroke="#2196F3" name="Crescimento (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounts Receivable Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes de Contas a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total a Receber</span>
                <span className="font-medium">R$ {accountsReceivable.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Em Atraso</span>
                <span className="text-red-600 font-medium">R$ {accountsReceivable.overdue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendentes</span>
                <span className="text-yellow-600 font-medium">R$ {accountsReceivable.pending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recebidos</span>
                <span className="text-green-600 font-medium">R$ {accountsReceivable.paid.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Payable Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes de Contas a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total a Pagar</span>
                <span className="font-medium">R$ {accountsPayable.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Em Atraso</span>
                <span className="text-red-600 font-medium">R$ {accountsPayable.overdue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendentes</span>
                <span className="text-yellow-600 font-medium">R$ {accountsPayable.pending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pagas</span>
                <span className="text-green-600 font-medium">R$ {accountsPayable.paid.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboardPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
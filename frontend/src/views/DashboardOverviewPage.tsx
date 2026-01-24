import React, { useState, useEffect, useCallback } from 'react';
import { MdTrendingUp, MdShoppingCart, MdLocalLaundryService, MdPeople, MdRefresh } from 'react-icons/md';
import { DashboardService, AdminService, OverviewDashboard } from '../services';

// Default mock data for company and branches (fallback)
const defaultCompanyData = {
  name: 'Lavatec',
  founded: '2018',
  headquarters: 'São Paulo, Brazil',
  ceo: 'Carlos Silva',
  employees: 128,
  website: 'www.lavatec.com.br'
};

const defaultBranchesData = [
  { id: 1, name: 'Lavatec São Paulo - Centro', address: 'Rua Augusta, 1500', city: 'São Paulo', phone: '(11) 3456-7890', manager: 'Ana Oliveira', active: true },
  { id: 2, name: 'Lavatec Rio de Janeiro', address: 'Av. Atlântica, 500', city: 'Rio de Janeiro', phone: '(21) 3456-7890', manager: 'Pedro Santos', active: true },
  { id: 3, name: 'Lavatec Belo Horizonte', address: 'Av. Afonso Pena, 2000', city: 'Belo Horizonte', phone: '(31) 3456-7890', manager: 'Camila Rocha', active: true },
  { id: 4, name: 'Lavatec Brasília', address: 'SQN 104, Bloco A', city: 'Brasília', phone: '(61) 3456-7890', manager: 'Rodrigo Mendes', active: false },
];

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
    <div className="flex flex-col">
      <span className="text-slate-600 dark:text-slate-400 text-sm mb-2">{title}</span>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</span>
          <div className="text-emerald-500 text-sm mt-2">{trend}</div>
        </div>
        <div className="text-emerald-500 dark:text-emerald-400">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const DashboardOverviewPage = () => {
  const [branches, setBranches] = useState(defaultBranchesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBranchId, setEditBranchId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    manager: '',
    active: true
  });
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<OverviewDashboard | null>(null);

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, branchesData] = await Promise.all([
        DashboardService.getOverviewDashboard(),
        AdminService.getBranches()
      ]);
      
      setDashboardData(overviewData);
      
      // Transform branches data
      if (branchesData.branches && branchesData.branches.length > 0) {
        const transformedBranches = branchesData.branches.map((b, index) => ({
          id: index + 1,
          name: b.name,
          address: b.address || '',
          city: b.city || '',
          phone: b.phone || '',
          manager: b.manager_name || '',
          active: b.is_active !== false
        }));
        setBranches(transformedBranches);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Stats based on API data or defaults
  const stats = [
    {
      title: 'Receita Total',
      value: dashboardData ? formatCurrency(dashboardData.revenue?.month || 0) : 'R$ 28.450',
      trend: dashboardData && dashboardData.revenue?.growth 
        ? `${dashboardData.revenue.growth > 0 ? '↑' : '↓'} ${Math.abs(dashboardData.revenue.growth).toFixed(1)}% vs. mês anterior`
        : '↑ 12.6% vs. mês anterior',
      icon: <MdTrendingUp className="w-8 h-8" />
    },
    {
      title: 'Total de Pedidos',
      value: dashboardData?.totalOrders?.toString() || '243',
      trend: '↑ 8.2% vs. mês anterior',
      icon: <MdShoppingCart className="w-8 h-8" />
    },
    {
      title: 'Pedidos Ativos',
      value: dashboardData?.activeOrders?.toString() || '45',
      trend: '↑ 5.3% vs. mês anterior',
      icon: <MdLocalLaundryService className="w-8 h-8" />
    },
    {
      title: 'Concluídos Hoje',
      value: dashboardData?.completedToday?.toString() || '12',
      trend: '↑ 3.8% vs. ontem',
      icon: <MdPeople className="w-8 h-8" />
    }
  ];

  const services = dashboardData?.topServices?.slice(0, 2).map(s => ({
    name: s.service,
    value: s.revenue
  })) || [
    { name: 'Lavagem Rápida', value: 8240 },
    { name: 'Lavagem + Secagem', value: 6120 }
  ];

  const recentOrders = dashboardData?.recentOrders?.slice(0, 5).map((o: any) => ({
    id: `#${o.order_number || o.id}`,
    client: o.customer_name || 'Cliente',
    date: new Date(o.created_at).toLocaleDateString('pt-BR'),
    status: o.status === 'completed' ? 'Concluído' : o.status === 'processing' ? 'Em processamento' : o.status,
    value: o.total || 0
  })) || [
    { id: '#6745', client: 'Maria Silva', date: '18/05/2023', status: 'Concluído', value: 67.50 },
    { id: '#6744', client: 'João Santos', date: '18/05/2023', status: 'Em processamento', value: 42.00 }
  ];

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleAddBranch = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      phone: '',
      manager: '',
      active: true
    });
    setShowAddForm(true);
    setEditBranchId(null);
  };

  const handleEditBranch = (branch: typeof branchesData[0]) => {
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      manager: branch.manager,
      active: branch.active
    });
    setShowAddForm(true);
    setEditBranchId(branch.id);
  };

  const handleDeleteBranch = (id: number) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter(branch => branch.id !== id));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editBranchId) {
      // Update existing branch
      setBranches(branches.map(branch => 
        branch.id === editBranchId ? { ...branch, ...formData } : branch
      ));
    } else {
      // Add new branch
      const newBranch = {
        id: Math.max(...branches.map(b => b.id)) + 1,
        ...formData
      };
      setBranches([...branches, newBranch]);
    }
    
    setShowAddForm(false);
    setEditBranchId(null);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Visão Geral</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Services Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Serviços Mais Vendidos</h2>
        <div className="space-y-6">
          {services.map((service, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 dark:text-slate-300">{service.name}</span>
                <span className="text-slate-700 dark:text-slate-300">R$ {service.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(service.value / 8240) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Pedidos Recentes</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400">
              <th className="pb-4 font-medium">Pedido</th>
              <th className="pb-4 font-medium">Cliente</th>
              <th className="pb-4 font-medium">Data</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-4 text-slate-600 dark:text-slate-300">{order.id}</td>
                <td className="text-slate-600 dark:text-slate-300">{order.client}</td>
                <td className="text-slate-600 dark:text-slate-300">{order.date}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-sm inline-block
                    ${order.status === 'Concluído' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="text-right text-slate-600 dark:text-slate-300">R$ {order.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverviewPage; 
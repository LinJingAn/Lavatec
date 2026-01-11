import React, { useState } from 'react';
import { MdTrendingUp, MdShoppingCart, MdLocalLaundryService, MdPeople } from 'react-icons/md';

// Mock data for company and branches
const companyData = {
  name: 'Lavatec',
  founded: '2018',
  headquarters: 'São Paulo, Brazil',
  ceo: 'Carlos Silva',
  employees: 128,
  website: 'www.lavatec.com.br'
};

const branchesData = [
  { id: 1, name: 'Lavatec São Paulo - Centro', address: 'Rua Augusta, 1500', city: 'São Paulo', phone: '(11) 3456-7890', manager: 'Ana Oliveira', active: true },
  { id: 2, name: 'Lavatec Rio de Janeiro', address: 'Av. Atlântica, 500', city: 'Rio de Janeiro', phone: '(21) 3456-7890', manager: 'Pedro Santos', active: true },
  { id: 3, name: 'Lavatec Belo Horizonte', address: 'Av. Afonso Pena, 2000', city: 'Belo Horizonte', phone: '(31) 3456-7890', manager: 'Camila Rocha', active: true },
  { id: 4, name: 'Lavatec Brasília', address: 'SQN 104, Bloco A', city: 'Brasília', phone: '(61) 3456-7890', manager: 'Rodrigo Mendes', active: false },
];

const statisticsData = {
  totalRevenue: 'R$ 1.245.780',
  monthlyRevenue: 'R$ 156.450',
  totalOrders: '12.456',
  activeCustomers: '4.567',
  processedItems: '156.432',
  avgOrderValue: 'R$ 98,50'
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex flex-col">
      <span className="text-gray-600 text-sm mb-2">{title}</span>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-semibold">{value}</span>
          <div className="text-green-500 text-sm mt-2">{trend}</div>
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const DashboardOverviewPage = () => {
  const [branches, setBranches] = useState(branchesData);
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

  const stats = [
    {
      title: 'Receita Total',
      value: 'R$ 28.450',
      trend: '↑ 12.6% vs. mês anterior',
      icon: <MdTrendingUp className="w-8 h-8" />
    },
    {
      title: 'Total de Pedidos',
      value: '243',
      trend: '↑ 8.2% vs. mês anterior',
      icon: <MdShoppingCart className="w-8 h-8" />
    },
    {
      title: 'KG Processados',
      value: '1.245',
      trend: '↑ 5.3% vs. mês anterior',
      icon: <MdLocalLaundryService className="w-8 h-8" />
    },
    {
      title: 'Clientes Ativos',
      value: '189',
      trend: '↑ 3.8% vs. mês anterior',
      icon: <MdPeople className="w-8 h-8" />
    }
  ];

  const services = [
    { name: 'Lavagem Rápida', value: 8240 },
    { name: 'Lavagem + Secagem', value: 6120 }
  ];

  const recentOrders = [
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Visão Geral</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Services Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Serviços Mais Vendidos</h2>
        <div className="space-y-6">
          {services.map((service, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{service.name}</span>
                <span className="text-gray-700">R$ {service.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(service.value / 8240) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Pedidos Recentes</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-4 font-medium">Pedido</th>
              <th className="pb-4 font-medium">Cliente</th>
              <th className="pb-4 font-medium">Data</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="py-4 text-gray-600">{order.id}</td>
                <td className="text-gray-600">{order.client}</td>
                <td className="text-gray-600">{order.date}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-sm inline-block
                    ${order.status === 'Concluído' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="text-right text-gray-600">R$ {order.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverviewPage; 
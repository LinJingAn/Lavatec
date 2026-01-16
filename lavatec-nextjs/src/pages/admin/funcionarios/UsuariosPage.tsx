import React, { useState } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdCheck, 
  MdClose,
  MdArrowDropDown
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// Mock data for users
const mockUsers = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao.silva@lavatec.com', 
    role: 'admin', 
    department: 'Gestão',
    lastLogin: '2023-09-22T10:30:00',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Maria Santos', 
    email: 'maria.santos@lavatec.com', 
    role: 'manager', 
    department: 'Operações',
    lastLogin: '2023-09-21T14:45:00',
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Pedro Costa', 
    email: 'pedro.costa@lavatec.com', 
    role: 'staff', 
    department: 'Atendimento',
    lastLogin: '2023-09-20T09:15:00',
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Ana Pereira', 
    email: 'ana.pereira@lavatec.com', 
    role: 'manager', 
    department: 'Vendas',
    lastLogin: '2023-09-15T11:20:00',
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Carlos Oliveira', 
    email: 'carlos.oliveira@lavatec.com', 
    role: 'staff', 
    department: 'Manutenção',
    lastLogin: '2023-08-30T08:45:00',
    status: 'inactive'
  },
  { 
    id: 6, 
    name: 'Julia Ferreira', 
    email: 'julia.ferreira@lavatec.com', 
    role: 'staff', 
    department: 'Limpeza',
    lastLogin: '2023-09-18T15:30:00',
    status: 'active'
  },
  { 
    id: 7, 
    name: 'Roberto Almeida', 
    email: 'roberto.almeida@lavatec.com', 
    role: 'manager', 
    department: 'Finanças',
    lastLogin: '2023-09-10T13:10:00',
    status: 'inactive'
  },
];

// Role translation and styling
const getRoleBadge = (role: string) => {
  switch(role) {
    case 'admin':
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Administrador</span>;
    case 'manager':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Gerente</span>;
    case 'staff':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Colaborador</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{role}</span>;
  }
};

// Status badge
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'active':
      return <span className="flex items-center text-green-600"><MdCheck className="mr-1" /> Ativo</span>;
    case 'inactive':
      return <span className="flex items-center text-red-600"><MdClose className="mr-1" /> Inativo</span>;
    default:
      return <span className="text-gray-600">{status}</span>;
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const UsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique departments for filter
  const departments = [...new Set(mockUsers.map(user => user.department))];
  
  // Filter users based on search term and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });
  
  const handleCreateUser = () => {
    navigate('/team/create');
  };
  
  const handleEditUser = (id: number) => {
    navigate(`/team/edit/${id}`);
  };
  
  const handleViewUser = (id: number) => {
    navigate(`/team/view/${id}`);
  };
  
  const handleToggleStatus = (id: number, currentStatus: string) => {
    // In a real application, this would call an API
    console.log(`Toggling status for user ${id} from ${currentStatus} to ${currentStatus === 'active' ? 'inactive' : 'active'}`);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Funcionários</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={handleCreateUser}
        >
          <MdAdd /> Adicionar Funcionário
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar funcionários..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md gap-1 hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <MdFilterList className="text-gray-500" />
                Filtros
                <MdArrowDropDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Todos os cargos</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="staff">Colaborador</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">Todos os departamentos</option>
                  {departments.map((department, index) => (
                    <option key={index} value={department}>{department}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewUser(user.id)} 
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => handleEditUser(user.id)} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)} 
                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {user.status === 'active' ? <MdClose size={18} /> : <MdCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum funcionário encontrado com os critérios de busca.</p>
          </div>
        )}
        
        <div className="px-4 py-3 border-t">
          <p className="text-sm text-gray-500">
            Mostrando {filteredUsers.length} de {mockUsers.length} funcionários.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage; 
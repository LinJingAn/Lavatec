import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdAdd, 
  MdSearch, 
  MdFilterList, 
  MdEdit, 
  MdDelete, 
  MdEmail,
  MdBlock,
  MdMoreVert,
  MdRemoveRedEye,
  MdLock,
  MdArrowBack
} from 'react-icons/md';

// Mock data for employees
const MOCK_EMPLOYEES = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao.silva@lavatec.com.br', 
    role: 'Administrador',
    department: 'TI',
    status: 'active',
    lastLogin: '2023-10-01T14:23:00'
  },
  { 
    id: 2, 
    name: 'Maria Souza', 
    email: 'maria.souza@lavatec.com.br', 
    role: 'Gerente',
    department: 'Operações',
    status: 'active',
    lastLogin: '2023-10-05T08:15:00'
  },
  { 
    id: 3, 
    name: 'Carlos Ferreira', 
    email: 'carlos.ferreira@lavatec.com.br', 
    role: 'Supervisor',
    department: 'Lavanderia',
    status: 'active',
    lastLogin: '2023-10-02T10:45:00'
  },
  { 
    id: 4, 
    name: 'Ana Oliveira', 
    email: 'ana.oliveira@lavatec.com.br', 
    role: 'Operador',
    department: 'Lavanderia',
    status: 'inactive',
    lastLogin: '2023-09-15T16:30:00'
  },
  { 
    id: 5, 
    name: 'Paulo Santos', 
    email: 'paulo.santos@lavatec.com.br', 
    role: 'Técnico',
    department: 'Manutenção',
    status: 'active',
    lastLogin: '2023-10-03T12:10:00'
  },
  { 
    id: 6, 
    name: 'Juliana Lima', 
    email: 'juliana.lima@lavatec.com.br', 
    role: 'Analista',
    department: 'Administrativo',
    status: 'active',
    lastLogin: '2023-10-04T09:20:00'
  },
  { 
    id: 7, 
    name: 'Roberto Almeida', 
    email: 'roberto.almeida@lavatec.com.br', 
    role: 'Supervisor',
    department: 'Operações',
    status: 'active',
    lastLogin: '2023-09-30T11:05:00'
  },
  { 
    id: 8, 
    name: 'Fernanda Costa', 
    email: 'fernanda.costa@lavatec.com.br', 
    role: 'Recursos Humanos',
    department: 'Administrativo',
    status: 'inactive',
    lastLogin: '2023-09-10T14:50:00'
  },
  { 
    id: 9, 
    name: 'Ricardo Martins', 
    email: 'ricardo.martins@lavatec.com.br', 
    role: 'Gerente',
    department: 'Lavanderia',
    status: 'active',
    lastLogin: '2023-10-06T08:30:00'
  },
  { 
    id: 10, 
    name: 'Luiza Pereira', 
    email: 'luiza.pereira@lavatec.com.br', 
    role: 'Atendente',
    department: 'Administrativo',
    status: 'active',
    lastLogin: '2023-10-05T13:15:00'
  }
];

type Employee = typeof MOCK_EMPLOYEES[0];

const ListaFuncionariosPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: ''
  });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  
  // Fetch employees (simulated)
  useEffect(() => {
    const fetchEmployees = async () => {
      // Simulate API call
      setTimeout(() => {
        setEmployees(MOCK_EMPLOYEES);
        setFilteredEmployees(MOCK_EMPLOYEES);
        setIsLoading(false);
      }, 800);
    };
    
    fetchEmployees();
  }, []);
  
  // Handle search and filtering
  useEffect(() => {
    let result = [...employees];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        emp => 
          emp.name.toLowerCase().includes(term) || 
          emp.email.toLowerCase().includes(term) ||
          emp.role.toLowerCase().includes(term)
      );
    }
    
    // Apply filters
    if (filters.role) {
      result = result.filter(emp => emp.role === filters.role);
    }
    
    if (filters.department) {
      result = result.filter(emp => emp.department === filters.department);
    }
    
    if (filters.status) {
      result = result.filter(emp => emp.status === filters.status);
    }
    
    setFilteredEmployees(result);
  }, [searchTerm, employees, filters]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      status: ''
    });
    setSearchTerm('');
  };
  
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
  
  const handleAddEmployee = () => {
    navigate('/admin/funcionarios/novo');
  };
  
  const handleBackToMain = () => {
    navigate('/admin/funcionarios');
  };
  
  const handleViewEmployee = (id: number) => {
    navigate(`/admin/funcionarios/${id}`);
    setActiveDropdown(null);
  };
  
  const handleEditEmployee = (id: number) => {
    navigate(`/admin/funcionarios/${id}/editar`);
    setActiveDropdown(null);
  };
  
  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      // In a real app, make API call to delete
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(updatedEmployees);
      alert('Funcionário excluído com sucesso!');
    }
    setActiveDropdown(null);
  };
  
  const handleResetPassword = (id: number) => {
    if (window.confirm('Enviar email para redefinição de senha?')) {
      // In a real app, make API call to initiate password reset
      alert('Email de redefinição de senha enviado com sucesso!');
    }
    setActiveDropdown(null);
  };
  
  const handleSendEmail = (id: number) => {
    // In a real app, redirect to email compose page or show modal
    alert('Funcionalidade de envio de email será implementada em breve.');
    setActiveDropdown(null);
  };
  
  const handleToggleStatus = (id: number) => {
    // Find employee
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) return;
    
    const employee = employees[employeeIndex];
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
    // In a real app, make API call to update status
    const updatedEmployees = [...employees];
    updatedEmployees[employeeIndex] = {
      ...employee,
      status: newStatus
    };
    
    setEmployees(updatedEmployees);
    alert(`Status do funcionário alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}`);
    setActiveDropdown(null);
  };
  
  const toggleDropdown = (id: number) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };
  
  // Get unique values for filter dropdowns
  const roles = [...new Set(employees.map(emp => emp.role))];
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToMain}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Lista de Funcionários</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie e visualize todos os funcionários da empresa
            </p>
          </div>
        </div>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Novo Funcionário
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
          <div className="relative flex-grow md:max-w-md mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, email ou cargo..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-gray-900 mr-4"
            >
              <MdFilterList className="mr-1" size={20} />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
            
            {showFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <select
                name="role"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                name="department"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando funcionários...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo/Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{employee.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                        <div className="text-sm text-gray-500">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={() => toggleDropdown(employee.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MdMoreVert size={20} />
                        </button>
                        
                        {activeDropdown === employee.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                            <button
                              onClick={() => handleViewEmployee(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <MdRemoveRedEye className="mr-2" /> Ver Detalhes
                            </button>
                            <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <MdEdit className="mr-2" /> Editar
                            </button>
                            <button
                              onClick={() => handleResetPassword(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <MdLock className="mr-2" /> Redefinir Senha
                            </button>
                            <button
                              onClick={() => handleSendEmail(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <MdEmail className="mr-2" /> Enviar Email
                            </button>
                            <button
                              onClick={() => handleToggleStatus(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <MdBlock className="mr-2" /> 
                              {employee.status === 'active' ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <MdDelete className="mr-2" /> Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nenhum funcionário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaFuncionariosPage; 
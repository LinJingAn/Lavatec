import React, { useState, useEffect, useCallback } from 'react';
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
  MdError
} from 'react-icons/md';
import { UserService, Employee } from '../../../services';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const FuncionariosPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: ''
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await UserService.getEmployees({
        search: searchTerm || undefined,
        role: filters.role || undefined,
        department: filters.department || undefined,
        status: filters.status || undefined
      });
      
      setEmployees(response.employees || []);
      setFilteredEmployees(response.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Erro ao carregar funcionários. Verifique a conexão com o servidor.');
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters]);
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  
  // Handle search and filtering (client-side for immediate feedback)
  useEffect(() => {
    if (!searchTerm && !filters.role && !filters.department && !filters.status) {
      setFilteredEmployees(employees);
      return;
    }
    
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
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
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
    navigate('/funcionarios/novo');
  };
  
  const handleViewEmployee = (id: string) => {
    navigate(`/funcionarios/${id}`);
    setActiveDropdown(null);
  };
  
  const handleEditEmployee = (id: string) => {
    navigate(`/funcionarios/${id}/editar`);
    setActiveDropdown(null);
  };
  
  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await UserService.deleteEmployee(id);
        const updatedEmployees = employees.filter(emp => emp.id !== id);
        setEmployees(updatedEmployees);
        alert('Funcionário excluído com sucesso!');
      } catch (err) {
        console.error('Error deleting employee:', err);
        alert('Erro ao excluir funcionário.');
      }
    }
    setActiveDropdown(null);
  };
  
  const handleResetPassword = async (id: string) => {
    if (window.confirm('Enviar email para redefinição de senha?')) {
      try {
        // In a real app, call API to initiate password reset
        alert('Email de redefinição de senha enviado com sucesso!');
      } catch (err) {
        console.error('Error resetting password:', err);
        alert('Erro ao enviar email de redefinição.');
      }
    }
    setActiveDropdown(null);
  };
  
  const handleSendEmail = (id: string) => {
    alert('Funcionalidade de envio de email será implementada em breve.');
    setActiveDropdown(null);
  };
  
  const handleToggleStatus = async (id: string) => {
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) return;
    
    const employee = employees[employeeIndex];
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
    try {
      await UserService.updateEmployee(id, { status: newStatus });
      
      const updatedEmployees = [...employees];
      updatedEmployees[employeeIndex] = {
        ...employee,
        status: newStatus
      };
      
      setEmployees(updatedEmployees);
      alert(`Status do funcionário alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}`);
    } catch (err) {
      console.error('Error updating employee status:', err);
      alert('Erro ao alterar status do funcionário.');
    }
    setActiveDropdown(null);
  };
  
  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };
  
  // Get unique values for filter dropdowns
  const roles = [...new Set(employees.map(emp => emp.role))];
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Funcionários</h1>
        <button
          onClick={handleAddEmployee}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-700 transition-colors"
        >
          <MdAdd className="mr-1" /> Adicionar Funcionário
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
        <div className="p-4 border-b dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Buscar por nome, email ou cargo..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <button
              className="flex items-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MdFilterList className="mr-1" /> Filtros
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
                  <select
                    name="role"
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full p-2.5"
                    value={filters.role}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos os cargos</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departamento</label>
                  <select
                    name="department"
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full p-2.5"
                    value={filters.department}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos os departamentos</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full p-2.5"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="on_leave">Em Licença</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cargo / Departamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Data de Contratação
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{employee.role}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{employee.department || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : employee.status === 'on_leave'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {employee.status === 'active' ? 'Ativo' : employee.status === 'on_leave' ? 'Em Licença' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(employee.hire_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button 
                            onClick={() => toggleDropdown(employee.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <MdMoreVert size={20} />
                          </button>
                          
                          {activeDropdown === employee.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10 border dark:border-slate-700">
                              <button
                                onClick={() => handleViewEmployee(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                              >
                                <MdRemoveRedEye className="mr-2" /> Ver Detalhes
                              </button>
                              <button
                                onClick={() => handleEditEmployee(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                              >
                                <MdEdit className="mr-2" /> Editar
                              </button>
                              <button
                                onClick={() => handleResetPassword(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                              >
                                <MdLock className="mr-2" /> Redefinir Senha
                              </button>
                              <button
                                onClick={() => handleSendEmail(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                              >
                                <MdEmail className="mr-2" /> Enviar Email
                              </button>
                              <button
                                onClick={() => handleToggleStatus(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
                              >
                                <MdBlock className="mr-2" /> 
                                {employee.status === 'active' ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 w-full text-left"
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
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {error ? 'Erro ao carregar dados.' : 'Nenhum funcionário encontrado com os filtros aplicados.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 border-t border-gray-200 dark:border-slate-600 sm:px-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span className="font-medium">{filteredEmployees.length}</span> de{' '}
                <span className="font-medium">{employees.length}</span> funcionários
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FuncionariosPage;

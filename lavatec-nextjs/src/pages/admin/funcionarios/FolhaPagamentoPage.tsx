import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdFileDownload, 
  MdAttachMoney,
  MdAssessment,
  MdCalendarToday
} from 'react-icons/md';

// Mock data for employee payroll
const MOCK_PAYROLL = [
  {
    id: 1,
    employeeName: 'João Silva',
    department: 'TI',
    position: 'Desenvolvedor Senior',
    basicSalary: 8500.00,
    benefits: 1200.00,
    taxes: 2550.00,
    netSalary: 7150.00,
    status: 'Processado',
    paymentDate: '2023-10-05'
  },
  {
    id: 2,
    employeeName: 'Maria Souza',
    department: 'Operações',
    position: 'Gerente',
    basicSalary: 9800.00,
    benefits: 1500.00,
    taxes: 2940.00,
    netSalary: 8360.00,
    status: 'Processado',
    paymentDate: '2023-10-05'
  },
  {
    id: 3,
    employeeName: 'Carlos Ferreira',
    department: 'Lavanderia',
    position: 'Supervisor',
    basicSalary: 5200.00,
    benefits: 850.00,
    taxes: 1560.00,
    netSalary: 4490.00,
    status: 'Processado',
    paymentDate: '2023-10-05'
  },
  {
    id: 4,
    employeeName: 'Ana Oliveira',
    department: 'Lavanderia',
    position: 'Operador',
    basicSalary: 2900.00,
    benefits: 500.00,
    taxes: 870.00,
    netSalary: 2530.00,
    status: 'Processado',
    paymentDate: '2023-10-05'
  },
  {
    id: 5,
    employeeName: 'Paulo Santos',
    department: 'Manutenção',
    position: 'Técnico',
    basicSalary: 3800.00,
    benefits: 650.00,
    taxes: 1140.00,
    netSalary: 3310.00,
    status: 'Processado',
    paymentDate: '2023-10-05'
  }
];

const PAYMENT_PERIODS = [
  { id: '2023-10', label: 'Outubro 2023' },
  { id: '2023-09', label: 'Setembro 2023' },
  { id: '2023-08', label: 'Agosto 2023' },
  { id: '2023-07', label: 'Julho 2023' },
  { id: '2023-06', label: 'Junho 2023' },
];

const FolhaPagamentoPage = () => {
  const navigate = useNavigate();
  const [payrollEntries, setPayrollEntries] = useState(MOCK_PAYROLL);
  const [selectedPeriod, setSelectedPeriod] = useState('2023-10');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: ''
  });
  
  const handleBackToMain = () => {
    navigate('/admin/funcionarios');
  };
  
  const handleAddPayrollEntry = () => {
    alert('Funcionalidade para adicionar novo lançamento será implementada em breve.');
  };
  
  const handleRunPayroll = () => {
    alert('Funcionalidade para processar folha de pagamento será implementada em breve.');
  };
  
  const handleEditPayrollEntry = (id: number) => {
    alert(`Editar lançamento ID: ${id}`);
  };
  
  const handleDeletePayrollEntry = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      const updatedEntries = payrollEntries.filter(entry => entry.id !== id);
      setPayrollEntries(updatedEntries);
      alert('Lançamento excluído com sucesso!');
    }
  };
  
  const handleToggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      department: '',
      status: ''
    });
  };
  
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };
  
  // Get filtered payroll entries
  const filteredEntries = payrollEntries.filter(entry => {
    if (filters.department && entry.department !== filters.department) return false;
    if (filters.status && entry.status !== filters.status) return false;
    return true;
  });
  
  // Get unique departments and statuses for filters
  const departments = [...new Set(payrollEntries.map(entry => entry.department))];
  const statuses = [...new Set(payrollEntries.map(entry => entry.status))];
  
  // Calculate summary stats
  const totalBasicSalary = filteredEntries.reduce((sum, entry) => sum + entry.basicSalary, 0);
  const totalBenefits = filteredEntries.reduce((sum, entry) => sum + entry.benefits, 0);
  const totalTaxes = filteredEntries.reduce((sum, entry) => sum + entry.taxes, 0);
  const totalNetSalary = filteredEntries.reduce((sum, entry) => sum + entry.netSalary, 0);
  
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
            <h1 className="text-2xl font-semibold">Folha de Pagamento</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie salários e pagamentos dos funcionários
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRunPayroll}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
          >
            <MdAttachMoney className="mr-1" size={20} />
            Processar Folha
          </button>
          <button
            onClick={handleAddPayrollEntry}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
          >
            <MdAdd className="mr-1" size={20} />
            Novo Lançamento
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Total Salário Base</h3>
          <p className="text-2xl font-bold text-gray-800">R$ {totalBasicSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Total Benefícios</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totalBenefits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Total Impostos</h3>
          <p className="text-2xl font-bold text-red-600">R$ {totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Total Líquido</h3>
          <p className="text-2xl font-bold text-blue-600">R$ {totalNetSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
          <div className="flex items-center">
            <MdCalendarToday className="text-gray-500 mr-2" size={20} />
            <select
              className="border-0 focus:ring-0 text-lg font-medium bg-transparent"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              {PAYMENT_PERIODS.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <button
              onClick={handleToggleFilter}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <MdFilterList className="mr-1" size={20} />
              {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <MdFileDownload className="mr-1" size={20} />
              Exportar
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <MdAssessment className="mr-1" size={20} />
              Relatórios
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {statuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento/Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salário Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefícios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impostos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salário Líquido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.position}</div>
                      <div className="text-sm text-gray-500">{entry.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {entry.basicSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      R$ {entry.benefits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      R$ {entry.taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {entry.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'Processado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPayrollEntry(entry.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeletePayrollEntry(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Nenhum lançamento encontrado para o período selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Additional Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Próximos Pagamentos</h2>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Data do Próximo Pagamento</span>
              <span className="text-blue-600 font-medium">05/11/2023</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Total Previsto</span>
              <span className="text-green-600 font-medium">R$ {totalNetSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Status</span>
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Despesas com Pessoal</h2>
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Salários (70%)</span>
                <span className="text-sm text-gray-500">R$ {totalBasicSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Benefícios (20%)</span>
                <span className="text-sm text-gray-500">R$ {totalBenefits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '20%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Impostos sobre Folha (10%)</span>
                <span className="text-sm text-gray-500">R$ {(totalTaxes * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: '10%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolhaPagamentoPage; 
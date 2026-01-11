import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdLocalHospital, 
  MdDirectionsCar,
  MdRestaurant,
  MdSchool,
  MdCardGiftcard,
  MdFitnessCenter,
  MdLocalAtm
} from 'react-icons/md';

// Mock data for benefits
const MOCK_BENEFITS = [
  {
    id: 1,
    name: 'Plano de Saúde Premium',
    category: 'Saúde',
    provider: 'Unimed',
    cost: 550.00,
    employeeContribution: 20, // percent
    eligibility: 'Todos os funcionários',
    description: 'Plano de saúde com cobertura nacional e rede credenciada ampla.'
  },
  {
    id: 2,
    name: 'Vale Refeição',
    category: 'Alimentação',
    provider: 'Alelo',
    cost: 660.00,
    employeeContribution: 0,
    eligibility: 'Todos os funcionários',
    description: 'Vale refeição para uso em restaurantes e estabelecimentos credenciados.'
  },
  {
    id: 3,
    name: 'Plano Odontológico',
    category: 'Saúde',
    provider: 'Odontoprev',
    cost: 120.00,
    employeeContribution: 10,
    eligibility: 'Todos os funcionários',
    description: 'Cobertura para tratamentos odontológicos básicos e alguns especializados.'
  },
  {
    id: 4,
    name: 'Vale Transporte',
    category: 'Transporte',
    provider: 'VT',
    cost: 240.00,
    employeeContribution: 6,
    eligibility: 'Todos os funcionários',
    description: 'Auxílio para deslocamento casa-trabalho conforme legislação.'
  },
  {
    id: 5,
    name: 'Auxílio Educação',
    category: 'Educação',
    provider: 'Interno',
    cost: 300.00,
    employeeContribution: 0,
    eligibility: 'Após 1 ano',
    description: 'Reembolso parcial para cursos relacionados à função.'
  },
  {
    id: 6,
    name: 'Seguro de Vida',
    category: 'Seguro',
    provider: 'Porto Seguro',
    cost: 85.00,
    employeeContribution: 0,
    eligibility: 'Todos os funcionários',
    description: 'Cobertura para morte, invalidez e assistência funeral.'
  },
  {
    id: 7,
    name: 'Auxílio Academia',
    category: 'Bem-estar',
    provider: 'Gympass',
    cost: 100.00,
    employeeContribution: 30,
    eligibility: 'Após 3 meses',
    description: 'Subsídio parcial para atividades físicas em academias.'
  }
];

// Mock data for employee benefits enrollment
const MOCK_EMPLOYEE_BENEFITS = [
  { employeeId: 1, employeeName: 'João Silva', benefitIds: [1, 2, 3, 4] },
  { employeeId: 2, employeeName: 'Maria Souza', benefitIds: [1, 2, 3, 4, 5, 7] },
  { employeeId: 3, employeeName: 'Carlos Ferreira', benefitIds: [1, 2, 4, 6] },
  { employeeId: 4, employeeName: 'Ana Oliveira', benefitIds: [1, 2, 4] },
  { employeeId: 5, employeeName: 'Paulo Santos', benefitIds: [1, 2, 3, 4, 6] }
];

const BeneficiosPage = () => {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState(MOCK_BENEFITS);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'enrollment', 'stats'
  const [showAddBenefitModal, setShowAddBenefitModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [employeeBenefits] = useState(MOCK_EMPLOYEE_BENEFITS);
  
  const handleBackToMain = () => {
    navigate('/admin/funcionarios');
  };
  
  const handleAddBenefit = () => {
    setSelectedBenefit(null);
    setShowAddBenefitModal(true);
  };
  
  const handleEditBenefit = (benefit) => {
    setSelectedBenefit(benefit);
    setShowAddBenefitModal(true);
  };
  
  const handleDeleteBenefit = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este benefício?')) {
      const updatedBenefits = benefits.filter(benefit => benefit.id !== id);
      setBenefits(updatedBenefits);
      alert('Benefício excluído com sucesso!');
    }
  };
  
  // Get total cost of all benefits
  const totalBenefitsCost = benefits.reduce((sum, benefit) => sum + benefit.cost, 0);
  
  // Get most popular benefits
  const benefitPopularity = benefits.map(benefit => {
    const enrollmentCount = employeeBenefits.filter(eb => 
      eb.benefitIds.includes(benefit.id)
    ).length;
    
    return {
      ...benefit,
      enrollmentCount,
      enrollmentPercentage: (enrollmentCount / employeeBenefits.length) * 100
    };
  }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);
  
  // Calculate benefit category distribution
  const categoryDistribution = {};
  benefits.forEach(benefit => {
    if (!categoryDistribution[benefit.category]) {
      categoryDistribution[benefit.category] = {
        count: 0,
        totalCost: 0
      };
    }
    categoryDistribution[benefit.category].count += 1;
    categoryDistribution[benefit.category].totalCost += benefit.cost;
  });
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Saúde':
        return <MdLocalHospital className="text-red-500" size={24} />;
      case 'Alimentação':
        return <MdRestaurant className="text-orange-500" size={24} />;
      case 'Transporte':
        return <MdDirectionsCar className="text-blue-500" size={24} />;
      case 'Educação':
        return <MdSchool className="text-indigo-500" size={24} />;
      case 'Seguro':
        return <MdLocalAtm className="text-green-500" size={24} />;
      case 'Bem-estar':
        return <MdFitnessCenter className="text-purple-500" size={24} />;
      default:
        return <MdCardGiftcard className="text-gray-500" size={24} />;
    }
  };
  
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
            <h1 className="text-2xl font-semibold">Gestão de Benefícios</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie os benefícios oferecidos aos funcionários
            </p>
          </div>
        </div>
        <button
          onClick={handleAddBenefit}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Novo Benefício
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('list')}
          >
            Lista de Benefícios
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'enrollment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('enrollment')}
          >
            Adesão de Funcionários
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Estatísticas
          </button>
        </nav>
      </div>
      
      {/* Benefits List Tab */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-medium">Benefícios Disponíveis</h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <MdFilterList className="mr-1" size={20} />
                Filtrar
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Benefício
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo Mensal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contribuição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Elegibilidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {benefits.map((benefit) => (
                  <tr key={benefit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{benefit.name}</div>
                      <div className="text-sm text-gray-500">{benefit.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(benefit.category)}
                        <span className="ml-2">{benefit.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {benefit.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {benefit.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benefit.employeeContribution}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {benefit.eligibility}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditBenefit(benefit)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBenefit(benefit.id)}
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
        </div>
      )}
      
      {/* Employee Enrollment Tab */}
      {activeTab === 'enrollment' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Adesão de Funcionários</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gerenciar os benefícios por funcionário
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  {benefits.map(benefit => (
                    <th key={benefit.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {benefit.name}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Custo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeBenefits.map((employee) => {
                  const employeeBenefitsList = benefits.filter(benefit => 
                    employee.benefitIds.includes(benefit.id)
                  );
                  
                  const totalCost = employeeBenefitsList.reduce(
                    (sum, benefit) => sum + benefit.cost, 0
                  );
                  
                  return (
                    <tr key={employee.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{employee.employeeName}</div>
                      </td>
                      
                      {benefits.map(benefit => (
                        <td key={benefit.id} className="px-6 py-4 whitespace-nowrap text-center">
                          {employee.benefitIds.includes(benefit.id) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Não
                            </span>
                          )}
                        </td>
                      ))}
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        R$ {totalCost.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <>
          {/* Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">Custo Total de Benefícios</h3>
              <p className="text-3xl font-bold text-blue-600">
                R$ {totalBenefitsCost.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Mensal</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">Custo Médio por Funcionário</h3>
              <p className="text-3xl font-bold text-green-600">
                R$ {(totalBenefitsCost / employeeBenefits.length).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Baseado em {employeeBenefits.length} funcionários</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-2">Total de Benefícios</h3>
              <p className="text-3xl font-bold text-purple-600">
                {benefits.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Em {Object.keys(categoryDistribution).length} categorias</p>
            </div>
          </div>
          
          {/* Category Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Distribuição por Categoria</h3>
              
              <div className="space-y-4">
                {Object.entries(categoryDistribution).map(([category, data]) => (
                  <div key={category}>
                    <div className="flex items-center mb-1">
                      {getCategoryIcon(category)}
                      <span className="ml-2 font-medium">{category}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        {data.count} benefícios
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category === 'Saúde' ? 'bg-red-500' :
                          category === 'Alimentação' ? 'bg-orange-500' :
                          category === 'Transporte' ? 'bg-blue-500' :
                          category === 'Educação' ? 'bg-indigo-500' :
                          category === 'Seguro' ? 'bg-green-500' :
                          category === 'Bem-estar' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${(data.count / benefits.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      R$ {data.totalCost.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Benefícios Mais Populares</h3>
              
              <div className="space-y-4">
                {benefitPopularity.slice(0, 5).map(benefit => (
                  <div key={benefit.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{benefit.name}</span>
                      <span className="text-sm text-gray-500">
                        {benefit.enrollmentCount} funcionários
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${benefit.enrollmentPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {benefit.enrollmentPercentage.toFixed(1)}% de adesão
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cost Projection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Projeção de Custos Anuais</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custo Mensal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custo Anual
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % do Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryDistribution).map(([category, data]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCategoryIcon(category)}
                          <span className="ml-2 font-medium">{category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        R$ {data.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">
                        R$ {(data.totalCost * 12).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {((data.totalCost / totalBenefitsCost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      R$ {totalBenefitsCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      R$ {(totalBenefitsCost * 12).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BeneficiosPage; 
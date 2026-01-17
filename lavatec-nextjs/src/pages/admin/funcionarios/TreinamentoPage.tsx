import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdFileDownload,
  MdPerson,
  MdSchool,
  MdAssignment,
  MdCheckCircle,
  MdAccessTime
} from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Mock data for training courses
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Operação de Equipamentos Industriais',
    category: 'Técnico',
    instructor: 'Roberto Martins',
    duration: '20 horas',
    status: 'Ativo',
    startDate: '2023-10-15',
    endDate: '2023-10-30',
    capacity: 20,
    enrolled: 15,
    description: 'Treinamento técnico para operação segura e eficiente de equipamentos de lavanderia industrial.'
  },
  {
    id: 2,
    title: 'Liderança e Gestão de Equipes',
    category: 'Gestão',
    instructor: 'Sandra Oliveira',
    duration: '16 horas',
    status: 'Ativo',
    startDate: '2023-11-05',
    endDate: '2023-11-15',
    capacity: 15,
    enrolled: 12,
    description: 'Desenvolvimento de habilidades de liderança e técnicas de gestão de equipes.'
  },
  {
    id: 3,
    title: 'Segurança no Trabalho',
    category: 'Segurança',
    instructor: 'Carlos Mendes',
    duration: '8 horas',
    status: 'Ativo',
    startDate: '2023-10-20',
    endDate: '2023-10-21',
    capacity: 30,
    enrolled: 28,
    description: 'Normas e procedimentos de segurança para o ambiente de lavanderia industrial.'
  },
  {
    id: 4,
    title: 'Atendimento ao Cliente',
    category: 'Comercial',
    instructor: 'Juliana Freitas',
    duration: '12 horas',
    status: 'Planejado',
    startDate: '2023-12-10',
    endDate: '2023-12-15',
    capacity: 25,
    enrolled: 10,
    description: 'Técnicas de atendimento e resolução de problemas para a equipe de atendimento ao cliente.'
  },
  {
    id: 5,
    title: 'Manutenção Preventiva',
    category: 'Técnico',
    instructor: 'Fernando Costa',
    duration: '24 horas',
    status: 'Concluído',
    startDate: '2023-09-01',
    endDate: '2023-09-15',
    capacity: 15,
    enrolled: 15,
    description: 'Técnicas de manutenção preventiva para equipamentos de lavanderia industrial.'
  }
];

// Mock data for employee training
const MOCK_EMPLOYEE_TRAINING = [
  { employeeId: 1, employeeName: 'João Silva', courseIds: [1, 3], status: ['Concluído', 'Em Andamento'] },
  { employeeId: 2, employeeName: 'Maria Souza', courseIds: [2, 3, 5], status: ['Em Andamento', 'Concluído', 'Concluído'] },
  { employeeId: 3, employeeName: 'Carlos Ferreira', courseIds: [1, 5], status: ['Em Andamento', 'Concluído'] },
  { employeeId: 4, employeeName: 'Ana Oliveira', courseIds: [3, 4], status: ['Concluído', 'Inscrito'] },
  { employeeId: 5, employeeName: 'Paulo Santos', courseIds: [1, 2, 3], status: ['Em Andamento', 'Em Andamento', 'Concluído'] }
];

const TreinamentoPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'enrollment', 'stats'
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof MOCK_COURSES[0] | null>(null);
  const [employeeTraining] = useState(MOCK_EMPLOYEE_TRAINING);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });
  
  const handleBackToMain = () => {
    navigate('/admin/funcionarios');
  };
  
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setShowAddCourseModal(true);
  };
  
  const handleEditCourse = (course: typeof MOCK_COURSES[0]) => {
    setSelectedCourse(course);
    setShowAddCourseModal(true);
  };
  
  const handleDeleteCourse = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      alert('Curso excluído com sucesso!');
    }
  };

  const handleToggleFilters = () => {
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
      category: '',
      status: ''
    });
  };
  
  // Get filtered courses
  const filteredCourses = courses.filter(course => {
    if (filters.category && course.category !== filters.category) return false;
    if (filters.status && course.status !== filters.status) return false;
    return true;
  });
  
  // Get unique categories and statuses for filters
  const categories = [...new Set(courses.map(course => course.category))];
  const statuses = [...new Set(courses.map(course => course.status))];
  
  // Calculate summary stats
  const activeCourses = courses.filter(course => course.status === 'Ativo').length;
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const averageCompletion = 65; // This would be calculated from actual data in a real implementation
  const upcomingCourses = courses.filter(course => course.status === 'Planejado').length;

  // Get training completion stats per employee
  const employeeCompletionStats = employeeTraining.map(employee => {
    const totalCourses = employee.courseIds.length;
    const completedCourses = employee.status.filter(status => status === 'Concluído').length;
    const completionPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
    
    return {
      ...employee,
      totalCourses,
      completedCourses,
      completionPercentage
    };
  }).sort((a, b) => b.completionPercentage - a.completionPercentage);

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
            <h1 className="text-2xl font-semibold">Gestão de Treinamentos</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie os cursos e treinamentos oferecidos aos funcionários
            </p>
          </div>
        </div>
        <button
          onClick={handleAddCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Novo Curso
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Cursos Ativos</h3>
          <p className="text-2xl font-bold text-gray-800">{activeCourses}</p>
          <div className="flex items-center mt-2">
            <MdSchool className="text-blue-500 mr-1" size={16} />
            <span className="text-sm text-gray-600">Treinamentos em andamento</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Total de Inscrições</h3>
          <p className="text-2xl font-bold text-gray-800">{totalEnrollments}</p>
          <div className="flex items-center mt-2">
            <MdPerson className="text-green-500 mr-1" size={16} />
            <span className="text-sm text-gray-600">Participantes em todos os cursos</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Taxa Média de Conclusão</h3>
          <p className="text-2xl font-bold text-gray-800">{averageCompletion}%</p>
          <div className="flex items-center mt-2">
            <MdCheckCircle className="text-purple-500 mr-1" size={16} />
            <span className="text-sm text-gray-600">De todos os treinamentos</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Próximos Cursos</h3>
          <p className="text-2xl font-bold text-gray-800">{upcomingCourses}</p>
          <div className="flex items-center mt-2">
            <MdAccessTime className="text-orange-500 mr-1" size={16} />
            <span className="text-sm text-gray-600">Treinamentos planejados</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('courses')}
          >
            Cursos Disponíveis
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'enrollment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('enrollment')}
          >
            Participação de Funcionários
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
      
      {/* Courses List Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-medium">Cursos e Treinamentos</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleFilters}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <MdFilterList className="mr-1" size={20} />
                Filtrar
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <MdFileDownload className="mr-1" size={20} />
                Exportar
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Todas as Categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Todos os Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instrutor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duração
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscrições
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
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{course.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(course.startDate).toLocaleDateString('pt-BR')} - {new Date(course.endDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {course.enrolled}/{course.capacity}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${course.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                          course.status === 'Planejado' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum curso encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Employee Enrollment Tab */}
      {activeTab === 'enrollment' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Participação em Treinamentos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Lista de funcionários e seus cursos
            </p>
          </div>
          
          {/* Employee Enrollment Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cursos Inscritos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concluídos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Em Andamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa de Conclusão
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeCompletionStats.map(employee => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.totalCourses}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.completedCourses}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {employee.totalCourses - employee.completedCourses}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 mr-2">{employee.completionPercentage.toFixed(0)}%</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              employee.completionPercentage >= 75 ? 'bg-green-600' : 
                              employee.completionPercentage >= 50 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${employee.completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Estatísticas de Treinamento</h2>
            <p className="text-sm text-gray-500 mt-1">
              Métricas e tendências dos programas de treinamento
            </p>
          </div>
          
          <div className="p-4">
            {/* Training Category Distribution */}
            <div className="mb-8">
              <h3 className="text-md font-medium mb-4">Distribuição por Categoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(category => {
                  const categoryCount = courses.filter(course => course.category === category).length;
                  const percentage = (categoryCount / courses.length) * 100;
                  
                  return (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-gray-500">{categoryCount} cursos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            category === 'Técnico' ? 'bg-blue-600' :
                            category === 'Gestão' ? 'bg-purple-600' :
                            category === 'Segurança' ? 'bg-red-600' :
                            category === 'Comercial' ? 'bg-green-600' :
                            'bg-gray-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Course Enrollment Rate */}
            <div className="mb-8">
              <h3 className="text-md font-medium mb-4">Taxa de Ocupação dos Cursos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Curso
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscritos
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacidade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa de Ocupação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map(course => {
                      const enrollmentRate = (course.enrolled / course.capacity) * 100;
                      
                      return (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{course.enrolled}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{course.capacity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900 mr-2">{enrollmentRate.toFixed(0)}%</div>
                              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    enrollmentRate >= 90 ? 'bg-red-600' : 
                                    enrollmentRate >= 70 ? 'bg-green-600' : 
                                    enrollmentRate >= 50 ? 'bg-yellow-500' : 
                                    'bg-blue-600'
                                  }`}
                                  style={{ width: `${enrollmentRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Training Status */}
            <div className="mb-8">
              <h3 className="text-md font-medium mb-4">Status dos Treinamentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statuses.map(status => {
                  const statusCount = courses.filter(course => course.status === status).length;
                  const percentage = (statusCount / courses.length) * 100;
                  
                  return (
                    <div key={status} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{status}</span>
                        <span className="text-gray-500">{statusCount} cursos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            status === 'Ativo' ? 'bg-green-600' :
                            status === 'Planejado' ? 'bg-yellow-500' :
                            status === 'Concluído' ? 'bg-blue-600' :
                            'bg-gray-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Top Performing Employees */}
            <div>
              <h3 className="text-md font-medium mb-4">Funcionários com Melhor Desempenho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employeeCompletionStats.slice(0, 4).map(employee => (
                  <div key={employee.employeeId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{employee.employeeName}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {employee.completedCourses} de {employee.totalCourses} treinamentos concluídos
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {employee.completionPercentage.toFixed(0)}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${employee.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Course Modal (Placeholder) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 overflow-y-auto" 
             aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 aria-hidden="true" onClick={() => setShowAddCourseModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" 
                  aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {selectedCourse ? 'Editar Curso' : 'Adicionar Novo Curso'}
                </h3>
                <div className="mt-4">
                  <p className="text-gray-500">Implementação do formulário de curso será adicionada em breve.</p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" 
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowAddCourseModal(false)}>
                  Salvar
                </button>
                <button type="button" 
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowAddCourseModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default TreinamentoPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
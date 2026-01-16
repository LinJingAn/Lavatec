import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdFilterList, MdFileDownload } from 'react-icons/md';

// Mock data for schedules
const MOCK_SCHEDULES = [
  {
    id: 1,
    employeeName: 'João Silva',
    department: 'TI',
    schedule: 'Segunda a Sexta, 08:00 - 17:00',
    type: 'Integral',
    hoursPerWeek: 40,
    status: 'active'
  },
  {
    id: 2,
    employeeName: 'Maria Souza',
    department: 'Operações',
    schedule: 'Segunda a Sexta, 09:00 - 18:00',
    type: 'Integral',
    hoursPerWeek: 40,
    status: 'active'
  },
  {
    id: 3,
    employeeName: 'Carlos Ferreira',
    department: 'Lavanderia',
    schedule: 'Terça a Sábado, 07:00 - 16:00',
    type: 'Integral',
    hoursPerWeek: 40,
    status: 'active'
  },
  {
    id: 4,
    employeeName: 'Ana Oliveira',
    department: 'Lavanderia',
    schedule: 'Segunda, Quarta e Sexta, 08:00 - 14:00',
    type: 'Meio Período',
    hoursPerWeek: 18,
    status: 'active'
  },
  {
    id: 5,
    employeeName: 'Paulo Santos',
    department: 'Manutenção',
    schedule: 'Segunda a Sexta, 14:00 - 22:00',
    type: 'Turno da Tarde',
    hoursPerWeek: 40,
    status: 'active'
  }
];

const HorariosPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    type: ''
  });
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const handleBackToMain = () => {
    navigate('/admin/funcionarios');
  };
  
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setShowScheduleModal(true);
  };
  
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleModal(true);
  };
  
  const handleDeleteSchedule = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este horário?')) {
      const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
      setSchedules(updatedSchedules);
      alert('Horário excluído com sucesso!');
    }
  };
  
  const handleToggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      department: '',
      type: ''
    });
  };
  
  // Get filtered schedules
  const filteredSchedules = schedules.filter(schedule => {
    if (filters.department && schedule.department !== filters.department) return false;
    if (filters.type && schedule.type !== filters.type) return false;
    return true;
  });
  
  // Get unique departments and types for filters
  const departments = [...new Set(schedules.map(s => s.department))];
  const types = [...new Set(schedules.map(s => s.type))];
  
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
            <h1 className="text-2xl font-semibold">Gestão de Horários</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie os horários e escalas de trabalho dos funcionários
            </p>
          </div>
        </div>
        <button
          onClick={handleAddSchedule}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <MdAdd className="mr-1" size={20} />
          Novo Horário
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
          <h2 className="text-lg font-medium">Lista de Horários</h2>
          
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
                Tipo de Horário
              </label>
              <select
                name="type"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
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
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Semanais
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{schedule.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{schedule.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.schedule}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.hoursPerWeek}h</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum horário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Calendar View Section (Preview) */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Visualização do Calendário de Turnos</h2>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <p className="text-gray-600">Visualização do calendário de turnos será implementada em breve.</p>
          <p className="text-gray-600 mt-2">Aqui os gerentes poderão ver a distribuição dos funcionários por turnos e dias da semana.</p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Total de Horas Semanais</h3>
          <p className="text-3xl font-bold text-blue-600">
            {schedules.reduce((total, schedule) => total + schedule.hoursPerWeek, 0)}h
          </p>
          <p className="text-sm text-gray-600 mt-1">Distribuídas entre {schedules.length} funcionários</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Média de Horas por Funcionário</h3>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(schedules.reduce((total, schedule) => total + schedule.hoursPerWeek, 0) / schedules.length)}h
          </p>
          <p className="text-sm text-gray-600 mt-1">Horas semanais em média</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-2">Distribuição por Tipo</h3>
          <div className="mt-2 space-y-2">
            {types.map((type) => {
              const count = schedules.filter(s => s.type === type).length;
              const percentage = Math.round((count / schedules.length) * 100);
              
              return (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <span className="text-sm text-gray-500">{percentage}% ({count})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorariosPage; 
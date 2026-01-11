import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete, MdSearch, MdFilterList, MdAdd } from 'react-icons/md';

// Mock data for units
const mockUnidades = [
  { id: 1, name: 'São José Centro', address: 'Avenida Central, Rua 1', status: 'active', employees: 15, machines: 12 },
  { id: 2, name: 'Escazú', address: 'Plaza Tempo, Local #5', status: 'maintenance', employees: 10, machines: 8 },
  { id: 3, name: 'Heredia', address: 'Centro Comercial Paseo de las Flores', status: 'active', employees: 12, machines: 10 },
  { id: 4, name: 'Alajuela', address: 'Rua Ancha, 200m Norte do Parque', status: 'active', employees: 8, machines: 6 },
  { id: 5, name: 'Cartago', address: 'Avenida 3, Edifício Lumina', status: 'inactive', employees: 0, machines: 5 },
  { id: 6, name: 'Tres Ríos', address: 'Centro Comercial Terramall', status: 'active', employees: 9, machines: 7 },
  { id: 7, name: 'Santa Ana', address: 'Centro Empresarial Forum 1', status: 'active', employees: 11, machines: 9 },
];

const ListUnidadesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter units based on search term and status filter
  const filteredUnidades = mockUnidades.filter(unidad => {
    const matchesSearch = unidad.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         unidad.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || unidad.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Ativa</span>;
      case 'maintenance':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Manutenção</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Inativa</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listagem de Unidades</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/unidades/add')}
        >
          <MdAdd /> Adicionar Unidade
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar unidades..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-500" />
            <select
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os estados</option>
              <option value="active">Ativas</option>
              <option value="maintenance">Em manutenção</option>
              <option value="inactive">Inativas</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionários</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máquinas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUnidades.map((unidad) => (
                <tr key={unidad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{unidad.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {unidad.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(unidad.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {unidad.employees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {unidad.machines}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigate(`/unidades/edit/${unidad.id}`)}
                      >
                        <MdEdit size={20} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUnidades.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma unidade encontrada com os critérios de busca.</p>
          </div>
        )}
        
        <div className="px-4 py-3 border-t">
          <p className="text-sm text-gray-500">
            Mostrando {filteredUnidades.length} de {mockUnidades.length} unidades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListUnidadesPage; 
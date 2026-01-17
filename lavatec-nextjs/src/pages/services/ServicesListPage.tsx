import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAdd, 
  MdOutlineDryCleaning, 
  MdSearch, 
  MdFilterList,
  MdSort,
  MdCheckCircle, 
  MdCancel,
  MdEdit,
  MdAccessTime,
  MdAttachMoney
} from 'react-icons/md';
import { 
  ServiceType, 
  ServiceCategory,
  generateMockServiceTypes, 
  getCategoryName
} from '../../models/ServiceTypes';
import { formatCurrency } from '../../lib/utils';

const ServicesListPage: React.FC = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');
  const [sortField, setSortField] = useState<keyof ServiceType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fetch services
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const data = generateMockServiceTypes();
      setServices(data);
      setFilteredServices(data);
      setIsLoading(false);
    }, 500);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...services];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(service => service.categoryId === categoryFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter !== null) {
      result = result.filter(service => service.isAvailable === availabilityFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle special case for sorting by category
      if (sortField === 'categoryId') {
        valueA = getCategoryName(a.categoryId as ServiceCategory);
        valueB = getCategoryName(b.categoryId as ServiceCategory);
      }
      
      if (valueA && valueB && valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA && valueB && valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredServices(result);
  }, [services, searchQuery, categoryFilter, sortField, sortDirection, availabilityFilter]);

  // Handle sort toggle
  const handleSortChange = (field: keyof ServiceType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setAvailabilityFilter(null);
    setSortField('name');
    setSortDirection('asc');
    setFilterMenuOpen(false);
  };

  // Format processing time for display
  const formatProcessingTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours === 1) return '1 hora';
    if (hours % 1 === 0) return `${hours}h`;
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours}h ${minutes}min`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            Serviços
          </h1>
          <p className="text-gray-600">Gerencie os tipos de serviços oferecidos</p>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to="/services/test"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Test Routes
          </Link>
          <Link
            to="/services/pricing"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <MdAttachMoney className="mr-1" /> Gestão de Preços
          </Link>
          <Link
            to="/services/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MdAdd className="mr-1" /> Novo Serviço
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serviços..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <MdFilterList className="mr-1" /> Filtros
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4">
                <h3 className="font-medium text-gray-700 mb-2">Filtrar por</h3>
                
                {/* Category filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as ServiceCategory | '')}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="laundry">Lavanderia</option>
                    <option value="drycleaning">Lavagem a Seco</option>
                    <option value="ironing">Passadoria</option>
                    <option value="special">Tratamentos Especiais</option>
                    <option value="household">Itens Domésticos</option>
                  </select>
                </div>
                
                {/* Availability filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidade
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAvailabilityFilter(availabilityFilter === true ? null : true)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        availabilityFilter === true 
                          ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Disponível
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter(availabilityFilter === false ? null : false)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        availabilityFilter === false 
                          ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Indisponível
                    </button>
                  </div>
                </div>
                
                {/* Sort options */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSortChange('name')}
                      className={`px-3 py-1 rounded-md text-sm flex items-center justify-center ${
                        sortField === 'name' 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Nome
                      {sortField === 'name' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSortChange('categoryId')}
                      className={`px-3 py-1 rounded-md text-sm flex items-center justify-center ${
                        sortField === 'categoryId' 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Categoria
                      {sortField === 'categoryId' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSortChange('basePrice')}
                      className={`px-3 py-1 rounded-md text-sm flex items-center justify-center ${
                        sortField === 'basePrice' 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Preço
                      {sortField === 'basePrice' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSortChange('processingTimeHours')}
                      className={`px-3 py-1 rounded-md text-sm flex items-center justify-center ${
                        sortField === 'processingTimeHours' 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      Tempo
                      {sortField === 'processingTimeHours' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Active filters summary */}
        {(searchQuery || categoryFilter || availabilityFilter !== null || sortField !== 'name' || sortDirection !== 'asc') && (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="text-gray-500">Filtros ativos:</span>
            
            {searchQuery && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Busca: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {categoryFilter && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Categoria: {getCategoryName(categoryFilter as ServiceCategory)}
                <button 
                  onClick={() => setCategoryFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {availabilityFilter !== null && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Status: {availabilityFilter ? 'Disponível' : 'Indisponível'}
                <button 
                  onClick={() => setAvailabilityFilter(null)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {(sortField !== 'name' || sortDirection !== 'asc') && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Ordenado por: {
                  sortField === 'name' ? 'Nome' :
                  sortField === 'categoryId' ? 'Categoria' :
                  sortField === 'basePrice' ? 'Preço' :
                  sortField === 'processingTimeHours' ? 'Tempo' : sortField
                } ({sortDirection === 'asc' ? 'crescente' : 'decrescente'})
                <button 
                  onClick={() => {
                    setSortField('name');
                    setSortDirection('asc');
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Services list */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MdOutlineDryCleaning className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Nenhum serviço encontrado</h2>
          <p className="text-gray-500 mb-4">
            Não encontramos serviços que correspondam aos seus critérios de busca.
          </p>
          {(searchQuery || categoryFilter || availabilityFilter !== null) && (
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    <div className="flex items-center">
                      Serviço
                      {sortField === 'name' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('categoryId')}
                  >
                    <div className="flex items-center">
                      Categoria
                      {sortField === 'categoryId' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('basePrice')}
                  >
                    <div className="flex items-center">
                      Preço Base
                      {sortField === 'basePrice' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('processingTimeHours')}
                  >
                    <div className="flex items-center">
                      Tempo
                      {sortField === 'processingTimeHours' && (
                        <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/services/${service.id}`} className="group">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {service.name}
                        </div>
                        {service.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {service.description}
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {getCategoryName(service.categoryId as ServiceCategory)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(service.basePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MdAccessTime className="mr-1 text-gray-500" />
                        {formatProcessingTime(service.processingTimeHours)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.isAvailable ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <MdCheckCircle className="mr-1" /> Disponível
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <MdCancel className="mr-1" /> Indisponível
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/services/${service.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/services/${service.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <MdEdit className="inline" /> Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredServices.length}</span> de{' '}
              <span className="font-medium">{services.length}</span> serviços
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesListPage; 
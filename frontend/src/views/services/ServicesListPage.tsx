import React, { useState, useEffect, useCallback } from 'react';
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
  MdAttachMoney,
  MdError
} from 'react-icons/md';
import { ServiceService, ServiceType } from '@/services';
import { formatCurrency } from '../../lib/utils';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    'laundry': 'Lavanderia',
    'drycleaning': 'Lavagem a Seco',
    'ironing': 'Passadoria',
    'special': 'Tratamentos Especiais',
    'household': 'Itens Domésticos'
  };
  return categories[categoryId] || categoryId;
};

const ServicesListPage: React.FC = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ServiceType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fetch services from API
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ServiceService.getServices({
        category_id: categoryFilter || undefined,
        is_available: availabilityFilter ?? undefined,
        search: searchQuery || undefined
      });
      
      setServices(result.services || []);
      setFilteredServices(result.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Erro ao carregar serviços. Verifique a conexão com o servidor.');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, availabilityFilter, searchQuery]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Apply filters and sorting (client-side for sorting)
  useEffect(() => {
    let result = [...services];
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (sortField === 'categoryId') {
        valueA = getCategoryName(a.categoryId);
        valueB = getCategoryName(b.categoryId);
      }
      
      if (valueA && valueB && valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA && valueB && valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredServices(result);
  }, [services, sortField, sortDirection]);

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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-emerald-600" />
            Serviços
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie os tipos de serviços oferecidos</p>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to="/services/pricing"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <MdAttachMoney className="mr-1" /> Gestão de Preços
          </Link>
          <Link
            to="/services/add"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <MdAdd className="mr-1" /> Novo Serviço
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}
      
      {/* Filters and search */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
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
              className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-md py-2 px-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
            >
              <MdFilterList className="mr-1" /> Filtros
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 p-4 border dark:border-slate-700">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por</h3>
                
                {/* Category filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-md py-1.5 px-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Disponibilidade
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAvailabilityFilter(availabilityFilter === true ? null : true)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        availabilityFilter === true 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-300 dark:border-green-700' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      Disponível
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter(availabilityFilter === false ? null : false)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        availabilityFilter === false 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-2 border-red-300 dark:border-red-700' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                      }`}
                    >
                      Indisponível
                    </button>
                  </div>
                </div>
                
                {/* Sort options */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ordenar por
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['name', 'categoryId', 'basePrice', 'processingTimeHours'] as const).map((field) => (
                      <button
                        key={field}
                        onClick={() => handleSortChange(field)}
                        className={`px-3 py-1 rounded-md text-sm flex items-center justify-center ${
                          sortField === field 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700' 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-slate-600'
                        }`}
                      >
                        {field === 'name' ? 'Nome' : 
                         field === 'categoryId' ? 'Categoria' : 
                         field === 'basePrice' ? 'Preço' : 'Tempo'}
                        {sortField === field && (
                          <MdSort className={`ml-1 transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Services list */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
          <MdOutlineDryCleaning className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhum serviço encontrado</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error ? 'Erro ao carregar dados.' : 'Não encontramos serviços que correspondam aos seus critérios de busca.'}
          </p>
          {(searchQuery || categoryFilter || availabilityFilter !== null) && (
            <button
              onClick={handleResetFilters}
              className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/services/${service.id}`} className="group">
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600">
                          {service.name}
                        </div>
                        {service.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {service.description}
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300">
                        {service.category_name || getCategoryName(service.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(service.basePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <MdAccessTime className="mr-1 text-gray-500 dark:text-gray-400" />
                        {formatProcessingTime(service.processingTimeHours)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.isAvailable ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <MdCheckCircle className="mr-1" /> Disponível
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <MdCancel className="mr-1" /> Indisponível
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/services/${service.id}`}
                        className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 mr-4"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/services/${service.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                      >
                        <MdEdit className="inline" /> Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 px-6 py-3 border-t border-gray-200 dark:border-slate-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdHistory,
  MdOutlineDryCleaning,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDelete
} from 'react-icons/md';
import { getCategoryName } from '../../models/ServiceTypes';
import {
  PriceHistoryAction,
  PriceHistoryEntry,
  generateMockPriceHistory
} from '../../models/PricingTable';
import { formatCurrency, formatDate } from '../../lib/utils';

const PriceHistoryPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PriceHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<PriceHistoryAction | ''>('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start?: Date; end?: Date }>({});
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Load data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const historyData = generateMockPriceHistory();
      setPriceHistory(historyData);
      setFilteredHistory(historyData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...priceHistory];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.userName.toLowerCase().includes(query) ||
        (entry.notes && entry.notes.toLowerCase().includes(query)) ||
        (entry.details.bulkUpdateInfo && entry.details.bulkUpdateInfo.toLowerCase().includes(query))
      );
    }
    
    // Action filter
    if (actionFilter) {
      filtered = filtered.filter(entry => entry.action === actionFilter);
    }
    
    // User filter
    if (userFilter) {
      filtered = filtered.filter(entry => entry.userName === userFilter);
    }
    
    // Date range filter
    if (dateRangeFilter.start) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(dateRangeFilter.start!));
    }
    if (dateRangeFilter.end) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(dateRangeFilter.end!));
    }
    
    setFilteredHistory(filtered);
  }, [priceHistory, searchQuery, actionFilter, userFilter, dateRangeFilter]);

  // Get unique users from price history
  const getUniqueUsers = (): string[] => {
    const users = priceHistory.map(entry => entry.userName);
    return [...new Set(users)];
  };

  // Helper to format action types
  const formatActionType = (action: PriceHistoryAction): string => {
    const actionLabels: Record<PriceHistoryAction, string> = {
      'create': 'Criação',
      'update': 'Atualização',
      'delete': 'Exclusão',
      'bulk_update': 'Atualização em Massa'
    };
    
    return actionLabels[action] || action;
  };

  // Helper to get action icon
  const getActionIcon = (action: PriceHistoryAction) => {
    switch (action) {
      case 'create':
        return <MdAdd className="text-green-600" />;
      case 'update':
        return <MdEdit className="text-blue-600" />;
      case 'delete':
        return <MdDelete className="text-red-600" />;
      case 'bulk_update':
        return <MdFilterList className="text-purple-600" />;
      default:
        return <MdHistory className="text-gray-600" />;
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActionFilter('');
    setUserFilter('');
    setDateRangeFilter({});
    setFilterMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/services/pricing" className="mr-4 text-gray-600 hover:text-gray-800">
          <MdArrowBack className="text-2xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            Histórico de Preços
          </h1>
          <p className="text-gray-600">
            Visualize o histórico de alterações nos preços dos serviços
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuário ou detalhes..."
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
                
                {/* Action filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Ação
                  </label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as PriceHistoryAction | '')}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as ações</option>
                    <option value="create">Criação</option>
                    <option value="update">Atualização</option>
                    <option value="delete">Exclusão</option>
                    <option value="bulk_update">Atualização em Massa</option>
                  </select>
                </div>
                
                {/* User filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuário
                  </label>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os usuários</option>
                    {getUniqueUsers().map((user, index) => (
                      <option key={index} value={user}>{user}</option>
                    ))}
                  </select>
                </div>
                
                {/* Date range filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={dateRangeFilter.start ? new Date(dateRangeFilter.start).toISOString().substr(0, 10) : ''}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      start: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={dateRangeFilter.end ? new Date(dateRangeFilter.end).toISOString().substr(0, 10) : ''}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      end: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
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
        
        {/* Active filters */}
        {(searchQuery || actionFilter || userFilter || dateRangeFilter.start || dateRangeFilter.end) && (
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
            
            {actionFilter && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Ação: {formatActionType(actionFilter)}
                <button 
                  onClick={() => setActionFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {userFilter && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Usuário: {userFilter}
                <button 
                  onClick={() => setUserFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {dateRangeFilter.start && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                A partir de: {new Date(dateRangeFilter.start).toLocaleDateString()}
                <button 
                  onClick={() => setDateRangeFilter(prev => ({ ...prev, start: undefined }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {dateRangeFilter.end && (
              <span className="px-2 py-1 bg-gray-100 rounded-md flex items-center">
                Até: {new Date(dateRangeFilter.end).toLocaleDateString()}
                <button 
                  onClick={() => setDateRangeFilter(prev => ({ ...prev, end: undefined }))}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* History list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Registros de Alteração</h2>
          <p className="text-sm text-gray-500">Histórico de mudanças nos preços dos serviços</p>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MdHistory className="text-gray-300 text-5xl mx-auto mb-2" />
            <p className="text-lg font-medium">Nenhum registro encontrado</p>
            <p className="mt-1">Ajuste os filtros ou tente uma nova busca.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredHistory.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {getActionIcon(entry.action)}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium">
                          {formatActionType(entry.action)} {' '}
                          {entry.action === 'bulk_update' ? 'em massa' : 'de preço'}
                        </h3>
                        <p className="text-xs text-gray-500">
                          por <span className="font-medium">{entry.userName}</span> em {formatDate(entry.date, true)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      {entry.action === 'bulk_update' ? (
                        <p className="text-sm">{entry.details.bulkUpdateInfo}</p>
                      ) : entry.action === 'create' && entry.details.ruleId ? (
                        <p className="text-sm">Nova regra de preço criada</p>
                      ) : (
                        <>
                          {entry.details.serviceTypeId && (
                            <div className="text-sm">
                              <span className="text-gray-600">Serviço:</span> {entry.details.serviceTypeId}
                            </div>
                          )}
                          
                          {entry.details.garmentTypeId && (
                            <div className="text-sm">
                              <span className="text-gray-600">Tipo de Peça:</span> {entry.details.garmentTypeId}
                            </div>
                          )}
                          
                          {entry.action === 'update' && entry.details.oldPrice !== undefined && entry.details.newPrice !== undefined && (
                            <div className="text-sm mt-1">
                              <span className="text-gray-600">Preço:</span>{' '}
                              <span className="line-through text-gray-500">{formatCurrency(entry.details.oldPrice)}</span>
                              {' → '}
                              <span className="font-medium">{formatCurrency(entry.details.newPrice)}</span>
                              <span className="ml-1 text-xs">
                                ({entry.details.oldPrice < entry.details.newPrice ? '+' : ''}
                                {((entry.details.newPrice - entry.details.oldPrice) / entry.details.oldPrice * 100).toFixed(1)}%)
                              </span>
                            </div>
                          )}
                          
                          {entry.action === 'create' && entry.details.newPrice !== undefined && (
                            <div className="text-sm mt-1">
                              <span className="text-gray-600">Preço Inicial:</span>{' '}
                              <span className="font-medium">{formatCurrency(entry.details.newPrice)}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {entry.notes && (
                        <p className="mt-1 text-sm italic text-gray-600">
                          Nota: {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredHistory.length}</span> de{' '}
            <span className="font-medium">{priceHistory.length}</span> registros
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryPage; 
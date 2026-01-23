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

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

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
        return <MdAdd className="text-emerald-500 dark:text-emerald-400" />;
      case 'update':
        return <MdEdit className="text-blue-500 dark:text-blue-400" />;
      case 'delete':
        return <MdDelete className="text-red-500 dark:text-red-400" />;
      case 'bulk_update':
        return <MdFilterList className="text-purple-500 dark:text-purple-400" />;
      default:
        return <MdHistory className="text-slate-500 dark:text-slate-400" />;
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
      <div className="flex justify-center items-center h-full p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 dark:border-emerald-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300 overflow-x-hidden">
      <div className="flex flex-wrap items-center mb-6 gap-4">
        <Link to="/services/pricing" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200">
          <MdArrowBack className="text-2xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-emerald-500 dark:text-emerald-400" />
            Histórico de Preços
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize o histórico de alterações nos preços dos serviços
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por usuário ou detalhes..."
              className="pl-10 w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            />
          </div>
          
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="inline-flex items-center px-4 py-2 h-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200 whitespace-nowrap"
            >
              <MdFilterList className="mr-1" /> Filtros
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-lg z-10 p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Filtrar por</h3>
                
                {/* Action filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Ação
                  </label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as PriceHistoryAction | '')}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Usuário
                  </label>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  >
                    <option value="">Todos os usuários</option>
                    {getUniqueUsers().map((user, index) => (
                      <option key={index} value={user}>{user}</option>
                    ))}
                  </select>
                </div>
                
                {/* Date range filter */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={dateRangeFilter.start ? new Date(dateRangeFilter.start).toISOString().substr(0, 10) : ''}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      start: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={dateRangeFilter.end ? new Date(dateRangeFilter.end).toISOString().substr(0, 10) : ''}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      end: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-1.5 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
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
            <span className="text-slate-500 dark:text-slate-400">Filtros ativos:</span>
            
            {searchQuery && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center text-slate-700 dark:text-slate-300">
                Busca: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            
            {actionFilter && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center text-slate-700 dark:text-slate-300">
                Ação: {formatActionType(actionFilter)}
                <button 
                  onClick={() => setActionFilter('')}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            
            {userFilter && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center text-slate-700 dark:text-slate-300">
                Usuário: {userFilter}
                <button 
                  onClick={() => setUserFilter('')}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            
            {dateRangeFilter.start && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center text-slate-700 dark:text-slate-300">
                A partir de: {new Date(dateRangeFilter.start).toLocaleDateString()}
                <button 
                  onClick={() => setDateRangeFilter(prev => ({ ...prev, start: undefined }))}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
            
            {dateRangeFilter.end && (
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center text-slate-700 dark:text-slate-300">
                Até: {new Date(dateRangeFilter.end).toLocaleDateString()}
                <button 
                  onClick={() => setDateRangeFilter(prev => ({ ...prev, end: undefined }))}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* History list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Registros de Alteração</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Histórico de mudanças nos preços dos serviços</p>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <MdHistory className="text-slate-300 dark:text-slate-600 text-5xl mx-auto mb-2" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">Nenhum registro encontrado</p>
            <p className="mt-1">Ajuste os filtros ou tente uma nova busca.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredHistory.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                      {getActionIcon(entry.action)}
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white break-words">
                          {formatActionType(entry.action)} {' '}
                          {entry.action === 'bulk_update' ? 'em massa' : 'de preço'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                          por <span className="font-medium">{entry.userName}</span> em {formatDate(entry.date, true)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {entry.action === 'bulk_update' ? (
                        <p className="text-sm text-slate-700 dark:text-slate-300 break-words">{entry.details.bulkUpdateInfo}</p>
                      ) : entry.action === 'create' && entry.details.ruleId ? (
                        <p className="text-sm text-slate-700 dark:text-slate-300 break-words">Nova regra de preço criada</p>
                      ) : (
                        <>
                          {entry.details.serviceTypeId && (
                            <div className="text-sm text-slate-700 dark:text-slate-300 break-words">
                              <span className="text-slate-600 dark:text-slate-400">Serviço:</span> {entry.details.serviceTypeId}
                            </div>
                          )}
                          
                          {entry.details.garmentTypeId && (
                            <div className="text-sm text-slate-700 dark:text-slate-300 break-words">
                              <span className="text-slate-600 dark:text-slate-400">Tipo de Peça:</span> {entry.details.garmentTypeId}
                            </div>
                          )}
                          
                          {entry.action === 'update' && entry.details.oldPrice !== undefined && entry.details.newPrice !== undefined && (
                            <div className="text-sm mt-1 break-words">
                              <span className="text-slate-600 dark:text-slate-400">Preço:</span>{' '}
                              <span className="line-through text-slate-500 dark:text-slate-500">{formatCurrency(entry.details.oldPrice)}</span>
                              {' → '}
                              <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(entry.details.newPrice)}</span>
                              <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">
                                ({entry.details.oldPrice < entry.details.newPrice ? '+' : ''}
                                {((entry.details.newPrice - entry.details.oldPrice) / entry.details.oldPrice * 100).toFixed(1)}%)
                              </span>
                            </div>
                          )}
                          
                          {entry.action === 'create' && entry.details.newPrice !== undefined && (
                            <div className="text-sm mt-1 break-words">
                              <span className="text-slate-600 dark:text-slate-400">Preço Inicial:</span>{' '}
                              <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(entry.details.newPrice)}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {entry.notes && (
                        <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-400 break-words">
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
        
        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Mostrando <span className="font-medium">{filteredHistory.length}</span> de{' '}
            <span className="font-medium">{priceHistory.length}</span> registros
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
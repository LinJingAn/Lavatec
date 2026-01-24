import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdCampaign,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdPause,
  MdPlayArrow,
  MdEdit,
  MdDelete,
  MdBarChart,
  MdError
} from 'react-icons/md';
import { MarketingService, Campaign } from '@/services';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await MarketingService.getCampaigns({
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      setCampaigns(result.campaigns || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Erro ao carregar campanhas. Verifique a conexão com o servidor.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handlePauseCampaign = async (id: string) => {
    try {
      await MarketingService.updateCampaign(id, { status: 'paused' });
      fetchCampaigns();
    } catch (err) {
      console.error('Error pausing campaign:', err);
      alert('Erro ao pausar campanha');
    }
  };

  const handleResumeCampaign = async (id: string) => {
    try {
      await MarketingService.updateCampaign(id, { status: 'active' });
      fetchCampaigns();
    } catch (err) {
      console.error('Error resuming campaign:', err);
      alert('Erro ao retomar campanha');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;
    
    try {
      await MarketingService.deleteCampaign(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Erro ao excluir campanha');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!campaign.name.toLowerCase().includes(term) && 
          !campaign.description?.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Ativa</span>;
      case 'scheduled':
        return <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Agendada</span>;
      case 'paused':
        return <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pausada</span>;
      case 'completed':
        return <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Concluída</span>;
      case 'draft':
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Rascunho</span>;
    }
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <MdCampaign className="mr-2 text-emerald-600" size={20} />
            Campanhas Promocionais
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie suas campanhas de marketing e promoções para seus clientes</p>
        </div>
        
        <button
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
        >
          <MdAdd className="mr-1" /> Nova Campanha
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar campanhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded py-2 px-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 flex items-center"
        >
          <MdFilterList className="mr-1" size={18} />
          <span>Filtros</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-slate-600 rounded py-2 px-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="active">Ativas</option>
                <option value="scheduled">Agendadas</option>
                <option value="paused">Pausadas</option>
                <option value="completed">Concluídas</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Campanha</th>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Tipo</th>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Status</th>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Período</th>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Enviados</th>
                <th className="px-6 py-3 text-left tracking-wider font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.description}</div>
                      {campaign.open_rate !== undefined && campaign.click_rate !== undefined && (
                        <div className="mt-1 flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{campaign.sent_count?.toLocaleString() || 0} enviados</span>
                          <span>{(campaign.open_rate * 100).toFixed(1)}% abertos</span>
                          <span>{(campaign.click_rate * 100).toFixed(1)}% cliques</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {campaign.scheduled_at ? (
                        <>
                          {new Date(campaign.scheduled_at).toLocaleDateString('pt-BR')}
                          {campaign.completed_at && ` até ${new Date(campaign.completed_at).toLocaleDateString('pt-BR')}`}
                        </>
                      ) : (
                        'Não agendada'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {campaign.sent_count?.toLocaleString() || 0} / {campaign.target_count?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4 items-center">
                        {campaign.status === 'active' && (
                          <button 
                            title="Pausar"
                            onClick={() => handlePauseCampaign(campaign.id)}
                          >
                            <MdPause className="text-yellow-500 hover:text-yellow-600" size={18} />
                          </button>
                        )}
                        
                        {campaign.status === 'paused' && (
                          <button 
                            title="Retomar"
                            onClick={() => handleResumeCampaign(campaign.id)}
                          >
                            <MdPlayArrow className="text-green-500 hover:text-green-600" size={18} />
                          </button>
                        )}
                        
                        <button title="Editar">
                          <MdEdit className="text-blue-500 hover:text-blue-600" size={18} />
                        </button>
                        
                        <button 
                          title="Excluir"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <MdDelete className="text-red-500 hover:text-red-600" size={18} />
                        </button>
                        
                        <button title="Estatísticas">
                          <MdBarChart className="text-blue-500 hover:text-blue-600" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {error ? 'Erro ao carregar dados.' : 'Nenhuma campanha encontrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;

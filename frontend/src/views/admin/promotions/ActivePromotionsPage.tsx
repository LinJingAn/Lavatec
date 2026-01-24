import React, { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdEdit, MdDelete, MdPause, MdPlayArrow, MdError } from 'react-icons/md';
import { PromotionService } from '@/services';

interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_count?: number;
  max_uses?: number;
}

const ActivePromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PromotionService.getPromotions({ is_active: true });
      setPromotions(result.promotions || []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Erro ao carregar promoções. Verifique a conexão com o servidor.');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleTogglePromotion = async (id: string, isActive: boolean) => {
    try {
      await PromotionService.updatePromotion(id, { is_active: !isActive });
      fetchPromotions();
    } catch (err) {
      console.error('Error toggling promotion:', err);
      alert('Erro ao atualizar promoção');
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta promoção?')) return;
    
    try {
      await PromotionService.deletePromotion(id);
      fetchPromotions();
    } catch (err) {
      console.error('Error deleting promotion:', err);
      alert('Erro ao excluir promoção');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promoções Ativas</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center">
          <MdAdd className="mr-1" /> Nova Promoção
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <MdError className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma promoção ativa no momento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Promoção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Desconto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{promo.name}</div>
                      {promo.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{promo.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {promo.discount_type === 'percentage' 
                        ? `${promo.discount_value}%` 
                        : formatCurrency(promo.discount_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(promo.start_date).toLocaleDateString('pt-BR')} - {new Date(promo.end_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {promo.usage_count || 0} {promo.max_uses ? `/ ${promo.max_uses}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promo.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {promo.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleTogglePromotion(promo.id, promo.is_active)}
                        className={`mr-3 ${promo.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={promo.is_active ? 'Pausar' : 'Ativar'}
                      >
                        {promo.is_active ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeletePromotion(promo.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePromotionsPage;

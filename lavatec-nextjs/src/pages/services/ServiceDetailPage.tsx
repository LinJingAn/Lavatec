import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdAccessTime,
  MdLocalOffer,
  MdFormatListBulleted,
  MdOutlineDryCleaning,
  MdVisibility,
  MdVisibilityOff,
  MdCategory,
  MdOutlineAttachMoney,
  MdInfo,
  MdInfoOutline,
  MdCheckCircle,
  MdNoteAdd,
  MdCancel,
  MdLocalLaundryService,
  MdWarning,
  MdLightbulbOutline,
  MdList,
  MdToggleOn,
  MdToggleOff
} from 'react-icons/md';
import {
  ServiceType,
  PriceVariant,
  generateMockServiceTypes,
  generateMockPriceVariants,
  getCategoryName
} from '../../models/ServiceTypes';
import { formatCurrency } from '../../lib/utils';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceType | null>(null);
  const [priceVariants, setPriceVariants] = useState<PriceVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!serviceId) {
      navigate('/services');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const services = generateMockServiceTypes();
      const service = services.find(s => s.id === serviceId);
      
      if (!service) {
        navigate('/services');
        return;
      }
      
      setService(service);
      
      const allVariants = generateMockPriceVariants();
      const serviceVariants = allVariants.filter(v => v.serviceTypeId === serviceId);
      setPriceVariants(serviceVariants);
      
      setLoading(false);
    }, 500);
  }, [serviceId, navigate]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format processing time
  const formatProcessingTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)} minutos`;
    if (hours === 1) return '1 hora';
    if (hours % 1 === 0) return `${hours} horas`;
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours}h ${minutes}min`;
  };

  const handleToggleAvailability = () => {
    if (!service) return;
    
    // In a real app, this would be an API call
    setService({
      ...service,
      isAvailable: !service.isAvailable
    });

    // Success message
    alert(`Serviço ${!service.isAvailable ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDeleteService = () => {
    // In a real app, this would be an API call
    setDeleteConfirmOpen(false);
    
    // Navigate back to services list
    navigate('/services');
    
    // Success message (would be shown on the services list page)
    // toast.success('Serviço excluído com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do serviço...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <MdWarning className="text-red-500 text-5xl mb-4" />
        <h1 className="text-2xl font-bold mb-2">Serviço não encontrado</h1>
        <p className="text-gray-600 mb-6">O serviço solicitado não foi encontrado ou não existe.</p>
        <Link
          to="/services"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          <MdArrowBack className="mr-2" /> Voltar para Serviços
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-xl">
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/services')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <MdArrowBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">{service.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleAvailability}
            className={`inline-flex items-center px-3 py-2 rounded text-sm font-medium ${
              service.isAvailable
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {service.isAvailable ? (
              <>
                <MdToggleOff className="mr-1" /> Desativar
              </>
            ) : (
              <>
                <MdToggleOn className="mr-1" /> Ativar
              </>
            )}
          </button>
          <Link
            to={`/services/${service.id}/edit`}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            <MdEdit className="mr-1" /> Editar
          </Link>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            <MdDelete className="mr-1" /> Excluir
          </button>
        </div>
      </div>

      {/* Service details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Detalhes do Serviço</h2>
              
              <div className="flex items-start mb-4">
                <MdCategory className="text-gray-500 text-xl mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium">{getCategoryName(service.categoryId)}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MdOutlineAttachMoney className="text-gray-500 text-xl mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Preço Base</p>
                  <p className="font-medium">{formatCurrency(service.basePrice)}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MdAccessTime className="text-gray-500 text-xl mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tempo de Processamento</p>
                  <p className="font-medium">{formatProcessingTime(service.processingTimeHours)}</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <MdLocalLaundryService className="text-gray-500 text-xl mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tipos de Peças Aplicáveis</p>
                  <ul className="list-disc pl-5 mt-1">
                    {service.applicableGarmentTypes.map((type, index) => (
                      <li key={index} className="text-gray-800">{type}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Additional details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
              
              <div className="mb-4">
                <h3 className="text-gray-700 font-medium mb-2">Descrição</h3>
                <p className="text-gray-800">{service.description}</p>
              </div>
              
              {service.specialInstructions && (
                <div className="mb-4">
                  <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                    <MdWarning className="text-amber-500 mr-1" /> Instruções Especiais
                  </h3>
                  <p className="text-gray-800 bg-amber-50 p-3 rounded-md border border-amber-100">
                    {service.specialInstructions}
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                  <MdLightbulbOutline className="mr-1" /> Opções de Serviço
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-600">Requer Manuseio Especial</p>
                    <p className={`font-medium ${service.needsSpecialHandling ? 'text-amber-600' : 'text-green-600'}`}>
                      {service.needsSpecialHandling ? 'Sim' : 'Não'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-600">Opção Expressa</p>
                    <p className={`font-medium ${service.hasExpressOption ? 'text-green-600' : 'text-gray-600'}`}>
                      {service.hasExpressOption ? 
                        `Sim (+${(service.expressMultiplier! - 1) * 100}%)` : 
                        'Não Disponível'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price variants */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Variantes de Preço</h2>
            <Link
              to={`/services/${service.id}/price-variants`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Gerenciar Variantes
            </Link>
          </div>
          
          {priceVariants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MdList className="text-gray-400 text-4xl mx-auto mb-2" />
              <p>Nenhuma variante de preço definida para este serviço.</p>
              <Link
                to={`/services/${service.id}/price-variants/add`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Adicionar Variante
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Padrão
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceVariants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{variant.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500">{variant.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {formatCurrency(service.basePrice * variant.multiplier)}
                          {variant.multiplier !== 1 && (
                            <span className="text-gray-500 text-sm ml-1">
                              ({variant.multiplier > 1 ? '+' : ''}{((variant.multiplier - 1) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {variant.isDefault ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Padrão
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir o serviço <strong>{service.name}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteService}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage; 
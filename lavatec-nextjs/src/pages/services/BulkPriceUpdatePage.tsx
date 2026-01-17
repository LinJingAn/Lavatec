import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdSave, 
  MdClose, 
  MdPreview, 
  MdDescription,
  MdOutlineDryCleaning,
  MdHistory,
  MdWarning,
  MdCheckCircle
} from 'react-icons/md';
import { 
  ServiceCategory, 
  ServiceType,
  mockServiceTypes,
  getCategoryName
} from '../../models/ServiceTypes';
import {
  BulkPriceUpdateRequest,
  GarmentType,
  PriceMatrixEntry,
  mockGarmentTypes,
  mockPriceMatrix
} from '../../models/PricingTable';
import { formatCurrency } from '../../lib/utils';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const BulkPriceUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [priceMatrix, setPriceMatrix] = useState<PriceMatrixEntry[]>([]);
  
  const [updateName, setUpdateName] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'percentage'>('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedServiceCategories, setSelectedServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [selectedGarmentCategories, setSelectedGarmentCategories] = useState<string[]>([]);
  
  const [previewMode, setPreviewMode] = useState(false);
  const [previewResults, setPreviewResults] = useState<{
    serviceId: string;
    serviceName: string;
    garmentId: string;
    garmentName: string;
    oldPrice: number;
    newPrice: number;
    difference: number;
    percentChange: number;
  }[]>([]);
  
  // Load data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      const serviceData = mockServiceTypes;
      const garmentData = mockGarmentTypes;
      const priceData = mockPriceMatrix;
      
      setServices(serviceData);
      setGarmentTypes(garmentData);
      setPriceMatrix(priceData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get unique service categories
  const getServiceCategories = (): ServiceCategory[] => {
    const categories = services.map(service => service.categoryId);
    return [...new Set(categories)] as ServiceCategory[];
  };

  // Get unique garment categories
  const getGarmentCategories = (): string[] => {
    const categories = garmentTypes.map(garment => garment.category);
    return [...new Set(categories)];
  };

  // Handle service category selection
  const handleServiceCategoryChange = (category: ServiceCategory) => {
    setSelectedServiceCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle garment category selection
  const handleGarmentCategoryChange = (category: string) => {
    setSelectedGarmentCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle service selection
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Handle garment selection
  const handleGarmentChange = (garmentId: string) => {
    setSelectedGarmentIds(prev => {
      if (prev.includes(garmentId)) {
        return prev.filter(id => id !== garmentId);
      } else {
        return [...prev, garmentId];
      }
    });
  };

  // Filter services by selected categories
  const filteredServices = selectedServiceCategories.length > 0
    ? services.filter(service => selectedServiceCategories.includes(service.categoryId))
    : services;

  // Filter garments by selected categories
  const filteredGarments = selectedGarmentCategories.length > 0
    ? garmentTypes.filter(garment => selectedGarmentCategories.includes(garment.category))
    : garmentTypes;
    
  // Check if a service is effectively selected (either directly or via its category)
  const isServiceSelected = (service: ServiceType): boolean => {
    return selectedServiceIds.includes(service.id) || 
           selectedServiceCategories.includes(service.categoryId);
  };
  
  // Check if a garment is effectively selected (either directly or via its category)
  const isGarmentSelected = (garment: GarmentType): boolean => {
    return selectedGarmentIds.includes(garment.id) || 
           selectedGarmentCategories.includes(garment.category);
  };

  // Generate preview
  const handleGeneratePreview = () => {
    // Filter the price matrix to include only selected services and garments
    const results: {
      serviceId: string;
      serviceName: string;
      garmentId: string;
      garmentName: string;
      oldPrice: number;
      newPrice: number;
      difference: number;
      percentChange: number;
    }[] = [];
    
    // Get effectively selected services and garments
    const selectedServices = services.filter(service => isServiceSelected(service));
    const selectedGarments = garmentTypes.filter(garment => isGarmentSelected(garment));
    
    // Loop through all combinations
    selectedServices.forEach(service => {
      selectedGarments.forEach(garment => {
        // Find existing price entry
        const priceEntry = priceMatrix.find(
          entry => entry.serviceTypeId === service.id && 
                  entry.garmentTypeId === garment.id &&
                  entry.isActive
        );
        
        if (priceEntry) {
          // Calculate new price
          let newPrice = priceEntry.basePrice;
          
          if (adjustmentType === 'fixed') {
            newPrice += adjustmentValue;
          } else {
            newPrice *= (1 + adjustmentValue / 100);
          }
          
          // Ensure no negative prices
          newPrice = Math.max(0, newPrice);
          
          // Calculate difference and percent change
          const difference = newPrice - priceEntry.basePrice;
          const percentChange = priceEntry.basePrice > 0 
            ? (difference / priceEntry.basePrice) * 100 
            : 0;
            
          results.push({
            serviceId: service.id,
            serviceName: service.name,
            garmentId: garment.id,
            garmentName: garment.name,
            oldPrice: priceEntry.basePrice,
            newPrice,
            difference,
            percentChange
          });
        }
      });
    });
    
    setPreviewResults(results);
    setPreviewMode(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    // In a real app, this would save the updated prices to the database
    
    // Create a bulk update record
    const bulkUpdateRequest: BulkPriceUpdateRequest = {
      id: `bulk-${Date.now()}`,
      name: updateName,
      description: updateDescription,
      filters: {
        serviceTypeIds: selectedServiceIds,
        serviceCategories: selectedServiceCategories,
        garmentTypeIds: selectedGarmentIds,
        garmentCategories: selectedGarmentCategories,
      },
      update: {
        adjustmentType,
        adjustmentValue
      },
      previewCount: previewResults.length,
      affectedPricesCount: previewResults.length,
      createdBy: 'current-user',
      createdAt: new Date(),
      executedAt: new Date(),
      status: 'executed'
    };
    
    // Show success message
    alert('Atualização de preços executada com sucesso!');
    
    // Navigate back to pricing matrix
    navigate('/services/pricing');
  };

  // Cancel
  const handleCancel = () => {
    if (previewMode) {
      setPreviewMode(false);
    } else {
      navigate('/services/pricing');
    }
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
            Atualização em Massa de Preços
          </h1>
          <p className="text-gray-600">
            Atualize múltiplos preços simultaneamente
          </p>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Prévia das Alterações</h2>
            
            <div className="mb-6 bg-blue-50 text-blue-700 p-4 rounded-md">
              <div className="flex items-start">
                <MdDescription className="mt-0.5 mr-2 text-blue-600" />
                <div>
                  <p className="font-medium">{updateName}</p>
                  {updateDescription && <p className="text-sm mt-1">{updateDescription}</p>}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Tipo de Ajuste:</p>
                  <p>
                    {adjustmentType === 'percentage' 
                      ? `${adjustmentValue > 0 ? '+' : ''}${adjustmentValue}%` 
                      : `${adjustmentValue > 0 ? '+' : ''}${formatCurrency(adjustmentValue)}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Itens Afetados:</p>
                  <p>{previewResults.length} combinações de preço</p>
                </div>
              </div>
            </div>
            
            {previewResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MdWarning className="text-5xl mx-auto mb-2 text-orange-500" />
                <p className="text-lg font-medium">Nenhum preço será afetado</p>
                <p className="mt-1">Verifique seus filtros de seleção e tente novamente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Peça
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Atual
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Novo Preço
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diferença
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.serviceName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{result.garmentName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                          {formatCurrency(result.oldPrice)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                          {formatCurrency(result.newPrice)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                          <span className={result.difference > 0 ? 'text-green-600' : result.difference < 0 ? 'text-red-600' : 'text-gray-500'}>
                            {result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)} ({result.percentChange.toFixed(1)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <MdClose className="inline mr-1" /> Voltar
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={previewResults.length === 0}
                className={`px-4 py-2 bg-green-600 text-white rounded-md flex items-center ${
                  previewResults.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                <MdCheckCircle className="mr-1" /> Aplicar Alterações
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Update Settings */}
              <div>
                <h2 className="text-lg font-medium mb-4">Configurações da Atualização</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da atualização *
                  </label>
                  <input
                    type="text"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Aumento de preços - Janeiro 2023"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva o motivo da atualização..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de ajuste
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="percentage"
                        name="adjustmentType"
                        checked={adjustmentType === 'percentage'}
                        onChange={() => setAdjustmentType('percentage')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="percentage" className="ml-2 block text-sm text-gray-700">
                        Percentual
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="fixed"
                        name="adjustmentType"
                        checked={adjustmentType === 'fixed'}
                        onChange={() => setAdjustmentType('fixed')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="fixed" className="ml-2 block text-sm text-gray-700">
                        Valor Fixo
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {adjustmentType === 'percentage' ? 'Percentual (%)' : 'Valor (R$)'}
                  </label>
                  <input
                    type="number"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(parseFloat(e.target.value) || 0)}
                    step={adjustmentType === 'percentage' ? '0.1' : '0.01'}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {adjustmentType === 'percentage'
                      ? 'Insira valores positivos para aumento e negativos para desconto. Ex: 5 para aumentar 5%.'
                      : 'Insira valores positivos para aumento e negativos para desconto. Ex: 2.50 para aumentar R$ 2,50.'}
                  </p>
                </div>
                
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias de Serviço</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getServiceCategories().map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-category-${category}`}
                          checked={selectedServiceCategories.includes(category)}
                          onChange={() => handleServiceCategoryChange(category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`service-category-${category}`} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {getCategoryName(category)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categorias de Peça</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getGarmentCategories().map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`garment-category-${category}`}
                          checked={selectedGarmentCategories.includes(category)}
                          onChange={() => handleGarmentCategoryChange(category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`garment-category-${category}`} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right side - Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Seleção Específica</h2>
                  <div className="text-sm text-gray-500">
                    {selectedServiceIds.length} serviços, {selectedGarmentIds.length} peças
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Serviços</h3>
                  <div className="border border-gray-300 rounded-md h-60 overflow-y-auto p-2">
                    {filteredServices.map(service => (
                      <div key={service.id} className="flex items-center py-1 border-b border-gray-100">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={selectedServiceIds.includes(service.id)}
                          onChange={() => handleServiceChange(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`service-${service.id}`} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="text-xs text-gray-500 ml-1">({getCategoryName(service.categoryId)})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tipos de Peça</h3>
                  <div className="border border-gray-300 rounded-md h-60 overflow-y-auto p-2">
                    {filteredGarments.map(garment => (
                      <div key={garment.id} className="flex items-center py-1 border-b border-gray-100">
                        <input
                          type="checkbox"
                          id={`garment-${garment.id}`}
                          checked={selectedGarmentIds.includes(garment.id)}
                          onChange={() => handleGarmentChange(garment.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={`garment-${garment.id}`} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          <span className="font-medium">{garment.name}</span>
                          <span className="text-xs text-gray-500 ml-1">({garment.category})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <MdClose className="inline mr-1" /> Cancelar
              </button>
              
              <button
                onClick={handleGeneratePreview}
                disabled={!updateName || adjustmentValue === 0}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center ${
                  !updateName || adjustmentValue === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                <MdPreview className="mr-1" /> Gerar Prévia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkPriceUpdatePage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
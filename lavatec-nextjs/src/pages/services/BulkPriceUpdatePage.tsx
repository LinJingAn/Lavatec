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
            Atualização em Massa de Preços
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Atualize múltiplos preços simultaneamente
          </p>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Prévia das Alterações</h2>
            
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start">
                <MdDescription className="mt-0.5 mr-2 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium break-words">{updateName}</p>
                  {updateDescription && <p className="text-sm mt-1 break-words">{updateDescription}</p>}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Tipo de Ajuste:</p>
                  <p className="break-words">
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
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <MdWarning className="text-5xl mx-auto mb-2 text-orange-500 dark:text-orange-400" />
                <p className="text-lg font-medium text-slate-900 dark:text-white">Nenhum preço será afetado</p>
                <p className="mt-1">Verifique seus filtros de seleção e tente novamente.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tipo de Peça
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Preço Atual
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Novo Preço
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Diferença
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {previewResults.map((result, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{result.serviceName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-slate-700 dark:text-slate-300">{result.garmentName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-slate-900 dark:text-white">
                          {formatCurrency(result.oldPrice)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(result.newPrice)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                          <span className={result.difference > 0 ? 'text-emerald-600 dark:text-emerald-400' : result.difference < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
                            {result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)} ({result.percentChange.toFixed(1)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3 flex-wrap gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 whitespace-nowrap"
              >
                <MdClose className="inline mr-1" /> Voltar
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={previewResults.length === 0}
                className={`px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center transition-colors duration-200 whitespace-nowrap ${
                  previewResults.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'
                }`}
              >
                <MdCheckCircle className="mr-1" /> Aplicar Alterações
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-colors duration-300">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Update Settings */}
              <div className="min-w-0 space-y-4">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">Configurações da Atualização</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 break-words">
                    Nome da atualização *
                  </label>
                  <input
                    type="text"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="Ex: Aumento de preços - Janeiro 2023"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 break-words">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-none"
                    placeholder="Descreva o motivo da atualização..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 break-words">
                    Tipo de ajuste
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="percentage"
                        name="adjustmentType"
                        checked={adjustmentType === 'percentage'}
                        onChange={() => setAdjustmentType('percentage')}
                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                      />
                      <label htmlFor="percentage" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
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
                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                      />
                      <label htmlFor="fixed" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        Valor Fixo
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 break-words">
                    {adjustmentType === 'percentage' ? 'Percentual (%)' : 'Valor (R$)'}
                  </label>
                  <input
                    type="number"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(parseFloat(e.target.value) || 0)}
                    step={adjustmentType === 'percentage' ? '0.1' : '0.01'}
                    className="w-full h-10 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 break-words">
                    {adjustmentType === 'percentage'
                      ? 'Insira valores positivos para aumento e negativos para desconto. Ex: 5 para aumentar 5%.'
                      : 'Insira valores positivos para aumento e negativos para desconto. Ex: 2.50 para aumentar R$ 2,50.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 break-words">Categorias de Serviço</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getServiceCategories().map((category) => (
                      <div key={category} className="flex items-start min-w-0">
                        <input
                          type="checkbox"
                          id={`service-category-${category}`}
                          checked={selectedServiceCategories.includes(category)}
                          onChange={() => handleServiceCategoryChange(category)}
                          className="mt-0.5 mr-2 flex-shrink-0 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                        />
                        <label 
                          htmlFor={`service-category-${category}`} 
                          className="text-sm text-slate-700 dark:text-slate-300 flex-1 min-w-0 break-words cursor-pointer leading-relaxed"
                        >
                          {getCategoryName(category)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 break-words">Categorias de Peça</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {getGarmentCategories().map((category) => (
                      <div key={category} className="flex items-start min-w-0">
                        <input
                          type="checkbox"
                          id={`garment-category-${category}`}
                          checked={selectedGarmentCategories.includes(category)}
                          onChange={() => handleGarmentCategoryChange(category)}
                          className="mt-0.5 mr-2 flex-shrink-0 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                        />
                        <label 
                          htmlFor={`garment-category-${category}`} 
                          className="text-sm text-slate-700 dark:text-slate-300 flex-1 min-w-0 break-words cursor-pointer leading-relaxed"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right side - Selection */}
              <div className="min-w-0 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h2 className="text-lg font-medium text-slate-900 dark:text-white">Seleção Específica</h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {selectedServiceIds.length} serviços, {selectedGarmentIds.length} peças
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 break-words">Serviços</h3>
                  <div className="border border-slate-300 dark:border-slate-600 rounded-lg h-80 overflow-y-auto p-3 bg-white dark:bg-slate-700 transition-colors duration-200">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                        Nenhum serviço disponível
                      </div>
                    ) : (
                      filteredServices.map(service => (
                        <div key={service.id} className="flex items-start py-2 border-b border-slate-200 dark:border-slate-600 last:border-b-0 min-w-0">
                          <input
                            type="checkbox"
                            id={`service-${service.id}`}
                            checked={selectedServiceIds.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            className="mt-0.5 mr-2 flex-shrink-0 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                          />
                          <label 
                            htmlFor={`service-${service.id}`} 
                            className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed"
                          >
                            <span className="font-medium break-words">{service.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 break-words">({getCategoryName(service.categoryId)})</span>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 break-words">Tipos de Peça</h3>
                  <div className="border border-slate-300 dark:border-slate-600 rounded-lg h-80 overflow-y-auto p-3 bg-white dark:bg-slate-700 transition-colors duration-200">
                    {filteredGarments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                        Nenhum tipo de peça disponível
                      </div>
                    ) : (
                      filteredGarments.map(garment => (
                        <div key={garment.id} className="flex items-start py-2 border-b border-slate-200 dark:border-slate-600 last:border-b-0 min-w-0">
                          <input
                            type="checkbox"
                            id={`garment-${garment.id}`}
                            checked={selectedGarmentIds.includes(garment.id)}
                            onChange={() => handleGarmentChange(garment.id)}
                            className="mt-0.5 mr-2 flex-shrink-0 h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                          />
                          <label 
                            htmlFor={`garment-${garment.id}`} 
                            className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 cursor-pointer leading-relaxed"
                          >
                            <span className="font-medium break-words">{garment.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 break-words">({garment.category})</span>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3 flex-wrap gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 whitespace-nowrap"
              >
                <MdClose className="inline mr-1" /> Cancelar
              </button>
              
              <button
                onClick={handleGeneratePreview}
                disabled={!updateName || adjustmentValue === 0}
                className={`px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center transition-colors duration-200 whitespace-nowrap ${
                  !updateName || adjustmentValue === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'
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
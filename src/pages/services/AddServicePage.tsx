import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSave, MdCancel, MdAdd, MdDelete, MdOutlineDryCleaning } from 'react-icons/md';
import { ServiceCategory, PriceVariant, getCategoryName } from '../../models/ServiceTypes';

const AddServicePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '' as ServiceCategory | '',
    basePrice: '',
    processingTimeHours: '',
    isAvailable: true,
    hasExpressOption: false,
    expressMultiplier: '1.5',
    needsSpecialHandling: false
  });
  
  // Price variants
  const [priceVariants, setPriceVariants] = useState<(Omit<PriceVariant, 'id' | 'serviceTypeId'> & { tempId: string })[]>([
    { tempId: '1', name: 'Padrão', description: 'Variante padrão', multiplier: 1, isDefault: true }
  ]);
  
  // Check if form is valid
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome do serviço é obrigatório';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Categoria é obrigatória';
    }
    
    const basePrice = parseFloat(formData.basePrice);
    if (isNaN(basePrice) || basePrice <= 0) {
      errors.basePrice = 'Preço base deve ser um valor positivo';
    }
    
    const processingTime = parseFloat(formData.processingTimeHours);
    if (isNaN(processingTime) || processingTime <= 0) {
      errors.processingTimeHours = 'Tempo de processamento deve ser um valor positivo';
    }
    
    if (formData.hasExpressOption) {
      const expressMultiplier = parseFloat(formData.expressMultiplier);
      if (isNaN(expressMultiplier) || expressMultiplier <= 1) {
        errors.expressMultiplier = 'Multiplicador expresso deve ser maior que 1';
      }
    }
    
    // Validate price variants
    const variantErrors: string[] = [];
    priceVariants.forEach((variant, index) => {
      if (!variant.name.trim()) {
        variantErrors.push(`Variante ${index + 1}: Nome é obrigatório`);
      }
      if (variant.multiplier <= 0) {
        variantErrors.push(`Variante ${index + 1}: Multiplicador deve ser positivo`);
      }
    });
    
    if (variantErrors.length > 0) {
      errors.variants = variantErrors.join('. ');
    }
    
    // Check if any default variant exists
    const hasDefaultVariant = priceVariants.some(v => v.isDefault);
    if (!hasDefaultVariant && priceVariants.length > 0) {
      errors.variants = (errors.variants || '') + ' Uma variante deve ser definida como padrão.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle variant change
  const handleVariantChange = (index: number, field: keyof PriceVariant, value: any) => {
    const updatedVariants = [...priceVariants];
    
    // If setting a new default, unset all others
    if (field === 'isDefault' && value === true) {
      updatedVariants.forEach(v => {
        v.isDefault = false;
      });
    }
    
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    
    setPriceVariants(updatedVariants);
  };
  
  // Add new variant
  const addVariant = () => {
    setPriceVariants(prev => [
      ...prev,
      {
        tempId: Date.now().toString(),
        name: '',
        description: '',
        multiplier: 1,
        isDefault: false
      }
    ]);
  };
  
  // Remove variant
  const removeVariant = (index: number) => {
    if (priceVariants.length <= 1) {
      return; // Keep at least one variant
    }
    
    const updatedVariants = [...priceVariants];
    const removedVariant = updatedVariants.splice(index, 1)[0];
    
    // If removing the default variant, set the first remaining one as default
    if (removedVariant.isDefault && updatedVariants.length > 0) {
      updatedVariants[0].isDefault = true;
    }
    
    setPriceVariants(updatedVariants);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert form data to proper types
      const serviceData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        processingTimeHours: parseFloat(formData.processingTimeHours),
        expressMultiplier: formData.hasExpressOption ? parseFloat(formData.expressMultiplier) : null,
        variants: priceVariants.map(({ tempId, ...variant }) => variant)
      };
      
      // Simulate API call - would normally send to backend
      console.log('Submitting service:', serviceData);
      
      // Simulate success after 1 second
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/services');
      }, 1000);
    } catch (error) {
      console.error('Error creating service:', error);
      setIsSubmitting(false);
      setFormErrors({
        submit: 'Ocorreu um erro ao criar o serviço. Tente novamente.'
      });
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            Adicionar Novo Serviço
          </h1>
          <p className="text-gray-600">Preencha os detalhes para criar um novo tipo de serviço</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {formErrors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {formErrors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-lg font-medium text-gray-800 border-b pb-2">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Serviço*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Ex: Lavagem Simples"
                  maxLength={100}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria*
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="laundry">Lavanderia</option>
                  <option value="drycleaning">Lavagem a Seco</option>
                  <option value="ironing">Passadoria</option>
                  <option value="special">Tratamentos Especiais</option>
                  <option value="household">Itens Domésticos</option>
                </select>
                {formErrors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o serviço detalhadamente..."
              />
            </div>
          </div>
          
          {/* Pricing and Processing Section */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-lg font-medium text-gray-800 border-b pb-2">Preço e Processamento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base Price */}
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Base (R$)*
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full rounded-md border ${formErrors.basePrice ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="29.90"
                />
                {formErrors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.basePrice}</p>
                )}
              </div>
              
              {/* Processing Time */}
              <div>
                <label htmlFor="processingTimeHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Processamento (horas)*
                </label>
                <input
                  type="number"
                  id="processingTimeHours"
                  name="processingTimeHours"
                  value={formData.processingTimeHours}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  className={`w-full rounded-md border ${formErrors.processingTimeHours ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="24"
                />
                {formErrors.processingTimeHours && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.processingTimeHours}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Tempo estimado para conclusão deste serviço em horas.
                </p>
              </div>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Available */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'isAvailable',
                      value: e.target.checked ? 'true' : 'false'
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Disponível para pedidos
                </label>
              </div>
              
              {/* Special Handling */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="needsSpecialHandling"
                  name="needsSpecialHandling"
                  checked={formData.needsSpecialHandling}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'needsSpecialHandling',
                      value: e.target.checked ? 'true' : 'false'
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="needsSpecialHandling" className="ml-2 block text-sm text-gray-700">
                  Requer manuseio especial
                </label>
              </div>
              
              {/* Express Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasExpressOption"
                  name="hasExpressOption"
                  checked={formData.hasExpressOption}
                  onChange={(e) => handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'hasExpressOption',
                      value: e.target.checked ? 'true' : 'false'
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasExpressOption" className="ml-2 block text-sm text-gray-700">
                  Opção expressa disponível
                </label>
              </div>
            </div>
            
            {/* Express Multiplier */}
            {formData.hasExpressOption && (
              <div className="ml-6">
                <label htmlFor="expressMultiplier" className="block text-sm font-medium text-gray-700 mb-1">
                  Multiplicador Expresso
                </label>
                <input
                  type="number"
                  id="expressMultiplier"
                  name="expressMultiplier"
                  value={formData.expressMultiplier}
                  onChange={handleInputChange}
                  min="1.1"
                  step="0.1"
                  className={`w-full max-w-xs rounded-md border ${formErrors.expressMultiplier ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="1.5"
                />
                {formErrors.expressMultiplier && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.expressMultiplier}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Multiplicador aplicado ao preço para o serviço expresso (ex: 1.5 = +50%).
                </p>
              </div>
            )}
          </div>
          
          {/* Price Variants Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-medium text-gray-800">Variantes de Preço</h2>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MdAdd className="mr-1" /> Adicionar Variante
              </button>
            </div>
            
            {formErrors.variants && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {formErrors.variants}
              </div>
            )}
            
            <div className="space-y-4">
              {priceVariants.map((variant, index) => (
                <div key={variant.tempId} className="border rounded-md p-4 bg-gray-50 relative">
                  {priceVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Remover variante"
                    >
                      <MdDelete />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Variant Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Variante*
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Padrão, Premium, Deluxe"
                      />
                    </div>
                    
                    {/* Variant Multiplier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Multiplicador de Preço*
                      </label>
                      <input
                        type="number"
                        value={variant.multiplier}
                        onChange={(e) => handleVariantChange(index, 'multiplier', parseFloat(e.target.value))}
                        step="0.05"
                        min="0.1"
                        className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1.0"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        1.0 = preço base, 1.5 = +50% do preço base
                      </p>
                    </div>
                    
                    {/* Default Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`isDefault-${variant.tempId}`}
                        checked={variant.isDefault}
                        onChange={(e) => handleVariantChange(index, 'isDefault', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`isDefault-${variant.tempId}`} className="ml-2 block text-sm text-gray-700">
                        Definir como variante padrão
                      </label>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={variant.description}
                      onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                      className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descreva esta variante (opcional)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MdCancel className="inline-block mr-1" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2 align-middle"></span>
                Salvando...
              </>
            ) : (
              <>
                <MdSave className="inline-block mr-1" /> Salvar Serviço
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServicePage; 
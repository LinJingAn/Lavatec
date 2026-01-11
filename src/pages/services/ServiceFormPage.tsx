import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MdSave, 
  MdClose, 
  MdArrowBack,
  MdOutlineDryCleaning,
  MdAddCircleOutline,
  MdRemoveCircleOutline
} from 'react-icons/md';
import { 
  ServiceType, 
  ServiceCategory,
  generateMockServiceTypes
} from '../../models/ServiceTypes';

const initialService: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  categoryId: 'laundry',
  basePrice: 0,
  processingTimeHours: 24,
  isAvailable: true,
  hasExpressOption: false,
  needsSpecialHandling: false,
  applicableGarmentTypes: []
};

const SERVICE_CATEGORIES = [
  { id: 'laundry', name: 'Lavanderia' },
  { id: 'drycleaning', name: 'Lavagem a Seco' },
  { id: 'ironing', name: 'Passadoria' },
  { id: 'special', name: 'Tratamentos Especiais' },
  { id: 'household', name: 'Itens Domésticos' }
];

const COMMON_GARMENT_TYPES = [
  'Camisetas', 'Calças', 'Shorts', 'Vestidos', 
  'Camisas Sociais', 'Calças Sociais', 'Blusas', 
  'Jaquetas', 'Casacos', 'Roupas Íntimas', 
  'Meias', 'Edredons', 'Cobertores', 'Lençóis',
  'Toalhas', 'Cortinas', 'Tapetes'
];

const ServiceFormPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!serviceId;
  
  const [formData, setFormData] = useState<Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>>(initialService);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGarmentType, setNewGarmentType] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);

  // Load service data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      
      // Simulate API call to fetch service
      setTimeout(() => {
        const services = generateMockServiceTypes();
        const serviceToEdit = services.find(s => s.id === serviceId);
        
        if (serviceToEdit) {
          const {
            id, createdAt, updatedAt,
            ...serviceData
          } = serviceToEdit;
          
          setFormData(serviceData);
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [serviceId, isEditMode]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // Special case: if hasExpressOption is unchecked, reset the expressMultiplier
    if (name === 'hasExpressOption' && !checked) {
      setFormData(prev => ({ ...prev, expressMultiplier: undefined }));
    }
    
    // Special case: if hasExpressOption is checked and no multiplier, set default
    if (name === 'hasExpressOption' && checked && !formData.expressMultiplier) {
      setFormData(prev => ({ ...prev, expressMultiplier: 1.5 }));
    }
  };

  // Add garment type
  const handleAddGarmentType = () => {
    if (!newGarmentType.trim()) return;
    
    if (!formData.applicableGarmentTypes.includes(newGarmentType.trim())) {
      setFormData(prev => ({
        ...prev,
        applicableGarmentTypes: [...prev.applicableGarmentTypes, newGarmentType.trim()]
      }));
    }
    
    setNewGarmentType('');
  };

  // Remove garment type
  const handleRemoveGarmentType = (garmentType: string) => {
    setFormData(prev => ({
      ...prev,
      applicableGarmentTypes: prev.applicableGarmentTypes.filter(t => t !== garmentType)
    }));
  };

  // Add common garment type
  const handleAddCommonGarmentType = (garmentType: string) => {
    if (!formData.applicableGarmentTypes.includes(garmentType)) {
      setFormData(prev => ({
        ...prev,
        applicableGarmentTypes: [...prev.applicableGarmentTypes, garmentType]
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Preço deve ser maior que zero';
    }
    
    if (formData.processingTimeHours <= 0) {
      newErrors.processingTimeHours = 'Tempo de processamento deve ser maior que zero';
    }
    
    if (formData.hasExpressOption && (!formData.expressMultiplier || formData.expressMultiplier <= 1)) {
      newErrors.expressMultiplier = 'Multiplicador expresso deve ser maior que 1';
    }
    
    if (formData.applicableGarmentTypes.length === 0) {
      newErrors.applicableGarmentTypes = 'Adicione pelo menos um tipo de roupa aplicável';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        // Update service
        console.log('Updating service:', { ...formData, id: serviceId });
      } else {
        // Create new service
        console.log('Creating service:', formData);
      }
      
      setIsSubmitting(false);
      navigate('/services');
    }, 1000);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/services" className="mr-4 text-gray-600 hover:text-gray-800">
            <MdArrowBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            {isEditMode ? 'Editar Serviço' : 'Novo Serviço'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Informações Básicas</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: Lavagem Simples"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {SERVICE_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Base (R$) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md ${errors.basePrice ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.basePrice && <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempo de Processamento (horas) *
                  </label>
                  <input
                    type="number"
                    name="processingTimeHours"
                    value={formData.processingTimeHours}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md ${errors.processingTimeHours ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.processingTimeHours && <p className="mt-1 text-sm text-red-500">{errors.processingTimeHours}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Descreva o serviço em detalhes..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>
              </div>
              
              {/* Additional Settings */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Configurações Adicionais</h2>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                      Serviço disponível para clientes
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="needsSpecialHandling"
                      name="needsSpecialHandling"
                      checked={formData.needsSpecialHandling}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needsSpecialHandling" className="ml-2 block text-sm text-gray-700">
                      Requer manuseio especial
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasExpressOption"
                      name="hasExpressOption"
                      checked={formData.hasExpressOption}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasExpressOption" className="ml-2 block text-sm text-gray-700">
                      Opção de serviço expresso disponível
                    </label>
                  </div>
                  
                  {formData.hasExpressOption && (
                    <div className="mt-2 pl-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Multiplicador de Preço Expresso *
                      </label>
                      <input
                        type="number"
                        name="expressMultiplier"
                        value={formData.expressMultiplier || 1.5}
                        onChange={handleChange}
                        step="0.1"
                        min="1.1"
                        className={`w-full px-3 py-2 border rounded-md ${errors.expressMultiplier ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Ex: 1.5 = acréscimo de 50% no preço para serviço expresso
                      </p>
                      {errors.expressMultiplier && <p className="mt-1 text-sm text-red-500">{errors.expressMultiplier}</p>}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instruções Especiais
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Instruções especiais para o processamento..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipos de Peças Aplicáveis *
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newGarmentType}
                      onChange={(e) => setNewGarmentType(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Adicionar tipo de peça..."
                    />
                    <button
                      type="button"
                      onClick={handleAddGarmentType}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <MdAddCircleOutline />
                    </button>
                  </div>
                  
                  {/* Common garment types */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">Tipos comuns:</p>
                    <div className="flex flex-wrap gap-1">
                      {COMMON_GARMENT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleAddCommonGarmentType(type)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            formData.applicableGarmentTypes.includes(type)
                              ? 'bg-blue-100 text-blue-800 cursor-default'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          disabled={formData.applicableGarmentTypes.includes(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    {formData.applicableGarmentTypes.length > 0 ? (
                      <ul className="space-y-1">
                        {formData.applicableGarmentTypes.map((type) => (
                          <li key={type} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md">
                            <span>{type}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGarmentType(type)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <MdRemoveCircleOutline />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Nenhum tipo de peça adicionado</p>
                    )}
                  </div>
                  
                  {errors.applicableGarmentTypes && (
                    <p className="mt-1 text-sm text-red-500">{errors.applicableGarmentTypes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Link
              to="/services"
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
            >
              <MdClose className="mr-1" /> Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <MdSave className="mr-1" /> {isSubmitting ? 'Salvando...' : 'Salvar Serviço'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormPage; 
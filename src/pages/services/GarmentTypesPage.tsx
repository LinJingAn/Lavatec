import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaToggleOn, FaToggleOff, FaArrowLeft } from 'react-icons/fa';
import { 
  mockGarmentTypes, 
  GarmentType, 
  getCategoryName,
  getCareLevelDescription,
  GarmentCategoryId 
} from '../../models/GarmentCategories';

// Interface for the component's props
interface GarmentTypesPageProps {}

const GarmentTypesPage: React.FC<GarmentTypesPageProps> = () => {
  const navigate = useNavigate();
  
  // State variables
  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<GarmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<GarmentType | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Categories for filter dropdown
  const categories = [
    { id: 'tops', name: 'Peças Superiores' },
    { id: 'bottoms', name: 'Peças Inferiores' },
    { id: 'dresses', name: 'Vestidos' },
    { id: 'suits', name: 'Ternos e Conjuntos' },
    { id: 'outerwear', name: 'Peças Externas' },
    { id: 'intimate', name: 'Roupas Íntimas' },
    { id: 'accessories', name: 'Acessórios' },
    { id: 'household', name: 'Itens Domésticos' },
    { id: 'special', name: 'Itens Especiais' }
  ];
  
  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    basePrice: '',
    isActive: true
  });
  
  // Load mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with delay
        setTimeout(() => {
          setGarmentTypes(mockGarmentTypes);
          setFilteredTypes(mockGarmentTypes);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching garment types:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter garment types based on search query and selected category
  useEffect(() => {
    let result = [...garmentTypes];
    
    if (searchQuery) {
      result = result.filter(type => 
        type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(type => type.categoryId === selectedCategory);
    }
    
    setFilteredTypes(result);
  }, [searchQuery, selectedCategory, garmentTypes]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  
  // Toggle garment type active status
  const handleToggleStatus = (id: string) => {
    const updatedTypes = garmentTypes.map(type => {
      if (type.id === id) {
        return { ...type, isActive: !type.isActive };
      }
      return type;
    });
    
    setGarmentTypes(updatedTypes);
  };
  
  // Open modal for adding a new garment type
  const handleAddNew = () => {
    setCurrentType(null);
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      basePrice: '',
      isActive: true
    });
    setFormErrors({});
    setShowAddModal(true);
  };
  
  // Open modal for editing an existing garment type
  const handleEdit = (type: GarmentType) => {
    setCurrentType(type);
    setFormData({
      name: type.name,
      categoryId: type.categoryId,
      description: type.description,
      basePrice: type.defaultPrice ? type.defaultPrice.toString() : '',
      isActive: type.isActive
    });
    setFormErrors({});
    setShowAddModal(true);
  };
  
  // Handle delete garment type
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de roupa?')) {
      const updatedTypes = garmentTypes.filter(type => type.id !== id);
      setGarmentTypes(updatedTypes);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'O nome é obrigatório';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'A categoria é obrigatória';
    }
    
    if (!formData.basePrice.trim()) {
      errors.basePrice = 'O preço base é obrigatório';
    } else if (isNaN(parseFloat(formData.basePrice)) || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = 'O preço base deve ser um número positivo';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const typeData: Partial<GarmentType> = {
      id: currentType ? currentType.id : `type-${Date.now()}`,
      name: formData.name,
      categoryId: formData.categoryId as GarmentCategoryId,
      description: formData.description,
      defaultPrice: parseFloat(formData.basePrice),
      isActive: formData.isActive,
      defaultMaterials: currentType?.defaultMaterials || ['cotton'],
      defaultCareInstructions: currentType?.defaultCareInstructions || '',
      careLevel: currentType?.careLevel || 'standard',
      priceMultiplier: currentType?.priceMultiplier || 1.0,
      hasSpecialHandling: currentType?.hasSpecialHandling || false,
      estimatedProcessingTimeMinutes: currentType?.estimatedProcessingTimeMinutes || 15,
      createdAt: currentType ? currentType.createdAt : new Date(),
      updatedAt: new Date()
    };
    
    if (currentType) {
      // Update existing garment type
      const updatedTypes = garmentTypes.map(type => {
        if (type.id === currentType.id) {
          return {...type, ...typeData} as GarmentType;
        }
        return type;
      });
      setGarmentTypes(updatedTypes);
    } else {
      // Add new garment type
      setGarmentTypes([...garmentTypes, typeData as GarmentType]);
    }
    
    setShowAddModal(false);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/services/garment-categories" className="mr-3 text-blue-500 hover:text-blue-700">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Tipos de Roupas</h1>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Adicionar Tipo
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tipos de roupas..."
                className="w-full px-4 py-2 border rounded pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Garment types table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Descrição</th>
                  <th className="px-4 py-3 text-right">Preço Base</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length > 0 ? (
                  filteredTypes.map(type => (
                    <tr key={type.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{type.name}</td>
                      <td className="px-4 py-3">
                        {getCategoryName(type.categoryId)}
                      </td>
                      <td className="px-4 py-3">{type.description}</td>
                      <td className="px-4 py-3 text-right">
                        {(type.defaultPrice || (type.priceMultiplier * 10)).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(type.id)}
                          className={`text-lg ${type.isActive ? 'text-green-500' : 'text-gray-400'}`}
                          title={type.isActive ? 'Ativo' : 'Inativo'}
                        >
                          {type.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(type)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Nenhum tipo de roupa encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                {currentType ? 'Editar Tipo de Roupa' : 'Adicionar Novo Tipo de Roupa'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nome*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : ''}`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Categoria*</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.categoryId ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.categoryId}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Preço Base (R$)*</label>
                <input
                  type="text"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${formErrors.basePrice ? 'border-red-500' : ''}`}
                />
                {formErrors.basePrice && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.basePrice}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Ativo</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-2 border-t pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {currentType ? 'Salvar alterações' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarmentTypesPage; 
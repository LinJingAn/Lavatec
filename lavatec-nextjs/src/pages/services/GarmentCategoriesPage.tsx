import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility, 
  MdVisibilityOff,
  MdSearch, 
  MdFilterList,
  MdOutlineDryCleaning,
  MdArrowBack,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import { 
  GarmentCategory, 
  GarmentCategoryId,
  CareLevel,
  mockGarmentCategories,
  getCategoryName,
  getCareLevelDescription
} from '../../models/GarmentCategories';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const GarmentCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<GarmentCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<GarmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editCategory, setEditCategory] = useState<GarmentCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Fetch data from mock
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setCategories(mockGarmentCategories);
      setFilteredCategories(mockGarmentCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  // Apply filters when search query or showInactive changes
  useEffect(() => {
    let filtered = [...categories];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(query) || 
        category.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(category => category.isActive);
    }
    
    // Sort by sortOrder
    filtered.sort((a, b) => a.sortOrder - b.sortOrder);
    
    setFilteredCategories(filtered);
  }, [categories, searchQuery, showInactive]);

  // Handle toggling category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Navigate back
  const handleGoBack = () => {
    navigate('/services');
  };

  // Open add category modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setEditCategory(null);
  };

  // Open edit category modal
  const handleOpenEditModal = (category: GarmentCategory) => {
    setEditCategory(category);
    setIsAddModalOpen(true);
  };

  // Handle category toggle status (active/inactive)
  const handleToggleStatus = (categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, isActive: !category.isActive } 
          : category
      )
    );
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prev => prev.filter(category => category.id !== categoryId));
    }
  };

  // Render loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineDryCleaning className="mr-2 text-blue-600" />
            Categorias de Itens
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <MdAdd className="mr-1" /> Nova Categoria
          </button>
        </div>
      </div>
      
      {/* Search and filter controls */}
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
              placeholder="Buscar categorias..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Show inactive toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-inactive"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="show-inactive" className="ml-2 text-sm text-gray-700">
              Mostrar Inativos
            </label>
          </div>
        </div>
      </div>
      
      {/* Categories list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Categorias de Itens</h2>
          <span className="text-sm text-gray-500">{filteredCategories.length} categorias</span>
        </div>
        
        {filteredCategories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhuma categoria encontrada.
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
                    Nível de Cuidado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Multiplicador de Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr className={`hover:bg-gray-50 ${!category.isActive ? 'bg-gray-50 text-gray-400' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="mr-2 text-gray-400 hover:text-gray-500"
                          >
                            {expandedCategories.includes(category.id) 
                              ? <MdExpandLess size={18} /> 
                              : <MdExpandMore size={18} />}
                          </button>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">
                          {category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {getCareLevelDescription(category.defaultCareLevel)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium">
                          {category.defaultPriceMultiplier.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(category.id)}
                          className={`hover:text-blue-900 mr-3 ${
                            category.isActive ? 'text-gray-600' : 'text-yellow-600'
                          }`}
                        >
                          {category.isActive ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedCategories.includes(category.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            <h3 className="font-medium mb-2">Detalhes da Categoria</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p><span className="font-medium">ID:</span> {category.id}</p>
                                <p><span className="font-medium">Ordem de Exibição:</span> {category.sortOrder}</p>
                                <p><span className="font-medium">Nível de Cuidado:</span> {getCareLevelDescription(category.defaultCareLevel)}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Multiplicador de Preço:</span> {category.defaultPriceMultiplier.toFixed(2)}x</p>
                                <p><span className="font-medium">Data de Criação:</span> {category.createdAt.toLocaleDateString()}</p>
                                <p><span className="font-medium">Última Atualização:</span> {category.updatedAt.toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Link 
                                to={`/services/garment-types/${category.id}`} 
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Ver tipos de itens nesta categoria
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <CategoryFormModal
          category={editCategory}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(savedCategory) => {
            if (editCategory) {
              // Update existing category
              setCategories(prev => 
                prev.map(cat => cat.id === savedCategory.id ? savedCategory : cat)
              );
            } else {
              // Add new category
              setCategories(prev => [...prev, savedCategory]);
            }
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Category Form Modal Component
interface CategoryFormModalProps {
  category: GarmentCategory | null;
  onClose: () => void;
  onSave: (category: GarmentCategory) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, onClose, onSave }) => {
  const isEditing = !!category;
  
  const [formData, setFormData] = useState<Omit<GarmentCategory, 'createdAt' | 'updatedAt'>>({
    id: category?.id || ('') as GarmentCategoryId,
    name: category?.name || '',
    description: category?.description || '',
    defaultCareLevel: category?.defaultCareLevel || 'standard',
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder || (Math.max(...mockGarmentCategories.map(c => c.sortOrder), 0) + 1),
    defaultPriceMultiplier: category?.defaultPriceMultiplier || 1.0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.id.trim()) {
      newErrors.id = 'ID é obrigatório';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.defaultPriceMultiplier <= 0) {
      newErrors.defaultPriceMultiplier = 'Multiplicador deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        createdAt: category?.createdAt || new Date(),
        updatedAt: new Date()
      });
    }
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) 
          : value
    }));
  };
  
  const careLevelOptions = [
    { value: 'standard', label: 'Cuidado Padrão' },
    { value: 'delicate', label: 'Cuidado Delicado' },
    { value: 'veryDelicate', label: 'Cuidado Muito Delicado' },
    { value: 'specialCare', label: 'Cuidado Especial' }
  ];
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdDelete size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID da Categoria
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isEditing}
                className={`w-full border ${
                  errors.id ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 ${
                  isEditing ? 'bg-gray-100' : ''
                }`}
              />
              {errors.id && (
                <p className="mt-1 text-sm text-red-500">{errors.id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Cuidado Padrão
              </label>
              <select
                name="defaultCareLevel"
                value={formData.defaultCareLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                {careLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Multiplicador de Preço
              </label>
              <input
                type="number"
                name="defaultPriceMultiplier"
                value={formData.defaultPriceMultiplier}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                className={`w-full border ${
                  errors.defaultPriceMultiplier ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.defaultPriceMultiplier && (
                <p className="mt-1 text-sm text-red-500">{errors.defaultPriceMultiplier}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordem de Exibição
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Categoria Ativa
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GarmentCategoriesPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
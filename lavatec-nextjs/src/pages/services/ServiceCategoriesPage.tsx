import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdOutlineDryCleaning,
  MdOutlineLocalLaundryService,
  MdIron,
  MdWash,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md';
import { ServiceCategory, getCategoryName } from '../../models/ServiceTypes';

// Mock data for service categories
const mockServiceCategories = [
  { 
    id: 'drycleaning',
    name: 'Lavagem a Seco', 
    icon: <MdOutlineDryCleaning className="text-blue-600" size={24} />,
    description: 'Serviços de limpeza a seco para roupas delicadas e especiais',
    count: 12,
    isActive: true
  },
  { 
    id: 'laundry',
    name: 'Lavanderia', 
    icon: <MdOutlineLocalLaundryService className="text-green-600" size={24} />,
    description: 'Serviços de lavagem comum para roupas do dia a dia',
    count: 18,
    isActive: true
  },
  { 
    id: 'ironing',
    name: 'Passadoria', 
    icon: <MdIron className="text-orange-600" size={24} />,
    description: 'Serviços de passar roupas e remoção de amassados',
    count: 6,
    isActive: true
  },
  { 
    id: 'special',
    name: 'Tratamentos Especiais', 
    icon: <MdWash className="text-purple-600" size={24} />,
    description: 'Serviços especiais como remoção de manchas e restauração',
    count: 8,
    isActive: true
  },
  { 
    id: 'household',
    name: 'Itens Domésticos', 
    icon: <MdOutlineDryCleaning className="text-gray-600" size={24} />,
    description: 'Serviços para itens domésticos como tapetes, cortinas e edredons',
    count: 4,
    isActive: true
  }
];

const ServiceCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState(mockServiceCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });

  // Simulate API call
  useEffect(() => {
    setIsLoading(true);
    // Simulated API call delay
    setTimeout(() => {
      setCategories(mockServiceCategories);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleEditClick = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditForm({
        name: category.name,
        description: category.description
      });
      setEditingCategory(categoryId);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
  };

  const handleSaveEdit = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, name: editForm.name, description: editForm.description }
        : category
    ));
    setEditingCategory(null);
    setEditForm({ name: '', description: '' });
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(category => category.id !== categoryToDelete));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias de Serviços</h1>
          <p className="text-gray-600">Gerencie as categorias de serviços oferecidos</p>
        </div>
        <Link
          to="/services/add-category"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <MdAdd className="mr-2" /> Nova Categoria
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviços
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCategory === category.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border border-gray-300 rounded-md px-3 py-1 w-full"
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-3">
                        {category.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.id}</div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingCategory === category.id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="border border-gray-300 rounded-md px-3 py-1 w-full"
                      rows={2}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{category.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{category.count} serviços</div>
                  <Link
                    to={`/services?category=${category.id}`}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Ver serviços
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(category.id)}
                    className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.isActive ? (
                      <>
                        <MdCheckCircle className="mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <MdCancel className="mr-1" />
                        Inativo
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingCategory === category.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(category.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(category.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-gray-500 mb-4">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita e pode afetar serviços associados.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategoriesPage; 
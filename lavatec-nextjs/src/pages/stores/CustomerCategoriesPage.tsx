import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdInfo, MdPeople, MdEdit, MdDelete } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Initial category data
const initialCategories = [
  {
    id: 1,
    name: 'Regular',
    code: 'regular',
    description: 'Clientes que frequentam regularmente, geralmente uma ou duas vezes por mês.',
    criteria: 'Frequência de 1-2 visitas por mês, valor médio de R$ 100-200 por mês.',
    color: 'blue',
    customerCount: 45
  },
  {
    id: 2,
    name: 'Frequente',
    code: 'heavy',
    description: 'Clientes que utilizam nossos serviços com grande frequência, pelo menos uma vez por semana.',
    criteria: 'Frequência de 4+ visitas por mês, valor médio acima de R$ 400 por mês.',
    color: 'purple',
    customerCount: 12
  },
  {
    id: 3,
    name: 'Ocasional',
    code: 'occasional',
    description: 'Clientes que utilizam nossos serviços ocasionalmente, algumas vezes por trimestre.',
    criteria: 'Frequência de 1-3 visitas por trimestre, valor médio de R$ 50-300 por trimestre.',
    color: 'yellow',
    customerCount: 38
  },
  {
    id: 4,
    name: 'Raro',
    code: 'rare',
    description: 'Clientes que raramente utilizam nossos serviços, menos de uma vez por trimestre.',
    criteria: 'Frequência menor que 1 visita por trimestre, valor médio abaixo de R$ 50 por trimestre.',
    color: 'gray',
    customerCount: 27
  }
];

const CustomerCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    criteria: '',
    color: 'blue'
  });
  
  const availableColors = [
    { name: 'Azul', value: 'blue' },
    { name: 'Roxo', value: 'purple' },
    { name: 'Verde', value: 'green' },
    { name: 'Amarelo', value: 'yellow' },
    { name: 'Vermelho', value: 'red' },
    { name: 'Cinza', value: 'gray' }
  ];
  
  const handleGoBack = () => {
    navigate('/stores/customers');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const startEditing = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setFormData({
        name: category.name,
        code: category.code,
        description: category.description,
        criteria: category.criteria,
        color: category.color
      });
      setEditingCategory(categoryId);
      setIsAddingNew(false);
    }
  };
  
  const cancelEditing = () => {
    setEditingCategory(null);
    setIsAddingNew(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      criteria: '',
      color: 'blue'
    });
  };
  
  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditingCategory(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      criteria: '',
      color: 'blue'
    });
  };
  
  const saveCategory = () => {
    // Basic validation
    if (!formData.name || !formData.code || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (isAddingNew) {
      // Add new category
      const newCategory = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        criteria: formData.criteria,
        color: formData.color,
        customerCount: 0
      };
      
      setCategories([...categories, newCategory]);
      alert('Nova categoria adicionada com sucesso!');
    } else if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(category => 
        category.id === editingCategory 
          ? { 
              ...category, 
              name: formData.name,
              code: formData.code,
              description: formData.description,
              criteria: formData.criteria,
              color: formData.color
            } 
          : category
      );
      
      setCategories(updatedCategories);
      alert('Categoria atualizada com sucesso!');
    }
    
    // Reset form
    cancelEditing();
  };
  
  const deleteCategory = (categoryId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar clientes classificados nesta categoria.')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setCategories(updatedCategories);
      alert('Categoria excluída com sucesso!');
    }
  };
  
  const getCategoryColorClass = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'gray': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const viewCustomersByCategory = (categoryCode: string) => {
    navigate(`/stores/customers/${categoryCode}`);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Categorias de Clientes
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={startAddingNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar Nova Categoria
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start p-4 bg-blue-50 rounded-lg mb-6">
          <MdInfo className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Sobre as Categorias de Clientes</h3>
            <p className="text-blue-700 text-sm">
              As categorias ajudam a classificar seus clientes com base na frequência de uso e valor gasto.
              Isso permite oferecer promoções personalizadas e entender melhor o comportamento dos diferentes tipos de clientes.
              Use as categorias para segmentar sua base de clientes e criar estratégias de marketing direcionadas.
            </p>
          </div>
        </div>
        
        {(isAddingNew || editingCategory !== null) && (
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingNew ? 'Adicionar Nova Categoria' : 'Editar Categoria'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ex: VIP"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código da Categoria <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ex: vip (somente letras minúsculas, sem espaço)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  O código é usado internamente pelo sistema.
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Descreva esta categoria de cliente"
                  required
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Critérios de Classificação
                </label>
                <textarea
                  name="criteria"
                  value={formData.criteria}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Critérios para classificar um cliente nesta categoria"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {availableColors.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
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
                  Critérios
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clientes
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColorClass(category.color)}`}>
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{category.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{category.criteria || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => viewCustomersByCategory(category.code)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <MdPeople className="mr-1" /> {category.customerCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => startEditing(category.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar categoria"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir categoria"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerCategoriesPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
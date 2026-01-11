import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAdd, 
  MdDelete, 
  MdEdit, 
  MdContentCopy, 
  MdOutlineEmail,
  MdSearch,
  MdFilterList
} from 'react-icons/md';

// Mock data for email templates
const mockTemplates = [
  {
    id: 1,
    name: 'Boas-vindas ao Cliente',
    subject: 'Bem-vindo à Lavatec - Sua lavanderia de confiança!',
    description: 'Email de boas-vindas enviado quando um cliente cria uma conta',
    lastModified: '2023-10-15',
    category: 'Onboarding',
    usageCount: 1245
  },
  {
    id: 2,
    name: 'Confirmação de Pedido',
    subject: 'Seu pedido foi recebido - Detalhes da sua lavagem',
    description: 'Enviado após um cliente fazer um pedido',
    lastModified: '2023-11-02',
    category: 'Transacional',
    usageCount: 3782
  },
  {
    id: 3,
    name: 'Pedido Pronto para Retirada',
    subject: 'Seu pedido está pronto para retirada!',
    description: 'Notifica o cliente quando o pedido está pronto',
    lastModified: '2023-10-28',
    category: 'Transacional',
    usageCount: 3241
  },
  {
    id: 4,
    name: 'Recuperação de Carrinho',
    subject: 'Você esqueceu algo? Complete seu pedido agora',
    description: 'Enviado quando um cliente abandona o carrinho',
    lastModified: '2023-09-18',
    category: 'Marketing',
    usageCount: 567
  },
  {
    id: 5,
    name: 'Feedback do Cliente',
    subject: 'Como foi sua experiência com a Lavatec?',
    description: 'Solicita feedback do cliente após a conclusão do pedido',
    lastModified: '2023-11-10',
    category: 'Feedback',
    usageCount: 2874
  }
];

const EmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter templates based on search and category filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(templates.map(template => template.category))];

  // Handle template deletion
  const handleDeleteTemplate = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdOutlineEmail className="mr-2 text-blue-600" />
            Templates de Email
          </h1>
          <p className="text-gray-600">Gerencie os templates de email para comunicação com os clientes</p>
        </div>
        
        <Link
          to="/stores/marketing/email-templates/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <MdAdd className="mr-2" /> Novo Template
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar templates..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <MdFilterList className="mr-2" /> Filtros
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filtrar por categoria</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1.5 px-3"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setIsFilterOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Template
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assunto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Modificação
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{template.subject}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.lastModified}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.usageCount.toLocaleString()} envios
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link to={`/stores/marketing/email-templates/${template.id}/preview`} className="text-indigo-600 hover:text-indigo-900">
                      Visualizar
                    </Link>
                    <Link to={`/stores/marketing/email-templates/${template.id}/edit`} className="text-blue-600 hover:text-blue-900">
                      <MdEdit size={18} />
                    </Link>
                    <button onClick={() => handleDeleteTemplate(template.id)} className="text-red-600 hover:text-red-900">
                      <MdDelete size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <MdContentCopy size={18} title="Duplicar template" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailTemplatesPage; 
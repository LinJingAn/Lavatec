import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdSms } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const SMSTemplatesPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Confirmação de Pedido',
      description: 'Enviado quando um pedido é realizado',
      content: 'Obrigado pelo seu pedido #{order_number}. Nós iremos processá-lo em breve.',
      variables: ['order_number'],
      characterCount: 85
    },
    {
      id: 2,
      name: 'Pedido Pronto',
      description: 'Enviado quando um pedido está pronto para retirada',
      content: 'Seu pedido #{order_number} está pronto para retirada!',
      variables: ['order_number'],
      characterCount: 45
    },
    {
      id: 3,
      name: 'Oferta Especial',
      description: 'Mensagem promocional para ofertas especiais',
      content: 'Oferta especial: #{offer_details}. Use o código #{promo_code} para economizar!',
      variables: ['offer_details', 'promo_code'],
      characterCount: 75
    }
  ]);

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  const handleEditTemplate = (id: number) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit template:', id);
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBackToMarketing}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <MdArrowBack className="text-gray-600" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Templates de SMS</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie seus templates de mensagens SMS
            </p>
          </div>
        </div>
        <Button>
          <MdAdd className="mr-2" size={20} />
          Criar Template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <MdSms className="text-purple-600" size={24} />
                </div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleEditTemplate(template.id)}
                  className="text-blue-500"
                  title="Editar template"
                >
                  <MdEdit size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-500"
                  title="Excluir template"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo da Mensagem
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                    {template.content}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variáveis Disponíveis
                    </label>
                    <div className="flex space-x-2">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700"
                        >
                          #{variable}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {template.characterCount} caracteres
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SMSTemplatesPage; 
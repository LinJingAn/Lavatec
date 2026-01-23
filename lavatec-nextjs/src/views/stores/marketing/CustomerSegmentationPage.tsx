import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdEdit, MdDelete, MdPeople } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const CustomerSegmentationPage = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState([
    {
      id: 1,
      name: 'Clientes de Alto Valor',
      description: 'Clientes com alto valor vitalício e pedidos frequentes',
      criteria: [
        { field: 'total_spent', operator: '>', value: '1000' },
        { field: 'order_frequency', operator: '>', value: '4' }
      ],
      customerCount: 150
    },
    {
      id: 2,
      name: 'Clientes em Risco',
      description: 'Clientes que não fizeram pedidos nos últimos 60 dias',
      criteria: [
        { field: 'last_order_date', operator: '<', value: '60' }
      ],
      customerCount: 45
    },
    {
      id: 3,
      name: 'Novos Clientes',
      description: 'Clientes que fizeram seu primeiro pedido nos últimos 30 dias',
      criteria: [
        { field: 'first_order_date', operator: '>', value: '30' }
      ],
      customerCount: 75
    }
  ]);

  const handleBackToMarketing = () => {
    navigate('/stores/marketing');
  };

  const handleEditSegment = (id: number) => {
    // In a real app, this would open a modal or navigate to an edit page
    console.log('Edit segment:', id);
  };

  const handleDeleteSegment = (id: number) => {
    setSegments(segments.filter(segment => segment.id !== id));
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
            <h1 className="text-2xl font-semibold">Segmentação de Clientes</h1>
            <p className="text-sm text-gray-600 mt-1">
              Crie e gerencie segmentos de clientes para marketing direcionado
            </p>
          </div>
        </div>
        <Button>
          <MdAdd className="mr-2" size={20} />
          Criar Segmento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MdPeople className="text-blue-600" size={24} />
                </div>
                <div>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <p className="text-sm text-gray-600">{segment.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleEditSegment(segment.id)}
                  className="text-blue-500"
                  title="Editar segmento"
                >
                  <MdEdit size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteSegment(segment.id)}
                  className="text-red-500"
                  title="Excluir segmento"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Critérios do Segmento
                  </label>
                  <div className="space-y-2">
                    {segment.criteria.map((criterion, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                        <span className="text-sm font-medium">{criterion.field}</span>
                        <span className="text-sm text-gray-500">{criterion.operator}</span>
                        <span className="text-sm font-medium">{criterion.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Clientes no segmento:</span>
                  <span className="text-sm font-medium text-blue-600">{segment.customerCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSegmentationPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
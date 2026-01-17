import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerNotes from '../../components/customer/CustomerNotes';
import { MdArrowBack, MdPerson } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const CustomerNotesPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch customer details
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock customer data
        setCustomer({
          id: parseInt(customerId || '0'),
          name: 'Cliente Exemplo',
          email: 'cliente@exemplo.com',
          phone: '(11) 98765-4321'
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Cliente não encontrado. O ID fornecido pode ser inválido.
        </div>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 flex items-center text-blue-600 hover:underline"
        >
          <MdArrowBack className="mr-1" /> Voltar para lista de clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/customers/${customerId}`)}
          className="mb-2 flex items-center text-blue-600 hover:underline"
        >
          <MdArrowBack className="mr-1" /> Voltar para detalhes do cliente
        </button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <MdPerson className="mr-2 text-gray-500" />
            Anotações: {customer.name}
          </h1>
          <div className="text-sm text-gray-500">
            {customer.email} • {customer.phone}
          </div>
        </div>
      </div>
      
      {/* Customer Notes Component */}
      <CustomerNotes customerId={parseInt(customerId || '0')} />
    </div>
  );
};

export default CustomerNotesPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
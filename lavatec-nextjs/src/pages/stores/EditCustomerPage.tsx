import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdSave, MdCancel } from 'react-icons/md';
import { z } from 'zod';

// Define validation schema
const customerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  zipCode: z.string().min(8, "CEP inválido"),
  category: z.string().min(1, "Selecione uma categoria"),
  washPreferences: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof customerSchema>;

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

// Mock customer data (in a real app, this would be fetched from API)
const MOCK_CUSTOMER = {
  id: 2,
  name: 'Carlos Oliveira',
  email: 'carlos.oliveira@email.com',
  phone: '(11) 91234-5678',
  address: 'Avenida Paulista, 1000 - São Paulo, SP',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  category: 'heavy',
  lastVisit: '2023-10-05',
  totalOrders: 24,
  totalSpent: 3450.75,
  washPreferences: 'Extra limpo, perfume suave',
  notes: 'Cliente VIP, sempre verificar se está satisfeito',
  createdAt: '2022-03-15'
};

const EditCustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id || '0');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    category: '',
    washPreferences: '',
    notes: ''
  });
  
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, fetch customer by ID from API
        const customerData = {
          name: MOCK_CUSTOMER.name,
          email: MOCK_CUSTOMER.email,
          phone: MOCK_CUSTOMER.phone,
          address: MOCK_CUSTOMER.address.split(' - ')[0], // Extract the street address
          city: MOCK_CUSTOMER.city,
          state: MOCK_CUSTOMER.state,
          zipCode: MOCK_CUSTOMER.zipCode,
          category: MOCK_CUSTOMER.category,
          washPreferences: MOCK_CUSTOMER.washPreferences,
          notes: MOCK_CUSTOMER.notes
        };
        
        setFormData(customerData);
        setOriginalData(customerData);
        setIsLoading(false);
      }, 800);
    };
    
    fetchCustomer();
  }, [customerId]);
  
  const handleGoBack = () => {
    navigate(`/stores/customers/${customerId}`);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    try {
      customerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, send data to API
    console.log('Submitting form data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message and navigate
      alert('Cliente atualizado com sucesso!');
      navigate(`/stores/customers/${customerId}`);
    }, 1000);
  };
  
  const handleCancel = () => {
    // Check if there are changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    if (!hasChanges) {
      navigate(`/stores/customers/${customerId}`);
      return;
    }
    
    if (confirm('Deseja cancelar as alterações? Todas as modificações serão perdidas.')) {
      navigate(`/stores/customers/${customerId}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Editar Cliente
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <MdSave className="mr-1" /> {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <MdCancel className="mr-1" /> Cancelar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Informações Pessoais</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`shadow appearance-none border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`shadow appearance-none border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className={`shadow appearance-none border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 98765-4321"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            
            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Endereço</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Endereço <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={`shadow appearance-none border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua, número, complemento"
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className={`shadow appearance-none border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className={`shadow appearance-none border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="SP"
                    required
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                  CEP <span className="text-red-500">*</span>
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  className={`shadow appearance-none border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                  required
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Categoria do Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className={`shadow appearance-none border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="heavy">Frequente</option>
                  <option value="occasional">Ocasional</option>
                  <option value="rare">Raro</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Esta classificação ajuda a organizar seus clientes
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="washPreferences">
                  Preferências de Lavagem
                </label>
                <textarea
                  id="washPreferences"
                  name="washPreferences"
                  rows={3}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.washPreferences}
                  onChange={handleInputChange}
                  placeholder="Ex: Sem perfume, temperatura baixa, etc."
                ></textarea>
              </div>
              
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o cliente..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6 flex justify-end">
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
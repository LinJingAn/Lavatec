import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';

// Define interfaces for better type safety
interface UnitData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  openingHours: string;
  numberOfEmployees: number;
  numberOfMachines: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface FormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  openingHours: string;
  numberOfEmployees: string;
  numberOfMachines: string;
  status: 'active' | 'maintenance' | 'inactive';
}

// Mock data service - replace with actual API calls
const fetchUnitData = (id: string): Promise<UnitData> => {
  // This would be replaced with an actual API call
  return Promise.resolve({
    id: id,
    name: "Unidade Centro",
    address: "Rua Principal, 123",
    city: "São Paulo",
    state: "SP",
    postalCode: "01234-567",
    phone: "(11) 91234-5678",
    email: "unidade.centro@lavatec.com",
    managerName: "Carlos Silva",
    openingHours: "08:00-20:00",
    numberOfEmployees: 12,
    numberOfMachines: 25,
    status: "active" as const
  });
};

const updateUnit = (id: string, data: Omit<UnitData, 'id'>): Promise<boolean> => {
  // Simulate API call
  console.log('Updating unit with ID:', id, data);
  return new Promise(resolve => setTimeout(() => resolve(true), 500));
};

const EditUnidadPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  // Define validation rules
  const validationRules = {
    name: (value: string) => !value.trim() ? 'Nome é obrigatório' : undefined,
    address: (value: string) => !value.trim() ? 'Endereço é obrigatório' : undefined,
    city: (value: string) => !value.trim() ? 'Cidade é obrigatória' : undefined,
    state: (value: string) => !value.trim() ? 'Estado é obrigatório' : undefined,
    postalCode: (value: string) => !value.trim() ? 'CEP é obrigatório' : undefined,
    phone: (value: string) => !value.trim() ? 'Telefone é obrigatório' : undefined,
    email: (value: string) => {
      if (!value.trim()) return 'Email é obrigatório';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
      return undefined;
    },
    numberOfEmployees: (value: string) => {
      if (!value.trim()) return 'Número de funcionários é obrigatório';
      if (isNaN(Number(value))) return 'Deve ser um número';
      return undefined;
    },
    numberOfMachines: (value: string) => {
      if (!value.trim()) return 'Número de máquinas é obrigatório';
      if (isNaN(Number(value))) return 'Deve ser um número';
      return undefined;
    }
  };
  
  // Use the custom hook
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    submitSuccess,
    setSubmitSuccess,
    handleChange,
    validateForm
  } = useFormValidation<FormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    managerName: '',
    openingHours: '',
    numberOfEmployees: '',
    numberOfMachines: '',
    status: 'active'
  }, validationRules);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchUnitData(id)
        .then(data => {
          setFormData({
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            phone: data.phone,
            email: data.email,
            managerName: data.managerName,
            openingHours: data.openingHours,
            numberOfEmployees: String(data.numberOfEmployees),
            numberOfMachines: String(data.numberOfMachines),
            status: data.status
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching unit data:', err);
          setIsLoading(false);
        });
    }
  }, [id, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    if (id) {
      updateUnit(id, {
        ...formData,
        numberOfEmployees: Number(formData.numberOfEmployees),
        numberOfMachines: Number(formData.numberOfMachines),
        status: formData.status
      })
        .then(() => {
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate('/unidades');
          }, 1500);
        })
        .catch(err => {
          console.error('Error updating unit:', err);
          setErrors(prev => ({ ...prev, submit: 'Erro ao atualizar unidade. Tente novamente.' }));
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-700">Carregando dados da unidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Unidade</h1>
        <button 
          onClick={() => navigate('/unidades')}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Voltar para Lista
        </button>
      </div>
      
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Unidade atualizada com sucesso! Redirecionando...
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nome da Unidade
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Endereço
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Cidade
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && <p className="text-red-500 text-xs italic mt-1">{errors.city}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
              Estado
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.state ? 'border-red-500' : ''}`}
            />
            {errors.state && <p className="text-red-500 text-xs italic mt-1">{errors.state}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
              CEP
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.postalCode ? 'border-red-500' : ''}`}
            />
            {errors.postalCode && <p className="text-red-500 text-xs italic mt-1">{errors.postalCode}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="managerName">
              Nome do Gerente
            </label>
            <input
              id="managerName"
              name="managerName"
              type="text"
              value={formData.managerName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="openingHours">
              Horário de Funcionamento
            </label>
            <input
              id="openingHours"
              name="openingHours"
              type="text"
              placeholder="Ex: 08:00-20:00"
              value={formData.openingHours}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfEmployees">
              Número de Funcionários
            </label>
            <input
              id="numberOfEmployees"
              name="numberOfEmployees"
              type="text"
              value={formData.numberOfEmployees}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.numberOfEmployees ? 'border-red-500' : ''}`}
            />
            {errors.numberOfEmployees && <p className="text-red-500 text-xs italic mt-1">{errors.numberOfEmployees}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfMachines">
              Número de Máquinas
            </label>
            <input
              id="numberOfMachines"
              name="numberOfMachines"
              type="text"
              value={formData.numberOfMachines}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.numberOfMachines ? 'border-red-500' : ''}`}
            />
            {errors.numberOfMachines && <p className="text-red-500 text-xs italic mt-1">{errors.numberOfMachines}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="active">Ativa</option>
              <option value="maintenance">Em Manutenção</option>
              <option value="inactive">Inativa</option>
            </select>
          </div>
        </div>
        
        {errors.submit && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/unidades')}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUnidadPage; 
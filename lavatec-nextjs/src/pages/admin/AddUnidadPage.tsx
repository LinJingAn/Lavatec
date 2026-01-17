import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave } from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

interface UnidadForm {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  manager_name: string;
  opening_hours: string;
  employees: string;
  machines: string;
  status: string;
}

const AddUnidadPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UnidadForm>({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: '',
    manager_name: '',
    opening_hours: '',
    employees: '',
    machines: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof UnidadForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof UnidadForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof UnidadForm, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'O endereço é obrigatório';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'A cidade é obrigatória';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório';
    } else if (!/^\d{8,10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Formato de telefone inválido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }
    
    if (formData.employees && !/^\d+$/.test(formData.employees)) {
      newErrors.employees = 'Deve ser um número';
    }
    
    if (formData.machines && !/^\d+$/.test(formData.machines)) {
      newErrors.machines = 'Deve ser um número';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting unit data:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/unidades/list');
      }, 2000);
    }, 1000);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/unidades')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Voltar para listagem
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Adicionar Nova Unidade</h1>
      
      {submitSuccess ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          Unidade criada com sucesso! Redirecionando para a listagem...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Unidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: São José Centro"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Avenida Central, Rua 1"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: São José"
              />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 10101"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 2222-3333"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: sanjose@lavatec.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Gerente
              </label>
              <input
                type="text"
                name="manager_name"
                value={formData.manager_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Maria Rodrigues"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Seg-Sáb 7:00 às 20:00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Funcionários
              </label>
              <input
                type="text"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employees ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 10"
              />
              {errors.employees && <p className="mt-1 text-sm text-red-500">{errors.employees}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Máquinas
              </label>
              <input
                type="text"
                name="machines"
                value={formData.machines}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.machines ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 8"
              />
              {errors.machines && <p className="mt-1 text-sm text-red-500">{errors.machines}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Ativa</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="inactive">Inativa</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/unidades')}
              className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              } transition-colors`}
            >
              <MdSave className="mr-2" /> 
              {isSubmitting ? 'Salvando...' : 'Salvar Unidade'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddUnidadPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
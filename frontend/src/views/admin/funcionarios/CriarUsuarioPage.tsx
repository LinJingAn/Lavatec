import React, { useState } from 'react';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  position: string;
  password: string;
  confirmPassword: string;
}

const CriarUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'staff',
    department: '',
    phone: '',
    position: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // List of departments for the dropdown
  const departments = [
    'Gestão',
    'Operações',
    'Finanças',
    'Marketing',
    'Recursos Humanos',
    'Vendas',
    'Atendimento',
    'Manutenção',
    'Limpeza',
    'TI'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData.department) {
      newErrors.department = 'O departamento é obrigatório';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'O cargo é obrigatório';
    }
    
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
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
      console.log('Submitting user data:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/team/members');
      }, 2000);
    }, 1000);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/team/members')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Voltar para listagem
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Adicionar Novo Funcionário</h1>
      
      {submitSuccess ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          Funcionário cadastrado com sucesso! Redirecionando para a listagem...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-medium mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: joao.silva@lavatec.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-medium mb-4">Informações Profissionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um departamento</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Gerente de Operações"
                />
                {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Acesso <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="staff">Colaborador</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Administrador: Acesso total ao sistema<br />
                  Gerente: Acesso a relatórios e gerenciamento de equipe<br />
                  Colaborador: Acesso básico às funcionalidades
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Credenciais de Acesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Um email será enviado ao funcionário com as instruções de acesso.
            </p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/team/members')}
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
              {isSubmitting ? 'Salvando...' : 'Salvar Funcionário'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CriarUsuarioPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
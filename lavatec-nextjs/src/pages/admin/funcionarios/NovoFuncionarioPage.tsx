import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdCancel } from 'react-icons/md';
import { z } from 'zod';

// Define validation schema
const newUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  role: z.string().min(1, "Selecione um cargo"),
  department: z.string().min(1, "Selecione um departamento"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  birthDate: z.string().optional(),
  hireDate: z.string().min(1, "Data de contratação é obrigatória"),
  sendCredentials: z.boolean().optional()
});

type FormData = z.infer<typeof newUserSchema>;

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

const NovoFuncionarioPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: '',
    hireDate: new Date().toISOString().split('T')[0],
    sendCredentials: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleGoBack = () => {
    navigate('/funcionarios');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const validateForm = () => {
    try {
      newUserSchema.parse(formData);
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
    
    // In a real app, send data to API
    console.log('Submitting form data:', formData);
    
    // Show success message and navigate
    alert('Funcionário cadastrado com sucesso!');
    navigate('/funcionarios');
  };
  
  const handleCancel = () => {
    if (confirm('Deseja cancelar o cadastro? Todos os dados inseridos serão perdidos.')) {
      navigate('/funcionarios');
    }
  };
  
  const roles = [
    { id: 'admin', name: 'Administrador' },
    { id: 'manager', name: 'Gerente' },
    { id: 'supervisor', name: 'Supervisor' },
    { id: 'operator', name: 'Operador' },
    { id: 'support', name: 'Suporte' }
  ];
  
  const departments = [
    { id: 'it', name: 'TI' },
    { id: 'operations', name: 'Operações' },
    { id: 'laundry', name: 'Lavanderia' },
    { id: 'maintenance', name: 'Manutenção' },
    { id: 'administrative', name: 'Administrativo' },
    { id: 'hr', name: 'Recursos Humanos' }
  ];
  
  const permissions = [
    { id: 'dashboard.view', name: 'Visualizar Dashboard' },
    { id: 'users.view', name: 'Visualizar Usuários' },
    { id: 'users.manage', name: 'Gerenciar Usuários' },
    { id: 'reports.view', name: 'Visualizar Relatórios' },
    { id: 'reports.create', name: 'Criar Relatórios' },
    { id: 'settings.view', name: 'Visualizar Configurações' },
    { id: 'settings.edit', name: 'Editar Configurações' },
    { id: 'locations.view', name: 'Visualizar Unidades' },
    { id: 'locations.manage', name: 'Gerenciar Unidades' },
    { id: 'tasks.view', name: 'Visualizar Tarefas' },
    { id: 'tasks.manage', name: 'Gerenciar Tarefas' },
    { id: 'products.view', name: 'Visualizar Produtos' },
    { id: 'products.manage', name: 'Gerenciar Produtos' }
  ];
  
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
            Adicionar Novo Funcionário
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleSubmit}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            <MdSave className="mr-1" /> Salvar
          </button>
          <button 
            onClick={handleCancel}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            <MdCancel className="mr-1" /> Cancelar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Informações Pessoais
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'permissions' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('permissions')}
            >
              Permissões
            </button>
          </nav>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Pessoais</h3>
                
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
                    Telefone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
                    Data de Nascimento
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Endereço
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                      Cidade
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                      Estado
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                    CEP
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Profissionais</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    className={`shadow appearance-none border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um cargo</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.role}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    className={`shadow appearance-none border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um departamento</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.department}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">
                    Data de Contratação <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    className={`shadow appearance-none border ${errors.hireDate ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.hireDate && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.hireDate}</p>
                  )}
                </div>
                
                <div className="mb-4 mt-8">
                  <div className="flex items-center">
                    <input
                      id="sendCredentials"
                      name="sendCredentials"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.sendCredentials}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="sendCredentials" className="ml-2 block text-sm text-gray-900">
                      Enviar credenciais por email
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    O novo funcionário receberá um email com instruções para definir a senha.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Informação</h4>
                  <p className="text-sm text-blue-700">
                    Após criar o funcionário, você poderá atribuir permissões específicas.
                    Por padrão, as permissões serão baseadas no cargo selecionado.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'permissions' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Permissões do Usuário</h3>
              <p className="text-sm text-gray-600 mb-4">
                Selecione as permissões que este funcionário deve ter no sistema. As permissões determinam
                o que o usuário pode ver e fazer no sistema.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center border rounded p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      id={`permission-${permission.id}`}
                      name={`permission-${permission.id}`}
                    />
                    <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // Select all permissions
                    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="permission-"]');
                    checkboxes.forEach((checkbox: any) => {
                      checkbox.checked = true;
                    });
                  }}
                >
                  Selecionar Todos
                </button>
                <button
                  type="button"
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    // Deselect all permissions
                    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="permission-"]');
                    checkboxes.forEach((checkbox: any) => {
                      checkbox.checked = false;
                    });
                  }}
                >
                  Limpar Todos
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Salvar Funcionário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoFuncionarioPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
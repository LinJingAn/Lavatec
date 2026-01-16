import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { 
  MdSave, 
  MdArrowBack,
  MdClose,
  MdCheck,
  MdVisibility,
  MdVisibilityOff,
  MdInfo
} from 'react-icons/md';

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'manager', 'staff'], { errorMap: () => ({ message: 'Selecione uma função válida' })}),
  department: z.string().min(1, 'Departamento é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive'], { errorMap: () => ({ message: 'Selecione um status válido' })}),
  address: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  hireDate: z.string().min(1, 'Data de contratação é obrigatória')
});

// Password schema (only used when creating new user or changing password)
const passwordSchema = z.object({
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirme a senha')
}).refine(data => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"]
});

// Mock user data
const mockUsers = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao.silva@lavatec.com', 
    role: 'admin', 
    department: 'Gestão',
    position: 'Diretor de Operações',
    phone: '(11) 98765-4321',
    lastLogin: '2023-09-22T10:30:00',
    status: 'active',
    hireDate: '2021-03-15',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    birthDate: '1980-05-10',
    permissions: ['manage_users', 'manage_locations', 'view_reports', 'manage_billing']
  },
  { 
    id: 2, 
    name: 'Maria Santos', 
    email: 'maria.santos@lavatec.com', 
    role: 'manager', 
    department: 'Operações',
    position: 'Gerente de Unidade',
    phone: '(11) 98765-1234',
    lastLogin: '2023-09-21T14:45:00',
    status: 'active',
    hireDate: '2022-01-10',
    address: 'Avenida Paulista, 1000 - São Paulo, SP',
    birthDate: '1985-08-22',
    permissions: ['manage_staff', 'view_reports', 'manage_inventory']
  }
];

// Permission options
const permissionOptions = [
  { id: 'manage_users', label: 'Gerenciar Usuários' },
  { id: 'manage_locations', label: 'Gerenciar Unidades' },
  { id: 'manage_staff', label: 'Gerenciar Funcionários' },
  { id: 'view_reports', label: 'Visualizar Relatórios' },
  { id: 'manage_billing', label: 'Gerenciar Faturamento' },
  { id: 'manage_inventory', label: 'Gerenciar Estoque' },
  { id: 'manage_customers', label: 'Gerenciar Clientes' },
  { id: 'manage_services', label: 'Gerenciar Serviços' }
];

const EditarUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNewUser = !id || id === 'new';
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    department: '',
    position: '',
    phone: '',
    status: 'active',
    hireDate: '',
    address: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    permissions: [] as string[]
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPermissionsInfo, setShowPermissionsInfo] = useState(false);
  
  // Effect to load user data if editing
  useEffect(() => {
    if (!isNewUser) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === parseInt(id as string));
        
        if (user) {
          // Format dates for input fields
          const formattedUser = {
            ...user,
            hireDate: user.hireDate ? new Date(user.hireDate).toISOString().split('T')[0] : '',
            birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
            password: '',
            confirmPassword: ''
          };
          
          setFormData(prev => ({
            ...prev,
            ...formattedUser,
            permissions: user.permissions || []
          }));
        } else {
          alert('Usuário não encontrado!');
          navigate('/team/members');
        }
        
        setIsLoading(false);
      }, 800);
    }
  }, [id, isNewUser, navigate]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle permission toggle
  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
        
      return { ...prev, permissions: newPermissions };
    });
  };
  
  // Form validation
  const validateForm = () => {
    try {
      userSchema.parse(formData);
      
      // Validate password only for new users
      if (isNewUser) {
        passwordSchema.parse(formData);
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0].toString();
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Success
      setIsSaving(false);
      alert(isNewUser ? 'Usuário criado com sucesso!' : 'Usuário atualizado com sucesso!');
      navigate('/team/members');
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Carregando dados do usuário...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewUser ? 'Novo Funcionário' : 'Editar Funcionário'}
        </h1>
        <button
          onClick={() => navigate('/team/members')}
          className="px-4 py-2 border border-gray-300 rounded flex items-center hover:bg-gray-50 transition-colors"
        >
          <MdArrowBack className="mr-2" /> Voltar
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        {/* Form header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">
            {isNewUser ? 'Cadastrar novo funcionário' : 'Atualizar dados do funcionário'}
          </h2>
          <p className="text-gray-500 text-sm">Preencha os campos abaixo com os dados do funcionário</p>
        </div>
        
        <div className="p-6">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Informações Pessoais</h3>
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
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
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
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
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
                  placeholder="(00) 00000-0000"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Professional Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department}</p>
                )}
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
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Função <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="staff">Colaborador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Contratação <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hireDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Password Section - Only shown for new users or when changing password */}
          {isNewUser && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Senha de Acesso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-2 pl-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-2 pl-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Permissions Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Permissões</h3>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                onClick={() => setShowPermissionsInfo(!showPermissionsInfo)}
              >
                <MdInfo className="mr-1" /> 
                {showPermissionsInfo ? 'Esconder detalhes' : 'Mostrar detalhes'}
              </button>
            </div>
            
            {showPermissionsInfo && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md text-sm">
                <h4 className="font-medium mb-2">Sobre as permissões:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Gerenciar Usuários:</strong> Criar, editar e excluir usuários no sistema</li>
                  <li><strong>Gerenciar Unidades:</strong> Configurar e administrar unidades da empresa</li>
                  <li><strong>Gerenciar Funcionários:</strong> Administrar equipes e funcionários</li>
                  <li><strong>Visualizar Relatórios:</strong> Acesso a relatórios e análises do sistema</li>
                  <li><strong>Gerenciar Faturamento:</strong> Acessar e gerenciar informações financeiras</li>
                  <li><strong>Gerenciar Estoque:</strong> Administrar inventário e produtos</li>
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {permissionOptions.map(permission => (
                <div key={permission.id} className="flex items-center">
                  <label className="flex items-center cursor-pointer space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                      <div className={`block w-5 h-5 rounded border ${
                        formData.permissions.includes(permission.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {formData.permissions.includes(permission.id) && (
                          <MdCheck className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">{permission.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end items-center">
          <button
            type="button"
            onClick={() => navigate('/team/members')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-100"
          >
            <span className="flex items-center">
              <MdClose className="mr-1" /> Cancelar
            </span>
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <MdSave className="mr-1" /> 
                {isNewUser ? 'Criar Funcionário' : 'Salvar Alterações'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuarioPage; 
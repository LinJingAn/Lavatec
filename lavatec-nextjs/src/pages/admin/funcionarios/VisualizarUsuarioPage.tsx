import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MdEdit, 
  MdArrowBack, 
  MdDelete, 
  MdLock, 
  MdMail,
  MdAccessTime,
  MdBadge,
  MdPerson,
  MdPhone,
  MdHome,
  MdCalendarToday,
  MdSecurity,
  MdApartment,
  MdWorkOutline,
  MdVerified
} from 'react-icons/md';

// Disable static generation - this page uses React Router
export const dynamic = 'force-dynamic';

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

// Permission options with descriptions
const permissionDetails = {
  'manage_users': 'Criar, editar e excluir usuários no sistema',
  'manage_locations': 'Configurar e administrar unidades da empresa',
  'manage_staff': 'Administrar equipes e funcionários',
  'view_reports': 'Visualizar relatórios e análises do sistema',
  'manage_billing': 'Acessar e gerenciar informações financeiras',
  'manage_inventory': 'Administrar inventário e produtos',
  'manage_customers': 'Gerenciar clientes e dados de clientes',
  'manage_services': 'Configurar serviços oferecidos pela empresa'
};

const VisualizarUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || '0');
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get role label based on role value
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'staff': return 'Colaborador';
      default: return 'Desconhecido';
    }
  };
  
  // Format date to Brazilian format
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Format datetime to readable format
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Load user data
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId);
      setUser(foundUser || null);
      setIsLoading(false);
    }, 800);
  }, [userId]);
  
  // Handle delete user
  const handleDeleteUser = () => {
    setShowDeleteConfirm(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    // Simulate deletion API call
    setTimeout(() => {
      alert(`Usuário ${user.name} excluído com sucesso!`);
      navigate('/team/members');
    }, 500);
  };
  
  // Handle reset password
  const handleResetPassword = () => {
    // Simulate password reset API call
    setTimeout(() => {
      alert(`Email de redefinição de senha enviado para ${user.email}`);
    }, 500);
  };
  
  // Handle send email
  const handleSendEmail = () => {
    window.location.href = `mailto:${user.email}`;
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-700">Carregando dados do funcionário...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          Funcionário não encontrado. O ID {userId} não existe no sistema.
        </div>
        <button 
          onClick={() => navigate('/team/members')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Voltar para listagem
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/team/members')}
            className="mr-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <MdArrowBack className="mr-1" /> Voltar
          </button>
          <h1 className="text-2xl font-bold">Detalhes do Funcionário</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/team/members/edit/${userId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 transition-colors"
          >
            <MdEdit className="mr-2" /> Editar
          </button>
          
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 bg-green-600 text-white rounded flex items-center hover:bg-green-700 transition-colors"
          >
            <MdLock className="mr-2" /> Resetar Senha
          </button>
          
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-gray-600 text-white rounded flex items-center hover:bg-gray-700 transition-colors"
          >
            <MdMail className="mr-2" /> Enviar Email
          </button>
          
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-600 text-white rounded flex items-center hover:bg-red-700 transition-colors"
          >
            <MdDelete className="mr-2" /> Excluir
          </button>
        </div>
      </div>
      
      {/* User status banner */}
      <div className={`mb-6 p-4 rounded-md flex items-center ${
        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <MdVerified className="text-xl mr-2" />
        <span>
          Status: <strong>{user.status === 'active' ? 'Ativo' : 'Inativo'}</strong>
          {user.lastLogin && ` • Último acesso em ${formatDateTime(user.lastLogin)}`}
        </span>
      </div>
      
      {/* Main content area */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* User header with name */}
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <MdPerson className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.position} • {user.department}</p>
            </div>
          </div>
        </div>
        
        {/* User information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal information */}
            <div>
              <h3 className="text-lg font-medium mb-4 border-b pb-2">Informações Pessoais</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MdMail className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdPhone className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-gray-900">{user.phone || '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdCalendarToday className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="text-gray-900">{user.birthDate ? formatDate(user.birthDate) : '-'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdHome className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="text-gray-900">{user.address || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional information */}
            <div>
              <h3 className="text-lg font-medium mb-4 border-b pb-2">Informações Profissionais</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MdBadge className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Função</p>
                    <p className="text-gray-900">{getRoleName(user.role)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdApartment className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Departamento</p>
                    <p className="text-gray-900">{user.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdWorkOutline className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Cargo</p>
                    <p className="text-gray-900">{user.position}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdCalendarToday className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Contratação</p>
                    <p className="text-gray-900">{formatDate(user.hireDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdAccessTime className="text-gray-500 mt-1 mr-3 min-w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Último Acesso</p>
                    <p className="text-gray-900">{user.lastLogin ? formatDateTime(user.lastLogin) : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Permissions section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">
              <span className="flex items-center">
                <MdSecurity className="mr-2" />
                Permissões de Acesso
              </span>
            </h3>
            
            {user.permissions && user.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {user.permissions.map((permission: string) => (
                  <div key={permission} className="flex items-center py-2">
                    <MdVerified className="text-green-500 mr-2" />
                    <div>
                      <p className="font-medium">{permission.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}</p>
                      <p className="text-sm text-gray-500">
                        {permissionDetails[permission as keyof typeof permissionDetails]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Este usuário não possui permissões específicas.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir o funcionário <strong>{user.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir Funcionário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarUsuarioPage;

// Force dynamic rendering for Pages Router
export async function getServerSideProps() {
  return {
    props: {},
  };
} 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdSave, MdEdit, MdDelete, MdRefresh, MdEmail, MdBlock, MdCheck } from 'react-icons/md';

// Mock data to simulate API fetch
const MOCK_USER = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@lavatec.com.br',
  role: 'Administrador',
  department: 'TI',
  status: 'Ativo',
  lastLogin: '2023-06-15T14:30:00',
  createdAt: '2022-12-01T09:00:00',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01234-567',
  birthDate: '1985-05-10',
  hireDate: '2022-11-15',
  permissions: [
    'dashboard.view',
    'users.manage',
    'reports.view',
    'reports.create',
    'settings.view',
    'settings.edit'
  ],
  loginHistory: [
    { date: '2023-06-15T14:30:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { date: '2023-06-14T09:15:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { date: '2023-06-13T11:45:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { date: '2023-06-10T16:20:00', ip: '192.168.1.100', device: 'Chrome / Windows' },
    { date: '2023-06-09T10:10:00', ip: '187.45.123.45', device: 'Safari / iOS' }
  ]
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Format datetime for display
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const FuncionarioDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form state
  const [formData, setFormData] = useState({
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
    hireDate: ''
  });
  
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, fetch user data from API based on id
      setUser(MOCK_USER);
      setFormData({
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        phone: MOCK_USER.phone,
        role: MOCK_USER.role,
        department: MOCK_USER.department,
        address: MOCK_USER.address,
        city: MOCK_USER.city,
        state: MOCK_USER.state,
        zipCode: MOCK_USER.zipCode,
        birthDate: MOCK_USER.birthDate,
        hireDate: MOCK_USER.hireDate
      });
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleGoBack = () => {
    navigate('/funcionarios');
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        birthDate: user.birthDate,
        hireDate: user.hireDate
      });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send updated data to API
    setUser(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
    alert('Dados do funcionário atualizados com sucesso!');
  };
  
  const handleResetPassword = () => {
    // In a real app, call API to reset password
    alert(`Senha resetada para o usuário: ${user.name}`);
  };
  
  const handleSendEmail = () => {
    // In a real app, open email composition interface
    alert(`Preparando para enviar email para: ${user.email}`);
  };
  
  const handleDisableUser = () => {
    // In a real app, call API to disable/enable user
    const newStatus = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
    setUser(prev => ({
      ...prev,
      status: newStatus
    }));
    alert(`Status do usuário alterado para: ${newStatus}`);
  };
  
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  
  const handleDeleteUser = () => {
    // In a real app, call API to delete user
    alert(`Usuário ${user.name} excluído com sucesso!`);
    navigate('/funcionarios');
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Funcionário não encontrado.</p>
          <button 
            onClick={handleGoBack}
            className="mt-2 text-blue-600 hover:underline"
          >
            Voltar para a lista de funcionários
          </button>
        </div>
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
            {isEditing ? 'Editar Funcionário' : 'Detalhes do Funcionário'}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button 
                onClick={toggleEditMode}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <MdEdit className="mr-1" /> Editar
              </button>
              <button 
                onClick={handleSendEmail}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                <MdEmail className="mr-1" /> Enviar Email
              </button>
              <button 
                onClick={handleResetPassword}
                className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
              >
                <MdRefresh className="mr-1" /> Resetar Senha
              </button>
              <button 
                onClick={handleDisableUser}
                className={`flex items-center ${user.status === 'Ativo' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded transition-colors`}
              >
                {user.status === 'Ativo' ? (
                  <><MdBlock className="mr-1" /> Desativar</>
                ) : (
                  <><MdCheck className="mr-1" /> Ativar</>
                )}
              </button>
              <button 
                onClick={handleDeleteClick}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                <MdDelete className="mr-1" /> Excluir
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSubmit}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <MdSave className="mr-1" /> Salvar
              </button>
              <button 
                onClick={toggleEditMode}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        {/* User header info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-16 w-16 flex items-center justify-center text-xl mr-4">
              {user.name.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex mt-1">
                <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                  user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Perfil
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
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'activity' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Atividade
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações Pessoais</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Nome Completo
                    </label>
                    {isEditing ? (
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="py-2">{user.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="py-2">{user.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="py-2">{user.phone}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
                      Data de Nascimento
                    </label>
                    {isEditing ? (
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="py-2">{formatDate(user.birthDate)}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                      Endereço
                    </label>
                    {isEditing ? (
                      <input
                        id="address"
                        name="address"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="py-2">{user.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                        Cidade
                      </label>
                      {isEditing ? (
                        <input
                          id="city"
                          name="city"
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="py-2">{user.city}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                        Estado
                      </label>
                      {isEditing ? (
                        <input
                          id="state"
                          name="state"
                          type="text"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="py-2">{user.state}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                      CEP
                    </label>
                    {isEditing ? (
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="py-2">{user.zipCode}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações Profissionais</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                      Cargo
                    </label>
                    {isEditing ? (
                      <select
                        id="role"
                        name="role"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Administrador">Administrador</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Operador">Operador</option>
                        <option value="Suporte">Suporte</option>
                      </select>
                    ) : (
                      <p className="py-2">{user.role}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                      Departamento
                    </label>
                    {isEditing ? (
                      <select
                        id="department"
                        name="department"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="TI">TI</option>
                        <option value="Operações">Operações</option>
                        <option value="Lavanderia">Lavanderia</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Recursos Humanos">Recursos Humanos</option>
                      </select>
                    ) : (
                      <p className="py-2">{user.department}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">
                      Data de Contratação
                    </label>
                    {isEditing ? (
                      <input
                        id="hireDate"
                        name="hireDate"
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.hireDate}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="py-2">{formatDate(user.hireDate)}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Status
                    </label>
                    <p className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Data de Cadastro
                    </label>
                    <p className="py-2">{formatDate(user.createdAt)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Último Acesso
                    </label>
                    <p className="py-2">{formatDateTime(user.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {activeTab === 'permissions' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Permissões do Usuário</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center border rounded p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={true}
                      disabled={!isEditing}
                      id={`permission-${index}`}
                    />
                    <label htmlFor={`permission-${index}`} className="ml-2 block text-sm text-gray-900">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
              
              {!isEditing && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Editar Permissões
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Histórico de Atividades</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Data/Hora</th>
                      <th className="py-3 px-6 text-left">Endereço IP</th>
                      <th className="py-3 px-6 text-left">Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {user.loginHistory.map((login, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{formatDateTime(login.date)}</td>
                        <td className="py-3 px-6 text-left">{login.ip}</td>
                        <td className="py-3 px-6 text-left">{login.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir o funcionário <span className="font-semibold">{user.name}</span>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionarioDetalhesPage; 
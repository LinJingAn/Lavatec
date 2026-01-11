import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdAdd, 
  MdDelete, 
  MdEdit, 
  MdContentCopy,
  MdNotificationsActive,
  MdSearch,
  MdFilterList,
  MdSend,
  MdDevices,
  MdSchedule
} from 'react-icons/md';

// Mock data for push notifications
const mockNotifications = [
  {
    id: 1,
    title: 'Pedido Pronto',
    body: 'Seu pedido #12345 está pronto para retirada!',
    status: 'active',
    type: 'transactional',
    segment: 'Todos os clientes',
    sentCount: 1245,
    openRate: 68,
    createdAt: '2023-10-15',
    lastModified: '2023-11-02',
    scheduleType: 'trigger',
    triggerEvent: 'Pedido Pronto'
  },
  {
    id: 2,
    title: 'Desconto Especial',
    body: 'Aproveite 20% de desconto em todos os serviços hoje!',
    status: 'active',
    type: 'promotional',
    segment: 'Clientes Premium',
    sentCount: 876,
    openRate: 42,
    createdAt: '2023-10-22',
    lastModified: '2023-10-22',
    scheduleType: 'scheduled',
    scheduledFor: '2023-12-01T09:00:00'
  },
  {
    id: 3,
    title: 'Lembrete de Retirada',
    body: 'Não esqueça de retirar seu pedido hoje até às 19h!',
    status: 'active',
    type: 'transactional',
    segment: 'Clientes com pedidos pendentes',
    sentCount: 532,
    openRate: 75,
    createdAt: '2023-09-10',
    lastModified: '2023-10-05',
    scheduleType: 'recurring',
    recurrence: 'Diário às 14h'
  },
  {
    id: 4,
    title: 'Nova Promoção de Verão',
    body: 'Refrescantes descontos de verão em roupas leves!',
    status: 'draft',
    type: 'promotional',
    segment: 'Todos os clientes',
    sentCount: 0,
    openRate: 0,
    createdAt: '2023-11-15',
    lastModified: '2023-11-15',
    scheduleType: 'scheduled',
    scheduledFor: '2023-12-15T10:00:00'
  },
  {
    id: 5,
    title: 'Confirmação de Pedido',
    body: 'Seu pedido foi recebido e está sendo processado',
    status: 'active',
    type: 'transactional',
    segment: 'Clientes com aplicativo',
    sentCount: 3210,
    openRate: 89,
    createdAt: '2023-08-20',
    lastModified: '2023-09-15',
    scheduleType: 'trigger',
    triggerEvent: 'Novo Pedido'
  }
];

const PushNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter notifications based on search, type and status
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.segment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === '' || notification.type === typeFilter;
    const matchesStatus = statusFilter === '' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let label = 'Desconhecido';
    
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100 text-green-800';
        label = 'Ativo';
        break;
      case 'paused':
        bgColor = 'bg-yellow-100 text-yellow-800';
        label = 'Pausado';
        break;
      case 'draft':
        bgColor = 'bg-gray-100 text-gray-800';
        label = 'Rascunho';
        break;
      case 'archived':
        bgColor = 'bg-red-100 text-red-800';
        label = 'Arquivado';
        break;
    }
    
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>{label}</span>;
  };

  // Type badge component
  const TypeBadge = ({ type }: { type: string }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let label = 'Desconhecido';
    
    switch (type) {
      case 'transactional':
        bgColor = 'bg-blue-100 text-blue-800';
        label = 'Transacional';
        break;
      case 'promotional':
        bgColor = 'bg-purple-100 text-purple-800';
        label = 'Promocional';
        break;
      case 'informational':
        bgColor = 'bg-indigo-100 text-indigo-800';
        label = 'Informativo';
        break;
    }
    
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>{label}</span>;
  };

  // Schedule type icon and label
  const ScheduleInfo = ({ notification }: { notification: any }) => {
    let icon = <MdSchedule className="text-gray-500" />;
    let label = 'Programação desconhecida';
    
    switch (notification.scheduleType) {
      case 'trigger':
        icon = <MdSend className="text-blue-600" />;
        label = `Gatilho: ${notification.triggerEvent}`;
        break;
      case 'scheduled':
        icon = <MdSchedule className="text-purple-600" />;
        const date = notification.scheduledFor ? new Date(notification.scheduledFor) : null;
        label = date ? `Agendado: ${date.toLocaleDateString()} às ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Agendado';
        break;
      case 'recurring':
        icon = <MdSchedule className="text-green-600" />;
        label = `Recorrente: ${notification.recurrence}`;
        break;
    }
    
    return (
      <div className="flex items-center text-xs text-gray-500">
        <span className="mr-1">{icon}</span>
        <span>{label}</span>
      </div>
    );
  };

  // Handle notification deletion
  const handleDeleteNotification = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdNotificationsActive className="mr-2 text-blue-600" />
            Notificações Push
          </h1>
          <p className="text-gray-600">Gerencie as notificações push enviadas diretamente para os dispositivos dos clientes</p>
        </div>
        
        <Link
          to="/stores/marketing/push-notifications/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <MdAdd className="mr-2" /> Nova Notificação
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar notificações..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <MdFilterList className="mr-2" /> Filtros
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo</h3>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="transactional">Transacional</option>
                    <option value="promotional">Promocional</option>
                    <option value="informational">Informativo</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3"
                  >
                    <option value="">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="paused">Pausado</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setTypeFilter('');
                      setStatusFilter('');
                      setIsFilterOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notificação
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programação
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Público-Alvo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Desempenho
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <tr key={notification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">{notification.body}</div>
                    <div className="mt-1 flex items-center">
                      <StatusBadge status={notification.status} />
                      <span className="text-xs text-gray-500 ml-2">
                        Modificado: {new Date(notification.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TypeBadge type={notification.type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScheduleInfo notification={notification} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MdDevices className="text-gray-400 mr-2" size={16} />
                    <span className="text-sm text-gray-600">{notification.segment}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {notification.sentCount > 0 ? (
                    <div className="text-sm">
                      <div>{notification.sentCount.toLocaleString()} envios</div>
                      <div className="text-xs text-gray-500">{notification.openRate}% de abertura</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">Ainda não enviado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link 
                      to={`/stores/marketing/push-notifications/${notification.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar notificação"
                    >
                      <MdEdit size={18} />
                    </Link>
                    
                    <button 
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir notificação"
                    >
                      <MdDelete size={18} />
                    </button>
                    
                    <button 
                      className="text-green-600 hover:text-green-900"
                      title="Duplicar notificação"
                    >
                      <MdContentCopy size={18} />
                    </button>
                    
                    {notification.status !== 'draft' && (
                      <Link 
                        to={`/stores/marketing/push-notifications/${notification.id}/analytics`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver estatísticas"
                      >
                        <MdSend size={18} />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PushNotificationsPage; 
import React, { useState } from 'react';
import { 
  MdEmail, 
  MdOutlineSms, 
  MdNotificationsActive, 
  MdSearch, 
  MdFilterList,
  MdPhoneAndroid,
  MdPerson,
  MdCheck,
  MdInfo
} from 'react-icons/md';

// Mock data for communication history
const mockCommunications = [
  {
    id: 1,
    type: 'email',
    subject: 'Pedido Recebido - #ORD-12345',
    recipientName: 'João Silva',
    recipientId: 'cliente-001',
    recipientEmail: 'joao.silva@email.com',
    sentDate: '2023-11-15T14:30:00',
    status: 'delivered',
    opened: true,
    clicked: true,
    campaign: 'Notificações de Pedido',
    template: 'Confirmação de Pedido'
  },
  {
    id: 2,
    type: 'sms',
    subject: 'Seu pedido está pronto para retirada',
    recipientName: 'Maria Oliveira',
    recipientId: 'cliente-002',
    recipientPhone: '(11) 98765-4321',
    sentDate: '2023-11-14T16:45:00',
    status: 'delivered',
    opened: null,
    clicked: null,
    campaign: 'Notificações de Status',
    template: 'Pedido Pronto para Retirada'
  },
  {
    id: 3,
    type: 'push',
    subject: 'Desconto especial só para você!',
    recipientName: 'Pedro Santos',
    recipientId: 'cliente-003',
    recipientDevice: 'Android-Samsung Galaxy S21',
    sentDate: '2023-11-13T10:15:00',
    status: 'opened',
    opened: true,
    clicked: true,
    campaign: 'Promoção de Fim de Semana',
    template: 'Notificação de Desconto'
  },
  {
    id: 4,
    type: 'email',
    subject: 'Seu feedback é importante para nós',
    recipientName: 'Ana Costa',
    recipientId: 'cliente-004',
    recipientEmail: 'ana.costa@email.com',
    sentDate: '2023-11-12T18:20:00',
    status: 'bounced',
    opened: false,
    clicked: false,
    campaign: 'Feedback de Clientes',
    template: 'Pesquisa de Satisfação'
  },
  {
    id: 5,
    type: 'sms',
    subject: 'Seu código de desconto: LAVA20',
    recipientName: 'Carlos Mendes',
    recipientId: 'cliente-005',
    recipientPhone: '(11) 91234-5678',
    sentDate: '2023-11-11T09:30:00',
    status: 'failed',
    opened: null,
    clicked: null,
    campaign: 'Recuperação de Clientes',
    template: 'Código de Desconto'
  },
  {
    id: 6,
    type: 'email',
    subject: '50% de desconto em lavagem de edredons',
    recipientName: 'Lucia Ferreira',
    recipientId: 'cliente-006',
    recipientEmail: 'lucia.ferreira@email.com',
    sentDate: '2023-11-10T14:00:00',
    status: 'delivered',
    opened: true,
    clicked: false,
    campaign: 'Promoção Sazonal',
    template: 'Promoção de Edredons'
  },
  {
    id: 7,
    type: 'push',
    subject: 'Seu pedido foi entregue!',
    recipientName: 'Roberto Alves',
    recipientId: 'cliente-007',
    recipientDevice: 'iOS-iPhone 12',
    sentDate: '2023-11-09T17:15:00',
    status: 'delivered',
    opened: false,
    clicked: false,
    campaign: 'Atualizações de Pedido',
    template: 'Notificação de Entrega'
  }
];

const CommunicationHistoryPage: React.FC = () => {
  const [communications, setCommunications] = useState(mockCommunications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter communications based on search, type and status
  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.template.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === '' || comm.type === typeFilter;
    const matchesStatus = statusFilter === '' || comm.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get communication type icon
  const getCommunicationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MdEmail className="text-blue-600" size={20} />;
      case 'sms':
        return <MdOutlineSms className="text-green-600" size={20} />;
      case 'push':
        return <MdNotificationsActive className="text-purple-600" size={20} />;
      default:
        return <MdInfo className="text-gray-600" size={20} />;
    }
  };

  // Get status badge
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    let statusText = '';

    switch (status) {
      case 'delivered':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = 'Entregue';
        break;
      case 'opened':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        statusText = 'Aberto';
        break;
      case 'bounced':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        statusText = 'Devolvido';
        break;
      case 'failed':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Falhou';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        statusText = 'Desconhecido';
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Histórico de Comunicação</h1>
        <p className="text-gray-600">Visualize todas as comunicações enviadas aos clientes</p>
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
              placeholder="Buscar por assunto, cliente ou campanha..."
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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de Comunicação</h3>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-1.5 px-3"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Notificação Push</option>
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
                    <option value="delivered">Entregue</option>
                    <option value="opened">Aberto</option>
                    <option value="bounced">Devolvido</option>
                    <option value="failed">Falhou</option>
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

      {/* Communication history table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assunto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destinatário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Envio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campanha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCommunications.map((comm) => (
              <tr key={comm.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getCommunicationTypeIcon(comm.type)}
                    <span className="ml-2 text-sm capitalize">{comm.type === 'push' ? 'Notificação Push' : comm.type === 'sms' ? 'SMS' : 'Email'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{comm.subject}</div>
                  <div className="text-xs text-gray-500">Template: {comm.template}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <MdPerson className="text-gray-400 mr-2" size={16} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{comm.recipientName}</div>
                      <div className="text-xs text-gray-500">
                        {comm.type === 'email' && comm.recipientEmail}
                        {comm.type === 'sms' && comm.recipientPhone}
                        {comm.type === 'push' && (
                          <div className="flex items-center">
                            <MdPhoneAndroid className="mr-1" size={12} />
                            {comm.recipientDevice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(comm.sentDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <StatusBadge status={comm.status} />
                    {comm.opened !== null && (
                      <div className="text-xs flex items-center">
                        {comm.opened ? (
                          <span className="text-green-600 flex items-center">
                            <MdCheck size={12} className="mr-1" /> Aberto
                          </span>
                        ) : (
                          <span className="text-gray-500">Não aberto</span>
                        )}
                      </div>
                    )}
                    {comm.clicked !== null && comm.opened && (
                      <div className="text-xs flex items-center">
                        {comm.clicked ? (
                          <span className="text-green-600 flex items-center">
                            <MdCheck size={12} className="mr-1" /> Clicado
                          </span>
                        ) : (
                          <span className="text-gray-500">Não clicado</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{comm.campaign}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunicationHistoryPage; 
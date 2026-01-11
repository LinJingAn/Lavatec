import React, { useState, useEffect } from 'react';
import { CommunicationLog, CommunicationChannel, generateMockCommunicationLogs } from '../../models/CustomerCommunication';
import { MdEmail, MdPhone, MdChat, MdPerson, MdAdd, MdFilterList, MdSearch, 
  MdExpandMore, MdExpandLess, MdCheck, MdCancel, MdAttachFile, MdOutlineWhatsapp } from 'react-icons/md';

interface CustomerCommunicationLogProps {
  customerId: number;
}

const CustomerCommunicationLog: React.FC<CustomerCommunicationLogProps> = ({ customerId }) => {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<CommunicationLog[]>([]);
  const [activeFilter, setActiveFilter] = useState<CommunicationChannel | 'all'>('all');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState<Partial<CommunicationLog>>({
    customerId,
    date: new Date().toISOString(),
    channel: 'email',
    subject: '',
    message: '',
    direction: 'outgoing',
    resolved: false
  });

  // Fetch logs (using mock data for now)
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedLogs = generateMockCommunicationLogs(customerId, 10);
    setLogs(fetchedLogs);
    setFilteredLogs(fetchedLogs);
  }, [customerId]);

  // Apply filters and search
  useEffect(() => {
    let result = [...logs];
    
    // Filter by channel
    if (activeFilter !== 'all') {
      result = result.filter(log => log.channel === activeFilter);
    }
    
    // Filter by direction
    if (directionFilter !== 'all') {
      result = result.filter(log => log.direction === directionFilter);
    }
    
    // Filter by resolved status
    if (resolvedFilter !== 'all') {
      result = result.filter(log => 
        resolvedFilter === 'resolved' ? log.resolved : !log.resolved
      );
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.subject.toLowerCase().includes(query) || 
        log.message.toLowerCase().includes(query) ||
        (log.notes && log.notes.toLowerCase().includes(query))
      );
    }
    
    setFilteredLogs(result);
  }, [logs, activeFilter, directionFilter, resolvedFilter, searchQuery]);

  const handleAddLog = () => {
    const newLogComplete: CommunicationLog = {
      ...newLog as any,
      id: logs.length + 1,
      date: new Date().toISOString(),
      employeeId: 1, // Mock user ID
      employeeName: 'Current User', // Mock user name
    };
    
    setLogs([newLogComplete, ...logs]);
    setShowAddForm(false);
    setNewLog({
      customerId,
      date: new Date().toISOString(),
      channel: 'email',
      subject: '',
      message: '',
      direction: 'outgoing',
      resolved: false
    });
  };

  const toggleLogResolved = (id: number) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...log, resolved: !log.resolved } : log
    ));
  };

  const getChannelIcon = (channel: CommunicationChannel) => {
    switch (channel) {
      case 'email': return <MdEmail className="text-blue-500" />;
      case 'phone': return <MdPhone className="text-green-500" />;
      case 'whatsapp': return <MdOutlineWhatsapp className="text-green-600" />;
      case 'sms': return <MdChat className="text-purple-500" />;
      case 'in-person': return <MdPerson className="text-orange-500" />;
      default: return <MdChat className="text-gray-500" />;
    }
  };

  const getChannelLabel = (channel: CommunicationChannel): string => {
    switch (channel) {
      case 'email': return 'Email';
      case 'phone': return 'Telefone';
      case 'whatsapp': return 'WhatsApp';
      case 'sms': return 'SMS';
      case 'in-person': return 'Presencial';
      default: return 'Outro';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Channel options for filter
  const channelOptions: { value: CommunicationChannel | 'all', label: string }[] = [
    { value: 'all', label: 'Todos os Canais' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'in-person', label: 'Presencial' },
    { value: 'other', label: 'Outro' }
  ];

  const directionOptions = [
    { value: 'all', label: 'Todas Direções' },
    { value: 'incoming', label: 'Recebidos' },
    { value: 'outgoing', label: 'Enviados' }
  ];

  const resolvedOptions = [
    { value: 'all', label: 'Todos Status' },
    { value: 'resolved', label: 'Resolvidos' },
    { value: 'unresolved', label: 'Pendentes' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Histórico de Comunicação</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
        >
          <MdAdd /> {showAddForm ? 'Cancelar' : 'Novo Registro'}
        </button>
      </div>
      
      {/* Search and filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <div className="relative">
          <MdSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar comunicações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <MdFilterList className="absolute left-3 top-2.5 text-gray-400" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as CommunicationChannel | 'all')}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {channelOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as 'all' | 'incoming' | 'outgoing')}
            className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {directionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value as 'all' | 'resolved' | 'unresolved')}
            className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {resolvedOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Add log form */}
      {showAddForm && (
        <div className="border rounded-md p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Novo Registro de Comunicação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Canal</label>
              <select
                value={newLog.channel}
                onChange={(e) => setNewLog({...newLog, channel: e.target.value as CommunicationChannel})}
                className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {channelOptions.filter(o => o.value !== 'all').map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Direção</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    checked={newLog.direction === 'incoming'}
                    onChange={() => setNewLog({...newLog, direction: 'incoming'})}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  Recebido
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="direction"
                    checked={newLog.direction === 'outgoing'}
                    onChange={() => setNewLog({...newLog, direction: 'outgoing'})}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  Enviado
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Assunto</label>
            <input
              type="text"
              value={newLog.subject}
              onChange={(e) => setNewLog({...newLog, subject: e.target.value})}
              className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Mensagem</label>
            <textarea
              rows={4}
              value={newLog.message}
              onChange={(e) => setNewLog({...newLog, message: e.target.value})}
              className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Observações (opcional)</label>
            <textarea
              rows={2}
              value={newLog.notes || ''}
              onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
              className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="resolved"
              checked={newLog.resolved || false}
              onChange={(e) => setNewLog({...newLog, resolved: e.target.checked})}
              className="mr-2 h-4 w-4 text-blue-600"
            />
            <label htmlFor="resolved" className="text-sm text-gray-700">
              Marcar como resolvido
            </label>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddLog}
              disabled={!newLog.subject || !newLog.message}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Salvar Registro
            </button>
          </div>
        </div>
      )}
      
      {/* Logs list */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div 
              key={log.id}
              className={`border rounded-md overflow-hidden ${log.resolved ? 'border-green-200' : 'border-amber-200'}`}
            >
              <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    {getChannelIcon(log.channel)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {log.subject}
                      <span className={`ml-2 text-xs ${log.direction === 'incoming' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'} px-2 py-0.5 rounded-full`}>
                        {log.direction === 'incoming' ? 'Recebido' : 'Enviado'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {getChannelLabel(log.channel)} • {formatDate(log.date)}
                      {log.employeeName && ` • por ${log.employeeName}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center text-xs px-2 py-1 rounded-full ${log.resolved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {log.resolved ? <MdCheck className="mr-1" /> : <MdCancel className="mr-1" />}
                    {log.resolved ? 'Resolvido' : 'Pendente'}
                  </span>
                  <button 
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    {expandedLogId === log.id ? <MdExpandLess /> : <MdExpandMore />}
                  </button>
                </div>
              </div>
              
              {expandedLogId === log.id && (
                <div className="p-3">
                  <div className="mb-3 whitespace-pre-line text-gray-700">
                    {log.message}
                  </div>
                  
                  {log.attachments && log.attachments.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-500 mb-1">Anexos:</p>
                      <div className="flex flex-wrap gap-2">
                        {log.attachments.map((attachment, index) => (
                          <a 
                            key={index}
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <MdAttachFile className="mr-1" />
                            Anexo {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {log.notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-500 mb-1">Observações:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                        {log.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <div></div>
                    <button
                      onClick={() => toggleLogResolved(log.id)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        log.resolved 
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {log.resolved ? 'Marcar como Pendente' : 'Marcar como Resolvido'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchQuery || activeFilter !== 'all' || directionFilter !== 'all' || resolvedFilter !== 'all' ? 
            'Nenhuma comunicação encontrada com os filtros atuais.' : 
            'Nenhuma comunicação registrada para este cliente.'}
        </div>
      )}
    </div>
  );
};

export default CustomerCommunicationLog; 
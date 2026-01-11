import React, { useState } from 'react';
import { 
  MdMessage, 
  MdAdd, 
  MdEmail, 
  MdPhone, 
  MdWhatsapp, 
  MdPersonPin, 
  MdSms,
  MdInfo,
  MdExpandMore,
  MdExpandLess,
  MdOutgoingMail,
  MdCallReceived,
  MdCheck,
  MdHourglassEmpty
} from 'react-icons/md';
import { CommunicationLog, CommunicationChannel, CommunicationStats } from '../../models/CustomerCommunication';

interface CommunicationLogsPanelProps {
  logs: CommunicationLog[];
  stats: CommunicationStats;
  customerId: number;
  onAddLog?: (log: Omit<CommunicationLog, 'id'>) => void;
  isReadOnly?: boolean;
}

const CommunicationLogsPanel: React.FC<CommunicationLogsPanelProps> = ({ 
  logs, 
  stats, 
  customerId, 
  onAddLog,
  isReadOnly = false 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedLogIds, setExpandedLogIds] = useState<number[]>([]);
  const [showAllStats, setShowAllStats] = useState(false);
  
  const [newLog, setNewLog] = useState<Omit<CommunicationLog, 'id'>>({
    customerId,
    date: new Date().toISOString(),
    channel: 'phone',
    subject: '',
    message: '',
    direction: 'outgoing',
    employeeName: 'Usuário Atual', // This would be dynamic in a real app
    resolved: true,
    notes: ''
  });
  
  const getChannelIcon = (channel: CommunicationChannel, className?: string) => {
    switch (channel) {
      case 'email':
        return <MdEmail className={className} />;
      case 'phone':
        return <MdPhone className={className} />;
      case 'whatsapp':
        return <MdWhatsapp className={className} />;
      case 'sms':
        return <MdSms className={className} />;
      case 'in-person':
        return <MdPersonPin className={className} />;
      default:
        return <MdMessage className={className} />;
    }
  };
  
  const getChannelLabel = (channel: CommunicationChannel) => {
    switch (channel) {
      case 'email':
        return 'Email';
      case 'phone':
        return 'Telefone';
      case 'whatsapp':
        return 'WhatsApp';
      case 'sms':
        return 'SMS';
      case 'in-person':
        return 'Presencial';
      default:
        return 'Outro';
    }
  };
  
  const getChannelColor = (channel: CommunicationChannel) => {
    switch (channel) {
      case 'email':
        return 'text-blue-600 bg-blue-100';
      case 'phone':
        return 'text-green-600 bg-green-100';
      case 'whatsapp':
        return 'text-green-600 bg-green-100';
      case 'sms':
        return 'text-purple-600 bg-purple-100';
      case 'in-person':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewLog(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewLog(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLog.subject || !newLog.message) {
      alert('Por favor, preencha o assunto e a mensagem.');
      return;
    }
    
    if (onAddLog) {
      onAddLog(newLog);
    }
    
    // Reset form
    setNewLog({
      customerId,
      date: new Date().toISOString(),
      channel: 'phone',
      subject: '',
      message: '',
      direction: 'outgoing',
      employeeName: 'Usuário Atual',
      resolved: true,
      notes: ''
    });
    
    setShowAddForm(false);
  };
  
  const toggleLogExpand = (logId: number) => {
    setExpandedLogIds(prev => 
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <MdMessage className="mr-2 text-blue-600" /> 
          Histórico de Comunicações
        </h3>
        
        {!isReadOnly && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
          >
            <MdAdd className="mr-1" /> Registrar Contato
          </button>
        )}
      </div>
      
      {/* Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Estatísticas de Comunicação</h4>
          <button 
            onClick={() => setShowAllStats(!showAllStats)}
            className="text-blue-600 text-sm flex items-center"
          >
            {showAllStats ? (
              <>
                Menos <MdExpandLess />
              </>
            ) : (
              <>
                Mais <MdExpandMore />
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Total de Contatos</div>
            <div className="text-xl font-bold">{stats.totalCommunications}</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Taxa de Resposta</div>
            <div className="text-xl font-bold">{stats.responseRate}%</div>
          </div>
          
          {showAllStats && (
            <>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Tempo Médio de Resposta</div>
                <div className="text-xl font-bold">{stats.averageResponseTime}h</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Canal Mais Usado</div>
                <div className="flex items-center mt-1">
                  {stats.channelBreakdown && Object.entries(stats.channelBreakdown).length > 0 ? (
                    <>
                      {getChannelIcon(
                        Object.entries(stats.channelBreakdown)
                          .sort((a, b) => b[1] - a[1])[0][0] as CommunicationChannel,
                        "mr-1 text-lg"
                      )}
                      <span className="font-semibold">
                        {getChannelLabel(
                          Object.entries(stats.channelBreakdown)
                            .sort((a, b) => b[1] - a[1])[0][0] as CommunicationChannel
                        )}
                      </span>
                    </>
                  ) : (
                    <span>Nenhum</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {showAllStats && (
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Assuntos Mais Comuns</h5>
            <div className="space-y-2">
              {stats.mostCommonSubjects.length > 0 ? (
                stats.mostCommonSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(subject.count / stats.totalCommunications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{subject.subject} ({subject.count})</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">Nenhum assunto registrado</div>
              )}
            </div>
          </div>
        )}
        
        {showAllStats && stats.channelBreakdown && Object.keys(stats.channelBreakdown).length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Canais de Comunicação</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.channelBreakdown).map(([channel, count]) => (
                <div key={channel} className={`px-2 py-1 rounded-full text-xs flex items-center ${getChannelColor(channel as CommunicationChannel)}`}>
                  {getChannelIcon(channel as CommunicationChannel, "mr-1")}
                  {getChannelLabel(channel as CommunicationChannel)}: {count}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h4 className="font-medium mb-3">Registrar Nova Comunicação</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canal de Comunicação
                </label>
                <select
                  name="channel"
                  value={newLog.channel}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="phone">Telefone</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="in-person">Presencial</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Direção
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="direction"
                      value="incoming"
                      checked={newLog.direction === 'incoming'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Recebido</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="direction"
                      value="outgoing"
                      checked={newLog.direction === 'outgoing'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Enviado</span>
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  name="subject"
                  value={newLog.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  placeholder="Ex: Confirmação de pedido"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  value={newLog.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  placeholder="Detalhes da comunicação..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações (opcionais)
                </label>
                <textarea
                  name="notes"
                  value={newLog.notes || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Observações adicionais..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="resolved"
                  name="resolved"
                  checked={newLog.resolved}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="resolved" className="ml-2 text-sm text-gray-700">
                  Comunicação resolvida/finalizada
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Communication Logs */}
      <div className="divide-y divide-gray-200">
        {logs.length === 0 ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <MdInfo className="text-blue-500 text-4xl" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhuma comunicação registrada</h4>
            <p className="text-gray-500">
              Ainda não há registros de comunicação com este cliente.
            </p>
          </div>
        ) : (
          logs.map(log => {
            const isExpanded = expandedLogIds.includes(log.id);
            return (
              <div 
                key={log.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${getChannelColor(log.channel)}`}>
                      {getChannelIcon(log.channel)}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        {log.direction === 'incoming' ? (
                          <MdCallReceived className="text-blue-600 mr-1" title="Recebido" />
                        ) : (
                          <MdOutgoingMail className="text-green-600 mr-1" title="Enviado" />
                        )}
                        <h4 className="font-medium">{log.subject}</h4>
                      </div>
                      
                      <div className="flex text-xs text-gray-500 mt-1">
                        <span>{formatDate(log.date)}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {log.resolved ? (
                            <span className="flex items-center text-green-600">
                              <MdCheck className="mr-1" /> Resolvido
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600">
                              <MdHourglassEmpty className="mr-1" /> Pendente
                            </span>
                          )}
                        </span>
                      </div>
                      
                      <p className="text-sm mt-1 text-gray-700">
                        {isExpanded ? log.message : `${log.message.slice(0, 100)}${log.message.length > 100 ? '...' : ''}`}
                      </p>
                      
                      {isExpanded && log.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 text-sm rounded">
                          <span className="font-medium">Observações:</span> {log.notes}
                        </div>
                      )}
                      
                      {isExpanded && log.employeeName && (
                        <div className="mt-2 text-xs text-gray-500">
                          Atendido por: {log.employeeName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleLogExpand(log.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {logs.length > 5 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Ver todas as comunicações ({logs.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunicationLogsPanel; 
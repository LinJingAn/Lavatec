import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdChat, MdPerson, MdOutlineWhatsapp, MdTimeline, MdPieChart } from 'react-icons/md';
import { CommunicationLog, CommunicationChannel, CommunicationStats, generateMockCommunicationLogs, generateMockCommunicationStats } from '../../models/CustomerCommunication';

interface CustomerCommunicationSummaryProps {
  customerId: number;
  maxLogs?: number;
  showActions?: boolean;
}

const CustomerCommunicationSummary: React.FC<CustomerCommunicationSummaryProps> = ({ 
  customerId,
  maxLogs = 3,
  showActions = true
}) => {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedLogs = generateMockCommunicationLogs(customerId, 8);
    setLogs(fetchedLogs.slice(0, maxLogs));
    setStats(generateMockCommunicationStats(fetchedLogs));
  }, [customerId, maxLogs]);
  
  if (!stats) return <div className="animate-pulse bg-gray-100 h-40 rounded-lg"></div>;
  
  const getChannelIcon = (channel: CommunicationChannel, className = "text-lg") => {
    switch (channel) {
      case 'email': return <MdEmail className={`text-blue-500 ${className}`} />;
      case 'phone': return <MdPhone className={`text-green-500 ${className}`} />;
      case 'whatsapp': return <MdOutlineWhatsapp className={`text-green-600 ${className}`} />;
      case 'sms': return <MdChat className={`text-purple-500 ${className}`} />;
      case 'in-person': return <MdPerson className={`text-orange-500 ${className}`} />;
      default: return <MdChat className={`text-gray-500 ${className}`} />;
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
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Histórico de Comunicação</h2>
          {showActions && (
            <Link 
              to={`/customers/${customerId}/communication`}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver completo ({stats.totalCommunications})
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Recent communications */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <MdTimeline className="mr-1" /> Comunicações Recentes
          </h3>
          
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className={`border-l-4 pl-3 py-1 ${
                  log.direction === 'incoming' ? 'border-blue-500' : 'border-purple-500'}`}>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {getChannelIcon(log.channel, "text-base")}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between w-full">
                        <span className="font-medium text-sm">{log.subject}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(log.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{log.message}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                          {log.direction === 'incoming' ? 'Recebido' : 'Enviado'}
                        </span>
                        <span className={`text-xs px-1 rounded ${log.resolved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {log.resolved ? 'Resolvido' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Sem comunicações recentes
            </div>
          )}
        </div>
        
        {/* Statistics */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <MdPieChart className="mr-1" /> Estatísticas
          </h3>
          
          <div className="space-y-4">
            {/* By channel */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Por canal</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(stats.channelBreakdown).map(([channel, count]) => (
                  count > 0 && (
                    <div 
                      key={channel} 
                      className="flex items-center gap-1 bg-gray-50 p-2 rounded-lg"
                    >
                      <div>
                        {getChannelIcon(channel as CommunicationChannel)}
                      </div>
                      <div>
                        <div className="text-xs font-medium">
                          {getChannelLabel(channel as CommunicationChannel)}
                        </div>
                        <div className="text-lg font-bold">{count}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Response metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-blue-700 mb-1">Taxa de Resposta</div>
                <div className="flex items-end">
                  <span className="text-lg font-bold text-blue-800">{stats.responseRate}%</span>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-green-700 mb-1">Tempo de Resposta</div>
                <div className="flex items-end">
                  <span className="text-lg font-bold text-green-800">{stats.averageResponseTime}h</span>
                </div>
              </div>
            </div>
            
            {/* Popular topics */}
            {stats.mostCommonSubjects.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2">Tópicos Frequentes</h4>
                <div className="space-y-1">
                  {stats.mostCommonSubjects.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="truncate">{subject.subject}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {subject.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCommunicationSummary; 
export type CommunicationChannel = 'email' | 'phone' | 'sms' | 'whatsapp' | 'in-person' | 'other';

export interface CommunicationLog {
  id: number;
  customerId: number;
  date: string; // ISO date string
  channel: CommunicationChannel;
  subject: string;
  message: string;
  attachments?: string[]; // URLs to any attachments
  direction: 'incoming' | 'outgoing';
  employeeId?: number; // ID of the employee who handled the communication
  employeeName?: string;
  resolved: boolean;
  notes?: string;
}

export interface CommunicationStats {
  totalCommunications: number;
  channelBreakdown: {
    [key in CommunicationChannel]?: number;
  };
  responseRate: number; // Percentage of communications responded to
  averageResponseTime: number; // In hours
  mostCommonSubjects: Array<{subject: string, count: number}>;
}

// Mock communication data generator for a customer
export const generateMockCommunicationLogs = (customerId: number, count = 5): CommunicationLog[] => {
  const channels: CommunicationChannel[] = ['email', 'phone', 'whatsapp', 'in-person', 'sms'];
  const subjects = [
    'Dúvida sobre pedido',
    'Agendamento de retirada',
    'Reclamação sobre serviço',
    'Solicitação de orçamento',
    'Informações sobre serviços',
    'Acompanhamento de pedido',
    'Cancelamento de pedido'
  ];
  const employees = [
    { id: 1, name: 'Maria Silva' },
    { id: 2, name: 'João Oliveira' },
    { id: 3, name: 'Ana Santos' },
    { id: 4, name: 'Carlos Lima' }
  ];
  
  const logs: CommunicationLog[] = [];
  
  // Generate logs from newest to oldest
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 90)); // Random date in the last 90 days
    
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const direction = Math.random() > 0.5 ? 'incoming' : 'outgoing';
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const employee = employees[Math.floor(Math.random() * employees.length)];
    
    logs.push({
      id: i + 1,
      customerId,
      date: date.toISOString(),
      channel,
      subject,
      message: `${direction === 'incoming' ? 'Cliente entrou em contato via' : 'Contato realizado via'} ${channel} sobre ${subject.toLowerCase()}.`,
      direction,
      employeeId: employee.id,
      employeeName: employee.name,
      resolved: Math.random() > 0.2, // 80% chance of being resolved
      notes: Math.random() > 0.7 ? 'Observações adicionais sobre este contato.' : undefined
    });
  }
  
  // Sort by date (newest first)
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock communication stats
export const generateMockCommunicationStats = (logs: CommunicationLog[]): CommunicationStats => {
  const channelBreakdown: {[key in CommunicationChannel]?: number} = {};
  const subjectCounts: {[key: string]: number} = {};
  
  logs.forEach(log => {
    // Count by channel
    channelBreakdown[log.channel] = (channelBreakdown[log.channel] || 0) + 1;
    
    // Count by subject
    subjectCounts[log.subject] = (subjectCounts[log.subject] || 0) + 1;
  });
  
  // Get top subjects
  const sortedSubjects = Object.entries(subjectCounts)
    .map(([subject, count]) => ({ subject, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  return {
    totalCommunications: logs.length,
    channelBreakdown,
    responseRate: 85, // Mock percentage
    averageResponseTime: 4.2, // Mock hours
    mostCommonSubjects: sortedSubjects
  };
}; 
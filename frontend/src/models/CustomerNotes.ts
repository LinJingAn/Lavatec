export type CustomerNoteType = 'general' | 'complaint' | 'feedback' | 'preference' | 'other';

export interface CustomerNote {
  id: number;
  customerId: number;
  title: string;
  content: string;
  date: string;
  type: CustomerNoteType;
  createdById: number;
  createdByName: string;
  isImportant: boolean;
  isPinned: boolean;
  isPrivate: boolean;
  tags?: string[];
}

export interface CustomerNotesStats {
  totalNotes: number;
  byType: Record<CustomerNoteType, number>;
  importantCount: number;
  recentActivity: {
    date: string;
    count: number;
  }[];
}

// Mock data generator for customer notes
export const generateMockNotes = (customerId: number, count = 3): CustomerNote[] => {
  const noteTypes: Array<CustomerNote['type']> = ['general', 'complaint', 'feedback', 'preference', 'other'];
  const employees = [
    { id: 1, name: 'Maria Silva' },
    { id: 2, name: 'João Oliveira' },
    { id: 3, name: 'Ana Santos' },
    { id: 4, name: 'Carlos Lima' }
  ];
  
  const noteTitles = [
    'Preferência de entrega',
    'Feedback sobre o último pedido',
    'Anotações sobre preferências',
    'Reclamação sobre atraso',
    'Comentário geral',
    'Observação importante',
    'Desconto oferecido'
  ];
  
  const noteContents = [
    'Cliente prefere entregas no período da tarde, após as 14h.',
    'Cliente elogiou a qualidade do serviço no último pedido de lavagem de edredom.',
    'Cliente solicitou atenção especial com peças delicadas.',
    'Cliente reclamou de atraso na entrega do pedido #124. Foi oferecido um desconto de 10% no próximo pedido como compensação.',
    'Cliente informou que ficará fora da cidade durante o mês de julho.',
    'Cliente tem alergia a alguns produtos de limpeza. Verificar preferências específicas antes de processar pedidos.',
    'Cliente é muito exigente com a qualidade da passadoria. Recomenda-se revisão extra antes da entrega.'
  ];
  
  const notes: CustomerNote[] = [];
  
  // Generate notes from newest to oldest
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const noteDate = new Date();
    noteDate.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in the last 60 days
    
    const type = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const titleIndex = Math.floor(Math.random() * noteTitles.length);
    const contentIndex = Math.floor(Math.random() * noteContents.length);
    
    notes.push({
      id: i + 1,
      customerId,
      date: noteDate.toISOString(),
      title: noteTitles[titleIndex],
      content: noteContents[contentIndex],
      type,
      createdById: employee.id,
      createdByName: employee.name,
      isImportant: Math.random() > 0.7,
      isPinned: Math.random() > 0.8,
      isPrivate: Math.random() > 0.9,
      tags: Math.random() > 0.5 ? ['atendimento', 'preferência'] : undefined
    });
  }
  
  // Sort by date (newest first)
  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock data generator for customer notes
export const generateMockCustomerNotes = (customerId: number, count = 5): CustomerNote[] => {
  const notes: CustomerNote[] = [];
  const types: CustomerNoteType[] = ['general', 'complaint', 'feedback', 'preference', 'other'];
  const mockUsers = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Oliveira' },
    { id: 3, name: 'Carlos Santos' }
  ];
  
  // Generate past dates (within last 30 days)
  const generateRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString();
  };

  for (let i = 1; i <= count; i++) {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    notes.push({
      id: i,
      customerId,
      title: `Note ${i} - ${randomType}`,
      content: `This is a sample ${randomType} note for customer #${customerId}. Created for testing purposes.`,
      date: generateRandomDate(),
      type: randomType,
      createdById: randomUser.id,
      createdByName: randomUser.name,
      isImportant: Math.random() > 0.7,
      isPinned: Math.random() > 0.8,
      isPrivate: Math.random() > 0.7,
      tags: Math.random() > 0.5 ? ['sample', randomType] : undefined
    });
  }
  
  // Sort by date, newest first
  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateMockCustomerNotesStats = (notes: CustomerNote[]): CustomerNotesStats => {
  const stats: CustomerNotesStats = {
    totalNotes: notes.length,
    byType: {
      general: 0,
      complaint: 0,
      feedback: 0,
      preference: 0,
      other: 0
    },
    importantCount: 0,
    recentActivity: []
  };
  
  // Count by type and important
  notes.forEach(note => {
    stats.byType[note.type]++;
    if (note.isImportant) stats.importantCount++;
  });
  
  // Group by date (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const dateMap = new Map<string, number>();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dateMap.set(dateString, 0);
  }
  
  notes.forEach(note => {
    const noteDate = note.date.split('T')[0];
    if (dateMap.has(noteDate)) {
      dateMap.set(noteDate, (dateMap.get(noteDate) || 0) + 1);
    }
  });
  
  // Convert map to array
  dateMap.forEach((count, date) => {
    stats.recentActivity.push({ date, count });
  });
  
  // Sort by date
  stats.recentActivity.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return stats;
}; 
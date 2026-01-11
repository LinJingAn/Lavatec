import React, { useState, useEffect } from 'react';
import { CustomerNote, CustomerNotesStats, generateMockCustomerNotes, generateMockCustomerNotesStats } from '../../models/CustomerNotes';
import { MdNoteAdd, MdTimeline, MdPieChart, MdFlag } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface CustomerNotesSummaryProps {
  customerId: number;
  maxNotes?: number;
  showActions?: boolean;
}

const CustomerNotesSummary: React.FC<CustomerNotesSummaryProps> = ({ 
  customerId,
  maxNotes = 3,
  showActions = true
}) => {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [stats, setStats] = useState<CustomerNotesStats | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedNotes = generateMockCustomerNotes(customerId, 8);
    setNotes(fetchedNotes.slice(0, maxNotes));
    setStats(generateMockCustomerNotesStats(fetchedNotes));
  }, [customerId, maxNotes]);
  
  if (!stats) return <div className="animate-pulse bg-gray-100 h-40 rounded-lg"></div>;
  
  // Colors for each note type
  const typeColors = {
    general: 'bg-gray-100',
    complaint: 'bg-red-100',
    feedback: 'bg-green-100',
    preference: 'bg-blue-100',
    other: 'bg-purple-100'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Anotações do Cliente</h2>
          {showActions && (
            <Link 
              to={`/customers/${customerId}/notes`}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver todas ({stats.totalNotes})
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Recent notes */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <MdTimeline className="mr-1" /> Anotações Recentes
          </h3>
          
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="border-l-4 border-blue-500 pl-3 py-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{note.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(note.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Sem anotações recentes
            </div>
          )}
          
          {showActions && (
            <div className="mt-4">
              <button className="flex items-center text-sm text-blue-600 hover:underline">
                <MdNoteAdd className="mr-1" /> Adicionar nova anotação
              </button>
            </div>
          )}
        </div>
        
        {/* Statistics */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <MdPieChart className="mr-1" /> Estatísticas
          </h3>
          
          <div className="space-y-3">
            {/* By type */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Por tipo</h4>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(stats.byType).map(([type, count]) => (
                  count > 0 && (
                    <div 
                      key={type} 
                      className={`text-xs px-2 py-1 rounded-full ${typeColors[type as keyof typeof typeColors]}`}
                    >
                      {type === 'general' ? 'Geral' : 
                       type === 'complaint' ? 'Reclamações' : 
                       type === 'feedback' ? 'Feedback' : 
                       type === 'preference' ? 'Preferências' : 'Outros'}: {count}
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Important count */}
            {stats.importantCount > 0 && (
              <div className="flex items-center gap-2">
                <MdFlag className="text-amber-500" />
                <span className="text-sm">
                  {stats.importantCount} {stats.importantCount === 1 ? 'anotação importante' : 'anotações importantes'}
                </span>
              </div>
            )}
            
            {/* Recent activity */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Atividade recente</h4>
              <div className="h-16 flex items-end gap-1">
                {stats.recentActivity.map((activity, index) => {
                  const barHeight = activity.count > 0 
                    ? Math.max(4, (activity.count / Math.max(...stats.recentActivity.map(a => a.count))) * 100) 
                    : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full bg-blue-400 rounded-t ${activity.count === 0 ? 'bg-gray-200' : ''}`}
                        style={{ height: `${barHeight}%` }}
                      ></div>
                      <div className="text-xs mt-1 text-gray-500">
                        {new Date(activity.date).getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerNotesSummary; 
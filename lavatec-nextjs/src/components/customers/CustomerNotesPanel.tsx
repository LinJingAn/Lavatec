import React, { useState } from 'react';
import { 
  MdNotes, 
  MdAdd, 
  MdComment, 
  MdSave, 
  MdClose, 
  MdError, 
  MdFeedback, 
  MdOutlineThumbUp,
  MdPushPin,
  MdPushPinOutlined,
  MdPublic,
  MdPublicOff,
  MdInfo,
  MdDelete
} from 'react-icons/md';
import { CustomerNote } from '../../models/CustomerNotes';

interface CustomerNotesPanelProps {
  notes: CustomerNote[];
  customerId: number;
  onAddNote?: (note: Omit<CustomerNote, 'id'>) => void;
  onUpdateNote?: (note: CustomerNote) => void;
  onDeleteNote?: (noteId: number) => void;
  isReadOnly?: boolean;
}

const CustomerNotesPanel: React.FC<CustomerNotesPanelProps> = ({ 
  notes, 
  customerId, 
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  isReadOnly = false 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | CustomerNote['type']>('all');
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  
  const [newNote, setNewNote] = useState<Omit<CustomerNote, 'id'>>({
    customerId,
    date: new Date().toISOString(),
    title: '',
    content: '',
    type: 'general',
    createdById: 1, // This would be dynamic in a real app
    createdByName: 'Usuário Atual', // This would be dynamic in a real app
    isImportant: false,
    isPinned: false,
    isPrivate: false
  });
  
  const getNoteTypeIcon = (type: CustomerNote['type'], className?: string) => {
    switch (type) {
      case 'complaint':
        return <MdError className={className} />;
      case 'feedback':
        return <MdFeedback className={className} />;
      case 'preference':
        return <MdOutlineThumbUp className={className} />;
      case 'general':
      default:
        return <MdComment className={className} />;
    }
  };
  
  const getNoteTypeLabel = (type: CustomerNote['type']) => {
    switch (type) {
      case 'complaint':
        return 'Reclamação';
      case 'feedback':
        return 'Feedback';
      case 'preference':
        return 'Preferência';
      case 'general':
        return 'Geral';
      default:
        return 'Outro';
    }
  };
  
  const getNoteTypeColor = (type: CustomerNote['type']) => {
    switch (type) {
      case 'complaint':
        return 'text-red-600 bg-red-100';
      case 'feedback':
        return 'text-purple-600 bg-purple-100';
      case 'preference':
        return 'text-green-600 bg-green-100';
      case 'general':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewNote(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.title || !newNote.content) {
      alert('Por favor, preencha o título e o conteúdo da nota.');
      return;
    }
    
    if (onAddNote) {
      onAddNote({
        ...newNote,
        date: new Date().toISOString()
      });
    }
    
    // Reset form
    setNewNote({
      customerId,
      date: new Date().toISOString(),
      title: '',
      content: '',
      type: 'general',
      createdById: 1,
      createdByName: 'Usuário Atual',
      isImportant: false,
      isPinned: false,
      isPrivate: false
    });
    
    setShowAddForm(false);
  };
  
  const toggleNotePinned = (note: CustomerNote) => {
    if (onUpdateNote) {
      onUpdateNote({
        ...note,
        isPinned: !note.isPinned
      });
    }
  };
  
  const toggleNoteImportant = (note: CustomerNote) => {
    if (onUpdateNote) {
      onUpdateNote({
        ...note,
        isImportant: !note.isImportant
      });
    }
  };
  
  const toggleNotePrivate = (note: CustomerNote) => {
    if (onUpdateNote) {
      onUpdateNote({
        ...note,
        isPrivate: !note.isPrivate
      });
    }
  };
  
  const handleDeleteNote = (noteId: number) => {
    if (confirm('Tem certeza que deseja excluir esta nota?') && onDeleteNote) {
      onDeleteNote(noteId);
    }
  };
  
  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (showImportantOnly && !note.isImportant) {
      return false;
    }
    
    if (filterType !== 'all' && note.type !== filterType) {
      return false;
    }
    
    return true;
  });
  
  // Sort notes - pinned first, then by date (newest)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Calculate stats
  const noteTypeCount = notes.reduce<Record<string, number>>((acc, note) => {
    acc[note.type] = (acc[note.type] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <MdNotes className="mr-2 text-blue-600" /> 
          Anotações e Observações
        </h3>
        
        {!isReadOnly && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
          >
            <MdAdd className="mr-1" /> Nova Anotação
          </button>
        )}
      </div>
      
      {/* Filters */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-1 text-xs rounded-md ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({notes.length})
          </button>
          
          {Object.entries(noteTypeCount).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setFilterType(type as CustomerNote['type'])}
              className={`px-2 py-1 text-xs rounded-md flex items-center ${
                filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getNoteTypeIcon(type as CustomerNote['type'], "mr-1")}
              {getNoteTypeLabel(type as CustomerNote['type'])} ({count})
            </button>
          ))}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showImportantOnly"
            checked={showImportantOnly}
            onChange={() => setShowImportantOnly(!showImportantOnly)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-1"
          />
          <label htmlFor="showImportantOnly" className="text-xs">
            Apenas importantes
          </label>
        </div>
      </div>
      
      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h4 className="font-medium mb-3">Nova Anotação</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newNote.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  placeholder="Ex: Preferência de horário de entrega"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Anotação
                </label>
                <select
                  name="type"
                  value={newNote.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="general">Geral</option>
                  <option value="complaint">Reclamação</option>
                  <option value="feedback">Feedback</option>
                  <option value="preference">Preferência</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={newNote.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  placeholder="Detalhes da anotação..."
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isImportant"
                    name="isImportant"
                    checked={newNote.isImportant}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isImportant" className="ml-2 text-sm text-gray-700">
                    Marcar como importante
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    checked={newNote.isPinned}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
                    Fixar no topo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    name="isPrivate"
                    checked={newNote.isPrivate}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
                    Nota privada
                  </label>
                </div>
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <MdSave className="mr-1" /> Salvar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Notes */}
      <div className="divide-y divide-gray-200">
        {sortedNotes.length === 0 ? (
          <div className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <MdInfo className="text-blue-500 text-4xl" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-1">Nenhuma anotação encontrada</h4>
            <p className="text-gray-500">
              {filterType !== 'all' || showImportantOnly 
                ? 'Nenhuma anotação corresponde aos filtros selecionados.' 
                : 'Ainda não há anotações registradas para este cliente.'}
            </p>
          </div>
        ) : (
          sortedNotes.map(note => (
            <div 
              key={note.id} 
              className={`p-4 hover:bg-gray-50 ${note.isPinned ? 'bg-yellow-50' : ''}`}
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className={`py-1 px-2 rounded-md text-xs flex items-center mr-2 ${getNoteTypeColor(note.type)}`}>
                    {getNoteTypeIcon(note.type, "mr-1")}
                    {getNoteTypeLabel(note.type)}
                  </div>
                  
                  {note.isImportant && (
                    <div className="bg-red-100 text-red-600 py-1 px-2 rounded-md text-xs flex items-center mr-2">
                      Importante
                    </div>
                  )}
                  
                  {note.isPrivate && (
                    <div className="bg-gray-100 text-gray-600 py-1 px-2 rounded-md text-xs flex items-center">
                      <MdPublicOff className="mr-1" /> Privado
                    </div>
                  )}
                </div>
                
                {!isReadOnly && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleNotePinned(note)}
                      className={`p-1 rounded-full ${note.isPinned ? 'text-yellow-600 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={note.isPinned ? 'Desafixar' : 'Fixar no topo'}
                    >
                      {note.isPinned ? <MdPushPin /> : <MdPushPinOutlined />}
                    </button>
                    
                    <button 
                      onClick={() => toggleNoteImportant(note)}
                      className={`p-1 rounded-full ${note.isImportant ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={note.isImportant ? 'Remover importância' : 'Marcar como importante'}
                    >
                      <MdError />
                    </button>
                    
                    <button 
                      onClick={() => toggleNotePrivate(note)}
                      className={`p-1 rounded-full ${note.isPrivate ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={note.isPrivate ? 'Tornar público' : 'Tornar privado'}
                    >
                      {note.isPrivate ? <MdPublicOff /> : <MdPublic />}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Excluir anotação"
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
              
              <h4 className="font-medium mt-2">{note.title}</h4>
              
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                {note.content}
              </p>
              
              <div className="text-xs text-gray-500 mt-3 flex justify-between">
                <span>
                  Por {note.createdByName} • {formatDate(note.date)}
                </span>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {notes.length > 5 && filteredNotes.length < notes.length && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={() => {
              setFilterType('all');
              setShowImportantOnly(false);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Exibir todas as {notes.length} anotações
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerNotesPanel; 
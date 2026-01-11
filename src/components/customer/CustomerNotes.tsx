import React, { useState, useEffect } from 'react';
import { CustomerNote, CustomerNoteType, generateMockCustomerNotes } from '../../models/CustomerNotes';
import { MdPushPin, MdStarRate, MdEdit, MdDelete, MdAdd, MdFilterList, MdSearch } from 'react-icons/md';

interface CustomerNotesProps {
  customerId: number;
}

const CustomerNotes: React.FC<CustomerNotesProps> = ({ customerId }) => {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CustomerNote[]>([]);
  const [activeFilter, setActiveFilter] = useState<CustomerNoteType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState<Partial<CustomerNote>>({
    customerId,
    title: '',
    content: '',
    type: 'general',
    isImportant: false,
    isPinned: false,
    isPrivate: false
  });

  // Fetch notes (using mock data for now)
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedNotes = generateMockCustomerNotes(customerId, 8);
    setNotes(fetchedNotes);
    setFilteredNotes(fetchedNotes);
  }, [customerId]);

  // Apply filters and search
  useEffect(() => {
    let result = [...notes];
    
    // Filter by type
    if (activeFilter !== 'all') {
      result = result.filter(note => note.type === activeFilter);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredNotes(result);
  }, [notes, activeFilter, searchQuery]);

  const handleAddNote = () => {
    const newNoteComplete: CustomerNote = {
      ...newNote as any,
      id: notes.length + 1,
      date: new Date().toISOString(),
      createdById: 1, // Mock user ID
      createdByName: 'Current User', // Mock user name
      tags: [],
    };
    
    setNotes([newNoteComplete, ...notes]);
    setShowAddForm(false);
    setNewNote({
      customerId,
      title: '',
      content: '',
      type: 'general',
      isImportant: false,
      isPinned: false,
      isPrivate: false
    });
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handlePinToggle = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleImportantToggle = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isImportant: !note.isImportant } : note
    ));
  };

  // Filter options
  const filterOptions: { value: CustomerNoteType | 'all', label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'general', label: 'Geral' },
    { value: 'complaint', label: 'Reclamações' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'preference', label: 'Preferências' },
    { value: 'other', label: 'Outros' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Anotações do Cliente</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
        >
          <MdAdd /> {showAddForm ? 'Cancelar' : 'Nova Anotação'}
        </button>
      </div>
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <MdSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar anotações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative min-w-[200px]">
          <MdFilterList className="absolute left-3 top-2.5 text-gray-400" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as CustomerNoteType | 'all')}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Add note form */}
      {showAddForm && (
        <div className="border rounded-md p-4 mb-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Nova Anotação</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Conteúdo</label>
              <textarea
                rows={3}
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote({...newNote, type: e.target.value as CustomerNoteType})}
                  className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filterOptions.filter(o => o.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newNote.isImportant}
                    onChange={(e) => setNewNote({...newNote, isImportant: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  Importante
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newNote.isPinned}
                    onChange={(e) => setNewNote({...newNote, isPinned: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  Fixar
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newNote.isPrivate}
                    onChange={(e) => setNewNote({...newNote, isPrivate: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  Privado
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.title || !newNote.content}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Salvar Anotação
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notes list */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-3">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              className={`border rounded-md p-4 relative ${note.isPinned ? 'bg-yellow-50' : 'bg-white'} ${note.isImportant ? 'border-amber-400' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {note.title}
                    {note.isPrivate && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        Privado
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(note.date).toLocaleDateString('pt-BR')} • {note.createdByName} • 
                    <span className={`ml-1 ${
                      note.type === 'complaint' ? 'text-red-600' : 
                      note.type === 'feedback' ? 'text-green-600' : 
                      note.type === 'preference' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {filterOptions.find(o => o.value === note.type)?.label}
                    </span>
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleImportantToggle(note.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${note.isImportant ? 'text-amber-500' : 'text-gray-400'}`}
                  >
                    <MdStarRate />
                  </button>
                  <button 
                    onClick={() => handlePinToggle(note.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${note.isPinned ? 'text-amber-500' : 'text-gray-400'}`}
                  >
                    <MdPushPin />
                  </button>
                  <button 
                    className="p-1 rounded hover:bg-gray-100 text-gray-400"
                  >
                    <MdEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-gray-700 whitespace-pre-line">
                {note.content}
              </div>
              {note.tags && note.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchQuery || activeFilter !== 'all' ? 
            'Nenhuma anotação encontrada com os filtros atuais.' : 
            'Nenhuma anotação para este cliente. Adicione uma nova anotação.'}
        </div>
      )}
    </div>
  );
};

export default CustomerNotes; 
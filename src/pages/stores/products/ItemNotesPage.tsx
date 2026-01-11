import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdInfo } from 'react-icons/md';

interface ItemNote {
  id: string;
  title: string;
  description: string;
  category: string;
  showToCustomer: boolean;
  showInReceipt: boolean;
}

const ItemNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<ItemNote[]>([
    {
      id: '1',
      title: 'Silk Care',
      description: 'Handle with care. Dry clean only. Do not bleach or iron directly.',
      category: 'Care Instructions',
      showToCustomer: true,
      showInReceipt: true
    },
    {
      id: '2',
      title: 'Leather Cleaning',
      description: 'Special process for leather items. May take additional time.',
      category: 'Process Notes',
      showToCustomer: true,
      showInReceipt: false
    },
    {
      id: '3',
      title: 'Stain Removal',
      description: 'Some stains may require additional treatment and fees.',
      category: 'Pricing Notes',
      showToCustomer: true,
      showInReceipt: true
    },
    {
      id: '4',
      title: 'Wedding Dress',
      description: 'Preservation service available. Store in acid-free container after cleaning.',
      category: 'Care Instructions',
      showToCustomer: true,
      showInReceipt: true
    },
    {
      id: '5',
      title: 'Internal Process Note',
      description: 'Check all pockets before processing. Tag items separately.',
      category: 'Process Notes',
      showToCustomer: false,
      showInReceipt: false
    }
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleShowToCustomer = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, showToCustomer: !note.showToCustomer } : note
    ));
  };

  const toggleShowInReceipt = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, showInReceipt: !note.showInReceipt } : note
    ));
  };

  const categories = ['all', ...Array.from(new Set(notes.map(note => note.category)))];

  const filteredNotes = filterCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === filterCategory);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Item Notes</h1>
        <div className="flex space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 text-sm leading-5 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <MdAdd className="mr-1" />
            Add Note
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Show to Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Show in Receipt
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {note.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {note.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {note.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={note.showToCustomer}
                      onChange={() => toggleShowToCustomer(note.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={note.showInReceipt}
                      onChange={() => toggleShowInReceipt(note.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <MdEdit size={20} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteNote(note.id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <div className="flex items-start">
          <MdInfo className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-medium mb-2">About Item Notes</h2>
            <p className="text-gray-600 mb-3">
              Item notes provide additional information, care instructions, and processing notes for products.
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li><span className="font-medium">Show to Customer</span>: These notes will be visible to customers in their account and order history.</li>
              <li><span className="font-medium">Show in Receipt</span>: These notes will be printed on customer receipts and order confirmations.</li>
              <li><span className="font-medium">Categories</span>: Organize notes by type (Care Instructions, Process Notes, Pricing Notes, etc.).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemNotesPage; 